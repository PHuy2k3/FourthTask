import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => {
    return {
        control: {
            height: "fit-content",
            width: "100%",
        },
        rootDataGrid: {
            "& .MuiDataGrid-cellEditing": {
                backgroundColor: "rgb(255,215,115, 0.19)",
                color: "#1a3e72",
            },
            "& .Mui-error": {
                backgroundColor: `rgb(126,10,15,0.1})`,
                color: "#750f0f",
            },

            "& .isadmin--true": {
                backgroundColor: "rgb(250, 179, 174)",
                "&:hover": {
                    backgroundColor: "rgb(249, 161, 154)",
                },
            },
        },
        button: {
            width: "100%",
            height: "100%",
        },
        userQuanTri: {
            backgroundColor: "rgb(250, 179, 174)",
            "&:hover": {
                backgroundColor: "rgb(249, 161, 154)",
            },
        },

        search: {
            verticalAlign: "bottom",
            position: "relative",
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.info.light, 0.15),
            "&:hover": {
                backgroundColor: fade(theme.palette.info.light, 0.25),
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
            width: "100%",
        },
        addUser: {
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
            fontWeight: '600',
            "&:hover": {
                backgroundColor: "#b42a14",
            }
        }

    };
});

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

export { useStyles, DialogContent, DialogTitle };