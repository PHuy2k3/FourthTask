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
        padding: theme.spacing(12, 0, 10),
        overflow: "hidden",
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(8, 0, 6),
        },
    },
    heroBackdrop: {
        position: "absolute",
        inset: 0,
        background:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35), transparent 55%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.25), transparent 60%)",
        opacity: 0.9,
        filter: "blur(20px)",
    },
    heroInner: {
        position: "relative",
        textAlign: "center",
        zIndex: 1,
    },
    heroTagline: {
        display: "inline-flex",
        alignItems: "center",
        gap: theme.spacing(1.5),
        padding: theme.spacing(1, 2.5),
        borderRadius: 999,
        border: "1px solid rgba(56,189,248,0.4)",
        background: "rgba(15,23,42,0.6)",
        color: "#38bdf8",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 2,
        fontSize: "0.75rem",
        marginBottom: theme.spacing(3),
    },
    heroTitle: {
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#f8fafc",
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            fontSize: "1.75rem",
            letterSpacing: "0.05em",
        },
    },
    heroTitleHighlight: {
        color: "#f8fafc",
    },
    heroSubtitle: {
        color: "rgba(226,232,240,0.75)",
        fontSize: "1.05rem",
        maxWidth: 720,
        margin: "0 auto",
        [theme.breakpoints.down("sm")]: {
            fontSize: "0.95rem",
        },
    },
    section: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
    },
    featuredWrapper: {
        position: "relative",
        padding: theme.spacing(4),
        borderRadius: theme.spacing(3),
        overflow: "hidden",
        background:
            "linear-gradient(135deg, rgba(30,64,175,0.65) 0%, rgba(56,189,248,0.28) 45%, rgba(2,6,23,0.92) 100%)",
        border: "1px solid rgba(148,163,184,0.25)",
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(3),
        },
    },
    featuredGlow: {
        position: "absolute",
        inset: "-40% -10%",
        background:
            "radial-gradient(circle at 25% 25%, rgba(191,219,254,0.35), transparent 60%), radial-gradient(circle at 80% 75%, rgba(56,189,248,0.25), transparent 65%)",
        opacity: 0.7,
        pointerEvents: "none",
    },
    featuredContent: {
        position: "relative",
        zIndex: 1,
    },
    featuredTitle: {
        fontWeight: 700,
        marginBottom: theme.spacing(2),
        color: "#f8fafc",
    },
    featuredDescription: {
        color: "rgba(226,232,240,0.78)",
        marginBottom: theme.spacing(3),
        lineHeight: 1.6,
    },
    featuredMeta: {
        color: "rgba(226,232,240,0.7)",
        fontSize: "0.95rem",
    },
    featuredImage: {
        position: "relative",
        borderRadius: theme.spacing(2),
        overflow: "hidden",
        minHeight: 300,
        backgroundPosition: "center",
        backgroundSize: "cover",
        boxShadow: "0 35px 65px rgba(15,23,42,0.45)",
    },
    featuredImageOverlay: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.85) 100%)",
    },
    chip: {
        background: "rgba(56,189,248,0.12)",
        color: "#38bdf8",
        border: "1px solid rgba(56,189,248,0.35)",
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: theme.spacing(2),
    },
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: theme.spacing(3),
        flexWrap: "wrap",
        gap: theme.spacing(2),
    },
    sectionTitle: {
        fontWeight: 700,
        letterSpacing: "0.04em",
    },
    sectionSubtitle: {
        color: "rgba(148,163,184,0.8)",
        maxWidth: 360,
    },
    card: {
        background: "rgba(15,23,42,0.85)",
        borderRadius: theme.spacing(2),
        border: "1px solid rgba(148,163,184,0.12)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 25px 45px rgba(15,23,42,0.35)",
            borderColor: "rgba(56,189,248,0.4)",
        },
    },
    cardAction: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
    },
    cardMedia: {
        height: 200,
    },
    cardContent: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    cardTitle: {
        color: "#f8fafc",
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: theme.spacing(1),
    },
    cardDescription: {
        color: "rgba(148,163,184,0.95)",
        lineHeight: 1.6,
    },
    cardMeta: {
        marginTop: theme.spacing(2),
        display: "flex",
        justifyContent: "space-between",
        color: "rgba(148,163,184,0.75)",
        fontSize: "0.85rem",
    },
    cardTags: {
        marginTop: theme.spacing(2),
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing(1),
    },
    tagPill: {
        padding: theme.spacing(0.75, 1.5),
        borderRadius: 999,
        background: "rgba(30,64,175,0.35)",
        color: "rgba(191,219,254,0.95)",
        fontSize: "0.75rem",
        letterSpacing: 0.6,
    },
    insightSection: {
        background: "linear-gradient(120deg, rgba(8,47,73,0.75) 0%, rgba(15,118,110,0.45) 100%)",
        borderRadius: theme.spacing(3),
        padding: theme.spacing(3.5),
        border: "1px solid rgba(34,211,238,0.25)",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2.5),
        height: "100%",
    },
    insightTitle: {
        fontWeight: 700,
        letterSpacing: "0.04em",
    },
    insightGrid: {
        display: "grid",
        gap: theme.spacing(2),
    },
    insightCard: {
        background: "rgba(8,47,73,0.55)",
        borderRadius: theme.spacing(2),
        padding: theme.spacing(2.5),
        border: "1px solid rgba(94,234,212,0.25)",
        transition: "transform 0.3s ease",
        "&:hover": {
            transform: "translateY(-6px)",
        },
    },
    insightLabel: {
        textTransform: "uppercase",
        letterSpacing: 3,
        fontSize: "0.7rem",
        color: "rgba(94,234,212,0.85)",
        display: "block",
        marginBottom: theme.spacing(1),
    },
    insightStat: {
        fontWeight: 700,
        color: "#5eead4",
        marginBottom: theme.spacing(1),
    },
    insightDescription: {
        color: "rgba(226,232,240,0.75)",
        lineHeight: 1.5,
    },
    tagList: {
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing(1.5),
        marginTop: theme.spacing(3),
    },
    tag: {
        padding: theme.spacing(1, 2),
        borderRadius: 999,
        background: "rgba(15,23,42,0.65)",
        border: "1px solid rgba(148,163,184,0.3)",
        color: "rgba(226,232,240,0.85)",
        fontWeight: 500,
        letterSpacing: 1,
        transition: "all 0.2s ease",
        "&:hover": {
            borderColor: "rgba(56,189,248,0.5)",
            color: "#38bdf8",
        },
    },
}));

export default useStyles;