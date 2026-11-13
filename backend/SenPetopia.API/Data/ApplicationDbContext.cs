using Microsoft.EntityFrameworkCore;
using SenPetopia.API.Models;

namespace SenPetopia.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) : base(options)
        {
        }

        public DbSet<SanPham> SanPham { get; set; }
    }
}