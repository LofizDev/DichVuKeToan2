# Dự án Website Dịch Vụ Kế Toán Thuế & Tư Vấn Việt Hưng

Website giới thiệu và quản lý dịch vụ kế toán trọn gói, báo cáo tài chính, dọn dẹp sổ sách và thành lập doanh nghiệp với đầy đủ tính năng quản trị Admin và hỗ trợ đa ngôn ngữ (Tiếng Việt / Tiếng Trung).

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### 💻 Frontend:
*   **React 19**
*   **TypeScript**
*   **Vite 6**
*   **Tailwind CSS 4**
*   **React Router Dom v7**
*   **Lucide Icons**
.
### ⚙️ Backend & Database:
*   **Node.js**
*   **Express.js**
*   **MongoDB Atlas** (Sử dụng thư viện **Mongoose**)
*   **JSON Web Tokens (JWT)** & **BcryptJS** (Bảo mật tài khoản Admin)

---

## 💻 Hướng Dẫn Thiết Lập Môi Trường Local (Local Development)

### 1. Chuẩn bị trước khi cài đặt:
*   Máy tính đã cài đặt **Node.js** (Khuyến nghị phiên bản v18 trở lên).
*   Đã có tài khoản **MongoDB Atlas** để lấy chuỗi kết nối Database.

### 2. Cấu hình biến môi trường (Environment Variables):

#### Phía Backend:
Tạo tệp `.env` bên trong thư mục `backend/` với nội dung sau:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.i6lmlwx.mongodb.net/ketoanchuyennghiep
JWT_SECRET=your_super_secret_jwt_key_123
```

#### Phía Frontend:
Mặc định hệ thống tự động gọi tới API Backend local (`http://localhost:5000/api`). Tuy nhiên bạn có thể cấu hình tệp `.env` bên trong thư mục `frontend/` nếu muốn thay đổi cổng:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Khởi Chạy Dự Án Dưới Local

### Bước 1: Cài đặt và khởi chạy Backend
Mở một terminal mới tại thư mục gốc của dự án:
```bash
cd backend
npm install
npm run dev
```
*   **Backend Server** sẽ chạy tại địa chỉ: `http://localhost:5000`

### Bước 2: Cài đặt và khởi chạy Frontend
Mở một terminal khác tại thư mục gốc của dự án:
```bash
cd frontend
npm install
npm run dev
```
*   **Frontend Client** sẽ chạy tại địa chỉ: `http://localhost:5173`

----

## 🗄️ Tạo Dữ Liệu Mẫu (Seed Database)

Để tạo sẵn dữ liệu hiển thị (Bảng giá, Các gói dịch vụ, Slider banner, Các mục bài viết và tài khoản Admin mặc định), hãy chạy lệnh sau:
```bash
cd backend
npm run seed
```

*   **Tài khoản Admin mặc định:**
    *   **Username:** `admin`
    *   **Password:** `zintaxadmin123`
    *   **Đường dẫn trang quản trị:** `http://localhost:5173/admin`
