import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, getDocs } from 'firebase/firestore';

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig;
try {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch(e) {
  console.error("Firebase config missing!", e);
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const app = express();
const PORT = 3000;
app.use(express.json());

// ==========================================
// CENTRALIZED DATABASE API ROUTES
// ==========================================

// 1. GET /api/robux - Get all character total Robux counts
app.get('/api/robux', async (req, res) => {
  try {
    const counts: Record<string, number> = {};
    const snapshot = await getDocs(collection(db, 'robux_counts'));
    snapshot.forEach((doc) => {
      counts[doc.id] = doc.data().count || 0;
    });
    res.json({
      success: true,
      counts,
      totalVotes: 0,
      lastUpdated: Date.now(),
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 2. GET /api/robux/device/:fingerprint - Get list of character IDs voted by this device
app.get('/api/robux/device/:fingerprint', async (req, res) => {
  try {
    const { fingerprint } = req.params;
    if (!fingerprint) {
      return res.status(400).json({ success: false, message: 'Missing fingerprint' });
    }
    const dRef = doc(db, 'device_votes', fingerprint);
    const snap = await getDoc(dRef);
    const votedCharacters = snap.exists() ? (snap.data().votedCharacters || []) : [];
    res.json({
      success: true,
      fingerprint,
      votedCharacters,
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 3. POST /api/robux/vote - Upvote +1 Robux with anonymous device fingerprinting
app.post('/api/robux/vote', async (req, res) => {
  try {
    const { characterId, fingerprint } = req.body;
    if (!characterId || typeof characterId !== 'string') {
      return res.status(400).json({ success: false, message: 'characterId is required' });
    }
    if (!fingerprint || typeof fingerprint !== 'string') {
      return res.status(400).json({ success: false, message: 'Device fingerprint is required' });
    }

    // Ensure character document exists
    const charRef = doc(db, 'robux_counts', characterId);
    let charSnap = await getDoc(charRef);
    if (!charSnap.exists()) {
      await setDoc(charRef, { count: 0 });
    }

    const deviceRef = doc(db, 'device_votes', fingerprint);
    const deviceSnap = await getDoc(deviceRef);
    
    let deviceVotes: string[] = [];
    if (deviceSnap.exists()) {
      deviceVotes = deviceSnap.data().votedCharacters || [];
    }

    // ENFORCE SINGLE-VOTE RULE: Check if device has already voted for this character
    if (deviceVotes.includes(characterId)) {
      charSnap = await getDoc(charRef);
      return res.status(200).json({
        success: false,
        alreadyVoted: true,
        error: 'ALREADY_VOTED',
        message: 'Thiết bị này đã thả 1 Robux cho nhân vật này rồi! (Tối đa 1 R$/nhân vật)',
        characterId,
        totalRobux: charSnap.data()?.count || 0,
        votedCharacters: deviceVotes,
      });
    }

    // Process vote
    deviceVotes.push(characterId);
    await setDoc(deviceRef, { votedCharacters: deviceVotes });
    await updateDoc(charRef, { count: increment(1) });
    
    charSnap = await getDoc(charRef);
    
    console.log(`[Vote Success] Device "${fingerprint}" voted for "${characterId}". New total: ${charSnap.data()?.count} R$`);
    res.json({
      success: true,
      alreadyVoted: false,
      characterId,
      totalRobux: charSnap.data()?.count || 1,
      votedCharacters: deviceVotes,
      message: 'Thả 1 Robux thành công (+1 R$)!',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 4. POST /api/robux/reset - Reset all characters to 0 Robux and clear device vote history
app.post('/api/robux/reset', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'robux_counts'));
    for (const d of snapshot.docs) {
      await updateDoc(doc(db, 'robux_counts', d.id), { count: 0 });
    }
    const deviceSnapshot = await getDocs(collection(db, 'device_votes'));
    for (const d of deviceSnapshot.docs) {
      await setDoc(doc(db, 'device_votes', d.id), { votedCharacters: [] });
    }
    
    res.json({ success: true, message: 'Đã reset tất cả nhân vật về 0 Robux thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ==========================================
// VITE / STATIC SERVING SETUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Roblox RP Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
