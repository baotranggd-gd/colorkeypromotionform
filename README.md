# Hệ Thống Tự Động Tính Đơn Hàng & Khuyến Mãi Q3 (GitHub Pages Single-File)

Website 1 file duy nhất (`index.html`) chạy trực tiếp trên trình duyệt, không cần cài đặt Node.js hay build code.

---

## 🚀 Cách đưa lên GitHub Pages (3 Bước Cực Nhanh)

1. **Tạo repository mới** trên GitHub: VD `ctkm-portal`
2. **Upload 2 file** (`index.html` và `README.md`) trực tiếp lên repo (bấm **Add file** -> **Upload files**).
3. **Bật GitHub Pages**:
   - Vào tab **Settings** của repo -> Chọn **Pages** (cột bên trái).
   - Tại mục **Build and deployment** -> Chọn **Branch: `main`** -> Chọn thư mục **`/(root)`** -> Bấm **Save**.
   - Sau 30 giây, GitHub sẽ cấp cho bạn một đường link web miễn phí:  
     `https://<tai-khoan-github-cua-ban>.github.io/ctkm-portal/`

---

## 🌟 Chức năng có sẵn:
- **Sidebar**: Chuyển đổi giữa *Xử lý đơn hàng*, *CTKM Q3*, *Sản phẩm*, *Khách hàng*.
- **Upload Excel**: Đọc tự động các cột Mã SP, Barcode, Tên SP, SL Đặt.
- **Tự động áp dụng khuyến mãi Q3**:
  - Mua 19 tặng 1, Mua 57 tặng 3 mask B5 tím.
  - Mua 22 tặng 2, mua 110 tặng 24 mini, mua 1 tặng 1 bông tẩy trang.
  - Tự động chiết khấu thêm theo Rank khách hàng (Diamond: 3%, Gold: 1.5%).
- **Xuất file**: Xuất ngược lại ra **Excel (.xlsx)** hoặc **PDF** để in/gửi cho khách hàng.
