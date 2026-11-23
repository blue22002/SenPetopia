
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SenPetopia.API.Data;

namespace SenPetopia.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SanPhamController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách sản phẩm kèm tên danh mục
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await (
                from sp in _context.SanPham
                join dm in _context.DanhMuc
                    on sp.MaDm equals dm.MaDm
                select new
                {
                    maSP = sp.MaSp,
                    maDM = sp.MaDm,
                    tenSP = sp.TenSp,
                    danhMuc = dm.TenDanhMuc,
                    giaBan = sp.GiaBan,
                    soLuongTon = sp.SoLuongTon,
                    hinhAnh = sp.HinhAnh,
                    moTa = sp.MoTa,
                    loaiPhuHop = sp.LoaiPhuHop,
                    canNangPhuHop = sp.CanNangPhuHop,
                    doTuoiPhuHop = sp.DoTuoiPhuHop,
                    trangThai = sp.TrangThai
                }
            ).ToListAsync();

            return Ok(products);
        }
    }
}
