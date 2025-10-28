import React from "react";
import { Box, Grid, Paper, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  section: {
    position: "relative",
    padding: theme.spacing(0, 0, 10),
    [theme.breakpoints.down("sm")]: {
      paddingBottom: theme.spacing(7),
    },
  },
  inner: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: theme.spacing(0, 3),
    position: "relative",
    zIndex: 1,
  },
  panel: {
    borderRadius: theme.spacing(4),
    padding: theme.spacing(6, 5),
    background: "linear-gradient(145deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.85) 100%)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    boxShadow: "0 35px 65px -32px rgba(15, 23, 42, 0.85)",
    overflow: "hidden",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(5, 3.5),
    },
  },
  panelGlow: {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 25% 25%, rgba(56,189,248,0.28), transparent 65%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.22), transparent 60%)",
    opacity: 0.7,
    pointerEvents: "none",
  },
  header: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    marginBottom: theme.spacing(5),
  },
  title: {
    fontWeight: 700,
    fontSize: "2.2rem",
    color: "#f8fafc",
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.9rem",
    },
  },
  subtitle: {
    color: "rgba(226, 232, 240, 0.75)",
    margin: 0,
    lineHeight: 1.6,
  },
  statsGrid: {
    position: "relative",
    zIndex: 1,
  },
  statCard: {
    height: "100%",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    border: "1px solid rgba(148, 163, 184, 0.12)",
    background: "rgba(15, 23, 42, 0.78)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 24px 45px -28px rgba(59, 130, 246, 0.45)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    color: "#e2e8f0",
  },
  statValue: {
    fontWeight: 700,
    fontSize: "2rem",
    letterSpacing: "0.04em",
    color: "#38bdf8",
  },
  statLabel: {
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(226, 232, 240, 0.6)",
  },
  statDetail: {
    fontSize: "0.95rem",
    color: "rgba(148, 163, 184, 0.85)",
    lineHeight: 1.6,
  },
}));

const stats = [
  {
    value: "320+",
    label: "Suất chiếu mỗi ngày",
    detail: "Lịch phim cập nhật liên tục, đảm bảo giữ chỗ nhanh chóng ở rạp yêu thích của bạn.",
  },
  {
    value: "4.8/5",
    label: "Đánh giá trải nghiệm",
    detail: "Khảo sát từ hơn 50.000 khách hàng đã đặt vé qua Amenic trong 12 tháng qua.",
  },
  {
    value: "30s",
    label: "Hoàn tất thanh toán",
    detail: "Quy trình đặt vé tinh gọn, đa dạng cổng thanh toán với xác thực hai lớp an toàn.",
  },
  {
    value: "24/7",
    label: "Hỗ trợ tận tâm",
    detail: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng đồng hành trong suốt hành trình giải trí của bạn.",
  },
];

const ExperienceShowcase = () => {
  const classes = useStyles();

  return (
    <section className={classes.section}>
      <div className={classes.inner}>
        <Paper elevation={0} className={classes.panel}>
          <span className={classes.panelGlow} />
          <header className={classes.header}>
            <Typography component="h2" className={classes.title}>
              Sẵn sàng cho mọi khoảnh khắc bùng nổ cảm xúc
            </Typography>
            <Typography component="p" className={classes.subtitle}>
              Đặt vé, chia sẻ trải nghiệm và theo dõi ưu đãi chỉ trong một nền tảng duy nhất.
            </Typography>
          </header>
          <Grid container spacing={3} className={classes.statsGrid}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <Box className={classes.statCard}>
                  <Typography component="div" className={classes.statValue}>
                    {stat.value}
                  </Typography>
                  <Typography component="div" className={classes.statLabel}>
                    {stat.label}
                  </Typography>
                  <Typography component="p" className={classes.statDetail}>
                    {stat.detail}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </div>
    </section>
  );
};

export default ExperienceShowcase;