import { makeStyles } from "@material-ui/core";

const surfaceColor = "#0b1220";
const panelColor = "#111c2f";
const accentColor = "#38bdf8";

const useStyles = makeStyles((theme) => ({
  theater: {
    display: (props) => (props.isMobileTheater ? "block" : "flex"),
    maxWidth: 940,
    width: "100%",
    margin: `${theme.spacing(5)}px auto`,
    borderRadius: 18,
    background: surfaceColor,
    border: "1px solid #1e293b",
    boxShadow: "0 25px 45px rgba(15, 23, 42, 0.35)",
    overflow: "hidden",
  },
  taps: {
    display: "flex",
    flexDirection: (props) => (props.isMobileTheater ? "row" : "column"),
    alignItems: "stretch",
    backgroundColor: panelColor,
    borderBottom: "none",
    borderRight: (props) => (props.isMobileTheater ? "none" : "1px solid #1e293b"),
    padding: (props) => (props.isMobileTheater ? theme.spacing(1.5, 1) : theme.spacing(3, 2)),
    minWidth: 140,
    gap: theme.spacing(1),
  },
  cumRap: {
    minWidth: (props) => (props.isMobileTheater ? "100%" : "calc(100% - 200px)"),
    padding: (props) => (props.isMobileTheater ? theme.spacing(2) : theme.spacing(4, 5)),
    backgroundColor: surfaceColor,
  },
  tabs__indicator: {
    backgroundColor: "transparent",
    "& > span": {
      width: 6,
      borderRadius: 4,
      background: accentColor,
      height: "70%",
      alignSelf: "center",
      boxShadow: "0 0 16px rgba(56, 189, 248, 0.6)",
    },
  },
  tap: (props) => ({
    padding: theme.spacing(1.5, 2),
    minWidth: 140,
    width: "100%",
    margin: props.isMobileTheater ? 0 : "auto",
    borderRadius: 12,
    transition: "background-color 0.25s ease, transform 0.25s ease",
    ...props.underLine,
    color: "#cbd5f5",
    textTransform: "none",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    opacity: 0.72,
    '&:hover': {
      opacity: 1,
      backgroundColor: "rgba(30, 64, 175, 0.25)",
    },
  }),
  tapSelected: {
    opacity: 1,
    backgroundColor: "rgba(30, 64, 175, 0.35)",
    boxShadow: "0 18px 38px rgba(15, 23, 42, 0.45)",
    transform: "translateY(-2px)",
  },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: theme.spacing(1.5),
  },
  tabLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1.5),
    textAlign: "left",
  },
  tabLogo: {
    width: 46,
    height: 46,
    objectFit: "contain",
    borderRadius: 12,
    backgroundColor: "#fff",
    boxShadow: "inset 0 0 0 1px rgba(148, 163, 184, 0.3)",
  },
  tabText: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.25),
  },
  tabName: {
    fontWeight: 700,
    fontSize: theme.typography.pxToRem(14),
    color: "#f8fafc",
  },
  tabMeta: {
    fontWeight: 500,
    fontSize: theme.typography.pxToRem(12),
    color: accentColor,
  },
  tabAddress: {
    fontSize: theme.typography.pxToRem(11),
    color: "#94a3b8",
    maxWidth: 180,
  },
  emptyState: {
    maxWidth: 600,
    margin: `${theme.spacing(6)}px auto`,
    padding: theme.spacing(6, 3),
    borderRadius: 16,
    background: panelColor,
    border: "1px solid #1e293b",
    textAlign: "center",
    color: "#e2e8f0",
    boxShadow: "0px 18px 40px rgba(15, 23, 42, 0.35)",
  },
}));
export default useStyles;