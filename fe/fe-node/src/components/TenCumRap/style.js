import { makeStyles } from "@material-ui/core";

const defaultAccent = "#4d8cff";

const useStyles = makeStyles({
  text__first: (props) => ({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 6,
    margin: 0,
    color: "#f7f9ff",
    fontWeight: 600,
    fontSize: props.testSize ? props.testSize : 15,
    letterSpacing: 0.4,
    lineHeight: 1.4,
  }),
  text__second: (props) => ({
    color: props.color ? props.color : defaultAccent,
    fontWeight: 600,
  }),
});

export default useStyles;