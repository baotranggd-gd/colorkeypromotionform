# Hệ Thống Quản Lý Nội Bộ Nhà Hàng (Restaurant POS)

Ứng dụng web Single-Page quản lý vận hành nhà hàng chuyên sâu: theo dõi trạng thái bàn theo thời gian thực, tách/chuyển bàn, tạo order phân trạm bếp tự động, thanh toán kèm tiền Tip và thống kê doanh thu.

## 🚀 Tính năng chính

- **Dashboard & Sơ đồ bàn:** Trực quan hóa trạng thái (*Trống, Đã Order, Đang phục vụ, Chờ thanh toán*) theo từng tầng/khu vực.
- **Split-Screen Ordering:** Giao diện gọi món 2 cột tối ưu cho máy tính bảng/Desktop: duyệt menu bên trái, phiếu order bên phải.
- **Kitchen Routing:** Tự động điều phối món ăn tới đúng trạm chế biến (*Bếp nướng, Bếp nấu, Bartender*).
- **Billing & Tips:** Tính tiền nhanh, hỗ trợ tip linh hoạt (5%, 10%, 15%) và các phương thức thanh toán tiền mặt/chuyển khoản QR.
- **Role-Based Access Control (RBAC):** Chuyển đổi linh hoạt giữa các nhóm quyền **Admin**, **Manager**, **Staff** với logic ẩn/hiện nút bấm tự động.

## 📦 Cách triển khai lên GitHub Pages (30 giây)

1. Tạo một repository mới trên GitHub (ví dụ: `restaurant-pos`).
2. Tải toàn bộ file `index.html` và `README.md` lên nhánh `main`.
3. Vào **Settings** $\rightarrow$ **Pages** (ở cột bên trái).
4. Tại mục **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
5. Bấm **Save**. Trang web sẽ chạy online ngay tại `https://<username>.github.io/<repository-name>/`.