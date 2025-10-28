import { makeStyles } from "@material-ui/core"
import { underLineDashed } from '../../../styles/materialUi';

const useStyles = makeStyles({
  resultBookTicket: {
    textAlign: 'left',
    lineHeight: '30px',
    padding: props => props.isMobile ? 23 : 40,
    width: "100%",
  },
  infoTicked: {
    display: 'flex',
    gap: '5%',
  },
  infoTicked__img: props => ({
    flex: "30%",
    backgroundImage: `url(${props.thongTinPhim?.hinhAnh})`,
    borderRadius: "4px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }),

  infoTicked__txt: {
    flex: "70%",
  },
  tenPhim: {
    fontSize: 19,
    ...underLineDashed
  },
  text__first: props => ({
    color: `${props.color}`,
    fontWeight: "500",
  }),
  text__second: {
    color: "#000",
    fontWeight: "500",
  },
  diaChi: {
    color: '#9B9B9B'
  },
  table: {
    marginTop: 10,
    width: "100%",
  },
  infoResult_label: {
    margin: "30px 0px 10px",
    fontWeight: 400,
  },
  paymentColor: {
    color: '#f79320'
  },
  errorColor: {
    color: 'rgb(238, 130, 59)'
  },
  noteresult: {
    fontStyle: 'italic',
    fontWeight: 500,
  },
  invoiceActions: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  invoiceButton: {
    backgroundColor: '#44c020',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '8px 16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color .2s ease',
    '&:hover': {
      backgroundColor: '#2f8513',
    },
    '&:disabled': {
      backgroundColor: '#9b9b9b',
      cursor: 'not-allowed',
    },
  },
  invoiceHint: {
    fontSize: 12,
    color: '#9b9b9b',
  },
  invoicePrintRoot: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    width: '100%',
    pointerEvents: 'none',
  },
  invoicePaper: {
    width: 680,
    padding: 32,
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    lineHeight: 1.6,
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  invoiceHeader: {
    textAlign: 'center',
    marginBottom: 24,
  },
  invoiceHeaderTitle: {
    fontSize: 20,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  invoiceMeta: {
    marginBottom: 16,
  },
  invoiceMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  invoiceTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 8,
  },
  invoiceTableHeadCell: {
    borderBottom: '1px solid #dcdcdc',
    textAlign: 'left',
    padding: '8px 4px',
    fontWeight: 600,
  },
  invoiceTableCell: {
    borderBottom: '1px solid #f0f0f0',
    padding: '8px 4px',
  },
  invoiceTableTotal: {
    padding: '8px 4px',
    textAlign: 'right',
    fontWeight: 700,
  },
  invoiceFooter: {
    marginTop: 24,
    fontSize: 12,
    textAlign: 'center',
    color: '#4a4a4a',
  },
  vietQrSection: {
    marginTop: 24,
    padding: 16,
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: (props) => (props.isMobile ? 'column' : 'row'),
    alignItems: (props) => (props.isMobile ? 'center' : 'flex-start'),
    gap: 16,
  },
  vietQrImage: {
    width: 220,
    height: 220,
    objectFit: 'cover',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  vietQrDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  vietQrHeading: {
    margin: '0 0 8px',
    fontWeight: 600,
  },
  vietQrRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  vietQrLabel: {
    minWidth: 120,
    color: '#5c5c5c',
    fontWeight: 500,
  },
  vietQrValue: {
    fontWeight: 600,
  },
  vietQrCopyButton: {
    marginLeft: 'auto',
    padding: '4px 10px',
    borderRadius: 4,
    border: '1px solid #44c020',
    backgroundColor: '#fff',
    color: '#44c020',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background-color .2s ease',
    '&:hover': {
      backgroundColor: '#44c020',
      color: '#fff',
    },
  },
  vietQrDeeplinkButton: {
    display: 'inline-block',
    marginTop: 8,
    padding: '6px 12px',
    borderRadius: 4,
    backgroundColor: '#f79320',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'background-color .2s ease',
    '&:hover': {
      backgroundColor: '#d97b0d',
    },
  },
  vietQrNote: {
    fontSize: 13,
    color: '#6f6f6f',
    marginTop: 8,
  },
  vietQrCopyMessage: {
    color: '#2f8513',
    fontSize: 13,
    fontWeight: 600,
  },
  vietQrCopyError: {
    color: '#d64545',
    fontSize: 13,
    fontWeight: 600,
  },
  vietQrFallback: {
    fontStyle: 'italic',
    color: '#9b9b9b',
  },

})
export default useStyles