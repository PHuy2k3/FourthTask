import React, { useState } from "react";

import { useParams } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLocation } from "react-router-dom";
import "./style.css"
import useStyles from "./style";
import formatDate from "../../../utilities/formatDate";
import useApiThoiLuongDanhGia from "../../../utilities/useApiThoiLuongDanhGia";
import Tap from "../Tap";
import { useDispatch } from 'react-redux';
import { OPEN_MODAL } from '../../../reducers/constants/ModalTrailer';
const play = '/img/carousel/play-video.png';
export default function Desktop({ movieDetailShowtimes: data, isMobile }) {
  const [onClickBtnMuave, setOnClickBtnMuave] = useState(0);
  const param = useParams();
  const [quantityComment, setQuantityComment] = useState(0);
  const { thoiLuong, danhGia } = useApiThoiLuongDanhGia(param.maPhim);
  const classes = useStyles({ bannerImg: data?.hinhAnh });
  const [imagePage404, setImagePage404] = useState(false);
  let location = useLocation();

  const handleBtnMuaVe = () => {
    setOnClickBtnMuave(Date.now());
  };
  const onIncreaseQuantityComment = (value) => {
    setQuantityComment(value);
  };
  const dispatch = useDispatch()

  const openModal = () => {
    dispatch({
      type: OPEN_MODAL, payload: {
        open: true,
        urlYoutube: data.trailer
      }
    })
  };


  console.log(data,"data")
  return (
    <div className="">
      <div className="wrapperFlex">
        <div className="flexCent">
          <div className="items">
            <img
              src={data.hinhAnh}
              alt="poster"
              onError={(e) => {
                e.target.onerror = null;
                setImagePage404(true);
              }}
            />
            {imagePage404 && <div className={classes.withOutImage}></div>}
          </div>
          <div className="items">
            <div className="">
              <div className="row">
                <p  className={`col-lg-3`}>Ngày công chiếu</p>
                <p  className={`col-lg-3`}>
                  {formatDate(data.ngayKhoiChieu?.slice(0, 10)).YyMmDd}
                </p>
              </div>
              <div className="row">
                <p  className={`col-lg-3`}>Đạo diễn</p>
                <p  className={`col-lg-3`}> {data?.daoDien} </p>
              </div>
              <div className="row">
                <p  className={`col-lg-3`}>Diễn viên</p>
                <p  className={`col-lg-3`}>
                {data?.dienVien}
                </p>
              </div>
              <div className="row">
                <p  className={`col-lg-3`}>Thể Loại</p>
                <p  className={`col-lg-3`}>{data?.maTheLoaiPhim}</p>
              </div>
              <div className="row">
                <p  className={`col-lg-3`}>Định dạng</p>
                <p  className={`col-lg-3`}>{data?.dinhDang}</p>
              </div>
              <div className="row">
                <p  className={`col-lg-3`}>Quốc Gia SX</p>
                <p  className={`col-lg-3`}>{data?.nhaSanXuat}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <p  className={``}>Nội dung</p>
              </div>
              <div className="col-lg-9">
                <p>{data.moTa}</p>
              </div>
            </div>
            <div className={classes.shortInfo}>
             
              <button className={classes.btnMuaVe} onClick={handleBtnMuaVe}>
                {location.state?.comingMovie ? "Thông tin phim" : "Mua vé"}
              </button>
              <button className={classes.btnMuaVe} onClick={() => openModal()}>
                {location.state?.comingMovie ? "Thông tin phim" : "Xem demo"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Tap
        data={data}
        onClickBtnMuave={onClickBtnMuave}
        onIncreaseQuantityComment={onIncreaseQuantityComment}
        isMobile={isMobile}
      />
    </div>
  );
}
