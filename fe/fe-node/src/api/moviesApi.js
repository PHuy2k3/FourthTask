import axiosClient from "./axiosClient";
const moviesApi = {
    getDanhSachPhim: () => {
        const path = "/QuanLyPhim/LayDanhSachPhim?maNhom=GP09";
        return axiosClient.get(path);
    },
    getThongTinPhim: (maPhim) => {
        const path = `/QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`;
        return axiosClient.get(path);
    },
    getDanhSachPhimTheoNgay: (maNhom, tuNgay, denNgay) => {
        const path = `/QuanLyPhim/LayDanhSachPhimTheoNgay`;
        return axiosClient.get(path, { maNhom, tuNgay, denNgay });
    },
    getDanhSachPhimPhanTrang: (param) => {
        const path = `/QuanLyPhim/LayDanhSachPhimPhanTrang`;
        return axiosClient.get(path, { param });
    },

    postThemPhim: (movie) => {
        const path = `/QuanLyPhim/ThemPhim`;
        return axiosClient.post(path, movie);
    },

    postCapNhatPhim: (movie) => {
        const path = `/QuanLyPhim/CapNhatPhim`;
        return axiosClient.post(path, movie);
    },

    deleteMovie: (maPhim) => {
        const path = `/QuanLyPhim/XoaPhim?MaPhim=${maPhim}`;
        return axiosClient.delete(path);
    },
};

export default moviesApi;
