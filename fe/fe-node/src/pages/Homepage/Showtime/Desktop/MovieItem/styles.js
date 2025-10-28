import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  addbg: {
    backgroundImage: (props) => `url(${props.bg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    paddingTop: "147.9%",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "inset 0 0 0 1px rgba(148, 163, 184, 0.2)",
  },
});

export default useStyles;