import axiosClient from "./axiosClient";
const BookTicketApi = {
    getDanhSachPhongVe: (maLichChieu) => {
        const path = `/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`;
        return axiosClient.get(path);
    },

    postDatVe: (data) => {
        const path = `/QuanLyDatVe/DatVe`;

        return axiosClient.post(path, data);
    },

    postTaoLichChieu: (data) => {
        const path = `/QuanLyDatVe/TaoLichChieu`;
        return axiosClient.post(path, data);
    },
    getLichChieuByMaLichChieu : (maLichChieu) => {
        const path = `/QuanLyDatVe/LayLichChieu?MaLichChieu=${maLichChieu}`;
        return axiosClient.get(path);
    },
    editLichChieuByMaLichChieu : (maLichChieu, time, gia) => {
        const path = `/QuanLyDatVe/SuaLichChieu?MaLichChieu=${maLichChieu}`;
        return axiosClient.put(path, {time, gia});
    },
};

export default BookTicketApi;