import React, { useState, useRef, useEffect } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import Desktop from './Desktop';
import useStyles from './style';

const getTimeSafe = (value) => {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

const sortByDate = (list = [], direction = 'desc') => {
  const factor = direction === 'asc' ? 1 : -1;

  return list.slice().sort((a, b) => {
    const timeA = getTimeSafe(a?.ngayKhoiChieu);
    const timeB = getTimeSafe(b?.ngayKhoiChieu);

    if (timeA === null && timeB === null) {
      return 0;
    }

    if (timeA === null) {
      return 1;
    }

    if (timeB === null) {
      return -1;
    }

    return (timeA - timeB) * factor;
  });
};

const limitItems = (list = [], limit = 16) => list.slice(0, limit);

const STATIC_COMING_MOVIES = [
  {
    maPhim: 'static-dune-pt2',
    tenPhim: 'Dune: Phần Hai',
    hinhAnh: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    trailer: 'https://www.youtube.com/watch?v=nqGSLM8v9WE',
    ngayKhoiChieu: '2024-11-01T00:00:00.000Z',
    thoiLuong: 155,
    danhGia: 'Đang cập nhật',
    forceInfoOnly: true,
  },
  {
    maPhim: 'static-inside-out-2',
    tenPhim: 'Inside Out 2',
    hinhAnh: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    trailer: 'https://www.youtube.com/watch?v=LEjhY15eCx0',
    ngayKhoiChieu: '2024-06-14T00:00:00.000Z',
    thoiLuong: 96,
    danhGia: 'Đang cập nhật',
    forceInfoOnly: true,
  },
  {
    maPhim: 'static-venom-3',
    tenPhim: 'Venom: The Last Dance',
    hinhAnh: 'https://image.tmdb.org/t/p/w500/1f3qspvmyg7s62dShvL5RRSD8SN.jpg',
    trailer: 'https://www.youtube.com/watch?v=__2bjWbetsA',
    ngayKhoiChieu: '2024-10-24T00:00:00.000Z',
    thoiLuong: 110,
    danhGia: 'Đang cập nhật',
    forceInfoOnly: true,
  },
  {
    maPhim: 'static-kungfu-panda-4',
    tenPhim: 'Kung Fu Panda 4',
    hinhAnh: 'https://image.tmdb.org/t/p/w500/yNXkx4hEJHKJrp9IbKWv1EL86rl.jpg',
    trailer: 'https://www.youtube.com/watch?v=_inKs4eeHiI',
    ngayKhoiChieu: '2024-03-08T00:00:00.000Z',
    thoiLuong: 95,
    danhGia: 'Đang cập nhật',
    forceInfoOnly: true,
  },
];

const getShowingMovies = (movieList = []) => {
  const now = Date.now();
  const showing = movieList.filter((movie) => {
    const time = getTimeSafe(movie?.ngayKhoiChieu);
    if (time === null) {
      return true;
    }

    return time <= now;
  });

  return limitItems(sortByDate(showing));
};

const getComingMovies = (movieList = []) => {
  const now = Date.now();
  const coming = movieList.filter((movie) => {
    const time = getTimeSafe(movie?.ngayKhoiChieu);
    return time !== null && time > now;
  });

  return limitItems(sortByDate([...coming, ...STATIC_COMING_MOVIES], 'asc'));
};
export function SampleNextArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <ArrowForwardIosRoundedIcon style={{ right: "-82px" }} onClick={onClick} className={classes.Arrow} />
  );
}
export function SamplePrevArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <ArrowBackIosRoundedIcon style={{ left: "-82px" }} onClick={onClick} className={classes.Arrow} />
  );
}
export default function SimpleTabs() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [value, setValue] = useState({ value: 0, fade: true, notDelay: 0 });
  const { errorMovieList, movieList } = useSelector((state) => state.movieReducer);
  const timeout = useRef(null)
  const [arrayData, setarrayData] = useState({ dailyMovieList: [], comingMovieList: [] })
  const classes = useStyles({ fade: value.fade, value: value.value, notDelay: value.notDelay });
  useEffect(() => {
    return () => {
      clearTimeout(timeout.current)
    }
  }, [])

  useEffect(() => {
    const list = Array.isArray(movieList) ? movieList : []
    const dailyMovieList = getShowingMovies(list)
    const comingMovieList = getComingMovies(list)

    setarrayData({ dailyMovieList, comingMovieList })
  }, [movieList])

  const handleChange = (e, newValue) => {
    setValue(value => ({ ...value, notDelay: newValue, fade: false }));
    timeout.current = setTimeout(() => {
      setValue(value => ({ ...value, value: newValue, fade: true }))
    }, 100);
  };

  if (errorMovieList) {
    return <div>{errorMovieList}</div>
  }

  return (
    <div
      style={{ paddingTop: "80px" }}
      id="lichchieu"
    >
      <div className="tab-bar">
      <AppBar className={classes.appBar} position="static">
        <Tabs classes={{ root: classes.tabBar, indicator: classes.indicator }} value={value.value} onChange={handleChange}>
          <Tab disableRipple className={`${classes.tabButton} ${classes.tabDangChieu}`} label="Phim đang chiếu" />
          <Tab disableRipple className={`${classes.tabButton} ${classes.tabSapChieu}`} label="Phim sắp chiếu" />
        </Tabs>
      </AppBar>
      </div>
      <div className={classes.listMovie}>
        <Desktop arrayData={arrayData} value={value} />
      </div>
    </div >

  );
}

