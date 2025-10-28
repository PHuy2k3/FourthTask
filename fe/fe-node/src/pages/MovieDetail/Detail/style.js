import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  desktop: {
  },
  bannerBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: "linear-gradient(to top, rgb(10, 32, 41), transparent 100%)"
  },
  topInfo: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e9e9e9",
    height: '100vh',
    // marginTop: '100px'

  },
  imgTrailer: {
    width: "25%",
    height: "100%",
    position: "relative",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    '&:hover > div ': { opacity: 1 },
  },
  img: {
    width: "100%",
    borderRadius: 4,

  },
  shortInfo: {
    width: "59%",
    padding: "0px 15px"
  },
  movieName: {
    fontSize: 24,
  },
  c18: {
    marginRight: "6px",
    verticalAlign: "13%",
    backgroundColor: "rgb(238, 130, 59)",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "4px",
    padding: "0 5px",
    display: "inline-block",
    textAlign: "center",
    minWidth: "33px"
  },
  btnMuaVe: {
    fontSize: "16px",
    borderRadius: "4px",
    background: "0 0",
    padding: "11px 25px",
    transition: "all .2s",
    marginTop: "25px",
    marginBottom: "20px",
    margin: '0 10px',
    backgroundColor: "rgb(238, 130, 59)",
    border: "none",
    color: "#fff",
    fontWeight:'600',
    "&:hover": {
      backgroundColor: "#b42a14",
    }
  },

  rate: {
    width: "16%",
    height: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  circular: {
    position: 'relative',
    height: 126,
    width: 126,
  },
  danhGia: {
    fontSize: 53,
    position: 'absolute',
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  fabProgress: {
    color: "#7ed321",
    position: 'absolute',
    top: 0,
    left: 0,
  },
  behined: {
    color: "#829869",
    position: 'absolute',
    top: 0,
    left: 0,
  },
  rateStar: {
    width: "fit-content",
    '& .MuiRating-iconEmpty': {
      color: "rgba(255, 180, 0, 0.3)",
    }
  },

  withOutImage: {
    borderRadius: 4,
    width: "100%", height: "100%",
    animationName: `$myEffect`,
    animationDuration: "3s",
    animationTimingFunction: `${theme.transitions.easing.easeInOut}`,
    animationIterationCount: "infinite",
    background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
    backgroundSize: "400% 400%",
  },
  "@keyframes myEffect": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },

}))
export default useStyles