
import React, { useEffect, useRef, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./style.css"
import { IMG_LOADING } from "../../constants/config";
import useHandleVibrateLazy from "../../utilities/useHandleVibrateLazy";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: (props) => (props.effectFadeOut ? "transparent" : "#fff"),
    zIndex: -1,
    transition: "background-color 0.6s ease-in-out",

    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  },
  visible: {
    zIndex: 99999,
  },
  image: {
    width: (props) => (props.isDesktop ? 250 : 100),
    animation: "$shake 0.6s infinite",
    position: "relative",
  },
  fadeIn: {
    animationName: "$fadeIn",
    animationDuration: "0.6s",
  },
  fadeOut: {
    animationName: "$fadeOut",
    animationDuration: "0.6s",
  },
  "@keyframes shake": {
    "0%": { transform: "rotate(-10deg)" },
    "50%": { transform: "rotate(10deg)" },
    "100%": { transform: "rotate(-10deg)" },
  },
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "scale(0.6,0.6)" },
    "70%": { opacity: 0.7, transform: "scale(1.1,1.1)" },
    "100%": { opacity: 1, transform: "scale(1)" },
  },
  "@keyframes fadeOut": {
    "0%": { opacity: 1, transform: "scale(1)" },
    "70%": { opacity: 0.7, transform: "scale(1.1,1.1)" },
    "100%": { opacity: 0, transform: "scale(0.6,0.6)" },
  },
});

export default function Loading() {
  const isLazy = useHandleVibrateLazy();
  const isLoadingBackToHome = useSelector(
    (state) => state.lazyReducer.isLoadingBackToHome
  );
  const loadingMovieList = useSelector(
    (state) => state.movieReducer.loadingMovieList
  );
  const loadingGetListSeat = useSelector(
    (state) => state.BookTicketReducer.loadingGetListSeat
  );
  const loadingMovieDetailShowtimes = useSelector(
    (state) => state.movieDetailReducer.loadingMovieDetailShowtimes
  );
  const loading =
    isLazy ||
    loadingMovieList ||
    loadingGetListSeat ||
    loadingMovieDetailShowtimes ||
    isLoadingBackToHome;
  const loadingPrevious = useRef(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [controlEffect, setControlEffect] = useState({
    visible: false,
    effectFadeIn: false,
    effectFadeOut: false,
  });
  const eFadeEffect = useRef(null);
  const materialStyles = useStyles({
    isDesktop,
    loading,
    visible: controlEffect.visible,
    effectFadeOut: controlEffect.effectFadeOut,
  });

  useEffect(() => {
    if (Number(loadingPrevious.current) < Number(loading)) {
      setControlEffect((data) => ({
        ...data,
        visible: true,
        effectFadeIn: true,
        effectFadeOut: false,
      }));
      loadingPrevious.current = true;
    } else if (Number(loadingPrevious.current) > Number(loading)) {
      setControlEffect((data) => ({
        ...data,
        visible: true,
        effectFadeIn: false,
        effectFadeOut: true,
      }));
      loadingPrevious.current = false;
      eFadeEffect.current?.addEventListener("animationend", resetAnimation);
    }
  }, [loading]);

  const resetAnimation = useCallback((e) => {
    eFadeEffect.current?.removeEventListener("animationend", resetAnimation);
    setControlEffect((data) => ({
      ...data,
      visible: false,
      effectFadeIn: false,
      effectFadeOut: false,
    }));
  }, []);

  return (
    <div
      className={clsx(
        `${materialStyles.root}`,
        controlEffect.visible && `${materialStyles.visible}`
      )}
      style={{ display: controlEffect.visible ? "flex" : "none" }}
    >
      <div
        ref={eFadeEffect}
        className={clsx(
          controlEffect.effectFadeIn && `${materialStyles.fadeIn}`,
          controlEffect.effectFadeOut && `${materialStyles.fadeOut}`
        )}
      >
       <div className="loading">
    <div className="bounceball"></div>
    <div className="text">NOW LOADING</div>
  </div>
      </div>
    </div>
  );
}