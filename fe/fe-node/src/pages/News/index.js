import React from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Chip,
    Button,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import {
    articles,
    featuredArticleSlug,
    insights,
    trendingTags,
    findArticleBySlug,
} from "../../data/news.js";
import useStyles from "./styles";
export default function News() {
    const classes = useStyles();
    const featuredArticle = findArticleBySlug(featuredArticleSlug) || articles[0];
    const newsArticles = articles.filter((article) => article.slug !== featuredArticle.slug);

    return (
        <main className={classes.page}>
            <section id="tintuc" className={classes.hero}>
                <span className={classes.heroBackdrop} />
                <Container className={classes.heroInner} maxWidth="lg">
                    <div className={classes.heroTagline}>Bản tin điện ảnh mỗi ngày</div>
                    <Typography variant="h3" component="h1" className={classes.heroTitle}>
                        Cập nhật <span className={classes.heroTitleHighlight}>tin tức</span> và góc nhìn điện ảnh mới nhất
                    </Typography>
                    <Typography className={classes.heroSubtitle}>
                        Theo dõi xu hướng, phân tích chuyên sâu và các câu chuyện hậu trường độc quyền từ đội ngũ phóng viên của chúng tôi.
                    </Typography>
                </Container>
            </section>

            <Container className={classes.section} maxWidth="lg">
                <div className={classes.featuredWrapper}>
                    <span className={classes.featuredGlow} />
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <div className={classes.featuredContent}>
                                <Chip label={featuredArticle.category} className={classes.chip} />
                                <Typography variant="h4" component="h2" className={classes.featuredTitle}>
                                    {featuredArticle.title}
                                </Typography>
                                <Typography className={classes.featuredDescription}>
                                    {featuredArticle.summary}
                                </Typography>
                                <div className={classes.featuredMeta}>
                                    {featuredArticle.date} • {featuredArticle.readTime}
                                </div>
                                <div className={classes.featuredActions}>
                                    <Button
                                        component={RouterLink}
                                        to={`/news/${featuredArticle.slug}`}
                                        className={classes.heroButton}
                                        variant="contained"
                                        aria-label={`Đọc bài viết ${featuredArticle.title}`}
                                    >
                                        Đọc bài viết
                                    </Button>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RouterLink
                                to={`/news/${featuredArticle.slug}`}
                                className={classes.featuredImage}
                                style={{ backgroundImage: `url(${featuredArticle.image})` }}
                                aria-label={`Mở bài viết ${featuredArticle.title}`}
                            >
                                <span className={classes.featuredImageOverlay} />
                            </RouterLink>
                        </Grid>
                    </Grid>
                </div>
            </Container>

            <Container className={classes.section} maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <div className={classes.sectionHeader}>
                            <Typography variant="h5" className={classes.sectionTitle}>
                                Tin mới nhất
                            </Typography>
                            <Typography className={classes.sectionSubtitle}>
                                Khám phá câu chuyện phía sau những thước phim đang gây bão
                            </Typography>
                        </div>
                        <Grid container spacing={4}>
                            {newsArticles.map((article) => (
                                <Grid item xs={12} sm={6} key={article.slug}>
                                    <Card className={classes.card} elevation={0}>
                                        <CardActionArea
                                            className={classes.cardAction}
                                            disableRipple
                                            component={RouterLink}
                                            to={`/news/${article.slug}`}
                                            aria-label={`Xem chi tiết ${article.title}`}
                                        >
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={article.image}
                                                title={article.title}
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Chip label={article.category} className={classes.chip} size="small" />
                                                <Typography variant="h6" className={classes.cardTitle}>
                                                    {article.title}
                                                </Typography>
                                                <Typography variant="body2" className={classes.cardDescription}>
                                                    {article.summary}
                                                </Typography>
                                                <div className={classes.cardMeta}>
                                                    <span>{article.date}</span>
                                                    <span>{article.readTime}</span>
                                                </div>
                                                <div className={classes.cardTags}>
                                                    {article.tags.map((tag) => (
                                                        <span key={tag} className={classes.tagPill}>
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <aside className={classes.insightSection}>
                            <Typography variant="h6" className={classes.insightTitle}>
                                Bản tin nhanh
                            </Typography>
                            <div className={classes.insightGrid}>
                                {insights.map((insight) => (
                                    <div key={insight.description} className={classes.insightCard}>
                                        <span className={classes.insightLabel}>{insight.category}</span>
                                        <Typography variant="h5" className={classes.insightStat}>
                                            {insight.stat}
                                        </Typography>
                                        <Typography variant="body2" className={classes.insightDescription}>
                                            {insight.description}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </Grid>
                </Grid>
            </Container>

            <Container className={classes.section} maxWidth="lg">
                <Typography variant="h6" className={classes.sectionTitle}>
                    Chủ đề đang được quan tâm
                </Typography>
                <div className={classes.tagList}>
                    {trendingTags.map((tag) => (
                        <span key={tag} className={classes.tag}>
                            #{tag}
                        </span>
                    ))}
                </div>
            </Container>
        </main>
    );
}