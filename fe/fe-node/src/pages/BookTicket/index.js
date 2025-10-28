import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useStyles from "./style";
import ListSeat from "./ListSeat";
import PayMent from "./PayMent";
import Modal from "./Modal";
import { getListSeat } from "../../reducers/actions/BookTicket";
import {
  SET_ISMOBILE,
  INIT_DATA,
  RESET_DATA_BookTicket,
} from "../../reducers/constants/BookTicket";
import { DISPLAY_MOBILE_BookTicket } from "../../constants/config";
export default function Index() {
  const classes = useStyles();
  const { isLazy } = useSelector((state) => state.lazyReducer);
  const {
    loadingGetListSeat,
    timeOut,
    danhSachPhongVe: { thongTinPhim, danhSachGhe },
    errorGetListSeatMessage,
  } = useSelector((state) => state.BookTicketReducer);
  const { currentUser } = useSelector((state) => state.authReducer);
  const param = useParams();
  const dispatch = useDispatch();
  const mediaQuery = useMediaQuery(DISPLAY_MOBILE_BookTicket);
  const loading = isLazy || loadingGetListSeat;
  useEffect(() => {
    dispatch(getListSeat(param.maLichChieu));
    return () => {
      dispatch({ type: RESET_DATA_BookTicket });
    };
  }, []);
useEffect(() => {
    const seatsPerRow = 16;
    let initCode = 64;
    const danhSachGheEdit =
      danhSachGhe?.reduce((acc, _, index) => {
        const isRowStart = index % seatsPerRow === 0;
        if (isRowStart) {
          initCode++;
          const rowSeats = danhSachGhe.slice(index, index + seatsPerRow);
          const rowLabel = String.fromCharCode(initCode);
          const makeWholeRowVip = ["D", "E", "F", "G"].includes(rowLabel);
          const referenceVipPrice = rowSeats.find((reference) => reference.loaiGhe === "Vip")?.giaVe;

          const vipSeats = makeWholeRowVip
            ? rowSeats.map((seat) => {
                return {
                  ...seat,
                  loaiGhe: "Vip",
                  giaVe: referenceVipPrice ?? seat.giaVe,
                };
              })
            : rowSeats.filter((seat) => seat.loaiGhe === "Vip");

          const regularSeats = makeWholeRowVip
            ? []
            : rowSeats.filter((seat) => seat.loaiGhe !== "Vip");

          const centeredRow = Array(seatsPerRow).fill(null);
          const vipStartIndex = Math.floor((seatsPerRow - vipSeats.length) / 2);

          vipSeats.forEach((seat, seatIndex) => {
            centeredRow[vipStartIndex + seatIndex] = seat;
          });

          let regularIndex = 0;
          centeredRow.forEach((seatSlot, seatPosition) => {
            if (!seatSlot && regularIndex < regularSeats.length) {
              centeredRow[seatPosition] = regularSeats[regularIndex];
              regularIndex++;
            }
          });

          centeredRow.forEach((seat, seatIndex) => {
            if (!seat) {
              return;
            }
            const number = (seatIndex + 1).toString().padStart(2, 0);
            acc.push({
              ...seat,
              label: `${String.fromCharCode(initCode)}${number}`,
              selected: false,
            });
          });
        }
        return acc;
      }, []) || [];
    dispatch({
      type: INIT_DATA,
      payload: {
        listSeat: danhSachGheEdit,
        maLichChieu: thongTinPhim?.maLichChieu,
        taiKhoanNguoiDung: currentUser?.taiKhoan,
        email: currentUser?.email,
        phone: currentUser?.soDT,
      },
    });
  }, [danhSachGhe, currentUser, timeOut]);
  useEffect(() => {
    dispatch({ type: SET_ISMOBILE, payload: { isMobile: mediaQuery } });
  }, [mediaQuery]);

  if (errorGetListSeatMessage) {
    return <div>{errorGetListSeatMessage}</div>;
  }
  return (
    <div style={{ display: loading ? "none" : "block" }}>
      <div className={classes.bookTicked}>
        <section className={classes.left}>
          <ListSeat />
        </section>
        <section className={classes.right}>
          <PayMent />
        </section>
      </div>
      <Modal />
    </div>
  );
}
