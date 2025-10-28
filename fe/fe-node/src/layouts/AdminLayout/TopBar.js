import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  AppBar,
  Badge,
  Box,
  Chip,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import { LOGOUT } from '../../reducers/constants/Auth';
import { LOADING_BACKTO_HOME } from '../../reducers/constants/Lazy';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.92) 50%, rgba(59,130,246,0.35) 100%)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
    boxShadow: '0 20px 40px -18px rgba(15, 23, 42, 0.65)',
  },
  toolbar: {
    minHeight: 78,
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2.5),
    },
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    cursor: 'pointer',
  },
  logo: {
    height: 48,
    width: 48,
    objectFit: 'cover',
    borderRadius: theme.spacing(1.5),
    boxShadow: '0 18px 35px -20px rgba(59, 130, 246, 0.65)',
  },
  tagline: {
    color: '#e2e8f0 !important',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  taglineSub: {
    color: 'rgba(226, 232, 240, 0.7) !important',
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  iconButton: {
    color: '#e2e8f0',
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    transition: 'all .3s ease',
    '&:hover': {
      backgroundColor: 'rgba(148, 163, 184, 0.25)',
    },
  },
  badge: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    boxShadow: '0 0 0 4px rgba(56, 189, 248, 0.25)',
  },
  mobileToggle: {
    marginLeft: theme.spacing(1),
  },
  welcomeBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: theme.spacing(3),
    gap: theme.spacing(0.5),
  },
  welcomeLabel: {
    fontSize: '0.7rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(226, 232, 240, 0.7)',
  },
  welcomeName: {
    color: '#f8fafc',
    fontWeight: 600,
    letterSpacing: '0.03em',
  },
  roleChip: {
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#38bdf8',
    fontWeight: 600,
    letterSpacing: '0.06em',
    borderRadius: 999,
  },
}));

const TopBar = ({
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const [notifications] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentUser } = useSelector((state) => state.authReducer);

  const handleClickLogo = () => {
    dispatch({ type: LOADING_BACKTO_HOME })
    setTimeout(() => {
      history.push("/", "")
    }, 50);
  }
  const displayName = currentUser?.hoTen || 'Quản trị viên';
  const roleLabel = currentUser?.maLoaiNguoiDung === 'QuanTri' ? 'Admin' : 'User';
  return (
    <AppBar
      className={classes.appBar}
      elevation={0}
      position="sticky"
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <div onClick={handleClickLogo} className={classes.logoWrapper}>
          <img src="https://t3.ftcdn.net/jpg/04/66/39/50/360_F_466395040_mj2YjwJe0qLlRXQk51kg0q8Jw9AwJp5r.jpg" alt="logo" className={classes.logo} />
          <Hidden smDown>
            <Box>
              <Typography variant="h6" className={classes.tagline}>
                Admin Control Center
              </Typography>
              <Typography variant="body2" className={classes.taglineSub}>
                Tối ưu vận hành rạp chiếu
              </Typography>
            </Box>
          </Hidden>
        </div>
        <Box flexGrow={1} />
        <Hidden smDown>
          <div className={classes.welcomeBlock}>
            <span className={classes.welcomeLabel}>Xin chào</span>
            <Typography variant="h6" className={classes.welcomeName}>
              {displayName}
            </Typography>
            <Chip size="small" label={roleLabel} className={classes.roleChip} />
          </div>
        </Hidden>
        <Hidden mdDown>
          <div className={classes.actions}>
            <IconButton className={classes.iconButton}>
              <Badge
                badgeContent={notifications.length}
                color="primary"
                variant="dot"
                classes={{ badge: classes.badge }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Tooltip title="Đăng xuất">
              <IconButton className={classes.iconButton} onClick={() => dispatch({ type: LOGOUT })}>
                <InputIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            className={clsx(classes.iconButton, classes.mobileToggle)}
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;