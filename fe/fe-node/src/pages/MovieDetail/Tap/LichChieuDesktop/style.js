import { makeStyles } from "@material-ui/core"
import { customScrollbar, underLine } from '../../../../styles/materialUi';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    borderRadius: "10px",
    margin: '30px 100px',
    color: "#000",
  },
  leftSection: {
    width: "28%",
  },
  indicator: {
    backgroundColor: "transparent",
  },

  wrapper: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  tabRoot: {
    padding: 20,
    textAlign: "left",
    fontSize: 12,
    opacity: .3,
    "&:hover": {
      opacity: 1,
    },
    transition: "all .2s",
    ...underLine
  },
  logo: {
    width: 50,
    marginRight: 10,
  },

  rightSection: {
    width: "72%",
  },

  listDay: {
    height: "90px",
    padding: "16px !important",
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
    backgroundColor: "#fff",
    borderRadius: 10,

    display: "flex",

    overflowX: "scroll",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    ...customScrollbar,
  },
  dayItem: {
    display: 'flex',
    alignItem: 'center',
    padding: 10,
    fontWeight: 500,
    textAlign: "center",
    cursor: "pointer",
  },

}));
export default useStyles
