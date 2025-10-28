import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    page: {
        minHeight: "100vh",
        width: "100%",
        background: "radial-gradient(circle at 15% 15%, #0f172a 0%, #020617 45%, #010313 100%)",
        color: "#e2e8f0",
        paddingBottom: theme.spacing(10),
    },
    hero: {
        position: "relative",
        minHeight: 420,
        display: "flex",
        alignItems: "flex-end",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        [theme.breakpoints.down("sm")]: {
            minHeight: 360,
        },
    },
    heroOverlay: {
        position: "absolute",
        inset: 0,
        background:
            "linear-gradient(0deg, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.35) 45%, rgba(2,6,23,0.9) 100%), radial-gradient(circle at 20% 15%, rgba(59,130,246,0.32), transparent 60%)",
    },
    heroContainer: {
        position: "relative",
        zIndex: 1,
        padding: theme.spacing(6, 0, 10),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(4, 0, 7),
        },
    },
    breadcrumb: {
        color: "rgba(226,232,240,0.65)",
        marginBottom: theme.spacing(2),
        "& a": {
            color: "rgba(148,163,184,0.85)",
            textDecoration: "none",
            transition: "color 0.2s ease",
            "&:hover": {
                color: "#38bdf8",
            },
        },
    },
    heroCategory: {
        display: "inline-flex",
        alignItems: "center",
        gap: theme.spacing(1),
        padding: theme.spacing(0.75, 1.75),
        borderRadius: 999,
        border: "1px solid rgba(56,189,248,0.35)",
        background: "rgba(15,23,42,0.65)",
        color: "#38bdf8",
        letterSpacing: 2,
        textTransform: "uppercase",
        fontSize: "0.75rem",
        marginBottom: theme.spacing(2),
    },
    heroTitle: {
        fontWeight: 800,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "#f8fafc",
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            fontSize: "1.85rem",
            letterSpacing: "0.03em",
        },
    },
    heroMeta: {
        display: "flex",
        gap: theme.spacing(2),
        flexWrap: "wrap",
        color: "rgba(226,232,240,0.7)",
        marginBottom: theme.spacing(3),
        fontSize: "0.95rem",
    },
    heroSummary: {
        color: "rgba(226,232,240,0.75)",
        maxWidth: 720,
        lineHeight: 1.7,
        fontSize: "1.05rem",
    },
    contentContainer: {
        marginTop: theme.spacing(6),
    },
    articleBody: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3.5),
        color: "rgba(226,232,240,0.86)",
        lineHeight: 1.8,
        fontSize: "1.05rem",
        [theme.breakpoints.down("sm")]: {
            fontSize: "1rem",
        },
    },
    paragraph: {
        margin: 0,
    },
    quote: {
        borderLeft: "4px solid rgba(56,189,248,0.5)",
        paddingLeft: theme.spacing(2.5),
        color: "#bae6fd",
        fontStyle: "italic",
        fontSize: "1.05rem",
    },
    quoteAuthor: {
        marginTop: theme.spacing(1),
        color: "rgba(148,163,184,0.8)",
        fontWeight: 500,
    },
    sectionHeading: {
        marginTop: theme.spacing(4),
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "#f8fafc",
    },
    takeawayList: {
        margin: 0,
        paddingLeft: theme.spacing(3),
        display: "grid",
        gap: theme.spacing(1.5),
    },
    takeawayItem: {
        position: "relative",
        color: "rgba(226,232,240,0.78)",
        "&::marker": {
            color: "#38bdf8",
        },
    },
    sidebar: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
    },
    sidebarCard: {
        background: "rgba(15,23,42,0.75)",
        borderRadius: theme.spacing(2),
        border: "1px solid rgba(148,163,184,0.15)",
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    sidebarTitle: {
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "#f8fafc",
    },
    metaList: {
        display: "grid",
        gap: theme.spacing(1.5),
        color: "rgba(226,232,240,0.75)",
        fontSize: "0.95rem",
    },
    tagList: {
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing(1),
    },
    tag: {
        padding: theme.spacing(0.75, 1.5),
        borderRadius: 999,
        background: "rgba(30,64,175,0.4)",
        color: "#bfdbfe",
        letterSpacing: 0.8,
        fontSize: "0.75rem",
    },
    relatedList: {
        display: "grid",
        gap: theme.spacing(1.5),
    },
    relatedLink: {
        color: "rgba(148,163,184,0.9)",
        textDecoration: "none",
        transition: "color 0.2s ease",
        "&:hover": {
            color: "#38bdf8",
        },
    },
    notFoundWrapper: {
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: theme.spacing(6, 2),
    },
    notFoundText: {
        color: "rgba(226,232,240,0.75)",
        maxWidth: 520,
        margin: `${theme.spacing(2)}px auto 0`,
    },
    backButton: {
        marginTop: theme.spacing(3),
        color: "#38bdf8",
        borderColor: "rgba(56,189,248,0.6)",
        textTransform: "uppercase",
        letterSpacing: 1,
        fontWeight: 600,
        "&:hover": {
            borderColor: "#38bdf8",
        },
    },
}));

export default useStyles;