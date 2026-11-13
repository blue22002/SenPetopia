using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SenPetopia.API.Data;

namespace SenPetopia.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SanPhamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SanPhamController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sanPhams = await _context.SanPham.ToListAsync();
            return Ok(sanPhams);
        }
    }
}