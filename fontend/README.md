# SenPetopia – Frontend

Frontend React (Vite) của SenPetopia. Backend: ASP.NET, cơ sở dữ liệu: SQL Server. Khi chạy dev, request `/api` được proxy sang ASP.NET (xem `vite.config.js`).

## Chạy thử trên máy
```bash
npm install
npm run dev
```

## Đẩy lên GitHub
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TEN-BAN/TEN-REPO.git
git push -u origin main
```
Sau đó vào **Settings → Pages → Source: GitHub Actions**. Mỗi lần push lên `main`, site sẽ tự build và cập nhật.

## Tùy chỉnh
Sửa nội dung ở các mảng đầu file `src/App.jsx`, màu sắc ở `src/App.css` (biến `:root`).
