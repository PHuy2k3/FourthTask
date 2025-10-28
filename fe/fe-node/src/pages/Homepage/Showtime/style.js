import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "rgba(15, 23, 42, 0.82)",
    color: "#e2e8f0",
    boxShadow: "0 28px 50px -30px rgba(15, 23, 42, 0.8)",
    borderRadius: theme.spacing(3.5),
    padding: theme.spacing(1),
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(0, "auto", 5),
    maxWidth: 960,
  },
  tabBar: {
    minHeight: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    backgroundColor: "transparent",
    transition: "none",
    '&::after': {
      content: '""',
      display: "block",
      width: 50,
      height: 4,
      margin: "0 auto",
      borderRadius: 999,
      background: "linear-gradient(135deg, #38bdf8 0%, #fb7185 100%)",
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.55)",
    },
  },
  tabButton: {
    opacity: 1,
    minHeight: 52,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 4),
    margin: theme.spacing(0, 1),
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontFamily: '"Saira", "Roboto", "Helvetica", "Arial", sans-serif',
    transition: "all .25s ease",
    color: "rgba(226, 232, 240, 0.75)",
    '&:hover': {
      color: "#f8fafc",
      background: "rgba(59, 130, 246, 0.15)",
    },
  },
  tabDangChieu: {
    color: (props) => (props.notDelay ? "rgba(226,232,240,0.75)" : "#38bdf8"),
    fontSize: (props) => (props.notDelay ? "0.95rem" : "1.05rem"),
  },
  tabSapChieu: {
    color: (props) => (props.notDelay ? "#fb7185" : "rgba(226,232,240,0.75)"),
    fontSize: (props) => (props.notDelay ? "1.05rem" : "0.95rem"),
  },
  Arrow: {
    position: "absolute",
    top: "48%",
    transform: "translateY(-50%)",
    zIndex: 2,
    width: 48,
    height: 96,
    color: "rgba(226, 232, 240, 0.6) !important",
    cursor: "pointer",
    transition: "all .2s",
    '&:hover': { color: '#f97316 !important' },
  },
  listMovie: {
    opacity: (props) => (props.fade ? 1 : 0),
    transition: "opacity .2s ease",
  },
}));

export default useStyles;