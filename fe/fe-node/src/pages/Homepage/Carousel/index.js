import React, { useEffect, useState } from "react";
import axios from "axios";
import {URL_BANNER} from "../../../constants/config";
import Slider from "react-slick";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import SearchStickets from "./SearchTickets";
import useStyles from "./styles";
import { LOADING_BACKTO_HOME_COMPLETED } from "../../../reducers/constants/Lazy";
import "./carousel.css";

export default function Carousel() {
  const [listFilmBanner, setListFilmBanner] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const getFilmBanner = async () => {
    try {
      const res = await axios.get(URL_BANNER);
      setListFilmBanner(res.data.content)
    } catch (err) {
      console.error(err);
    }
  };
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const settings = {
    dots: true,
    infinite: true,
    autoplaySpeed: 5000, //speed per sence
    autoplay: true,
    speed: 500,
    swipeToSlide: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slickdotsbanner",
    beforeChange: (_current, next) => setActiveBannerIndex(next),
  };

  useEffect(() => {
    dispatch({ type: LOADING_BACKTO_HOME_COMPLETED });
    getFilmBanner();
  }, []);

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <ArrowForwardIosRoundedIcon
        style={{ right: "15px" }}
        onClick={onClick}
        className={classes.Arrow}
      />
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <ArrowBackIosRoundedIcon
        style={{ left: "15px" }}
        onClick={onClick}
        className={classes.Arrow}
      />
    );
  }

  const featuredBanner = listFilmBanner[activeBannerIndex] || listFilmBanner[0];

  const handleScrollToBooking = () => {
    const target = document.getElementById("searchTickets");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToSchedule = () => {
    const target = document.getElementById("lichchieu");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="carousel" className={classes.carousel}>
      <Slider {...settings}>
        {listFilmBanner.map((banner) => {
          return (
            <div key={banner.maPhim} className={classes.itemSlider}>
              <img src={banner?.hinhAnh} alt="banner" className={classes.img} />
              <div
                className={classes.backgroundLinear}
                onClick={() => history.push(`/detail/${banner.maPhim}`)}
              />
            </div>
          );
        })}
      </Slider>
      <div className={classes.heroOverlay}>
        <div className={classes.heroInner}>
          <div className={classes.heroContent}>
            <span className={classes.heroEyebrow}>Trải nghiệm điện ảnh đỉnh cao</span>
            <h1 className={classes.heroTitle}>
              Đặt vé xem phim đẹp mắt và nhanh chóng hơn bao giờ hết
            </h1>
            <p className={classes.heroSubtitle}>
              Cập nhật những suất chiếu mới nhất, sở hữu ghế đẹp và chiếu vé chỉ trong vài bước.
            </p>
            <div className={classes.heroActions}>
              <Button
                color="primary"
                variant="contained"
                className={classes.heroPrimaryButton}
                onClick={handleScrollToBooking}
              >
                Đặt ngay
              </Button>
              <Button
                variant="outlined"
                className={classes.heroSecondaryButton}
                onClick={handleScrollToSchedule}
              >
                Xem lịch chiếu
              </Button>
            </div>
          </div>
          {featuredBanner && (
            <aside className={classes.heroAside}>
              <div className={classes.highlightCard}>
                <div className={classes.highlightPosterWrap}>
                  <img
                    src={featuredBanner.hinhAnh}
                    alt={featuredBanner.tenPhim}
                    className={classes.highlightPoster}
                  />
                  <span className={classes.highlightBadge}>Đang nổi bật</span>
                </div>
                <div className={classes.highlightBody}>
                  <h3 className={classes.highlightTitle}>{featuredBanner.tenPhim}</h3>
                  {featuredBanner.danhGia !== undefined && (
                    <p className={classes.highlightMeta}>
                      Đánh giá {featuredBanner.danhGia}/10
                    </p>
                  )}
                  <Button
                    size="small"
                    className={classes.highlightButton}
                    onClick={() => history.push(`/detail/${featuredBanner.maPhim}`)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
      <SearchStickets />
    </div>
  );
}