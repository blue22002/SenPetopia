
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const navigate = useNavigate()
  const taiKhoan = JSON.parse(localStorage.getItem('taiKhoan') || 'null')

  const dangXuat = () => {
    localStorage.removeItem('taiKhoan')
    navigate('/dang-nhap')
  }

  if (!taiKhoan || taiKhoan.vaiTro !== 'QuanTriVien') {
    navigate('/dang-nhap')
    return null
  }

  return (
    <div className="admin-page">
      <header>
        <h2>🐾 SenPetopia - Quản trị viên</h2>
        <button onClick={dangXuat}>Đăng xuất</button>
      </header>

      <main>
        <h1>Xin chào, {taiKhoan.tenDangNhap}!</h1>
        <p>Đây là trang quản trị hệ thống SenPetopia.</p>

        <div className="admin-menu">
          <button onClick={() => navigate('/quan-ly-tai-khoan')}> Quản lý tài khoản</button>
          <button>Quản lý nhân viên</button>
          <button>Quản lý khách hàng</button>
          <button>Quản lý sản phẩm</button>
          <button>Quản lý đơn hàng</button>
        </div>
      </main>
    </div>
  )
}
