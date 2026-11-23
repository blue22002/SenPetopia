
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

//const API_URL = 'http://localhost:5181/api/TaiKhoan'
const API_URL = 'https://senpetopia-api.onrender.com/api/TaiKhoan'

export default function ThongTinCaNhan() {
  const navigate = useNavigate()

  const taiKhoan = JSON.parse(
    localStorage.getItem('taiKhoan') || 'null'
  )

  const [thongTin, setThongTin] = useState(null)
  const [matKhauCu, setMatKhauCu] = useState('')
  const [matKhauMoi, setMatKhauMoi] = useState('')
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!taiKhoan) {
      navigate('/dang-nhap')
      return
    }

    fetch(`${API_URL}/thong-tin/${taiKhoan.maTk}`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => setThongTin(data))
      .catch(() => setError('Không thể tải thông tin tài khoản.'))
      .finally(() => setLoading(false))
  }, [])

  const doiMatKhau = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (matKhauMoi.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.')
      return
    }

    if (matKhauMoi !== xacNhanMatKhau) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    try {
      const res = await fetch(
        `${API_URL}/doi-mat-khau/${taiKhoan.maTk}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            matKhauCu,
            matKhauMoi
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Đổi mật khẩu thất bại.')
      }

      setMessage(data.message || 'Đổi mật khẩu thành công!')
      setMatKhauCu('')
      setMatKhauMoi('')
      setXacNhanMatKhau('')
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến máy chủ.')
    }
  }

  if (loading) {
    return <p>Đang tải thông tin...</p>
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <button
          className="profile-back-btn"
          onClick={() => navigate('/khach-hang')}
        >
          ← Quay lại cửa hàng
        </button>

        <h1>Thông tin cá nhân</h1>
        <p>Quản lý thông tin tài khoản SenPetopia</p>

        {error && <p className="profile-error">{error}</p>}

        {thongTin && (
          <div className="profile-info">
            <div className="profile-avatar">🐶</div>

            <div className="profile-field">
              <label>Mã tài khoản</label>
              <strong>{thongTin.maTk}</strong>
            </div>

            <div className="profile-field">
              <label>Tên đăng nhập</label>
              <strong>{thongTin.tenDangNhap}</strong>
            </div>

            <div className="profile-field">
              <label>Vai trò</label>
              <strong>{thongTin.vaiTro}</strong>
            </div>

            <div className="profile-field">
              <label>Trạng thái</label>
              <strong>{thongTin.trangThai}</strong>
            </div>

            <div className="profile-field">
              <label>Ngày tạo</label>
              <strong>
                {thongTin.ngayTao
                  ? new Date(thongTin.ngayTao).toLocaleString('vi-VN')
                  : 'Chưa có thông tin'}
              </strong>
            </div>
          </div>
        )}

        <div className="profile-password">
          <h2>Đổi mật khẩu</h2>

          <form onSubmit={doiMatKhau}>
            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
              value={matKhauCu}
              onChange={e => setMatKhauCu(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={matKhauMoi}
              onChange={e => setMatKhauMoi(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={xacNhanMatKhau}
              onChange={e => setXacNhanMatKhau(e.target.value)}
              required
            />

            <button type="submit">
              Cập nhật mật khẩu
            </button>
          </form>

          {message && <p className="profile-success">{message}</p>}
          {error && <p className="profile-error">{error}</p>}
        </div>

      </div>
    </div>
  )
}
