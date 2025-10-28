import { makeStyles } from "@material-ui/core";

const accentColor = "#4d8cff";
const panelOverlay = "rgba(12, 16, 36, 0.55)";
const borderColor = "rgba(255, 255, 255, 0.08)";

const useStyles = makeStyles({
  lstPhim: (props) => ({
    flex: "0 0 50%",
    height: 705,
    overflowY: "auto",
    borderLeft: `1px solid ${borderColor}`,
    background: panelOverlay,
    backdropFilter: "blur(16px)",
    padding: "24px 26px",
    display: "flex",
    flexDirection: "column",
    rowGap: 20,
    ...props.customScrollbar,
  }),
  phim: () => ({
    padding: "20px 22px",
    borderRadius: 20,
    background:
      "linear-gradient(135deg, rgba(77, 140, 255, 0.12) 0%, rgba(130, 87, 255, 0.18) 100%)",
    boxShadow: "0 22px 36px rgba(10, 14, 32, 0.45)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 26px 46px rgba(10, 14, 32, 0.6)",
      borderColor: "rgba(77, 140, 255, 0.4)",
    },
  }),
  phim__info: {
    display: "flex",
    alignItems: "center",
    columnGap: 18,
  },
  phim__img: {
    width: 68,
    height: 68,
    objectFit: "cover",
    borderRadius: 18,
    boxShadow: "0 12px 22px rgba(15, 23, 42, 0.45)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  phim__text: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    rowGap: 6,
    color: "#dfe7ff",
  },
  phim__text_name: {
    fontWeight: 600,
    textTransform: "capitalize",
    fontSize: 16,
    color: "#f7f9ff",
    letterSpacing: 0.2,
  },
  phim__meta: {
    display: "flex",
    alignItems: "center",
    columnGap: 12,
    fontSize: 12,
    color: "rgba(223, 231, 255, 0.75)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  phim__metaDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: accentColor,
    boxShadow: "0 0 8px rgba(77, 140, 255, 0.6)",
  },
});

export default useStyles;