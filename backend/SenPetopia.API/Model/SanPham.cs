
namespace SenPetopia.API.Models
{
    public class SanPham
    {
        public int MaSp { get; set; }

        public int MaDm { get; set; }

        public string MaSku { get; set; } = string.Empty;

        public string TenSp { get; set; } = string.Empty;

        public decimal GiaBan { get; set; }

        public int SoLuongTon { get; set; }

        public string? HinhAnh { get; set; }

        public string? MoTa { get; set; }

        public string? LoaiPhuHop { get; set; }

        public string? CanNangPhuHop { get; set; }

        public string? DoTuoiPhuHop { get; set; }

        public string TrangThai { get; set; } = string.Empty;

        public DateTime NgayTao { get; set; }
    }
}
