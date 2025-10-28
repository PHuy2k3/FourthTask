
import React, { useEffect, useState } from 'react'
import Axios from "axios";
import PropTypes from 'prop-types';

CheckEmptySeat.propTypes = {
    maLichChieu: PropTypes.any.isRequired,
};
export default function CheckEmptySeat(maLichChieu) {
    const [isEmptySeat, setIsEmptySeat] = useState(false)
    const url = `http://localhost:4000/api/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`
    useEffect(() => {
        let cancel = Axios.CancelToken.source();
        const loadData = async () => {
            try {
                const response = await Axios.get(url, {
                    cancelToken: cancel.token
                });
                console.log("response.data: ", response.data);

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
            cancel.cancel();
        };
    }, [])

    return isEmptySeat
}