import React from 'react'

import { Link, useHistory } from 'react-router-dom'

import BtnPlay from '../../../../../components/BtnPlay';
import useStyles from './styles';
import useApiThoiLuongDanhGia from '../../../../../utilities/useApiThoiLuongDanhGia';

import './movie.css'

function MovieItem({ movie, comingMovie = false }) {
  const forceInfoOnly = movie?.forceInfoOnly || movie?.maPhim?.toString().startsWith('static-');
  const infoOnly = comingMovie || forceInfoOnly;
  const classes = useStyles({ bg: movie.hinhAnh, comingMovie: infoOnly });
  const history = useHistory();
  const handleOverlayClick = () => {
    if (forceInfoOnly) {
      return;
    }
    history.push(`/detail/${movie.maPhim}`, { comingMovie: infoOnly });
  };
  const { thoiLuong, danhGia } = useApiThoiLuongDanhGia(movie.maPhim, {
    thoiLuong: movie.thoiLuong,
    danhGia: movie.danhGia,
    disableFetch: forceInfoOnly
  })
  return (
    <div style={{
      padding: '15px',
      cursor: 'pointer',
    }} >
      <div className="film">
        <div className="film__img">
          <div className={`film__poster ${classes.addbg}`}>
            <div className="film__overlay" onClick={handleOverlayClick} />
            <div className="play__trailer">
              <BtnPlay cssRoot={"play"} width={48} height={48} urlYoutube={movie.trailer} />
            </div>
          </div>
        </div>
        <div className="film__content">
          <div className={`film__name ${thoiLuong ? "" : "not_hide"}`}>
            <div className="name">
              <p><span className="c18">C18</span>{movie.tenPhim}</p>
            </div>
            <p className="pt-2">
              {thoiLuong ? <span className="text_info">{thoiLuong} phút - {danhGia ?? movie.danhGia}</span> : <span className="text_info">{danhGia ?? movie.danhGia}</span>}
            </p>
          </div>
          {/* <div className={`film__button`}>
            {(thoiLuong || infoOnly) && (
              <Link
                style={{ background: infoOnly ? "#60c5ef" : "rgb(238, 130, 59)" }}
                to={forceInfoOnly ? '#' : {
                  pathname: `/datve/${movie.maPhim}`,
                  state: { comingMovie: infoOnly }
                }}
                onClick={forceInfoOnly ? (event) => event.preventDefault() : undefined}
              >
                {infoOnly ? "THÔNG TIN PHIM" : "MUA VÉ"}
              </Link>
            )}
          </div> */}
        </div>
      </div>
    </div>
  )

}
export default MovieItem