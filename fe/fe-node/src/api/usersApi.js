import axiosClient from "./axiosClient";

const usersApi = {
    postDangKy: (user) => {
        const path = "/QuanLyNguoiDung/DangKy";
        return axiosClient.post(path, user);
    },
    postDangNhap: (user) => {
        const path = "/QuanLyNguoiDung/DangNhap";
        return axiosClient.post(path, user);
    },

    getDanhSachNguoiDung: () => {
        const path = "/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP09";
        return axiosClient.get(path);
    },

    getDanhSachNguoiDungPhanTrang: (soTrang, soPhanTuTrenTrang) => {
        const path = "/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang?MaNhom=GP09";
        return axiosClient.get(path, { soTrang, soPhanTuTrenTrang });
    },

    postThemNguoiDung: (user) => {
        const path = "/QuanLyNguoiDung/ThemNguoiDung";

        return axiosClient.post(path, user);
    },

    deleteUser: (taiKhoan) => {
        const path = `/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`;

        return axiosClient.delete(path);
    },

    editTaiKhoan: (user) => {
        const path = `/QuanLyNguoiDung/CapNhatThongTinNguoiDung`;
        return axiosClient.put(path, user);
    },

    getThongTinTaiKhoan: (info) => {
        const path = `/QuanLyNguoiDung/ThongTinTaiKhoan`;
        return axiosClient.post(path, info);
    },

    getDanhSachVeDaDat: (taiKhoanNguoiDat) => {
        const path = `/QuanLyDatVe/LayDanhSachVeDaMua?taiKhoanNguoiDat=${taiKhoanNguoiDat}`;
        return axiosClient.get(path);
    },

    getDanhSachVeDatCuaKhachHang : () => {
        const path = `/QuanLyDatVe/LayDanhSachVeDaMuaCuaKhachHang`;
        return axiosClient.get(path);
    },

    getVe : (taiKhoanNguoiDat, maGhe) => {
        const path = `/QuanLyDatVe/LayVeTheoMaGhe?taiKhoanNguoiDat=${taiKhoanNguoiDat}&maGhe=${maGhe}`;
        return axiosClient.get(path);
    },

    creatPaymentUrl: (amount, maLichChieu, danhSachVe, taiKhoanNguoiDung) => {
        const path = '/create_payment_url';
        const params = {
          amount: amount,
          maLichChieu: maLichChieu,
          taiKhoanNguoiDung: taiKhoanNguoiDung
        };
      
        danhSachVe.forEach((value, index) => {
          params[`danhSachVe[${index}]`] = value;
        });
      
        return axiosClient.get(path, { params });
      },

     getVietQR: ({ amount, maLichChieu, taiKhoanNguoiDung, orderId, danhSachVe }) => {
        const path = "/payment/vietqr/create";
        return axiosClient.post(path, {
            amount,
            maLichChieu,
            taiKhoanNguoiDung,
            orderId,
            danhSachVe,
        });
    },

    // FE polling trạng thái đã nhận tiền hay chưa
    checkVietQrStatus: ({ orderId }) => {
        const encodedId = encodeURIComponent(orderId ?? "");
        const path = `payment/vietqr/status/${encodedId}`;
        return axiosClient.get(path);
    },

    // Xác nhận tay (dùng test nhanh khi chưa có webhook ngân hàng)
    confirmVietQrPaid: ({ orderId }) => {
        const path = "/payment/vietqr/manual-confirm";
        return axiosClient.post(path, { orderId });
    }, 
    updateStatusOfTicket : (data) => {
        const path = `/QuanLyDatVe/ThayDoiTrangThaiDatVe`;
        return axiosClient.put(path, data)
    },

    getMonth : () => {
        const path = "/ThongKe/getMonth";
        return axiosClient.get(path);
    },

    getPhim : () => {
        const path = "ThongKe/getPhim";
        return axiosClient.get(path);
    },

    deleteTicketOfUser : (data) => {
        const path = `/DeleteTicketOfUser?maGhe=${data.maGhe}&taiKhoanNguoiDat=${data.taiKhoanNguoiDat}`;
        return axiosClient.delete(path)
    }
};

export default usersApi;