
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SenPetopia.API.Data;

namespace SenPetopia.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaiKhoanController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaiKhoanController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class DangNhapRequest
        {
            public string TenDangNhap { get; set; } = string.Empty;
            public string MatKhau { get; set; } = string.Empty;
        }

        [HttpPost("ma-hoa-mat-khau")]
        public IActionResult MaHoaMatKhau([FromBody] string matKhau)
        {
            var hash = BCrypt.Net.BCrypt.HashPassword(matKhau);
            return Ok(new { matKhauMaHoa = hash });
        }

        [HttpPost("dang-nhap")]
        public async Task<IActionResult> DangNhap(
            [FromBody] DangNhapRequest request)
        {
            var taiKhoan = await _context.TaiKhoan
                .FirstOrDefaultAsync(x =>
                    x.TenDangNhap == request.TenDangNhap);

            if (taiKhoan == null)
            {
                return Unauthorized(new
                {
                    message = "Tên đăng nhập hoặc mật khẩu không đúng"
                });
            }

            if (taiKhoan.TrangThai != "HoatDong")
            {
                return BadRequest(new
                {
                    message = "Tài khoản đã bị khóa hoặc chưa được kích hoạt"
                });
            }

            bool hopLe = BCrypt.Net.BCrypt.Verify(
                request.MatKhau,
                taiKhoan.MatKhauMaHoa
            );

            if (!hopLe)
            {
                return Unauthorized(new
                {
                    message = "Tên đăng nhập hoặc mật khẩu không đúng"
                });
            }

            taiKhoan.SoLanDangNhapSai = 0;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đăng nhập thành công",
                maTk = taiKhoan.MaTk,
                tenDangNhap = taiKhoan.TenDangNhap,
                vaiTro = taiKhoan.VaiTro
            });
        }
        [HttpGet("thong-tin/{maTk}")]
        public async Task<IActionResult> ThongTin(int maTk)
        {
            var taiKhoan = await _context.TaiKhoan
                .FirstOrDefaultAsync(x => x.MaTk == maTk);

            if (taiKhoan == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản" });
            }

            return Ok(new
            {
                maTk = taiKhoan.MaTk,
                tenDangNhap = taiKhoan.TenDangNhap,
                vaiTro = taiKhoan.VaiTro,
                trangThai = taiKhoan.TrangThai,
                ngayTao = taiKhoan.NgayTao
            });
        }

        [HttpGet("danh-sach")]
        public async Task<IActionResult> DanhSach()
        {
            var danhSach = await _context.TaiKhoan
                .Select(x => new
                {
                    maTk = x.MaTk,
                    tenDangNhap = x.TenDangNhap,
                    vaiTro = x.VaiTro,
                    trangThai = x.TrangThai,
                    ngayTao = x.NgayTao
                })
                .ToListAsync();

            return Ok(danhSach);
        }

        public class TaoTaiKhoanRequest
        {
            public string TenDangNhap { get; set; } = string.Empty;
            public string MatKhau { get; set; } = string.Empty;
            public string VaiTro { get; set; } = string.Empty;
        }

        [HttpPost("tao-moi")]
        public async Task<IActionResult> TaoMoi(
   [FromBody] TaoTaiKhoanRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.TenDangNhap) ||
                string.IsNullOrWhiteSpace(request.MatKhau) ||
                string.IsNullOrWhiteSpace(request.VaiTro))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin" });
            }

            bool daTonTai = await _context.TaiKhoan.AnyAsync(
                x => x.TenDangNhap == request.TenDangNhap
            );

            if (daTonTai)
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại" });
            }

            var taiKhoan = new SenPetopia.API.Models.TaiKhoan
            {
                TenDangNhap = request.TenDangNhap,
                MatKhauMaHoa = BCrypt.Net.BCrypt.HashPassword(request.MatKhau),
                VaiTro = request.VaiTro,
                TrangThai = "HoatDong",
                SoLanDangNhapSai = 0,
                NgayTao = DateTime.UtcNow
            };

            _context.TaiKhoan.Add(taiKhoan);
            await _context.SaveChangesAsync();
            Console.WriteLine("VaiTro nhận được: " + request.VaiTro);
            // Nếu là khách hàng thì tạo hồ sơ khách hàng tương ứng
            if (request.VaiTro == "KhachHang")
            {
                var khachHang = new SenPetopia.API.Models.KhachHang
                {
                    MaTk = taiKhoan.MaTk,
                    HoTen = request.TenDangNhap
                };

                _context.KhachHang.Add(khachHang);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Tạo tài khoản thành công",
                maTk = taiKhoan.MaTk
            });
        }
        [HttpPut("doi-trang-thai/{maTk}")]
        public async Task<IActionResult> DoiTrangThai(int maTk)
        {
            var taiKhoan = await _context.TaiKhoan
                .FirstOrDefaultAsync(x => x.MaTk == maTk);

            if (taiKhoan == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản" });
            }

            taiKhoan.TrangThai = taiKhoan.TrangThai == "HoatDong"
                ? "TamKhoa"
                : "HoatDong";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đổi trạng thái thành công",
                trangThai = taiKhoan.TrangThai
            });
        }

        public class SuaTaiKhoanRequest
        {
            public string TenDangNhap { get; set; } = string.Empty;
            public string VaiTro { get; set; } = string.Empty;
            public string MatKhauMoi { get; set; } = string.Empty;
        }

        [HttpPut("sua/{maTk}")]
        public async Task<IActionResult> SuaTaiKhoan(
            int maTk,
            [FromBody] SuaTaiKhoanRequest request)
        {
            var taiKhoan = await _context.TaiKhoan
                .FirstOrDefaultAsync(x => x.MaTk == maTk);

            if (taiKhoan == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản" });
            }

            if (string.IsNullOrWhiteSpace(request.TenDangNhap) ||
                string.IsNullOrWhiteSpace(request.VaiTro))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin" });
            }

            bool trungTen = await _context.TaiKhoan.AnyAsync(
                x => x.TenDangNhap == request.TenDangNhap && x.MaTk != maTk
            );

            if (trungTen)
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại" });
            }

            taiKhoan.TenDangNhap = request.TenDangNhap;
            taiKhoan.VaiTro = request.VaiTro;

            // Chỉ đổi mật khẩu khi Admin nhập mật khẩu mới
            if (!string.IsNullOrWhiteSpace(request.MatKhauMoi))
            {
                taiKhoan.MatKhauMaHoa = BCrypt.Net.BCrypt.HashPassword(
                    request.MatKhauMoi
                );
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật tài khoản thành công" });
        }
        public class DoiMatKhauRequest
        {
            public string MatKhauCu { get; set; } = string.Empty;
            public string MatKhauMoi { get; set; } = string.Empty;
        }

        [HttpPut("doi-mat-khau/{maTk}")]
        public async Task<IActionResult> DoiMatKhau(
            int maTk,
            [FromBody] DoiMatKhauRequest request)
        {
            var taiKhoan = await _context.TaiKhoan
                .FirstOrDefaultAsync(x => x.MaTk == maTk);

            if (taiKhoan == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản" });
            }

            if (string.IsNullOrWhiteSpace(request.MatKhauCu) ||
                string.IsNullOrWhiteSpace(request.MatKhauMoi))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ mật khẩu" });
            }

            if (!BCrypt.Net.BCrypt.Verify(
                request.MatKhauCu,
                taiKhoan.MatKhauMaHoa))
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác" });
            }

            taiKhoan.MatKhauMaHoa = BCrypt.Net.BCrypt.HashPassword(
                request.MatKhauMoi
            );

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công" });
        }
    }
}
