import React, { useEffect } from 'react';

import MovieIcon from '@material-ui/icons/Movie';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import MovieCreationTwoToneIcon from '@material-ui/icons/MovieCreationTwoTone';
import TheatersIcon from '@material-ui/icons/Theaters';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';

import NavItem from './NavItem';
import { FAKE_AVATAR } from '../../../constants/config';

const items = [
  {
    href: '/admin/dashboard',
    icon: DashboardIcon,
    title: 'Thống kê'
  },
  {
    href: '/admin/movies',
    icon: MovieIcon,
    title: 'Phim'
  },
  {
    href: '/admin/theater-complex',
    icon: TheatersIcon,
    title: 'Danh sách rạp'
  },
  {
    href: '/admin/cinema-management',
    icon: MovieFilterIcon,
    title: 'Quản lý rạp'
  },
  {
    href: '/admin/movie-genre',
    icon: MovieCreationTwoToneIcon,
    title: 'Thể loại phim'
  },
  // {
  //   href: '/admin/chair-management',
  //   icon: EventSeatIcon,
  //   title: 'Quản lý ghế'
  // },
  {
    href: '/admin/users',
    icon: PeopleAltIcon,
    title: 'Người dùng'
  },
  {
    href: '/admin/showtimes',
    icon: PostAddIcon,
    title: 'Lịch chiếu'
  },
  {
    href: '/admin/ticket-management',
    icon: ListAltIcon,
    title: 'Quản lý vé'
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 220,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

export default function NavBar({ onMobileClose, openMobile }) {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { currentUser } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const user = {
    avatar: FAKE_AVATAR,
    jobTitle: 'Senior Developer',
    name: currentUser?.hoTen,
  };

  const handleUser = () => {
    history.push("/taikhoan")
  }
  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2} 
      >
        <Tooltip title="Thông tin tài khoản">
          <Avatar
            className={classes.avatar}
            src={user.avatar}
            onClick={handleUser}
          />
        </Tooltip>
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile} 
          variant="temporary"
        >
          {content}
        </Drawer>

      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>

    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};