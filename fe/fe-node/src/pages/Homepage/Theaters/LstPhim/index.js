import React, { memo } from 'react'

import { useHistory } from "react-router-dom";

import ThoiLuongDanhGia from '../../../../components/ThoiLuongDanhGia/thoiLuongDanhGia'
import { customScrollbar } from '../../../../styles/materialUi'
import { underLine } from '../../../../styles/materialUi'
import useStyles from './style'
import LstNgayChieu from './LstNgayChieu/'

function Index(props) {
  const history = useHistory();
  const classes = useStyles({ customScrollbar, underLine });

  return (
    <div className={classes.lstPhim} hidden={props.hidden}>
      {props.lstPhim.map(phim => (
        <div onClick={() => history.push(`/detail/${phim.maPhim}`)} className={classes.phim} key={phim.maPhim}>
          <div className={classes.phim__info}>
            <img src={phim.hinhAnh} className={classes.phim__img} alt={phim.tenPhim} />
            <div className={classes.phim__text}>
              <p className={classes.phim__text_name}>{phim.tenPhim}</p>
              <div className={classes.phim__meta}>
                <span className={classes.phim__metaDot} />
                <ThoiLuongDanhGia maPhim={phim.maPhim} />
              </div>
            </div>
          </div>
          <div>
            <LstNgayChieu lstLichChieuTheoPhim={phim.lstLichChieuTheoPhim} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(Index);