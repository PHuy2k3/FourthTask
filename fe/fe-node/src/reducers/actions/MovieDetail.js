import theatersApi from '../../api/theatersApi';
import {
  GET_MOVIE_SHOWTIMES_REQUESS, GET_MOVIE_SHOWTIMES_SUCCESS, GET_MOVIE_SHOWTIMES_FAIL,
} from '../constants/MovieDetail';

export const getMovieShowtimes = (movieId) => {
  return (dispatch) => {
    dispatch({
      type: GET_MOVIE_SHOWTIMES_REQUESS
    })
    theatersApi.getThongTinLichChieuPhim(movieId)
      .then(result => {
        dispatch({
          type: GET_MOVIE_SHOWTIMES_SUCCESS,
          payload: { data: result.data }
        })
      }
      )
      .catch(
        error => {
          dispatch({
            type: GET_MOVIE_SHOWTIMES_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}