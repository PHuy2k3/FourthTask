import { fade, makeStyles } from "@material-ui/core/styles";
import { customScrollbar } from "../../styles/materialUi";
import { createMuiTheme } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  return {
    backgroundImg: {
      animationTimingFunction: `${theme.transitions.easing.easeInOut}`,
      animationIterationCount: "infinite",
      animationDirection: "reverse",
      animationName: "$myEffect",
      backgroundImage: (theme) =>
        theme.srcImg
          ? `url('${theme.srcImg}')`
          : "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
      backgroundSize: (theme) => (theme.srcImg ? "auto" : "400% 400%"),
      animationDuration: (theme) => (theme.srcImg ? "0s" : "5s"),
    },
    "@keyframes myEffect": {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" },
    },
    button: {
      margin: theme.spacing(1),
      width: 270,
    },

    addMovie: {
      margin: theme.spacing(1),
    },

    search: {
      verticalAlign: "bottom",
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.info.light, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.info.light, 0.25),
      },
      [theme.breakpoints.down("md")]: {
        marginTop: 11,
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
      textOverflow: "ellipsis",
      overflow: "hidden",
      display: "flex",
    },
    inputInput: {
      padding: "8.5px 8.5px 8.5px 0px",
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
    },

    rootTrailer: {
      display: "inline-block",
      width: 50,
      height: 50,
      position: "relative",
      "&:hover > div": {
        opacity: 1,
      },
      "& > div > img": {
        verticalAlign: "top",
      },
    },
    imgTrailer: {
      width: "100%",
      height: "100%",
      borderRadius: 4,
    },

    rootCellExpand: {
      alignItems: "center",
      lineHeight: "24px",
      width: "100%",
      height: "100%",
      position: "relative",
      display: "flex",
      "& .cellValue": {
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    rootSlider: {
      width: 60,
      verticalAlign: "middle",
    },

    search__item: {
      color: "black",
      padding: 10,
      "& > div > div": {
        border: "1px solid #cacaca",
        textShadow:
          "1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
        color: "rgb(238, 130, 59)",
        padding: "18px 0px",
        paddingLeft: 15,
        borderRadius: 4,
        "&:focus": {
          borderRadius: 4,
        },
        "& ~ svg": {
          color: "#fff",
          top: "29%",
          right: "12px",
        },
        "& > input": {
          // text select date
          textShadow:
            "1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
        },
        "&:before": {
          borderColor: "transparent",
        },
      
      },
      "& div": {
        "&:before": {
          borderColor: "transparent",
        },
       
      },
    },
    paddingBtn: {
      padding: "18.4px 11px 18.4px",
    },
    menu: { maxHeight: 300, ...customScrollbar },
    menu__item: {
      width: "100%",
      minHeight: "auto",
      display: "block",
      padding: "3px 20px",
      fontSize: "14px",
      color: "#333",
      "&:focus": {
        backgroundColor: "transparent",
      },
      "& li ~ li": {
        fontSize: 11,
        color: "#aaa",
      },
      "&:hover": {
        backgroundColor: "rgb(238, 130, 59)",
        color: "#fff",
        "& li ~ li": {
          color: "#fff",
        },
      },
    },
    "menu__item--selected": {
      backgroundColor: "rgb(238, 130, 59) !important",
      color: "#fff",
      "& li ~ li": {
        color: "#fff",
      },
    },
    imgSelected: {
      maxWidth: "100%",
      borderRadius: 4,
      marginTop: 11,
    },
    control: {
      margin: "11px 0",
    },
    itemCtro: {
      paddingRight: 16,
      paddingLeft: 16,
      [theme.breakpoints.up("md")]: {
        paddingRight: 32,
        paddingLeft: 32,
      },
    },
    btn: {
      margin: "0 10px",
      fontSize: "16px",
      borderRadius: "4px",
      background: "0 0",
      padding: "5px 15px",
      transition: "all .2s",
      marginTop: "25px",
      width: '15%',
      marginBottom: "20px",
      backgroundColor: "rgb(238, 130, 59)",
      border: "none",
      color: "#fff",
      fontWeight:'600',
      "&:hover": {
        backgroundColor: "#b42a14",
      }
    },
    btnDisabled: {
      fontSize: "16px",
      borderRadius: "4px",
      background: "0 0",
      padding: "5px 15px",
      transition: "all .2s",
      marginTop: "25px",
      width: '15%',
      marginBottom: "20px",
      backgroundColor: "rgb(238, 130, 59)",
      border: "none",
      color: "#fff",
      fontWeight:'600',
      "&:hover": {
        backgroundColor: "#b42a14",
      }
    },
  };
});

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "rgb(238, 130, 59)",
      },
    },
    MuiPickerDTTabs: {
      tabs: {
        backgroundColor: "rgb(238, 130, 59)",
      },
    },
    MuiPickersDay: {
      day: {
        color: "rgb(238, 130, 59)",
      },
      daySelected: {
        backgroundColor: "rgb(238, 130, 59)",
      },
    },
    MuiButton: {
      textPrimary: {
        color: "rgb(238, 130, 59)",
      },
    },
    PrivateTabIndicator: {
      colorSecondary: {
        backgroundColor: "rgb(238, 130, 59)",
      },
    },
    MuiInputBase: {
      input: {
        padding: 1.4,
      },
    },
    MuiInput: {
      underline: {
        "&:after": {
          content: "",
        },
      },
    },
    MuiSvgIcon: {
      root: {
        color: "#fff",
      },
    },
  },
});
export { useStyles, materialTheme };
