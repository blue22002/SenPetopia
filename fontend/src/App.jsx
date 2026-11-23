
import { useState } from 'react'
import './App.css'
import ProductManagement from './ProductManagement'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './Login'
import Admin from './Admin'
import Customer from './Customer'
import AccountManagement from './AccountManagement'
import ThongTinCaNhan from './ThongTinCaNhan'
import GioHang from './GioHang'

export default function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      {/* Trang chủ chuyển thành trang đăng nhập */}
      <Route path="/" element={<Login />} />

      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/khach-hang" element={<Customer />} />

      {/* Thông tin cá nhân */}
      <Route
        path="/thong-tin-ca-nhan"
        element={<ThongTinCaNhan />}
      />

      <Route
        path="/quan-ly-tai-khoan"
        element={<AccountManagement onBack={() => navigate('/admin')} />}
      />

      <Route
        path="/quan-ly-san-pham"
        element={<ProductManagement onBack={() => navigate('/admin')} />}
      />
      <Route path="/khach-hang" element={<Customer />} />
<Route path="/gio-hang" element={<GioHang />} />
    </Routes>
  )
}
