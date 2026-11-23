
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

        public DbSet<TaiKhoan> TaiKhoan { get; set; }

        public DbSet<SanPham> SanPham { get; set; }

        public DbSet<DanhMuc> DanhMuc { get; set; }

        public DbSet<GioHang> GioHang { get; set; }

        public DbSet<KhachHang> KhachHang { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // TÀI KHOẢN
            modelBuilder.Entity<TaiKhoan>(entity =>
            {
                entity.ToTable("tai_khoan");

                entity.HasKey(e => e.MaTk);

                entity.Property(e => e.MaTk).HasColumnName("ma_tk");
                entity.Property(e => e.TenDangNhap).HasColumnName("ten_dang_nhap");
                entity.Property(e => e.MatKhauMaHoa).HasColumnName("mat_khau_ma_hoa");
                entity.Property(e => e.VaiTro).HasColumnName("vai_tro");
                entity.Property(e => e.TrangThai).HasColumnName("trang_thai");
                entity.Property(e => e.SoLanDangNhapSai).HasColumnName("so_lan_dang_nhap_sai");
                entity.Property(e => e.NgayTao).HasColumnName("ngay_tao");
            });

            // DANH MỤC
            modelBuilder.Entity<DanhMuc>(entity =>
            {
                entity.ToTable("danh_muc");

                entity.HasKey(e => e.MaDm);

                entity.Property(e => e.MaDm).HasColumnName("ma_dm");
                entity.Property(e => e.TenDanhMuc).HasColumnName("ten_danh_muc");
                entity.Property(e => e.MoTa).HasColumnName("mo_ta");
                entity.Property(e => e.TrangThai).HasColumnName("trang_thai");
            });

            // SẢN PHẨM
            modelBuilder.Entity<SanPham>(entity =>
            {
                entity.ToTable("san_pham");

                entity.HasKey(e => e.MaSp);

                entity.Property(e => e.MaSp).HasColumnName("ma_sp");
                entity.Property(e => e.MaDm).HasColumnName("ma_dm");
                entity.Property(e => e.MaSku).HasColumnName("ma_sku");
                entity.Property(e => e.TenSp).HasColumnName("ten_sp");
                entity.Property(e => e.GiaBan).HasColumnName("gia_ban");
                entity.Property(e => e.SoLuongTon).HasColumnName("so_luong_ton");
                entity.Property(e => e.HinhAnh).HasColumnName("hinh_anh");
                entity.Property(e => e.MoTa).HasColumnName("mo_ta");
                entity.Property(e => e.LoaiPhuHop).HasColumnName("loai_phu_hop");
                entity.Property(e => e.CanNangPhuHop).HasColumnName("can_nang_phu_hop");
                entity.Property(e => e.DoTuoiPhuHop).HasColumnName("do_tuoi_phu_hop");
                entity.Property(e => e.TrangThai).HasColumnName("trang_thai");
                entity.Property(e => e.NgayTao).HasColumnName("ngay_tao");
            });
            //Giỏ Hàng
            modelBuilder.Entity<GioHang>(entity =>
            {
                entity.ToTable("gio_hang");

                entity.HasKey(e => e.MaGh);

                entity.Property(e => e.MaGh).HasColumnName("ma_gh");
                entity.Property(e => e.MaKh).HasColumnName("ma_kh");
                entity.Property(e => e.MaSp).HasColumnName("ma_sp");
                entity.Property(e => e.SoLuong).HasColumnName("so_luong");
                entity.Property(e => e.NgayThem).HasColumnName("ngay_them");
            });
            //Khách hàng
            modelBuilder.Entity<KhachHang>(entity =>
            {
                entity.ToTable("khach_hang");

                entity.HasKey(e => e.MaKh);

                entity.Property(e => e.MaKh).HasColumnName("ma_kh");
                entity.Property(e => e.MaTk).HasColumnName("ma_tk");
                entity.Property(e => e.HoTen).HasColumnName("ho_ten");
                entity.Property(e => e.SoDienThoai).HasColumnName("so_dien_thoai");
                entity.Property(e => e.DiaChi).HasColumnName("dia_chi");
            });
        }
    }
}
