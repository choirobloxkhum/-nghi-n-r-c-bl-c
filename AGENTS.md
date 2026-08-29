# Quy tắc quản trị nhân vật Roblox RP Hub

## 1. Thứ tự thêm nhân vật mới
- **Luôn thêm nhân vật mới vào ĐẦU danh sách** (vị trí index `0` trong `INITIAL_RP_CHARACTERS` tại file `src/data/rpCharacters.ts`), để nhân vật mới luôn xuất hiện ở phía trước / đầu trang, không bao giờ đặt ở cuối trang.
- Đặt `createdAt: Date.now()` (hoặc timestamp lớn nhất) cho nhân vật mới.

## 2. Nhãn Tag Mới (Top-Right Badge)
- Luôn gắn thuộc tính `isNew: true` và `cornerTag: 'MỚI'` (hoặc tag tùy chỉnh) cho nhân vật mới thêm.
- Thẻ nhân vật sẽ tự động hiển thị nhãn nổi bật (`MỚI`) ở góc phải trên cùng của khung ảnh đại diện.

## 3. Quy tắc Thả Robux Ẩn Danh (Anonymous Single-Vote & Browser Fingerprinting)
- Cho phép người dùng thả Robux (+1 R$) trực tiếp mà **không cần đăng nhập hoặc sign in bất kỳ tài khoản nào**.
- Sử dụng **Browser & Device Fingerprinting** kết hợp **LocalStorage / Cookies** để chống spam:
  * Mỗi thiết bị/trình duyệt chỉ được thả tối đa **1 Robux (+1 R$) cho MỖI nhân vật**.
  * Lưu cờ cục bộ `roblox_rp_has_voted_char_<id>` và mã định danh thiết bị độc nhất gửi lên backend database để hạn chế chính xác 1 lượt vote/chồng/thiết bị.
  * Nếu thiết bị đã vote cho nhân vật đó, hiển thị thông báo rõ ràng "Thiết bị này đã thả 1 Robux (tối đa 1 R$/nhân vật)".

## 4. Lưu trữ và Đồng bộ Thời Gian Thực (Real-Time Database Persistence)
- Số lượng Robux của các nhân vật được kết nối trực tiếp với cơ sở dữ liệu trung tâm của server (`/api/robux`), đồng bộ thời gian thực cho mọi người dùng.
- Toàn bộ số lượng Robux được thả cho các nhân vật **PHẢI được lưu trữ cố định vĩnh viễn vào hệ thống** (không bị mất khi reload / tải lại trang).
- Mọi lượt thả Robux mới đều được cộng dồn và lưu vào bộ nhớ cơ sở dữ liệu lâu dài của hệ thống.
