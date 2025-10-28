import axiosClient from "./axiosClient";
const theatersApi = {
    getThongTinHeThongRap: () => {
        const path = "/QuanLyRap/LayThongTinHeThongRap";
        return axiosClient.get(path);
    },
    getThongTinLichChieuHeThongRap: () => {
        const path = "/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP09";
        return axiosClient.get(path);
    },
    getThongTinLichChieuPhim: (maPhim) => {
        const path = `/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`;
        return axiosClient.get(path);
    },
    getListCumRapTheoHeThong: (maHeThongRap) => {
        const path = `/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`;
        return axiosClient.get(path);
    },

    getListRap: () => {
        const path = `/QuanLyRap/LayThongTinRap`;
        return axiosClient.get(path);
    },
    deleteLichChieu: (maLichChieu) => {
        const path = `/QuanLyLichChieu/XoaLichChieu?maLichChieu=${maLichChieu}`;
        return axiosClient.delete(path);
    },
    getThongTinCumRap : () => {
        const path = "/QuanLyRap/LayThongTinCumRap";
        return axiosClient.get(path);
    },
    addThongTinCumRap : (data) => {
        const path = "/QuanLyRap/AddCumRap";
        return axiosClient.post(path, data);
    },
    suaCumRap : (data) => {
        const path = "/QuanLyRap/SuaCumRap";
        return axiosClient.put(path, data)
    },
    xoaCumRap : (data) => {
        const path = "/QuanLyRap/XoaCumRap";
        return axiosClient.post(path,data);
    },

    // CHUC NANG CUA RAP
    themRap : (data) => {
        const path = "/QuanLyRap/ThemRap";
        return axiosClient.post(path, data);
    },

    suaRap : (data) => {
        const path = "/QuanLyRap/SuaRap";
        return axiosClient.put(path, data);
    },

    xoaRap : (data) => {
        const path = "/QuanLyRap/XoaRap";
        return axiosClient.post(path, data)
    },


    //CHUC NANG THE LOAI PHIM
    getThongTinCuaTheLoaiPhim : () => {
        const path = "/QuanLyRap/LayThongTinTheLoaiPhim";
        return axiosClient.get(path);
    },
    addTheLoaiPhim : (data) => {
        const path = "/QuanLyRap/AddTheLoaiPhim";
        return axiosClient.post(path, data);
    }
    ,
    updateTheLoaiPhim : (data) => {
        const path = "/QuanLyRap/UpdateTheLoaiPhim";
        return axiosClient.put(path, data);
    }
    ,
    deleteTheLoaiPhim : (id) => {
        const path = "/QuanLyRap/DeleteTheLoaiPhim";
        return axiosClient.post(path, id);
    }
};

export default theatersApi;
