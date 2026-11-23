
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SenPetopia.API.Data;
using SenPetopia.API.Models;

namespace SenPetopia.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GioHangController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GioHangController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy giỏ hàng
        [HttpGet("{maKh}")]
        public async Task<IActionResult> GetGioHang(int maKh)
        {
            var gioHang = await (
                from gh in _context.GioHang
                join sp in _context.SanPham
                    on gh.MaSp equals sp.MaSp
                where gh.MaKh == maKh
                select new
                {
                    maGh = gh.MaGh,
                    maSp = sp.MaSp,
                    tenSP = sp.TenSp,
                    giaBan = sp.GiaBan,
                    hinhAnh = sp.HinhAnh,
                    soLuong = gh.SoLuong,
                    soLuongTon = sp.SoLuongTon,
                    thanhTien = sp.GiaBan * gh.SoLuong
                }
            ).ToListAsync();

            return Ok(gioHang);
        }

        // Thêm sản phẩm vào giỏ
        [HttpPost("them")]
        public async Task<IActionResult> ThemVaoGio(
            [FromBody] ThemGioHangRequest request)
        {
            if (request.SoLuong <= 0)
                return BadRequest(new { message = "Số lượng không hợp lệ." });

            var khachHang = await _context.KhachHang
                .FirstOrDefaultAsync(k => k.MaKh == request.MaKh);

            if (khachHang == null)
                return NotFound(new { message = "Không tìm thấy khách hàng." });

            var sanPham = await _context.SanPham
                .FirstOrDefaultAsync(s => s.MaSp == request.MaSp);

            if (sanPham == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm." });

            var gioHang = await _context.GioHang
                .FirstOrDefaultAsync(g =>
                    g.MaKh == request.MaKh &&
                    g.MaSp == request.MaSp);

            int soLuongMoi = (gioHang?.SoLuong ?? 0) + request.SoLuong;

            if (soLuongMoi > sanPham.SoLuongTon)
                return BadRequest(new { message = "Số lượng vượt quá tồn kho." });

            if (gioHang == null)
            {
                gioHang = new GioHang
                {
                    MaKh = request.MaKh,
                    MaSp = request.MaSp,
                    SoLuong = request.SoLuong,
                    NgayThem = DateTime.UtcNow
                };

                _context.GioHang.Add(gioHang);
            }
            else
            {
                gioHang.SoLuong = soLuongMoi;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã thêm sản phẩm vào giỏ hàng!" });
        }

        // Cập nhật số lượng
        [HttpPut("cap-nhat/{maGh}")]
        public async Task<IActionResult> CapNhat(
            int maGh, [FromBody] CapNhatGioHangRequest request)
        {
            var gioHang = await _context.GioHang.FindAsync(maGh);

            if (gioHang == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm trong giỏ." });

            if (request.SoLuong <= 0)
                return BadRequest(new { message = "Số lượng không hợp lệ." });

            var sanPham = await _context.SanPham.FindAsync(gioHang.MaSp);

            if (sanPham == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm." });

            if (request.SoLuong > sanPham.SoLuongTon)
                return BadRequest(new { message = "Số lượng vượt quá tồn kho." });

            gioHang.SoLuong = request.SoLuong;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật giỏ hàng thành công!" });
        }

        // Xóa sản phẩm
        [HttpDelete("xoa/{maGh}")]
        public async Task<IActionResult> Xoa(int maGh)
        {
            var gioHang = await _context.GioHang.FindAsync(maGh);

            if (gioHang == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm trong giỏ." });

            _context.GioHang.Remove(gioHang);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa sản phẩm khỏi giỏ hàng!" });
        }

        // Thanh toán giỏ hàng
        [HttpPost("thanh-toan/{maKh}")]
        public async Task<IActionResult> ThanhToan(int maKh)
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync();

            var gioHang = await _context.GioHang
                .Where(g => g.MaKh == maKh)
                .ToListAsync();

            if (gioHang.Count == 0)
                return BadRequest(new { message = "Giỏ hàng đang trống." });

            foreach (var item in gioHang)
            {
                var sanPham = await _context.SanPham
                    .FirstOrDefaultAsync(s => s.MaSp == item.MaSp);

                if (sanPham == null)
                    return BadRequest(new { message = "Có sản phẩm không còn tồn tại." });

                if (item.SoLuong > sanPham.SoLuongTon)
                    return BadRequest(new
                    {
                        message = $"Sản phẩm {sanPham.TenSp} không đủ số lượng tồn kho."
                    });
            }

            foreach (var item in gioHang)
            {
                var sanPham = await _context.SanPham
                    .FirstAsync(s => s.MaSp == item.MaSp);

                sanPham.SoLuongTon -= item.SoLuong;
            }

            _context.GioHang.RemoveRange(gioHang);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { message = "Thanh toán thành công!" });
        }
    }

    public class ThemGioHangRequest
    {
        public int MaKh { get; set; }
        public int MaSp { get; set; }
        public int SoLuong { get; set; }
    }

    public class CapNhatGioHangRequest
    {
        public int SoLuong { get; set; }
    }
}