import { makeStyles } from "@material-ui/core";

const panelBorder = "rgba(255, 255, 255, 0.08)";
const surfaceGradient = "linear-gradient(135deg, rgba(15, 18, 42, 0.92) 0%, rgba(7, 10, 26, 0.9) 100%)";
const defaultAccent = "#4d8cff";
const subtleText = "rgba(198, 205, 232, 0.78)";

const clampAlpha = (value) => Math.min(Math.max(value, 0), 1);

const hexToRgba = (hex = defaultAccent, alpha = 1) => {
  const sanitized = (hex || "").replace("#", "");

  if (sanitized.length !== 3 && sanitized.length !== 6) {
    return `rgba(77, 140, 255, ${clampAlpha(alpha)})`;
  }

  const normalized = sanitized.length === 3
    ? sanitized.split("").map((char) => `${char}${char}`).join("")
    : sanitized;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  if ([r, g, b].some((channel) => Number.isNaN(channel))) {
    return `rgba(77, 140, 255, ${clampAlpha(alpha)})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${clampAlpha(alpha)})`;
};

const useStyles = makeStyles({
  flexCumRap: {
    display: "flex",
    borderRadius: 26,
    overflow: "hidden",
    border: `1px solid ${panelBorder}`,
    background: surfaceGradient,
    boxShadow: "0 28px 64px rgba(9, 11, 35, 0.35)",
  },
  lstCumRap: (props) => ({
    flex: "0 0 50%",
    overflowY: "auto",
    height: 705,
    overflowX: "hidden",
    borderRight: `1px solid ${panelBorder}`,
    borderLeft: `1px solid ${panelBorder}`,
    borderBottom: "none",
    backdropFilter: "blur(18px)",
    background: "linear-gradient(180deg, rgba(20, 24, 52, 0.85) 0%, rgba(9, 12, 30, 0.78) 100%)",
    padding: "18px 0",
    ...props.customScrollbar,
  }),
  cumRap: (props) => {
    const underline = props.underLine || {};
    const { "&:after": underlineAfter = {}, ...restUnderline } = underline;

    return {
      position: "relative",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      padding: "20px 28px",
      transition: "transform .25s ease, background .25s ease, box-shadow .25s ease, opacity .25s ease",
      color: "#edf0ff",
      opacity: 0.65,
      ...restUnderline,
      "&:after": {
        ...underlineAfter,
        width: "calc(100% - 56px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      },
      "&:hover": {
        transform: "translateX(10px)",
        opacity: 0.95,
      },
      "&:hover $cumRap__indicator": {
        opacity: 0.55,
      },
    };
  },
  cumRapActive: (props) => {
    const accent = props.color || defaultAccent;

    return {
      background: `linear-gradient(120deg, ${hexToRgba(accent, 0.25)} 0%, ${hexToRgba(accent, 0.45)} 100%)`,
      boxShadow: `0 24px 42px ${hexToRgba(accent, 0.32)}`,
      opacity: 1,
      "& $cumRap__indicator": {
        opacity: 1,
      },
      "&:hover $cumRap__indicator": {
        opacity: 1,
      },
    };
  },
  cumRap__indicator: (props) => {
    const accent = props.color || defaultAccent;

    return {
      position: "absolute",
      left: 12,
      top: "50%",
      width: 6,
      height: 42,
      borderRadius: 12,
      transform: "translateY(-50%)",
      background: `linear-gradient(180deg, ${hexToRgba(accent, 0.95)} 0%, ${hexToRgba(accent, 0.2)} 100%)`,
      boxShadow: `0 0 18px ${hexToRgba(accent, 0.6)}`,
      opacity: 0,
      transition: "opacity .25s ease",
    };
  },
  cumRap__body: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingLeft: 24,
  },
  cumRap__thumb: {
    flex: "0 0 60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    background: "rgba(255, 255, 255, 0.1)",
    padding: 6,
    marginRight: 18,
    border: `1px solid ${panelBorder}`,
  },
  cumRap__img: {
    width: 48,
    height: 48,
    borderRadius: 14,
    objectFit: "cover",
    boxShadow: "0 12px 26px rgba(10, 14, 32, 0.55)",
  },
  cumRap__info: {
    flex: 1,
    paddingLeft: 0,
  },
  cumRap__titleRow: {
    display: "flex",
    alignItems: "center",
    columnGap: 14,
    marginBottom: 10,
    "& p": {
      display: "flex",
      alignItems: "center",
      color: "#f7f9ff !important",
      margin: 0,
    },
    "& p span": {
      color: "#f7f9ff !important",
    },
  },
  cumRap__order: (props) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 34,
    height: 34,
    borderRadius: 12,
    background: hexToRgba(props.color || defaultAccent, 0.2),
    fontSize: 14,
    fontWeight: 600,
    color: "#f0f4ff",
    letterSpacing: 1,
    boxShadow: `0 10px 22px ${hexToRgba(props.color || defaultAccent, 0.18)}`,
  }),
  cumRap__address: {
    fontSize: 12,
    color: subtleText,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginBottom: 12,
  },
  cumRap__meta: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: 12,
    rowGap: 8,
  },
  cumRap__metaItem: (props) => ({
    fontSize: 11,
    color: "#d6e0ff",
    textTransform: "uppercase",
    letterSpacing: 1,
    background: hexToRgba(props.color || defaultAccent, 0.18),
    padding: "5px 12px",
    borderRadius: 999,
    border: `1px solid ${hexToRgba(props.color || defaultAccent, 0.35)}`,
    boxShadow: `0 12px 18px ${hexToRgba(props.color || defaultAccent, 0.14)}`,
  }),
});

export default useStyles;