
import { useEffect, useState } from 'react'
import './App.css'
import ProductManagement from './ProductManagement'

// Thay PORT bằng cổng HTTPS Backend của bạn
const API_URL = 'https://senpetopia-api.onrender.com/api/SanPham'

const CATEGORIES = [
  { icon: '🥣', name: 'Thức ăn' },
  { icon: '🎾', name: 'Đồ chơi' },
  { icon: '👕', name: 'Quần áo' },
  { icon: '🦴', name: 'Phụ kiện' },
  { icon: '🧼', name: 'Vệ sinh & chăm sóc' },
]

const money = (n) => Number(n).toLocaleString('vi-VN') + '₫'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('Tất cả')
  const [showManagement, setShowManagement] = useState(false)

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Không thể tải sản phẩm')
        return response.json()
      })
      .then((data) => setProducts(data))
      .catch(() => setError('Không thể kết nối đến máy chủ. Bạn hãy kiểm tra Backend nhé!'))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchName = p.tenSP.toLowerCase().includes(keyword.toLowerCase())
    const matchCategory = category === 'Tất cả' || p.danhMuc === category
    return matchName && matchCategory
  })
if (showManagement) {
  return (
    <ProductManagement
      onBack={() => setShowManagement(false)}
    />
  )
}
  return (
    <>
      <header className="bar">
        <a href="#" className="brand">🐾 SenPetopia</a>

        <nav className="navigation">
          <a href="#">Trang chủ</a>
          <a href="#danh-muc">Danh mục</a>
          <a href="#san-pham">Sản phẩm</a>
        </nav>

        <div className="bar-actions">
          <a href="#dang-nhap" className="login-link">Đăng nhập</a>
          <a href="#gio-hang" className="cart-btn">🛒 Giỏ hàng</a>
          <button className="login-link" onClick={() => setShowManagement(true)}>Quản lý sản phẩm </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <span className="eyebrow">🐶 PET SHOP · SENPETOPIA</span>
            <h1>Yêu thương bé cưng từ những điều nhỏ nhất</h1>
            <p>
              Khám phá thức ăn, đồ chơi, quần áo và phụ kiện
              chất lượng dành riêng cho những người bạn bốn chân.
            </p>
            <a href="#san-pham" className="primary-btn">
              Khám phá sản phẩm →
            </a>
          </div>

          <div className="hero-image">
            <span>🐕</span>
            <span>🐈</span>
            <div className="hero-note">Happy pets, happy life ❤️</div>
          </div>
        </section>

        <section className="block" id="danh-muc">
          <div className="section-heading">
            <div>
              <span className="section-label">KHÁM PHÁ</span>
              <h2>Danh mục sản phẩm</h2>
              <p>Lựa chọn những món đồ phù hợp cho bé cưng.</p>
            </div>
          </div>

          <div className="cats">
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                className={`cat-card ${category === c.name ? 'active' : ''}`}
                onClick={() => {
                  setCategory(c.name)
                  document.getElementById('san-pham')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span className="cat-icon">{c.icon}</span>
                <strong>{c.name}</strong>
                <span className="cat-arrow">→</span>
              </button>
            ))}
          </div>
        </section>

        <section className="block products-section" id="san-pham">
          <div className="section-heading product-heading">
            <div>
              <span className="section-label">CỬA HÀNG SENPETOPIA</span>
              <h2>Sản phẩm dành cho bé</h2>
              <p>Danh sách sản phẩm được tải trực tiếp từ hệ thống.</p>
            </div>
            <button className="all-btn" onClick={() => setCategory('Tất cả')}>
              Tất cả sản phẩm
            </button>
          </div>

          <div className="product-tools">
            <input
              type="search"
              placeholder="🔍 Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Tất cả">Tất cả danh mục</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {loading && <p className="status-message">Đang tải sản phẩm...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && (
            <>
              <p className="product-count">
                Hiển thị {filteredProducts.length} sản phẩm
              </p>

              <div className="products">
                {filteredProducts.map((p) => (
                  <article className="product-card" key={p.maSP}>
                    <div className="product-image">
                      <span>
                        {p.danhMuc === 'Thức ăn' ? '🥣' :
                         p.danhMuc === 'Đồ chơi' ? '🎾' :
                         p.danhMuc === 'Quần áo' ? '👕' : '🐾'}
                      </span>
                      <span className="product-category">{p.danhMuc}</span>
                    </div>

                    <div className="product-info">
                      <h3>{p.tenSP}</h3>
                      <p className="product-price">{money(p.giaBan)}</p>

                      <div className="product-bottom">
                        <span className={p.soLuongTon > 0 ? 'in-stock' : 'out-stock'}>
                          {p.soLuongTon > 0
                            ? `Còn ${p.soLuongTon} sản phẩm`
                            : 'Hết hàng'}
                        </span>
                        <button
                          className="buy-btn"
                          disabled={p.soLuongTon <= 0}
                          onClick={() => alert('Chức năng giỏ hàng sẽ được bổ sung sau!')}
                        >
                          {p.soLuongTon > 0 ? 'Mua ngay' : 'Hết hàng'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <p className="status-message">Không tìm thấy sản phẩm phù hợp.</p>
              )}
            </>
          )}
        </section>
      </main>

      <footer>
        <strong>🐾 SenPetopia</strong>
        <span>© {new Date().getFullYear()} SenPetopia. Yêu thương thú cưng mỗi ngày.</span>
      </footer>
    </>
  )
}
