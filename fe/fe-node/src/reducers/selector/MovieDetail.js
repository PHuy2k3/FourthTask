import { createSelector } from 'reselect'
import formatDate from '../../utilities/formatDate';
const selectMobileData = createSelector(
  state => state.movieDetailReducer,
  movieDetailReducer => {
    const isEmptyData = movieDetailReducer.movieDetailShowtimes.heThongRapChieu?.length === 0
    const heThongRapChieu = movieDetailReducer.movieDetailShowtimes.heThongRapChieu
    const arrayAllLichChieuPhimAddProp = heThongRapChieu?.reduce(
      (colect1, heThongRapChieuItem) => {
        return [...colect1,
        ...heThongRapChieuItem.cumRapChieu?.reduce((colect2, cumRapChieuItem) => {
          return [...colect2,
          ...cumRapChieuItem.lichChieuPhim?.reduce((colect3, lichChieuPhimItem) => {
            return [...colect3, {
              ...lichChieuPhimItem,
              tenHeThongRap: heThongRapChieuItem.tenHeThongRap,
              tenCumRap: cumRapChieuItem.tenCumRap,
              logo: heThongRapChieuItem.logo
            }]
          }, [])
          ]
        }, [])
        ]
      }, [])

    const arrayDay = [...new Set(arrayAllLichChieuPhimAddProp?.map(
      item => item.ngayChieuGioChieu?.slice(0, 10)
    ))].sort()
    const arrayHeThongRapChieuFilterByDay = arrayDay.map((date) => {

      const arrayLichChieuPhimFilterByDay = arrayAllLichChieuPhimAddProp.filter(
        item => item.ngayChieuGioChieu.slice(0, 10) === date)

      const arrayHeThongRapRemoveDup = arrayLichChieuPhimFilterByDay?.filter(
        (itemIncrease, indexIncrease, arr) =>
          indexIncrease === arr.findIndex((t) => t.tenHeThongRap === itemIncrease.tenHeThongRap)
      )
      const arrayHeThongRapItem = arrayHeThongRapRemoveDup.map(heThongRapItem => {
        const arrayLichChieuPhimFilterByHeThongRap = arrayLichChieuPhimFilterByDay?.filter(
          (item) => item.tenHeThongRap === heThongRapItem.tenHeThongRap)
        const arrayCumRapChieuRemoveDup = arrayLichChieuPhimFilterByHeThongRap?.filter(
          (itemIncrease, indexIncrease, arr) =>
            indexIncrease === arr.findIndex((t) => t.tenCumRap === itemIncrease.tenCumRap))

        const cumRapChieu = arrayCumRapChieuRemoveDup.map(cumRapChieu => {
          const lichChieuPhim = arrayLichChieuPhimFilterByHeThongRap.filter(
            lichChieuPhim => lichChieuPhim.tenCumRap === cumRapChieu.tenCumRap
          )
          return {
            tenCumRap: cumRapChieu.tenCumRap,
            maLichChieu: cumRapChieu.maLichChieu,
            lichChieuPhim
          }
        })
        return { tenHeThongRap: heThongRapItem.tenHeThongRap, logo: heThongRapItem.logo, cumRapChieu }
      })

      return { date, heThongRap: arrayHeThongRapItem }
    })
    return { arrayHeThongRapChieuFilterByDay, isEmptyData }
  }
)

const selectDesktopData = (currentSelectedHeThongRapChieu) => {
  const arrayAllLichChieuPhim = currentSelectedHeThongRapChieu.cumRapChieu.reduce((colect, item) => {
    return [...colect,
    ...item.lichChieuPhim.map(lichChieu => ({
      ...lichChieu, tenCumRap: item.tenCumRap
    }))
    ]
  }, [])

  const arrayAllDay = arrayAllLichChieuPhim.map(item => {
    return item.ngayChieuGioChieu.slice(0, 10);
  })
  const arrayDay = [...(new Set(arrayAllDay))].sort() // xóa đi phần tử trùng lặp

  const allArrayCumRapChieuFilterByDay = arrayDay.map((day) => {
    const arrayLichChieuPhimFilterByDay = arrayAllLichChieuPhim.filter(item => {
      if (item.ngayChieuGioChieu.slice(0, 10) === day) {
        return true
      }
      return false
    })
    const arrayCumRapChieuRemoveDup = arrayLichChieuPhimFilterByDay?.filter((itemIncrease, indexIncrease, arr) => {
      const indexFirstFounded = arr.findIndex((t) => (
        t.tenCumRap === itemIncrease.tenCumRap
      ))
      return indexIncrease === indexFirstFounded
    })
    const arrayCumRapChieu = arrayCumRapChieuRemoveDup.map(cumRapChieu => {
      const tenCumRap = cumRapChieu.tenCumRap
      const maLichChieu = cumRapChieu.maLichChieu
      const lichChieuPhim = arrayLichChieuPhimFilterByDay.filter(lichChieuPhim => lichChieuPhim.tenCumRap === tenCumRap)
      return { tenCumRap, maLichChieu, lichChieuPhim }
    })

    return arrayCumRapChieu
  })
  return { arrayDay, allArrayCumRapChieuFilterByDay }
}

const selectCommentByMaPhimAndCommentTest = createSelector(
  (state, maPhim) => state.movieDetailReducer.commentList.filter(item => item.dataTest || (item.maPhim === maPhim)), // nếu comment là dataTest hoặc trùng mã phim thì lấy
  commentListFiltered => {
    const commentList = commentListFiltered.sort((a, b) => formatDate(b.createdAt).getTime - formatDate(a.createdAt).getTime)
    return { commentList }
  }
)

export { selectMobileData, selectDesktopData, selectCommentByMaPhimAndCommentTest }