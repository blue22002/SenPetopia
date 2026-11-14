
import { useEffect, useState } from 'react'

const API_URL = 'https://senpetopia-api.onrender.com/api/SanPham'

const money = (n) => Number(n).toLocaleString('vi-VN') + '₫'

export default function ProductManagement({ onBack }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tenSP, setTenSP] = useState('')
  const [danhMuc, setDanhMuc] = useState('Thức ăn')
  const [giaBan, setGiaBan] = useState('')
  const [soLuongTon, setSoLuongTon] = useState('')

  const loadProducts = async () => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setProducts(data)
    } catch {
      alert('Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const addProduct = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenSP,
          danhMuc,
          giaBan: Number(giaBan),
          soLuongTon: Number(soLuongTon)
        })
      })

      if (!res.ok) throw new Error()

      alert('Thêm sản phẩm thành công!')
      setTenSP('')
      setGiaBan('')
      setSoLuongTon('')
      loadProducts()
    } catch {
      alert('Không thể thêm sản phẩm')
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error()

      alert('Xóa sản phẩm thành công!')
      loadProducts()
    } catch {
      alert('Không thể xóa sản phẩm')
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <button onClick={onBack}>← Quay lại trang chủ</button>

      <h1>Quản lý sản phẩm SenPetopia</h1>

      <h2>Thêm sản phẩm</h2>

      <form onSubmit={addProduct}>
        <input
          placeholder="Tên sản phẩm"
          value={tenSP}
          onChange={e => setTenSP(e.target.value)}
          required
        />

        <select
          value={danhMuc}
          onChange={e => setDanhMuc(e.target.value)}
        >
          <option>Thức ăn</option>
          <option>Đồ chơi</option>
          <option>Quần áo</option>
          <option>Phụ kiện</option>
          <option>Vệ sinh & chăm sóc</option>
        </select>

        <input
          type="number"
          placeholder="Giá bán"
          min="0"
          value={giaBan}
          onChange={e => setGiaBan(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Số lượng tồn"
          min="0"
          value={soLuongTon}
          onChange={e => setSoLuongTon(e.target.value)}
          required
        />

        <button type="submit">+ Thêm sản phẩm</button>
      </form>

      <h2>Danh sách sản phẩm</h2>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p.maSP}>
                <td>{p.maSP}</td>
                <td>{p.tenSP}</td>
                <td>{p.danhMuc}</td>
                <td>{money(p.giaBan)}</td>
                <td>{p.soLuongTon}</td>
                <td>
                  <button onClick={() => deleteProduct(p.maSP)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
