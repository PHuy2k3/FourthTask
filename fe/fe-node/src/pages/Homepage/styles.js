import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "radial-gradient(circle at 10% 10%, #1b2a4b 0%, #050914 45%, #030510 100%)",
    color: "#f8fafc",
    overflow: "hidden",
  },
  heroSection: {
    position: "relative",
  },
  sectionSpacing: {
    position: "relative",
    padding: theme.spacing(10, 0),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(7, 0),
    },
  },
  sectionLight: {
    background: "linear-gradient(180deg, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.64) 45%, rgba(15,23,42,0.35) 100%)",
  },
  sectionDark: {
    background: "radial-gradient(circle at top, rgba(30,58,138,0.45) 0%, rgba(3,7,18,0.92) 55%, rgba(3,7,18,1) 100%)",
  },
  sectionInner: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: theme.spacing(0, 3),
    position: "relative",
    zIndex: 1,
  },
  sectionGlow: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.18), transparent 55%), radial-gradient(circle at 80% 70%, rgba(14,165,233,0.15), transparent 60%)",
    opacity: 0.65,
  },
}));

export default useStyles;