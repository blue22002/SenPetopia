
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LOGIN_API = 'http://localhost:5181/api/TaiKhoan/dang-nhap'

export default function Login() {
  const [tenDangNhap, setTenDangNhap] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tenDangNhap,
          matKhau
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Đăng nhập thất bại')
        return
      }

      localStorage.setItem('taiKhoan', JSON.stringify(data))

      if (data.vaiTro === 'QuanTriVien') {
        navigate('/admin')
      } else if (data.vaiTro === 'KhachHang') {
        navigate('/khach-hang')
      } else {
        setError('Tài khoản chưa được hỗ trợ truy cập giao diện này')
      }
    } catch {
      setError('Không thể kết nối đến máy chủ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>🐾 SenPetopia</h2>
        <h3>Đăng nhập</h3>

        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={tenDangNhap}
          onChange={(e) => setTenDangNhap(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={matKhau}
          onChange={(e) => setMatKhau(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <button type="button" onClick={() => navigate('/')}>
          Quay lại trang chủ
        </button>
      </form>
    </div>
  )
}
