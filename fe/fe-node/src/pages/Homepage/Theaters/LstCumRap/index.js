import React, { memo, useCallback } from 'react';

import LstPhim from '../LstPhim';
import useStyles from './style';
import { underLine, customScrollbar } from '../../../../styles/materialUi';
import TheaterImg from '../../../../components/TheaterImg/TheaterImg';
import TenCumRap from '../../../../components/TenCumRap';

function LstCumRap(props) {
  const { lstCumRap, color } = props;
  const [valueCumRap, setValueCumRap] = React.useState(0);
  const classes = useStyles({ underLine, customScrollbar, color });

  const handleChangeCumRap = useCallback((index) => {
    setValueCumRap(index);
  }, []);

  const handleKeyDown = useCallback((event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleChangeCumRap(index);
    }
  }, [handleChangeCumRap]);

  return (
    <div className={classes.flexCumRap}>
      <div className={classes.lstCumRap}>
        {lstCumRap.map((cumRap, index) => {
          const isActive = valueCumRap === index;
          const totalRooms = cumRap?.danhSachRap?.length || 0;
          const totalMovies = cumRap?.danhSachPhim?.length || 0;

          return (
            <div
              className={`${classes.cumRap}${isActive ? ` ${classes.cumRapActive}` : ''}`}
              onClick={() => handleChangeCumRap(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              role="button"
              tabIndex={0}
              key={cumRap.maCumRap}
            >
              <span className={classes.cumRap__indicator} />
              <div className={classes.cumRap__body}>
                <div className={classes.cumRap__thumb}>
                  <TheaterImg nameTheater={cumRap.tenCumRap} imgStyle={classes.cumRap__img} />
                </div>
                <div className={classes.cumRap__info}>
                  <div className={classes.cumRap__titleRow}>
                    <span className={classes.cumRap__order}>{String(index + 1).padStart(2, '0')}</span>
                    <TenCumRap tenCumRap={cumRap.tenCumRap} />
                  </div>
                  <p className={classes.cumRap__address}>{cumRap.diaChi}</p>
                  <div className={classes.cumRap__meta}>
                    {totalRooms > 0 && (
                      <span className={classes.cumRap__metaItem}>{`${totalRooms} phòng chiếu`}</span>
                    )}
                    {totalMovies > 0 && (
                      <span className={classes.cumRap__metaItem}>{`${totalMovies} phim đang chiếu`}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {lstCumRap.map((cumRap, index) => (
        <LstPhim lstPhim={cumRap.danhSachPhim} key={cumRap.maCumRap} hidden={valueCumRap !== index} />
      ))}
    </div>
  );
}

export default memo(LstCumRap);