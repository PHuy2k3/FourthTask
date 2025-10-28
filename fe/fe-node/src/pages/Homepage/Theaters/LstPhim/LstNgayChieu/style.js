import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  lstNgayChieu: {
    paddingTop: 18,
    display: "flex",
    flexDirection: "column",
    rowGap: 18,
  },
  ngayChieu: {
    fontSize: 13,
    fontWeight: 600,
    color: "#9fb8ff",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    margin: 0,
  },
  groupTime: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    background: "rgba(10, 14, 32, 0.55)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    padding: "14px 16px",
  },
});

export default useStyles;