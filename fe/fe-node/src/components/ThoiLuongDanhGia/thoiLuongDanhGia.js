import React from 'react'

import useApiThoiLuongDanhGia from '../../utilities/useApiThoiLuongDanhGia';

export default function ThoiLuongDanhGia(props) {
  const { thoiLuong, danhGia } = useApiThoiLuongDanhGia(props.maPhim)
  const style = {
    fontSize: 12,
    color: "rgba(223, 231, 255, 0.85)",
    letterSpacing: 0.5,
  }
  return (
    <>
      <span style={style}>
        {`${thoiLuong ?? "120"} phút - Điểm ${danhGia}`}
      </span>
    </>
  )
}