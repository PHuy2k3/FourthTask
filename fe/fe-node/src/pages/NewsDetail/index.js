import React from "react";
import {
    Container,
    Typography,
    Grid,
    Breadcrumbs,
    Link as MuiLink,
    Button,
} from "@material-ui/core";
import { Link as RouterLink, useParams } from "react-router-dom";
import useStyles from "./styles";
import { findArticleBySlug, getRelatedArticles } from "../../data/news";

export default function NewsDetail() {
    const classes = useStyles();
    const { slug } = useParams();
    const article = findArticleBySlug(slug);

    if (!article) {
        return (
            <main className={classes.page}>
                <div className={classes.notFoundWrapper}>
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Không tìm thấy bài viết
                        </Typography>
                        <Typography variant="body1" className={classes.notFoundText}>
                            Bài viết bạn đang tìm đã bị xóa hoặc đường dẫn không tồn tại. Vui lòng quay lại trang tin tức để
                            tiếp tục khám phá.
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/news"
                            variant="outlined"
                            className={classes.backButton}
                        >
                            Quay lại trang tin tức
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    const relatedArticles = getRelatedArticles(slug, 3);

    return (
        <main className={classes.page}>
            <section
                className={classes.hero}
                style={{
                    backgroundImage: `url(${article.image})`,
                }}
            >
                <span className={classes.heroOverlay} />
                <Container maxWidth="lg" className={classes.heroContainer}>
                    <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
                        <MuiLink component={RouterLink} color="inherit" to="/">
                            Trang chủ
                        </MuiLink>
                        <MuiLink component={RouterLink} color="inherit" to="/news">
                            Tin tức
                        </MuiLink>
                        <Typography color="inherit">{article.title}</Typography>
                    </Breadcrumbs>
                    <span className={classes.heroCategory}>{article.category}</span>
                    <Typography variant="h3" component="h1" className={classes.heroTitle}>
                        {article.title}
                    </Typography>
                    <div className={classes.heroMeta}>
                        <span>{article.date}</span>
                        <span>{article.readTime}</span>
                        {article.author && <span>Tác giả: {article.author}</span>}
                    </div>
                    <Typography className={classes.heroSummary}>{article.summary}</Typography>
                </Container>
            </section>

            <Container maxWidth="lg" className={classes.contentContainer}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={8}>
                        <div className={classes.articleBody}>
                            {article.content.map((paragraph, index) => (
                                <Typography
                                    key={`${article.slug}-paragraph-${index}`}
                                    component="p"
                                    className={classes.paragraph}
                                >
                                    {paragraph}
                                </Typography>
                            ))}

                            {article.quote && (
                                <div>
                                    <Typography component="p" className={classes.quote}>
                                        “{article.quote.text}”
                                    </Typography>
                                    {article.quote.author && (
                                        <Typography variant="body2" className={classes.quoteAuthor}>
                                            — {article.quote.author}
                                        </Typography>
                                    )}
                                </div>
                            )}

                            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                                <>
                                    <Typography variant="h6" className={classes.sectionHeading}>
                                        Những điểm nổi bật
                                    </Typography>
                                    <ul className={classes.takeawayList}>
                                        {article.keyTakeaways.map((item) => (
                                            <li key={item} className={classes.takeawayItem}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <aside className={classes.sidebar}>
                            <div className={classes.sidebarCard}>
                                <Typography variant="subtitle1" className={classes.sidebarTitle}>
                                    Thông tin bài viết
                                </Typography>
                                <div className={classes.metaList}>
                                    <span>Ngày đăng: {article.date}</span>
                                    {article.author && <span>Tác giả: {article.author}</span>}
                                    <span>Thời lượng đọc: {article.readTime}</span>
                                </div>
                                {article.tags && article.tags.length > 0 && (
                                    <div>
                                        <Typography variant="subtitle2" className={classes.sidebarTitle}>
                                            Từ khóa
                                        </Typography>
                                        <div className={classes.tagList}>
                                            {article.tags.map((tag) => (
                                                <span key={tag} className={classes.tag}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {relatedArticles.length > 0 && (
                                <div className={classes.sidebarCard}>
                                    <Typography variant="subtitle1" className={classes.sidebarTitle}>
                                        Bài viết liên quan
                                    </Typography>
                                    <div className={classes.relatedList}>
                                        {relatedArticles.map((related) => (
                                            <MuiLink
                                                key={related.slug}
                                                component={RouterLink}
                                                to={`/news/${related.slug}`}
                                                className={classes.relatedLink}
                                            >
                                                {related.title}
                                            </MuiLink>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </Grid>
                </Grid>
            </Container>
        </main>
    );
}