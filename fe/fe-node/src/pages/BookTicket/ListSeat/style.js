import { makeStyles } from "@material-ui/core"
import { customScrollbar } from '../../../styles/materialUi';

const useStyles = makeStyles({
  listSeat: props => ({
    position: 'relative',
    maxWidth: 'min(100%, 1280px)',
    margin: '0 auto',
    boxSizing: 'border-box',
    padding: props.isMobile
      ? '16px 16px 56px'
      : '24px clamp(32px, 7vw, 96px) 72px',
  }),

  info_CountDown: {
    width: "100%",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    padding: props => props.isMobile ? '0 0 16px' : '8px 0 24px',
  },
  infoTheater: {
    display: 'flex',
  },
  text: {
    paddingTop: 5,
    paddingLeft: 13,
  },
  textTime: {
    color: "white",
    fontSize: 13,
  },
  countDown: {
    textAlign: "center",
  },
  timeTitle: {
    fontSize: "12px",
    color: "white",
  },
  timeCount: {
    fontWeight: 500,
    fontSize: 34,
    color: "rgb(238, 130, 59)",
    lineHeight: '39px',
  },

  overflowSeat: {
    overflowX: 'visible',
    overflowY: 'visible',
    display: 'flex',
    justifyContent: 'center',
    ...customScrollbar,
  },
  invariantWidth: {
    width: 'min(100%, 1020px)',
    margin: '0 auto',
    padding: props => props.isMobile ? '0 12px' : '0 clamp(24px, 6vw, 48px)',
  },
  toppingForm: {
    width: '100%',
    maxWidth: 520,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    '& .MuiInput-underline:before': {
      borderBottomColor: 'rgba(255,255,255,0.25)',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fa7f6c',
    },
  },
  toppingLabel: {
    color: '#f5f5f5 !important',
    fontSize: 13,
    letterSpacing: 1,
  },
  toppingSelect: {
    color: '#fff',
    '& .MuiSelect-icon': {
      color: '#fa7f6c',
    },
    '& .MuiMenuItem-root': {
      color: '#1b1b1b',
    },
  },
  screenWrapper: {
    position: 'relative',
    margin: '20px auto 32px',
    width: '100%',
    maxWidth: 'min(100%, 920px)',
    textAlign: 'center',
    color: '#f5f5f5',
    letterSpacing: 2,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  screen: {
    height: 12,
    borderRadius: 12,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.08) 100%)',
    boxShadow: '0 12px 24px rgba(255,255,255,0.15)',
  },
  screenGlow: {
    position: 'absolute',
    left: '50%',
    top: -12,
    width: '60%',
    height: 40,
    transform: 'translateX(-50%)',
    background: 'radial-gradient(circle, rgba(250,127,108,0.35) 0%, rgba(0,0,0,0) 70%)',
    filter: 'blur(12px)',
    pointerEvents: 'none',
  },
  seatSelect: {
    width: '100%',
    maxWidth: 'min(100%, 920px)',
    margin: '0 auto',
    padding: 'clamp(20px, 3vw, 36px)',
    borderRadius: 24,
    background: 'rgba(12, 18, 28, 0.55)',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 24px 45px rgba(0, 0, 0, 0.35)',
    backdropFilter: 'blur(6px)',
    display: 'grid',
    gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
    columnGap: 'clamp(8px, 1.2vw, 14px)',
    rowGap: 'clamp(12px, 1.5vw, 18px)',
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
  },
  seat: {
    position: 'relative',
    minWidth: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, filter 0.2s ease',
    '&:hover $seatIcon': {
      transform: 'translateY(-4px) scale(1.03)',
      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.45))',
    },
  },
  label: {
    color: 'white',
    position: 'absolute',
    top: "50%",
    left: 0,
    transform: 'translate(calc(-100% - clamp(8px, 1.2vw, 16px)), -50%)',
    fontWeight: 500,
    fontSize: 'clamp(11px, 1.15vw, 14px)',
    letterSpacing: 1,
    cursor: "default",
    whiteSpace: 'nowrap',
  },
  seatName: {
    color: 'white',
    position: 'absolute',
    top: "42%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
    fontWeight: 600,
    fontSize: 'clamp(9px, 1vw, 13px)',
    textShadow: '0 3px 6px rgba(0,0,0,0.55)',
  },
  seatLocked: {
    position: 'absolute',
    top: "42%",
    left: "50%",
    width: 'clamp(16px, 2.8vw, 26px)',
    transform: "translate(-50%, -50%)",
  },
  seatIcon: {
    fontSize: 'clamp(18px, 3vw, 36px)',
    transition: 'transform 0.2s ease',
  },
  viewCenter: {
    position: "absolute",
    top: "68%",
    left: "47.5%",
    width: '700%',
    height: '350%',
    transform: "translate(-42.5%,-42%)",
    zIndex: 1,
  },
  areaClick: {
    width: '100%',
    height: '100%',
    color: 'red',
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 0,
  },

  noteSeat: {
    width: '100%',
    maxWidth: 'min(100%, 920px)',
    margin: '32px auto 0',
    padding: '0 clamp(16px, 5vw, 32px)',
    fontSize: 13,
    color: '#c6d3db'
  },
  typeSeats: {
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-evenly',
    textAlign: 'center',
    gap: 12,
    flexWrap: 'wrap',
    rowGap: 18,
    background: 'rgba(12, 18, 28, 0.6)',
    padding: '18px 24px',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 18px 30px rgba(0,0,0,0.35)'
  },
  typeSeatItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  posiX: {
    position: 'absolute',
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 18,
    color: '#fff',
  },

  positionView: {
    textAlign: 'center',
    marginTop: 5,
    paddingBottom: 20,
  },
  line: {
    marginLeft: 19,
  },
  linecenter: {
    display: "inline-block",
    borderBottom: "2px dashed #fa7f6c",
    width: 28,
    verticalAlign: "super",
    marginRight: 8,
  },
  linebeautiful: {
    display: "inline-block",
    borderBottom: "2px solid #fa7f6c",
    width: 28,
    verticalAlign: "super",
    marginRight: 8,
  },

  modalleft: props => ({
    display: props.isMobile ? 'none' : 'block',
    left: 0,
    top: 100,
    height: "calc(100% - 100px)",
    width: "7.5%",
    position: "fixed",
    backgroundImage: `url(${props.modalLeftImg})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }),

  opacity: {
    height: '100%',
    width: '100%',
    background: "#000",
    opacity: 0.7
  }

})
export default useStyles