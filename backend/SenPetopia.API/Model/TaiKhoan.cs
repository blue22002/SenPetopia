
namespace SenPetopia.API.Models
{
    public class TaiKhoan
    {
        public int MaTk { get; set; }

        public string TenDangNhap { get; set; } = string.Empty;

        public string MatKhauMaHoa { get; set; } = string.Empty;

        public string VaiTro { get; set; } = string.Empty;

        public string TrangThai { get; set; } = string.Empty;

        public int SoLanDangNhapSai { get; set; }

        public DateTime NgayTao { get; set; }
    }
}
