import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import TheatersIcon from "@material-ui/icons/Theaters";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import EventSeatIcon from "@material-ui/icons/EventSeat";
import SecurityIcon from "@material-ui/icons/Security";

const useStyles = makeStyles((theme) => ({
  section: {
    position: "relative",
    padding: theme.spacing(10, 0, 8),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(8, 0, 6),
    },
  },
  sectionInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: theme.spacing(0, 3),
    position: "relative",
    zIndex: 2,
  },
  heading: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: "2.5rem",
    marginBottom: theme.spacing(1.5),
    color: "#f8fafc",
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
    },
  },
  description: {
    textAlign: "center",
    color: "rgba(226, 232, 240, 0.75)",
    maxWidth: 640,
    margin: theme.spacing(0, "auto", 6),
    lineHeight: 1.6,
  },
  grid: {
    position: "relative",
    zIndex: 1,
  },
  card: {
    height: "100%",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background: "linear-gradient(160deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.85) 100%)",
    boxShadow: "0 30px 60px -35px rgba(15, 23, 42, 0.95)",
    transition: "transform .25s ease, box-shadow .25s ease",
    color: "#e2e8f0",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    '&:hover': {
      transform: "translateY(-8px)",
      boxShadow: "0 35px 70px -35px rgba(59, 130, 246, 0.55)",
    },
    '&:before': {
      content: '""',
      position: "absolute",
      inset: 1,
      borderRadius: theme.spacing(2.75),
      background: "linear-gradient(140deg, rgba(59,130,246,0.16), rgba(236,72,153,0.14))",
      opacity: 0,
      transition: "opacity .25s ease",
      zIndex: 0,
    },
    '&:hover:before': {
      opacity: 1,
    },
  },
  cardInner: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    flexGrow: 1,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(1),
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: "1.25rem",
    color: "#f8fafc",
  },
  cardDesc: {
    color: "rgba(226, 232, 240, 0.75)",
    lineHeight: 1.6,
    flexGrow: 1,
  },
  bulletList: {
    margin: 0,
    paddingLeft: theme.spacing(2.5),
    color: "rgba(148, 163, 184, 0.85)",
    fontSize: "0.95rem",
    '& li': {
      marginBottom: theme.spacing(1),
    },
  },
  backdrop: {
    position: "absolute",
    inset: "-40% -20%", // extends outside for soft glow
    background: "radial-gradient(circle at 25% 25%, rgba(59,130,246,0.28), transparent 55%), radial-gradient(circle at 75% 75%, rgba(236,72,153,0.2), transparent 60%)",
    opacity: 0.65,
    filter: "blur(10px)",
    pointerEvents: "none",
  },
}));

const features = [
  {
    title: "Hệ thống rạp toàn quốc",
    description:
      "Kết nối hơn 60 cụm rạp từ Bắc vào Nam giúp bạn dễ dàng lựa chọn điểm đến yêu thích cho mỗi buổi xem phim.",
    icon: TheatersIcon,
    accent: {
      background: "linear-gradient(135deg, rgba(56,189,248,0.22) 0%, rgba(59,130,246,0.18) 100%)",
      color: "#38bdf8",
      shadow: "rgba(59, 130, 246, 0.45)",
    },
    bullets: [
      "Cập nhật nhanh vị trí rạp gần bạn",
      "Đồng bộ khung giờ chuẩn xác theo khu vực",
    ],
  },
  {
    title: "Kho phim đặc sắc",
    description:
      "Hàng nghìn bộ phim bom tấn và độc quyền, liên tục bổ sung nội dung mới để đáp ứng mọi gu thưởng thức.",
    icon: MovieFilterIcon,
    accent: {
      background: "linear-gradient(135deg, rgba(236,72,153,0.22) 0%, rgba(244,114,182,0.18) 100%)",
      color: "#f472b6",
      shadow: "rgba(236, 72, 153, 0.4)",
    },
    bullets: [
      "Phim chiếu rạp mới nhất luôn sẵn sàng",
      "Gợi ý theo sở thích cá nhân",
    ],
  },
  {
    title: "Trải nghiệm đặt vé mượt mà",
    description:
      "Chỉ vài thao tác chạm để chọn suất chiếu, ghế ngồi và thanh toán bảo mật với nhiều phương thức tiện lợi.",
    icon: EventSeatIcon,
    accent: {
      background: "linear-gradient(135deg, rgba(74,222,128,0.22) 0%, rgba(16,185,129,0.18) 100%)",
      color: "#4ade80",
      shadow: "rgba(16, 185, 129, 0.4)",
    },
    bullets: [
      "Chọn ghế trực quan trên sơ đồ rạp",
      "Thanh toán đa kênh, lưu lịch sử vé",
    ],
  },
  {
    title: "An toàn và tin cậy",
    description:
      "Thông tin của bạn được bảo vệ với chuẩn bảo mật cao cùng đội ngũ hỗ trợ 24/7 khi cần trợ giúp.",
    icon: SecurityIcon,
    accent: {
      background: "linear-gradient(135deg, rgba(129,140,248,0.22) 0%, rgba(99,102,241,0.18) 100%)",
      color: "#818cf8",
      shadow: "rgba(99, 102, 241, 0.45)",
    },
    bullets: [
      "Chuẩn PCI DSS cho giao dịch online",
      "Hỗ trợ khách hàng tận tâm 24/7",
    ],
  },
];

const FeatureHighlights = () => {
  const classes = useStyles();

  return (
    <section className={classes.section}>
      <div className={classes.backdrop} />
      <div className={classes.sectionInner}>
        <Typography component="h2" className={classes.heading}>
          Mọi trải nghiệm điện ảnh trong một điểm chạm
        </Typography>
        <Typography className={classes.description}>
          Amenic giúp bạn khám phá những bom tấn mới nhất, chọn rạp ưng ý và giữ chỗ ghế đẹp chỉ trong vài phút.
        </Typography>
        <Grid container spacing={4} className={classes.grid}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Grid item xs={12} sm={6} key={feature.title}>
                <Paper
                  elevation={0}
                  className={classes.card}
                  style={{ boxShadow: `0 30px 55px -35px ${feature.accent.shadow}` }}
                >
                  <div className={classes.cardInner}>
                    <Box
                      className={classes.iconWrap}
                      style={{ background: feature.accent.background }}
                    >
                      <Icon style={{ color: feature.accent.color, fontSize: 28 }} />
                    </Box>
                    <Typography component="h3" className={classes.cardTitle}>
                      {feature.title}
                    </Typography>
                    <Typography className={classes.cardDesc}>
                      {feature.description}
                    </Typography>
                    <ul className={classes.bulletList}>
                      {feature.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </section>
  );
};

export default FeatureHighlights;