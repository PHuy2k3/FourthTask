import React, { useEffect, useState } from 'react'
import Axios from "axios";
export default function ThoiLuongDanhGia(props) {
    const [data, setData] = useState({ thoiLuong: '120 ', danhGia: '..' })
    const url = `http://localhost:4000/api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${props.maPhim}`
    const style = {
        fontSize: 12,
        color: "#9b9b9b",
    }
    useEffect(() => {
        let getInfoFlimCancel = Axios.CancelToken.source();
        const loadData = async () => {
            try {
                const response = await Axios.get(url, {
                    cancelToken: getInfoFlimCancel.token
                });
                setData({
                    thoiLuong: response.data.heThongRapChieu?.[0].cumRapChieu?.[0].lichChieuPhim?.[0].thoiLuong,
                    danhGia: response.data.danhGia
                });
            } catch (error) {
                if (Axios.isCancel(error)) {
                    console.log("AxiosCancel: caught cancel");
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
    return (
        <>
            <span style={{ style }}>
                {`${data.thoiLuong} phút - TXT Đánh giá ${data.danhGia}`}
            </span>
        </>
    )
}