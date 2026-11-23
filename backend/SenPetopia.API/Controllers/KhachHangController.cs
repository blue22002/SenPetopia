
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SenPetopia.API.Data;

namespace SenPetopia.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class KhachHangController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public KhachHangController(ApplicationDbContext context)
		{
			_context = context;
		}

		[HttpGet("theo-tai-khoan/{maTk}")]
		public async Task<IActionResult> GetTheoTaiKhoan(int maTk)
		{
			var khachHang = await _context.KhachHang
				.Where(k => k.MaTk == maTk)
				.Select(k => new
				{
					maKh = k.MaKh,
					maTk = k.MaTk,
					hoTen = k.HoTen
				})
				.FirstOrDefaultAsync();

			if (khachHang == null)
				return NotFound(new { message = "Không tìm thấy khách hàng." });

			return Ok(khachHang);
		}
	}
}
