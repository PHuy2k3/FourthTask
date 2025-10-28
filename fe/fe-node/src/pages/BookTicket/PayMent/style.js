import { makeStyles } from "@material-ui/core"
import { underLineDashed, customScrollbar } from '../../../styles/materialUi';

const useStyles = makeStyles({
  payMent: props => ({
    width: '100%',
    height: props.isMobile ? 'calc(100vh - 130px)' : '100vh',
    position: 'relative',
    boxShadow: "0 0 15px rgb(0 0 0 / 30%)",
    padding: "0 8%",
    overflow: "auto",
    color: 'white',
    display: 'flex',
    flexDirection: "column",
    justifyContent: 'space-between',

    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    ...customScrollbar
  }),
  payMentItem: {
    position: 'relative',
    padding: "12px 0",
    ...underLineDashed
  },

  vietQrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  vietQrImage: {
    width: 240,
    height: 240,
    borderRadius: 12,
    backgroundColor: '#fff',
    objectFit: 'cover',
  },
  vietQrInfo: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: 'rgba(255,255,255,0.05)',
    padding: '12px 16px',
    borderRadius: 12,
  },
  vietQrRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  vietQrLabel: {
    minWidth: 110,
    fontSize: 13,
    color: '#9b9b9b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  vietQrValue: {
    fontWeight: 600,
    color: '#fff',
    wordBreak: 'break-word',
  },
  copyButton: {
    marginLeft: 'auto',
    background: '#2f80ed',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: 12,
    '&:hover': {
      background: '#1b66c9',
    },
  },
  deeplinkButton: {
    display: 'inline-block',
    marginTop: 8,
    alignSelf: 'flex-start',
    background: '#44c020',
    color: '#fff',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 600,
    '&:hover': {
      background: '#318014',
    },
  },
  vietQrNote: {
    fontSize: 12,
    color: '#f7c244',
    marginTop: 8,
  },
  vietQrStatus: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 13,
    lineHeight: 1.6,
    color: '#9b9b9b',
  },
  vietQrGenerating: {
    color: '#f7c244',
    fontWeight: 500,
  },
  vietQrOrderHint: {
    color: '#fff',
    fontSize: 13,
  },
  copyMessage: {
    fontSize: 12,
    color: '#44c020',
  },
  amount: {
    lineHeight: '60px',
    textAlign: 'center',
    fontSize: "41px",
    color: "#44c020",
    fontWeight: 500,
  },

  tenPhim: {
    fontWeight: 500,
    textTransform: 'capitalize',
  },

  seatInfo: {
    display: 'flex',
    justifyContent: "space-between",
    gap: '10%',
    color: "rgb(238, 130, 59)",
    fontSize: 18,
  },
  amountLittle: {
    flex: "0 0 82px",
    color: "#44c020",
    fontWeight: 500,
    textAlign: 'right',
  },

  label: {
    color: "#9b9b9b",
    display: 'block'
  },
  labelEmail: {
    color: props => props.dataFocus.email ? "#4a90e2" : "#9b9b9b",
    fontSize: props => (!props.dataFocus.email && !props.dataSubmit.values.email) ? 16 : 13,
    transition: "color .3s, font-size .2s",
    display: 'block',
    position: 'absolute',
    top: "9%",
    left: 0,
  },
  labelPhone: {
    color: props => props.dataFocus.phone ? "#4a90e2" : "#9b9b9b",
    fontSize: props => (!props.dataFocus.phone && !props.dataSubmit.values.phone) ? 16 : 13,
    transition: "color .3s, font-size .2s",
    display: 'block',
    position: 'absolute',
    top: "9%",
    left: 0,
  },
  error: {
    color: "rgb(238, 130, 59)",
  },
  fillIn: {
    background: 'black',
    color:'white',
    border: 'none',
    width: "100%",
    lineHeight: 1.7,
    '&:focus': {
      outline: 'none'
    },
  },
  fillInEmail: {
    background: 'black',
    color:'white',
    border: 'none',
    width: "100%",
    lineHeight: 1.7,
    paddingTop: props => (!props.dataFocus.email && !props.dataSubmit.values.email) ? 0 : 12.5,
    marginTop: props => (!props.dataFocus.email && !props.dataSubmit.values.email) ? 0 : 5,
    transition: ".2s",
    '&:focus': {
      outline: 'none'
    },
  },
  fillInPhone: {
    background: 'black',
    color:'white',
    border: 'none',
    width: "100%",
    lineHeight: 1.7,
    paddingTop: props => (!props.dataFocus.phone && !props.dataSubmit.values.phone) ? 0 : 12.5,
    marginTop: props => (!props.dataFocus.phone && !props.dataSubmit.values.phone) ? 0 : 5,
    transition: ".2s",
    '&:focus': {
      outline: 'none'
    },
  },
  btnDiscount: {
    backgroundColor: "#afafaf",
    color: '#fff',
    border: 'none',
    borderRadius: "6px",
    padding: "5px 7px",
    position: 'absolute',
    top: "50%",
    right: '0%',
    transform: "translateY(-50%)",
  },

  selectedPayMentMethod: {
    paddingTop: 12,
  },
  toggleNotice: props => ({
    display: props.isSelectedSeat ? 'none' : 'block',
    fontSize: 15,
    color: '#fb4f35',
    paddingTop: 12,
  }),
  formPayment: props => ({
    display: props.isSelectedSeat ? 'block' : 'none',
    paddingTop: 12,
  }),
  formPaymentItem: {
    display: 'flex',
    alignItems: "center",
  },
  img: {
    borderRadius: "5px",
    marginLeft: "15px",
    marginRight: "15px",
    maxWidth: "40px",
  },
  input: {
    flexShrink: 0,
    width: "22px",
    height: "22px",
    cursor: 'pointer',
    "-webkit-appearance": "none",
    border: "1px solid #4a90e2",
    borderRadius: "50%",
    outline: 0,
    '&:before': {
      content: "''",
      display: "block",
      width: "50%",
      height: "50%",
      margin: "25% auto",
      borderRadius: "50%"
    },
    '&:checked:before': {
      background: "#4a90e2"
    }
  },
  btnDV:{
    fontSize: "16px",
    borderRadius: "4px",
    background: "0 0",
    padding: "11px 25px",
    transition: "all .2s",
    marginTop: "25px",
    width: '100%',
    marginBottom: "20px",
    backgroundColor: "rgb(238, 130, 59)",
    border: "none",
    color: "#fff",
    fontWeight:'600',
    "&:hover": {
      backgroundColor: "#b42a14",
    }
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  notice: {
    fontSize: 13,
    textAlign: 'center',
    paddingBottom: 70,
    paddingTop: 20,
  },
  imgNotice: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  contactColor: {
    color: '#f79320'
  },

  btnDatVe: props => ({
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: '25%',
    border: 'none',
    cursor: 'pointer',
    height: 60,
    backgroundColor: '#afafaf',
    backgroundImage: props.isReadyPayment ? "linear-gradient(223deg,#b4ec51 0,#429321 100%)" : 'none',
  }),
  txtDatVe: {
    margin: "auto",
    color: '#e9e9e9',
    fontSize: 25,
  },

})
export default useStyles