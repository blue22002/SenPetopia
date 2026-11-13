using System.ComponentModel.DataAnnotations;

namespace SenPetopia.API.Models
{
    public class SanPham
    {
        [Key]
        public int MaSP { get; set; }

        public string TenSP { get; set; } = string.Empty;

        public string DanhMuc { get; set; } = string.Empty;

        public decimal GiaBan { get; set; }

        public int SoLuongTon { get; set; }
    }
}