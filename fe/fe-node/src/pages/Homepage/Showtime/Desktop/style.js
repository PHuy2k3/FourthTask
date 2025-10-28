import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: theme.spacing(0, 1),
    [theme.breakpoints.down(960)]: {
      width: "100%",
      padding: theme.spacing(0, 0.5),
    },
  },
  Arrow: {
    position: "absolute",
    top: "48%",
    transform: "translateY(-50%)",
    [theme.breakpoints.down(960)]: {
      display: "none",
    },
    zIndex: 2,
    width: 48,
    height: 96,
    color: "rgba(226, 232, 240, 0.65) !important",
    cursor: "pointer",
    transition: "all .2s",
    background: "rgba(15, 23, 42, 0.45)",
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    boxShadow: "0 18px 40px -24px rgba(15, 23, 42, 0.6)",
    '&:hover': { color: '#f97316 !important', background: 'rgba(15, 23, 42, 0.7)' },
  },
}));

export default useStyles;