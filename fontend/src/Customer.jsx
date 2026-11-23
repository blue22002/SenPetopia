
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

//const API_URL = 'https://senpetopia-api.onrender.com/api/SanPham'
const API_URL = 'http://localhost:5181/api/SanPham'
const KHACH_HANG_API = 'http://localhost:5181/api/KhachHang'
const GIO_HANG_API = 'http://localhost:5181/api/GioHang'

const CATEGORIES = [
  { icon: '🥣', name: 'Thức ăn', description: 'Dinh dưỡng mỗi ngày' },
  { icon: '🎾', name: 'Đồ chơi', description: 'Vui chơi thỏa thích' },
  { icon: '👕', name: 'Quần áo', description: 'Thời trang thú cưng' },
  { icon: '🦴', name: 'Phụ kiện', description: 'Những món đồ đáng yêu' },
  { icon: '🧼', name: 'Vệ sinh & chăm sóc', description: 'Chăm sóc bé mỗi ngày' },
]

const money = (n) =>
  Number(n).toLocaleString('vi-VN') + '₫'

export default function Customer() {
  const navigate = useNavigate()
  const taiKhoan = JSON.parse(
    localStorage.getItem('taiKhoan') || 'null'
  )
  console.log('Tài khoản đăng nhập:', taiKhoan)

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('Tất cả')
  const [menuOpen, setMenuOpen] = useState(false)
  const [maKh, setMaKh] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không thể tải sản phẩm')
        }
        return response.json()
      })
      .then((data) => setProducts(data))
      .catch(() => setError('Không thể kết nối đến máy chủ.'))
      .finally(() => setLoading(false))
  }, [])

  if (!taiKhoan || taiKhoan.vaiTro !== 'KhachHang') {
    navigate('/dang-nhap')
    return null
  }

  const dangXuat = () => {
    localStorage.removeItem('taiKhoan')
    navigate('/dang-nhap')
  }
  const themVaoGioHang = async (maSp) => {
  if (!maKh) {
    alert('Không tìm thấy thông tin khách hàng!')
    return
  }

  try {
    const response = await fetch(`${GIO_HANG_API}/them`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        maKh: maKh,
        maSp: maSp,
        soLuong: 1
      })
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Thêm vào giỏ hàng thất bại!')
      return
    }

    setCartCount(prev => prev + 1)
    alert('Đã thêm sản phẩm vào giỏ hàng!')
  } catch (error) {
  console.error('Lỗi thêm giỏ hàng:', error)
  alert('Không thể kết nối đến máy chủ!')
}
}
useEffect(() => {
  if (!taiKhoan?.maTk) return

  fetch(`${KHACH_HANG_API}/theo-tai-khoan/${taiKhoan.maTk}`)
    .then(res => {
      if (!res.ok) throw new Error()
      return res.json()
    })
    .then(data => {
      setMaKh(data.maKh)

      return fetch(`${GIO_HANG_API}/${data.maKh}`)
    })
    .then(res => {
      if (!res.ok) throw new Error()
      return res.json()
    })
    .then(data => {
      setCartCount(data.reduce((sum, item) => sum + item.soLuong, 0))
    })
    .catch(() => console.log('Không thể tải giỏ hàng'))
}, [])

  const filteredProducts = products.filter((p) => {
  const tenSP = (p.tenSP || '').toLowerCase()
  const matchName = tenSP.includes(keyword.toLowerCase())
  const matchCategory = category === 'Tất cả' || p.danhMuc === category
    return matchName && matchCategory
  })

  const chonDanhMuc = (tenDanhMuc) => {
    setCategory(tenDanhMuc)
    setMenuOpen(false)

    document.getElementById('san-pham')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const iconDanhMuc = (danhMuc) => {
    if (danhMuc === 'Thức ăn') return '🥣'
    if (danhMuc === 'Đồ chơi') return '🎾'
    if (danhMuc === 'Quần áo') return '👕'
    if (danhMuc === 'Phụ kiện') return '🦴'
    if (danhMuc === 'Vệ sinh & chăm sóc') return '🧼'
    return '🐾'
  }

  return (
    <div className="customer-page">

      {/* HEADER */}
      <header className="customer-header">

        {/* LOGO */}
        <a href="#trang-chu" className="customer-brand">
          <span>🐾</span>
          <span>SenPetopia</span>
        </a>

        {/* TÌM KIẾM */}
        <div className="customer-header-search-wrapper">
          <input
            className="customer-header-search"
            type="search"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* MENU DANH MỤC */}
        <nav className="customer-nav">
          <a href="#danh-muc">Chó cưng</a>
          <a href="#danh-muc">Mèo cưng</a>
          <a href="#san-pham" onClick={() => setCategory('Thức ăn')}>
            Thức ăn
          </a>
          <a href="#san-pham" onClick={() => setCategory('Phụ kiện')}>
            Phụ kiện
          </a>
          <a href="#san-pham">Khuyến mãi</a>
        </nav>

        {/* MENU BA GẠCH */}
        <div className="customer-menu-wrapper">
          <button
            className="customer-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Mở menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {menuOpen && (
            <>
              <div
                className="customer-menu-overlay"
                onClick={() => setMenuOpen(false)}
              />

              <div className="customer-dropdown">

                <div className="customer-menu-user">
                  <div className="customer-user-avatar">🐶</div>

                  <div>
                    <strong>{taiKhoan.tenDangNhap}</strong>
                    <span>Khách hàng SenPetopia</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/thong-tin-ca-nhan')
                  }}
                >
                  👤 Thông tin cá nhân
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    alert('Chức năng đơn hàng sẽ được bổ sung sau!')
                  }}
                >
                  📦 Đơn hàng của tôi
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/gio-hang')
                  }}
                >
                  🛒 Giỏ hàng ({cartCount})
                </button>


                <button
                  className="customer-logout"
                  onClick={dangXuat}
                >
                  🚪 Đăng xuất
                </button>

              </div>
            </>
          )}
        </div>
      </header>

      <main>

        {/* BANNER */}
        <section className="customer-hero" id="trang-chu">

          <div className="customer-hero-text">
            <span className="customer-eyebrow">
              🐾 CHÀO MỪNG ĐẾN VỚI SENPETOPIA
            </span>

            <h1>
              Thế giới mua sắm
              <br />
              dành cho <span>bé cưng!</span>
            </h1>

            <p>
              Xin chào {taiKhoan.tenDangNhap}!
              Cùng khám phá những sản phẩm chất lượng,
              đáng yêu dành riêng cho người bạn bốn chân của bạn.
            </p>

            <button
              className="customer-primary-btn"
              onClick={() => chonDanhMuc('Tất cả')}
            >
              Mua sắm ngay <span>→</span>
            </button>

            <div className="customer-hero-note">
              ❤️ Chăm sóc bé yêu bằng những điều tốt nhất
            </div>
          </div>

          <div className="customer-hero-image">
            <div className="customer-hero-circle">
              <span className="customer-hero-dog">🐕</span>
              <span className="customer-hero-cat">🐈</span>
            </div>

            <div className="customer-hero-sticker">
              🐾 Pet shop yêu thương
            </div>
          </div>

        </section>

        {/* THÔNG ĐIỆP CỬA HÀNG */}
        <section className="customer-benefits">

          <div>
            🚚
            <span>
              <strong>Mua sắm tiện lợi</strong>
              <small>Dễ dàng tìm sản phẩm</small>
            </span>
          </div>

          <div>
            🐾
            <span>
              <strong>Đa dạng sản phẩm</strong>
              <small>Dành cho mọi bé cưng</small>
            </span>
          </div>

          <div>
            ❤️
            <span>
              <strong>Chăm sóc yêu thương</strong>
              <small>Đồng hành cùng thú cưng</small>
            </span>
          </div>

        </section>

        {/* DANH MỤC */}
        <section className="customer-section" id="danh-muc">

          <div className="customer-heading">
            <span>KHÁM PHÁ CỬA HÀNG</span>
            <h2>Mua sắm theo danh mục</h2>
            <p>
              Tất cả những gì bé cưng cần đều có tại SenPetopia.
            </p>
          </div>

          <div className="customer-categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                className={`customer-category ${
                  category === c.name ? 'active' : ''
                }`}
                onClick={() => chonDanhMuc(c.name)}
              >
                <span className="customer-category-icon">
                  {c.icon}
                </span>

                <strong>{c.name}</strong>
                <small>{c.description}</small>
              </button>
            ))}
          </div>

        </section>

        {/* SẢN PHẨM */}
        <section
          className="customer-section customer-product-section"
          id="san-pham"
        >

          <div className="customer-heading">
            <span>GIAN HÀNG SENPETOPIA</span>
            <h2>Sản phẩm nổi bật</h2>
            <p>
              Lựa chọn những món đồ phù hợp nhất cho bé yêu.
            </p>
          </div>

          {/* LỌC DANH MỤC */}
          <div className="customer-product-tools">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Tất cả">Tất cả danh mục</option>

              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <p className="customer-status">
              Đang tải sản phẩm...
            </p>
          )}

          {error && (
            <p className="customer-error">{error}</p>
          )}

          {!loading && !error && (
            <>
              <div className="customer-product-result">
                <span>
                  Hiển thị {filteredProducts.length} sản phẩm
                </span>

                <span>🐾 SenPetopia Shop</span>
              </div>

              <div className="customer-products">

                {filteredProducts.map((p) => (
                  <article
                    className="customer-product-card"
                    key={p.maSP}
                  >
                    <div className="customer-product-image">
                      <span>{iconDanhMuc(p.danhMuc)}</span>
                      <small>{p.danhMuc}</small>
                    </div>

                    <div className="customer-product-info">
                      <h3>{p.tenSP}</h3>

                      <strong className="customer-product-price">
                        {money(p.giaBan)}
                      </strong>

                      <div className="customer-product-bottom">
                        <span>
                          {p.soLuongTon > 0
                            ? `Còn ${p.soLuongTon} sản phẩm`
                            : 'Hết hàng'}
                        </span>

                        <button
                          disabled={p.soLuongTon <= 0}
                          onClick={() => themVaoGioHang(p.maSP)}
                        >
                          {p.soLuongTon > 0
                            ? 'Mua ngay →'
                            : 'Hết hàng'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

              </div>

              {filteredProducts.length === 0 && (
                <p className="customer-status">
                  Không tìm thấy sản phẩm phù hợp.
                </p>
              )}
            </>
          )}

        </section>

        {/* BANNER CUỐI TRANG */}
        <section className="customer-promo">

          <div>
            <span>🐶 🐱</span>

            <h2>Bé cưng xứng đáng được yêu thương!</h2>

            <p>
              Khám phá ngay những sản phẩm thú cưng tại SenPetopia.
            </p>
          </div>

          <button onClick={() => chonDanhMuc('Tất cả')}>
            Khám phá cửa hàng →
          </button>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="customer-footer">
        <strong>🐾 SenPetopia</strong>

        <p>
          Cửa hàng sản phẩm và phụ kiện dành cho thú cưng.
        </p>

        <p>
          © {new Date().getFullYear()} SenPetopia. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
