import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to persistent JSON database file
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'robux_votes_db.json');

// Initial default character IDs with 0 Robux counts
const INITIAL_CHARACTER_IDS = [
  'char-10-belphegor',
  'char-1-yuuma',
  'char-2-thetri',
  'char-3-taloi',
  'char-4-rex',
  'char-5-ducson',
  'char-6-kenji',
  'char-7-james',
  'char-8-votran',
  'char-9-nolan',
];

interface DatabaseSchema {
  counts: Record<string, number>;
  votesByDevice: Record<string, string[]>; // fingerprint -> array of characterIds voted
  voteLogs: Array<{ characterId: string; fingerprint: string; timestamp: number; ip?: string }>;
  lastUpdated: number;
}

// In-memory state cached from database file
let db: DatabaseSchema = {
  counts: {},
  votesByDevice: {},
  voteLogs: [],
  lastUpdated: Date.now(),
};

// Initialize counts to 0 for all characters
INITIAL_CHARACTER_IDS.forEach((id) => {
  db.counts[id] = 0;
});

// Load persistent database from disk on startup
function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        db.counts = parsed.counts || {};
        db.votesByDevice = parsed.votesByDevice || {};
        db.voteLogs = parsed.voteLogs || [];
        db.lastUpdated = parsed.lastUpdated || Date.now();
      }
    } else {
      saveDatabase();
    }

    // Ensure all characters have a registered key
    INITIAL_CHARACTER_IDS.forEach((id) => {
      if (typeof db.counts[id] !== 'number') {
        db.counts[id] = 0;
      }
    });
  } catch (err) {
    console.error('[Database] Failed to load db file, initializing with fresh zero state:', err);
    saveDatabase();
  }
}

// Save database to disk
function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db.lastUpdated = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] Failed to persist database:', err);
  }
}

// Load DB immediately
loadDatabase();

// ==========================================
// CENTRALIZED DATABASE API ROUTES
// ==========================================

// 1. GET /api/robux - Get all character total Robux counts
app.get('/api/robux', (req, res) => {
  res.json({
    success: true,
    counts: db.counts,
    totalVotes: db.voteLogs.length,
    lastUpdated: db.lastUpdated,
  });
});

// 2. GET /api/robux/device/:fingerprint - Get list of character IDs voted by this device
app.get('/api/robux/device/:fingerprint', (req, res) => {
  const { fingerprint } = req.params;
  if (!fingerprint) {
    return res.status(400).json({ success: false, message: 'Missing fingerprint' });
  }

  const votedCharacters = db.votesByDevice[fingerprint] || [];
  res.json({
    success: true,
    fingerprint,
    votedCharacters,
  });
});

// 3. POST /api/robux/vote - Upvote +1 Robux with anonymous device fingerprinting
app.post('/api/robux/vote', (req, res) => {
  const { characterId, fingerprint } = req.body;

  if (!characterId || typeof characterId !== 'string') {
    return res.status(400).json({ success: false, message: 'characterId is required' });
  }

  if (!fingerprint || typeof fingerprint !== 'string') {
    return res.status(400).json({ success: false, message: 'Device fingerprint is required' });
  }

  // Ensure device record exists
  if (!db.votesByDevice[fingerprint]) {
    db.votesByDevice[fingerprint] = [];
  }

  const deviceVotes = db.votesByDevice[fingerprint];

  // ENFORCE SINGLE-VOTE RULE: Check if device has already voted for this character
  if (deviceVotes.includes(characterId)) {
    return res.status(200).json({
      success: false,
      alreadyVoted: true,
      error: 'ALREADY_VOTED',
      message: 'Thiết bị này đã thả 1 Robux cho nhân vật này rồi! (Tối đa 1 R$/nhân vật)',
      characterId,
      totalRobux: db.counts[characterId] || 0,
      votedCharacters: deviceVotes,
    });
  }

  // Record the vote
  deviceVotes.push(characterId);
  db.counts[characterId] = (db.counts[characterId] || 0) + 1;

  // Log vote with timestamp
  db.voteLogs.push({
    characterId,
    fingerprint,
    timestamp: Date.now(),
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
  });

  // Save to persistent database
  saveDatabase();

  console.log(`[Vote Success] Device "${fingerprint}" voted for "${characterId}". New total: ${db.counts[characterId]} R$`);

  res.json({
    success: true,
    alreadyVoted: false,
    characterId,
    totalRobux: db.counts[characterId],
    votedCharacters: deviceVotes,
    message: 'Thả 1 Robux thành công (+1 R$)!',
  });
});

// 4. POST /api/robux/reset - Reset all characters to 0 Robux and clear device vote history
app.post('/api/robux/reset', (req, res) => {
  INITIAL_CHARACTER_IDS.forEach((id) => {
    db.counts[id] = 0;
  });
  db.votesByDevice = {};
  db.voteLogs = [];
  saveDatabase();

  res.json({
    success: true,
    message: 'Đã reset tất cả nhân vật về 0 Robux thành công!',
    counts: db.counts,
  });
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
