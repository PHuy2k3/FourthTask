import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { BarChart } from '@mui/x-charts';

import usersApi from '../../api/usersApi';

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatAxisCurrency = (value) => {
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `${billions % 1 === 0 ? billions : billions.toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
  }
  return value.toLocaleString('vi-VN');
};

export default function Dashboard() {
  const [movieStats, setMovieStats] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true);
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(640);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.offsetWidth;
        setChartWidth(Math.max(width - 48, 420));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    usersApi
      .getMonth()
      .then((response) => {
        setMonthlyRevenue(response.data || []);
      })
      .catch((error) => {
        console.error('Error fetching revenue:', error);
        setMonthlyRevenue([]);
      })
      .finally(() => setIsLoadingRevenue(false));
  }, []);

  useEffect(() => {
    usersApi
      .getPhim()
      .then((response) => {
        setMovieStats(response.data || []);
      })
      .catch((error) => {
        console.error('Error fetching phim:', error);
        setMovieStats([]);
      })
      .finally(() => setIsLoadingMovies(false));
  }, []);

  const dashboardHighlights = useMemo(() => {
    const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + (item?.doanhSo || 0), 0);
    const bestRevenueMonth = monthlyRevenue.reduce((best, item) => {
      if (!best || (item?.doanhSo || 0) > (best?.doanhSo || 0)) {
        return item;
      }
      return best;
    }, null);

    const topMovie = movieStats.reduce((best, item) => {
      if (!best || (item?.soLuong || 0) > (best?.soLuong || 0)) {
        return item;
      }
      return best;
    }, null);

    return {
      totalRevenue,
      bestRevenueMonth,
      topMovie,
      moviesTracked: movieStats.length,
      monthsTracked: monthlyRevenue.length,
    };
  }, [monthlyRevenue, movieStats]);

  const revenueLabels = useMemo(
    () => monthlyRevenue.map((item) => `Tháng ${item.thang}`),
    [monthlyRevenue],
  );

  const revenueValues = useMemo(
    () => monthlyRevenue.map((item) => item.doanhSo || 0),
    [monthlyRevenue],
  );

  return (
    <Box
      component="section"
      style={{
        minHeight: '100%',
        padding: '32px 40px 48px',
        backgroundColor: '#f4f6f8',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h4" gutterBottom style={{ fontWeight: 600 }}>
        Tổng quan hoạt động
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Theo dõi hiệu suất đặt vé và độ phổ biến của phim trong thời gian gần đây.
      </Typography>

      <Grid container spacing={3} style={{ marginTop: 8 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '24px 28px' }}>
            <Typography variant="subtitle2" color="#000">
              Tổng doanh thu đã ghi nhận
            </Typography>
            <Typography variant="h5" style={{ marginTop: 8 }}>
              {isLoadingRevenue ? 'Đang tải…' : formatCurrency(dashboardHighlights.totalRevenue)}
            </Typography>
            <Typography variant="body2" color="#000" style={{ marginTop: 12 }}>
              {dashboardHighlights.monthsTracked} tháng gần nhất
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '24px 28px' }}>
            <Typography variant="subtitle2" color="#000">
              Tháng doanh thu cao nhất
            </Typography>
            <Typography variant="h5" style={{ marginTop: 8 }}>
              {isLoadingRevenue
                ? 'Đang tải…'
                : dashboardHighlights.bestRevenueMonth
                ? `Tháng ${dashboardHighlights.bestRevenueMonth.thang}`
                : 'Chưa có dữ liệu'}
            </Typography>
            <Typography variant="body2" color="#000" style={{ marginTop: 12 }}>
              {dashboardHighlights.bestRevenueMonth
                ? formatCurrency(dashboardHighlights.bestRevenueMonth.doanhSo)
                : '—'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '24px 28px' }}>
            <Typography variant="subtitle2" color="#000">
              Phim được xem nhiều nhất
            </Typography>
            <Typography variant="h5" style={{ marginTop: 8 }}>
              {isLoadingMovies
                ? 'Đang tải…'
                : dashboardHighlights.topMovie
                ? dashboardHighlights.topMovie.tenPhim
                : 'Chưa có dữ liệu'}
            </Typography>
            <Typography variant="body2" color="#000" style={{ marginTop: 12 }}>
              {dashboardHighlights.topMovie
                ? `${dashboardHighlights.topMovie.soLuong} lượt đặt`
                : `${dashboardHighlights.moviesTracked} phim đang theo dõi`}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} ref={chartContainerRef}>
          <Paper
            elevation={3}
            style={{
              padding: '24px 28px',
              background: 'linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%)',
              boxShadow: '0 10px 30px rgba(15, 36, 64, 0.08)',
              borderRadius: 16,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Doanh thu theo tháng
            </Typography>
            <Typography variant="body2" color="#000" gutterBottom>
              Phân bố doanh thu theo các tháng gần nhất.
            </Typography>
            <Divider style={{ margin: '12px 0 24px' }} />
            {isLoadingRevenue ? (
              <Typography color="#000">Đang tải biểu đồ…</Typography>
            ) : monthlyRevenue.length ? (
              <BarChart
                xAxis={[
                  {
                    id: 'months',
                    data: revenueLabels,
                    scaleType: 'band',
                    // label: 'Tháng',
                  },
                ]}
                yAxis={[
                  {
                    valueFormatter: (value) => formatAxisCurrency(value),
                    // label: 'Doanh thu (VND)',
                  },
                ]}
                series={[
                  {
                    id: 'revenue',
                    label: 'Doanh thu',
                    data: revenueValues,
                    color: '#2f6bff',
                    valueFormatter: (value) => formatCurrency(value),
                  },
                ]}
                grid={{ horizontal: true }}
                sx={{
                  '& .MuiBarElement-root': {
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                  },
                  '& .MuiBarElement-root:hover': {
                    opacity: 0.9,
                    transform: 'translateY(-4px)',
                  },
                  '& .MuiChartsAxis-tickLabel': {
                    fontWeight: 500,
                  },
                }}
                slotProps={{
                  legend: {
                    hidden: false,
                  },
                  bar: {
                    rx: 12,
                    ry: 12,
                  },
                }}
                height={360}
                width={chartWidth}
                margin={{ top: 16, right: 24, bottom: 72, left: 80 }}
              />
            ) : (
              <Typography color="#000">Chưa có dữ liệu doanh thu.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '24px 28px' }}>
            <Typography variant="h6" gutterBottom>
              Top phim được đặt vé
            </Typography>
            <Typography variant="body2" color="#000" gutterBottom>
              Số lượng vé đã đặt theo từng phim.
            </Typography>
            <Divider style={{ margin: '12px 0 24px' }} />
            {isLoadingMovies ? (
              <Typography color="#000">Đang tải biểu đồ…</Typography>
            ) : movieStats.length ? (
              <BarChart
                xAxis={[
                  {
                    id: 'movies',
                    data: movieStats.map((item) => item.tenPhim),
                    scaleType: 'band',
                  },
                ]}
                series={[
                  {
                    id: 'tickets',
                    label: 'Lượt đặt',
                    data: movieStats.map((item) => item.soLuong),
                  },
                ]}
                height={360}
                width={chartWidth}
                margin={{ top: 16, right: 24, bottom: 80, left: 72 }}
              />
            ) : (
              <Typography color="#000">Chưa có dữ liệu phim.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}