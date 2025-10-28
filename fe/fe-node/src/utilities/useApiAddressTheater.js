import { useEffect, useState } from 'react'
import Axios from "axios";
export default function UseThoiLuongDanhGia(maLichChieu) {
    const [data, setData] = useState({ diaChi: 'loading...' })
    const url = `http://localhost:4000/api/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`
    useEffect(() => {
        if (!maLichChieu) {
            return
        }
        let getInfoFlimCancel = Axios.CancelToken.source();
        const loadData = async () => {
            try {
                const response = await Axios.get(url, {
                    cancelToken: getInfoFlimCancel.token
                });
                setData({
                    diaChi: response.data?.thongTinPhim?.diaChi,
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
    return { diaChi: data.diaChi }
}