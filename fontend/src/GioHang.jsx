
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

//const API_URL = 'http://localhost:5181/api/GioHang'
const API_URL = 'https://senpetopia-api.onrender.com/api/SanPham'
const KHACH_HANG_API = 'http://localhost:5181/api/KhachHang'

const money = (n) =>
  Number(n).toLocaleString('vi-VN') + '₫'

export default function GioHang() {
  const navigate = useNavigate()
  const taiKhoan = JSON.parse(
    localStorage.getItem('taiKhoan') || 'null'
  )

  const [maKh, setMaKh] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dangThanhToan, setDangThanhToan] = useState(false)

  const taiGioHang = async (idKhachHang) => {
    const res = await fetch(`${API_URL}/${idKhachHang}`)
    if (!res.ok) throw new Error('Không thể tải giỏ hàng.')
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => {
    const khoiTao = async () => {
      try {
        if (!taiKhoan || taiKhoan.vaiTro !== 'KhachHang') {
          navigate('/dang-nhap')
          return
        }

        const res = await fetch(
          `${KHACH_HANG_API}/theo-tai-khoan/${taiKhoan.maTk}`
        )

        if (!res.ok) throw new Error('Không tìm thấy khách hàng.')

        const data = await res.json()
        setMaKh(data.maKh)
        await taiGioHang(data.maKh)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    khoiTao()
  }, [])

  const capNhatSoLuong = async (item, soLuongMoi) => {
    if (soLuongMoi < 1) return

    try {
      const res = await fetch(`${API_URL}/cap-nhat/${item.maGh}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soLuong: soLuongMoi })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      await taiGioHang(maKh)
    } catch (err) {
      alert(err.message || 'Không thể cập nhật số lượng.')
    }
  }

  const xoaSanPham = async (maGh) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    try {
      const res = await fetch(`${API_URL}/xoa/${maGh}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      await taiGioHang(maKh)
    } catch (err) {
      alert(err.message || 'Không thể xóa sản phẩm.')
    }
  }

  // Thanh toán giỏ hàng
  const thanhToan = async () => {
    if (!maKh || dangThanhToan) return

    if (!window.confirm(
      `Bạn xác nhận thanh toán đơn hàng với tổng tiền ${money(tongTien)}?`
    )) return

    try {
      setDangThanhToan(true)

      const res = await fetch(`${API_URL}/thanh-toan/${maKh}`, {
        method: 'POST'
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Thanh toán thất bại.')
      }

      alert(data.message || 'Thanh toán thành công!')

      await taiGioHang(maKh)
    } catch (err) {
      alert(err.message || 'Không thể kết nối đến máy chủ.')
    } finally {
      setDangThanhToan(false)
    }
  }

  const tongTien = items.reduce(
    (sum, item) => sum + Number(item.thanhTien),
    0
  )

  if (loading) return <p>Đang tải giỏ hàng...</p>

  return (
    <div className="cart-page">
      <div className="cart-container">
        <button
          className="cart-back-btn"
          onClick={() => navigate('/khach-hang')}
        >
          ← Tiếp tục mua sắm
        </button>

        <h1>🛒 Giỏ hàng của tôi</h1>
        <p>Kiểm tra sản phẩm bạn đã chọn tại SenPetopia.</p>

        {error && <p className="cart-error">{error}</p>}

        {!error && items.length === 0 && (
          <div className="cart-empty">
            <span>🛒</span>
            <h2>Giỏ hàng đang trống</h2>
            <p>Hãy khám phá và chọn sản phẩm cho bé cưng nhé!</p>
            <button onClick={() => navigate('/khach-hang')}>
              Khám phá cửa hàng
            </button>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {items.map(item => (
                    <tr key={item.maGh}>
                      <td>{item.tenSP}</td>
                      <td>{money(item.giaBan)}</td>
                      <td>
                        <div className="cart-quantity">
                          <button
                            onClick={() =>
                              capNhatSoLuong(item, item.soLuong - 1)
                            }
                            disabled={item.soLuong <= 1}
                          >
                            −
                          </button>

                          <strong>{item.soLuong}</strong>

                          <button
                            onClick={() =>
                              capNhatSoLuong(item, item.soLuong + 1)
                            }
                            disabled={item.soLuong >= item.soLuongTon}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>{money(item.thanhTien)}</td>
                      <td>
                        <button
                          className="cart-delete-btn"
                          onClick={() => xoaSanPham(item.maGh)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-total">
              <span>Tổng thanh toán:</span>
              <strong>{money(tongTien)}</strong>
            </div>

            <div className="cart-checkout">
              <button
                onClick={thanhToan}
                disabled={dangThanhToan}
              >
                {dangThanhToan ? 'Đang thanh toán...' : 'Thanh toán'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
