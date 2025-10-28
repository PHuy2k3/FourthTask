import React from "react";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

import useStyles from "./style";
import {
  RESET_DATA_BookTicket,
  RESET_ALERT_OVER10,
} from "../../../reducers/constants/BookTicket";
import { LOADING_BACKTO_HOME } from "../../../reducers/constants/Lazy";
import { getListSeat } from "../../../reducers/actions/BookTicket";
import { colorTheater } from "../../../constants/theaterData";
import ResultBookTicket from "../../BookTicket/ResultBookticket";

export default function Modal() {
  const {
    alertOver10,
    isMobile,
    timeOut,
    successBookTicketTicketMessage,
    errorBookTicketMessage,
    danhSachPhongVe: { thongTinPhim },
  } = useSelector((state) => state.BookTicketReducer);
  const dispatch = useDispatch();
  const param = useParams(); // lấy dữ liệu param từ URL
  const history = useHistory();
  const classes = useStyles({
    thongTinPhim,
    color: colorTheater[thongTinPhim?.tenCumRap.slice(0, 3).toUpperCase()],
    isMobile,
  });
  const isBookTicket =
    successBookTicketTicketMessage || errorBookTicketMessage ? true : false;

  const handleReBookTicket = () => {
    if (successBookTicketTicketMessage) {
      dispatch(getListSeat(param.maLichChieu));
    }
    dispatch({ type: RESET_DATA_BookTicket });
  };
  const handleTimeOut = () => {
    dispatch({ type: RESET_DATA_BookTicket });
    dispatch(getListSeat(param.maLichChieu));
  };
  const handleAlertOver10 = () => {
    dispatch({ type: RESET_ALERT_OVER10 });
  };

  const handleCombackHome = () => {
    dispatch({ type: RESET_DATA_BookTicket });
    dispatch({ type: LOADING_BACKTO_HOME });
    history.push("/");
  };

  return (
    <Dialog
      open={timeOut || (isBookTicket && !isMobile) || alertOver10}
      classes={{ paper: classes.modal }}
      maxWidth="md"
    >
      {timeOut &&
        !isBookTicket && (
          <div className={classes.padding}>
            <p>
              Đã hết thời gian giữ ghế. Vui lòng thực hiện đơn hàng trong thời
              hạn 5 phút.
              <span className={classes.txtClick} onClick={handleTimeOut}>
                Đặt vé lại
              </span>
            </p>
          </div>
        )}
      {alertOver10 &&
        !timeOut && (
          <div className={classes.over10}>
            <div className={classes.notification}>
              <img
                width="100%"
                src="/img/BookTicket/Post-notification.png"
                alt="Post-notification"
              />
            </div>
            <p className={classes.textOver}>Bạn không thể chọn quá 3 ghế</p>
            <Button
              variant="outlined"
              classes={{ root: classes.btnOver }}
              onClick={handleAlertOver10}
            >
              ok
            </Button>
          </div>
        )}
      {!isMobile &&
        isBookTicket && ( 
          <>
            <ResultBookTicket />
            <div className={classes.spaceEvenly}>
              <Button
                classes={{ root: classes.btnResult }}
                onClick={handleReBookTicket}
              >
                {successBookTicketTicketMessage && "Mua thêm vé phim này"}
                {errorBookTicketMessage && "Thử mua lại"}
              </Button>
              <Button
                classes={{ root: classes.btnResult }}
                onClick={handleCombackHome}
              >
                Quay về trang chủ
              </Button>
            </div>
          </>
        )}
    </Dialog>
  );
}
