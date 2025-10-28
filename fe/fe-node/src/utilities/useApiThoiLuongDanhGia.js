import { useEffect, useState } from 'react'
import Axios from "axios";
export default function UseThoiLuongDanhGia(maPhim) {
    const [data, setData] = useState({ thoiLuong: '120', danhGia: '10' })
    const url = `http://localhost:4000/api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`
    useEffect(() => {
        let getInfoFlimCancel = Axios.CancelToken.source();
        const loadData = async () => {
            try {
                const response = await Axios.get(url, {
                    cancelToken: getInfoFlimCancel.token
                });
                setData({
                    thoiLuong: response.data?.heThongRapChieu?.[0]?.cumRapChieu?.[0]?.lichChieuPhim?.[0]?.thoiLuong,
                    danhGia: response.data.danhGia
                });
            } catch (error) {
                if (Axios.isCancel(error)) {
                } else {
                    throw error;
                }
            }
        };
        loadData();
        return () => {
            getInfoFlimCancel.cancel();
        };
    }, [])
    return { thoiLuong: data.thoiLuong, danhGia: data.danhGia }
}