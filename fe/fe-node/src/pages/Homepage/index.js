import React, { useEffect } from "react";
import clsx from "clsx";

import { useDispatch, useSelector } from "react-redux";

import { getMovieList } from "../../reducers/actions/Movie";
import { getTheaters } from "../../reducers/actions/Theater";
import Carousel from "./Carousel";
import Theaters from "./Theaters";
import Showtime from "./Showtime";
import FeatureHighlights from "./FeatureHighlights";
import ExperienceShowcase from "./ExperienceShowcase";
import useStyles from "./styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Homepage() {
  const dispatch = useDispatch();
  const movieList = useSelector((state) => state.movieReducer.movieList);
  const theaterList = useSelector((state) => state.theaterReducer.theaterList);
  const classes = useStyles();

  useEffect(() => {
    if (!movieList.length) {
      dispatch(getMovieList());
    }
    if (!theaterList.length) {
      dispatch(getTheaters());
    }
  }, []);

  return (
    <main className={classes.page}>
      <section className={classes.heroSection}>
        <Carousel />
      </section>
      <FeatureHighlights />
      <ExperienceShowcase />
      <section className={clsx(classes.sectionSpacing, classes.sectionLight)}>
        <span className={classes.sectionGlow} />
        <div className={classes.sectionInner}>
          <Showtime />
        </div>
      </section>
      <section className={clsx(classes.sectionSpacing, classes.sectionDark)}>
        <span className={classes.sectionGlow} />
        <div className={classes.sectionInner}>
          <Theaters />
        </div>
      </section>
    </main>
  );
}