# Hệ Thống Tự Động Tính Đơn Hàng & Khuyến Mãi (Promotion Management System)

Website chuyên dụng tự động hóa việc tính chương trình khuyến mãi (CTKM), giảm thiểu sai sót và tiết kiệm thời gian nhập thủ công cho đội ngũ Sales, Admin và Kế toán.

---

## 🌟 Tính Năng Chính

- **Sidebar Điều Hướng Chuẩn:**
  - **Xử lý Đơn Hàng:** Tải file Excel đơn hàng, chọn khách hàng, chọn CTKM khu vực và tự động tính toán quà tặng/chiết khấu.
  - **Chương trình khuyến mãi (CTKM):** Quản lý CTKM theo từng quý (Q3, Q4) và từng vùng miền (GT CENTRAL, GT SOUTH, GT NORTH).
  - **Danh mục Sản phẩm:** Tên sản phẩm, Barcode, Product Code, Giá niêm yết, Giá sỉ sau chiết khấu, Quy cách thùng.
  - **Danh sách Khách hàng:** Quản lý thông tin xuất VAT, Khu vực và Phân hạng khách hàng (Diamond, Gold, Silver, Standard).
- **Core Engine Khuyến Mãi:**
  - Tự động nhận diện quy tắc: *Mua 19 tặng 1, Mua 57 tặng 3 mask B5, Mua 22 tặng 2, Mua 110 tặng 24 minisize, Mua 1 tặng 1 bông tẩy trang,...*
  - Tự động áp dụng chiết khấu cộng thêm theo Rank (Diamond -3%, Gold -1.5%).
- **Xuất Báo Cáo:**
  - Xuất file **Excel (.xlsx)** định dạng chuẩn kèm thông tin xuất hóa đơn VAT, STT, Barcode, chi tiết quà tặng.
  - Xuất file **PDF** chuyên nghiệp để in ấn hoặc gửi ngay cho khách hàng.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local

### 1. Yêu Cầu Môi Trường
- Node.js >= 18.0.0
- npm hoặc yarn

### 2. Cài Đặt Thư Viện
```bash
# Di chuyển vào thư mục dự án
cd promotion-management-system

# Cài đặt các dependencies
npm install
```

### 3. Chạy Server Thử Nghiệm (Development)
```bash
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:3000`

### 4. Build Bản Production
```bash
npm run build
```

---

## 📤 Hướng Dẫn Đưa Lên GitHub

```bash
# 1. Khởi tạo Git
git init

# 2. Thêm tất cả file vào staging
git add .

# 3. Tạo commit đầu tiên
git commit -m "feat: Initial commit for promotion management web portal"

# 4. Đổi tên branch chính thành main
git branch -M main

# 5. Thêm remote repository từ GitHub của bạn
git remote add origin https://github.com/<tai-khoan-cua-ban>/promotion-management-system.git

# 6. Push code lên GitHub
git push -u origin main
```

---

## 🌐 Deploy Miễn Phí Lên Vercel / Netlify

1. Đăng nhập vào [Vercel](https://vercel.com/) hoặc [Netlify](https://www.netlify.com/).
2. Chọn **"Add New Project"** -> Chọn Repository GitHub vừa tạo.
3. Cấu hình tự động:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Bấm **Deploy**. Sau 1 phút bạn sẽ có link web trực tiếp để toàn bộ công ty truy cập sử dụng.
