import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import useStyles from './styles'
import { OPEN_MODAL } from "../../reducers/constants/ModalTrailer";
const play = "/img/carousel/play-video.png";
BtnPlay.propTypes = {
  urlYoutube: PropTypes.string,
  cssRoot: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};
export default function BtnPlay({ cssRoot, width, height, urlYoutube }) {
  const classes = useStyles({ width, height });
  const dispatch = useDispatch();
  const openModal = () => {
    dispatch({
      type: OPEN_MODAL,
      payload: {
        open: true,
        urlYoutube,
      },
    });
  };
  return (
    <div className={`${classes.button} ${cssRoot}`}>
      <img
        src={play}
        className={classes.imgPlay}
        onClick={() => openModal()}
        alt="play"
      />
    </div>
  );
}
