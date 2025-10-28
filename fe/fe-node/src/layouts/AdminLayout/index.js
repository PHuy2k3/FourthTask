import React, { useState } from 'react';

import { SnackbarProvider } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from "react-redux";

import NavBar from './NavBar';
import TopBar from './TopBar';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    background: 'radial-gradient(circle at top, #0f172a 0%, #020617 45%, #01030a 100%)',
    color: '#f8fafc',
  },
  backgroundTexture: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(circle at 15% 20%, rgba(59,130,246,0.25) 0%, transparent 60%), radial-gradient(circle at 85% 25%, rgba(236,72,153,0.18) 0%, transparent 65%), radial-gradient(circle at 50% 80%, rgba(14,165,233,0.22) 0%, transparent 70%)',
    opacity: 0.85,
    zIndex: 0,
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.65,
    pointerEvents: 'none',
    zIndex: 0,
  },
  ambientOrbPrimary: {
    width: 420,
    height: 420,
    top: -140,
    left: -140,
    background: 'radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0) 65%)',
  },
  ambientOrbSecondary: {
    width: 320,
    height: 320,
    bottom: -120,
    right: -90,
    background: 'radial-gradient(circle, rgba(236,72,153,0.45) 0%, rgba(236,72,153,0) 70%)',
  },
  ambientOrbTertiary: {
    width: 260,
    height: 260,
    top: '45%',
    right: '45%',
    background: 'radial-gradient(circle, rgba(45,212,191,0.35) 0%, rgba(45,212,191,0) 70%)',
  },
  shell: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
    padding: theme.spacing(4),
    boxSizing: 'border-box',
    gap: theme.spacing(3),
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: theme.spacing(2.5),
    },
  },
  navRail: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      width: 260,
      position: 'relative',
      zIndex: 1,
    },
  },
  content: {
    position: 'relative',
    flexGrow: 1,
    borderRadius: theme.spacing(3.5),
    background: 'linear-gradient(145deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.92) 100%)',
    color: '#0f172a',
    backdropFilter: 'blur(22px)',
    boxShadow: '0 45px 80px -35px rgba(15, 23, 42, 0.45)',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    overflow: 'hidden',
  },
  contentGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(129, 140, 248, 0.15), rgba(236, 72, 153, 0.12))',
    opacity: 0.7,
    pointerEvents: 'none',
  },
  contentInner: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.5),
    },
  },
}));

export default function AdminLayout(props) {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.authReducer);
  if (currentUser?.maLoaiNguoiDung !== "QuanTri") {
    return <>{props.children}</>
  }
  return (
    <SnackbarProvider maxSnack={3}>
      <div className={classes.root}>
        <span className={classes.backgroundTexture} />
        <span className={clsx(classes.ambientOrb, classes.ambientOrbPrimary)} />
        <span className={clsx(classes.ambientOrb, classes.ambientOrbSecondary)} />
        <span className={clsx(classes.ambientOrb, classes.ambientOrbTertiary)} />
        <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
        <div className={classes.shell}>
          <div className={classes.navRail}>
            <NavBar
              onMobileClose={() => setMobileNavOpen(false)}
              openMobile={isMobileNavOpen}
            />
          </div>
          <div className={clsx('content-admin', classes.content)}>
            <span className={classes.contentGlow} />
            <div className={classes.contentInner}>
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </SnackbarProvider>
  )
}