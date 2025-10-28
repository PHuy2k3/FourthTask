import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { getMovieShowtimes } from '../../reducers/actions/MovieDetail';
import { DISPLAY_MOBILE_HOMEPAGE } from '../../constants/config'
import { RESET_MOVIEDETAIL_REDUCER } from '../../reducers/constants/MovieDetail';
import Detail from './Detail';
export default function Index() {
  const isMobile = useMediaQuery(DISPLAY_MOBILE_HOMEPAGE)
  const { movieDetailShowtimes, errorMovieDetailShowtimes } = useSelector((state) => state.movieDetailReducer);
  const param = useParams()
  const dispatch = useDispatch();
  useEffect(function () {
    dispatch(getMovieShowtimes(param.maPhim))
    return () => {
      dispatch({ type: RESET_MOVIEDETAIL_REDUCER })
    }
  }, [])

  if (errorMovieDetailShowtimes) {
    return <div>{errorMovieDetailShowtimes}</div>
  }
  return (
    <>
      <Detail movieDetailShowtimes={movieDetailShowtimes} isMobile={isMobile} />
    </>
  )
}
