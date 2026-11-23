
import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:5181/api/TaiKhoan'

export default function AccountManagement({ onBack }) {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [tenDangNhap, setTenDangNhap] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [vaiTro, setVaiTro] = useState('KhachHang')
  const [message, setMessage] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editTenDangNhap, setEditTenDangNhap] = useState('')
  const [editVaiTro, setEditVaiTro] = useState('KhachHang')
  const [editMatKhauMoi, setEditMatKhauMoi] = useState('')

  const loadAccounts = () => {
    setLoading(true)
    fetch(`${API_URL}/danh-sach`)
      .then(response => {
        if (!response.ok) throw new Error('Không thể tải tài khoản')
        return response.json()
      })
      .then(data => {
        setAccounts(data)
        setError('')
      })
      .catch(() => setError('Không thể kết nối Backend'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const createAccount = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/tao-moi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tenDangNhap,
          matKhau,
          vaiTro
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Tạo tài khoản thất bại')
        return
      }

      setMessage('Tạo tài khoản thành công!')
      setTenDangNhap('')
      setMatKhau('')
      setVaiTro('KhachHang')
      setShowForm(false)
      loadAccounts()
    } catch {
      setMessage('Không thể kết nối Backend')
    }
  }

  const toggleStatus = async (maTk) => {
    try {
      const response = await fetch(
        `${API_URL}/doi-trang-thai/${maTk}`,
        { method: 'PUT' }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Không thể đổi trạng thái')
        return
      }

      alert(data.message)
      loadAccounts()
    } catch {
      alert('Không thể kết nối Backend')
    }
  }

  const editAccount = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${API_URL}/sua/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tenDangNhap: editTenDangNhap,
          vaiTro: editVaiTro,
          matKhauMoi: editMatKhauMoi
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Cập nhật thất bại')
        return
      }

      alert(data.message)
      setEditingId(null)
      setEditMatKhauMoi('')
      loadAccounts()
    } catch {
      alert('Không thể kết nối Backend')
    }
  }

  return (
    <div className="account-management">
      <header>
        <h2>🐾 SenPetopia - Quản lý tài khoản</h2>
        <button onClick={onBack}>Quay lại</button>
      </header>

      <main>
        <h1>Danh sách tài khoản</h1>
        <p>Quản lý tài khoản người dùng trong hệ thống.</p>

        <button onClick={() => {
          setShowForm(!showForm)
          setMessage('')
        }}>
          + Thêm tài khoản
        </button>

        {showForm && (
          <form onSubmit={createAccount}>
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

            <select
              value={vaiTro}
              onChange={(e) => setVaiTro(e.target.value)}
            >
              <option value="KhachHang">Khách hàng</option>
              <option value="NhanVienBanHang">Nhân viên bán hàng</option>
              <option value="NhanVienKho">Nhân viên kho</option>
              <option value="QuanTriVien">Quản trị viên</option>
            </select>

            <button type="submit">Lưu tài khoản</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Hủy
            </button>
          </form>
        )}

        {message && <p>{message}</p>}

        {editingId !== null && (
          <form onSubmit={editAccount}>
            <h3>Sửa thông tin tài khoản</h3>

            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={editTenDangNhap}
              onChange={(e) => setEditTenDangNhap(e.target.value)}
              required
            />

            <select
              value={editVaiTro}
              onChange={(e) => setEditVaiTro(e.target.value)}
            >
              <option value="KhachHang">Khách hàng</option>
              <option value="NhanVienBanHang">Nhân viên bán hàng</option>
              <option value="NhanVienKho">Nhân viên kho</option>
              <option value="QuanTriVien">Quản trị viên</option>
            </select>

            <input
              type="password"
              placeholder="Mật khẩu mới (để trống nếu không đổi)"
              value={editMatKhauMoi}
              onChange={(e) => setEditMatKhauMoi(e.target.value)}
            />

            <button type="submit">Lưu thay đổi</button>

            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setEditMatKhauMoi('')
              }}
            >
              Hủy
            </button>
          </form>
        )}

        <button onClick={loadAccounts}>↻ Làm mới</button>

        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Mã tài khoản</th>
                <th>Tên đăng nhập</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {accounts.map(account => (
                <tr key={account.maTk}>
                  <td>{account.maTk}</td>
                  <td>{account.tenDangNhap}</td>
                  <td>{account.vaiTro}</td>
                  <td>{account.trangThai}</td>
                  <td>
                    {new Date(account.ngayTao).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingId(account.maTk)
                        setEditTenDangNhap(account.tenDangNhap)
                        setEditVaiTro(account.vaiTro)
                        setEditMatKhauMoi('')
                      }}
                    >
                      Sửa
                    </button>

                    <button onClick={() => toggleStatus(account.maTk)}>
                      {account.trangThai === 'HoatDong'
                        ? 'Khóa'
                        : 'Mở khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}
