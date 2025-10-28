import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import useStyles from "./style";
import formatDate from "../../../utilities/formatDate";
import { BookTicket } from "../../../reducers/actions/BookTicket";
import {
  SET_DATA_PAYMENT,
  SET_READY_PAYMENT,
  BOOK_TICKET_REQUEST,
  BOOK_TICKET_SUCCESS,
  BOOK_TICKET_FAIL,
} from "../../../reducers/constants/BookTicket";
import usersApi from "../../../api/usersApi";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import BookTicketApi from "../../../api/bookingApi";
import { VIETQR_BOOKING_KEY, VIETQR_ORDER_KEY } from "../../../constants/storageKeys";

const makeObjError = (name, value, dataSubmit) => {
  let newErrors = {
    ...dataSubmit.errors,
    [name]:
      value?.trim() === ""
        ? `${name.charAt(0).toUpperCase() + name.slice(1)} không được bỏ trống`
        : "",
  };
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexNumber = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;
  if (name === "email" && value) {
    if (!regexEmail.test(value)) newErrors[name] = "Email không đúng định dạng";
  }
  if (name === "phone" && value) {
    if (!regexNumber.test(value)) newErrors[name] = "Phone không đúng định dạng";
  }
  return newErrors;
};

export default function PayMent() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.authReducer);
  const {
    listSeat,
    amount,
    email,
    phone,
    paymentMethod,
    isReadyPayment,
    isMobile,
    danhSachVe,
    danhSachPhongVe: { thongTinPhim },
    maLichChieu,
    taiKhoanNguoiDung,
    isSelectedSeat,
    listSeatSelected,
    loadingBookTicketTicket,
    successBookTicketTicketMessage,
    errorBookTicketMessage,
  } = useSelector((state) => state.BookTicketReducer);

  const emailRef = useRef();
  const phoneRef = useRef(); // fix: trước đây khởi tạo sai
  const hasNavigatedToResultRef = useRef(false);

  // VietQR states
  const [qr, setQr] = useState(null);           // URL ảnh QR từ BE
  const [orderId, setOrderId] = useState("");   // mã đơn để đối soát
  const [polling, setPolling] = useState(false);
  const [qrError, setQrError] = useState("");
  const [copiedField, setCopiedField] = useState("");
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const [dataFocus, setDataFocus] = useState({ phone: false, email: false });
  const [dataSubmit, setdataSubmit] = useState({
    values: {
      email: email || currentUser?.email || "",
      phone: phone || currentUser?.soDt || "",
      paymentMethod: paymentMethod || "vnpay", // mặc định VNPay
    },
    errors: {
      email: "",
      phone: "",
    },
  });

  const classes = useStyles({
    isSelectedSeat,
    isReadyPayment,
    isMobile,
    dataFocus,
    dataSubmit,
  });

  const onChange = (e) => {
    let { name, value } = e.target;
    let newValues = { ...dataSubmit.values, [name]: value };
    let newErrors = makeObjError(name, value, dataSubmit);
    setdataSubmit((s) => ({ ...s, values: newValues, errors: newErrors }));
  };

  // Sync redux & validate
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({
        type: SET_DATA_PAYMENT,
        payload: {
          email: dataSubmit.values.email,
          phone: dataSubmit.values.phone,
          paymentMethod: dataSubmit.values.paymentMethod,
        },
      });
      if (
        !dataSubmit.errors.email &&
        !dataSubmit.errors.phone &&
        dataSubmit.values.email &&
        dataSubmit.values.phone &&
        dataSubmit.values.paymentMethod &&
        isSelectedSeat
      ) {
        dispatch({ type: SET_READY_PAYMENT, payload: { isReadyPayment: true } });
      } else {
        dispatch({ type: SET_READY_PAYMENT, payload: { isReadyPayment: false } });
      }
    }, 500);
    return () => clearTimeout(t);
  }, [dataSubmit, isSelectedSeat, dispatch]);

  // Khi đổi danh sách ghế -> làm mới validate email/phone
  useEffect(() => {
    if (!emailRef.current || !phoneRef.current) return;
    let emailErrors = makeObjError(emailRef.current.name, dataSubmit.values.email, dataSubmit);
    let phoneErrors = makeObjError(phoneRef.current.name, dataSubmit.values.phone, dataSubmit);
    setdataSubmit((s) => ({
      ...s,
      errors: { email: emailErrors.email, phone: phoneErrors.phone },
    }));
  }, [listSeat]); // eslint-disable-line

  // Xử lý return từ VNPay
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const transactionStatus = searchParams.get('vnp_TransactionStatus');

    const dsVe = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith('danhSachVe')) {
        const index = key.match(/\[(\d+)\]/)[1];
        dsVe[index] = JSON.parse(value);
      }
    });

    if (transactionStatus) {
      const taiKhoanNguoiDung = searchParams.get('taiKhoanNguoiDung');
      const maLichChieu = searchParams.get('maLichChieu');
      const amount = searchParams.get('vnp_Amount');
      const tenPhim = thongTinPhim?.tenPhim;
      dispatch(BookTicket({ maLichChieu, danhSachVe: dsVe, taiKhoanNguoiDung, amount, tenPhim }));
    }
  }, [location.search, dispatch, thongTinPhim?.tenPhim]);

  // Reset QR info khi đổi phương thức
  useEffect(() => {
    if (dataSubmit.values.paymentMethod !== "vietqr") {
      setQr(null);
      setQrError("");
      setOrderId("");
      setPolling(false);
      setCopiedField("");
      setIsGeneratingQr(false);
    }
  }, [dataSubmit.values.paymentMethod]);

  // Polling trạng thái VietQR
  useEffect(() => {
    if (!polling || !orderId) return;
    const iv = setInterval(async () => {
      try {
        const r = await usersApi.checkVietQrStatus({ orderId });
       const statusPayload = r?.data || {};
        const currentStatus =
          (statusPayload.status || statusPayload.state || "").toString().toLowerCase();

        if (currentStatus === "paid") {
          clearInterval(iv);
          setPolling(false);

          const normalisedTickets = (Array.isArray(danhSachVe) ? danhSachVe : [])
            .map((ticket) => {
              if (typeof ticket === "string") {
                try {
                  return JSON.parse(ticket);
                } catch (err) {
                  return { maGhe: ticket };
                }
              }
              return ticket;
            })
            .filter(Boolean);

          dispatch({ type: BOOK_TICKET_REQUEST });

          const confirmPayloads = normalisedTickets
            .map((ticket) => ticket?.maGhe || ticket?.maVe || ticket?.tenGhe || ticket?.tenDayDu)
            .filter(Boolean)
            .map((maGhe) =>
              usersApi.updateStatusOfTicket({
                maGhe,
                taiKhoanNguoiDat: taiKhoanNguoiDung,
              })
            );

          if (confirmPayloads.length) {
            await Promise.allSettled(confirmPayloads);
          }

          const successPayload = {
            message: "Success",
            orderId,
            paymentMethod: "vietqr",
            danhSachVe,
          };

          dispatch({
            type: BOOK_TICKET_SUCCESS,
            payload: { data: successPayload },
          });
        }
        if (currentStatus && currentStatus !== "pending" && currentStatus !== "paid") {
          clearInterval(iv);
          setPolling(false);
          setQrError(
            statusPayload.message ||
              "Thanh toán VietQR không thành công. Vui lòng kiểm tra lại giao dịch."
          );
        }
      } catch (e) {
        console.error(e);
        dispatch({
          type: BOOK_TICKET_FAIL,
          payload: {
            error:
              e?.response?.data?.message ||
              "Không thể xác nhận thanh toán VietQR. Vui lòng liên hệ hỗ trợ.",
          },
        });
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [
    polling,
    orderId,
    dispatch,
    maLichChieu,
    danhSachVe,
    taiKhoanNguoiDung,
    amount,
    thongTinPhim?.tenPhim,
  ]);

  // Click "Đặt Vé"
  const persistOrderToSession = useCallback((id) => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(VIETQR_ORDER_KEY, id || "");
    } catch (err) {
      console.error("Failed to persist VietQR order id", err);
    }
  }, []);

  const persistPendingBooking = useCallback(
    (id) => {
      if (typeof window === "undefined") return;
      try {
        const snapshot = {
          orderId: id || "",
          booking: {
            orderId: id || "",
            paymentMethod: "vietqr",
            danhSachVe,
          },
          amount: Number(amount || 0),
          email: dataSubmit.values.email,
          phone: dataSubmit.values.phone,
          paymentMethod: "vietqr",
          seats: Array.isArray(listSeatSelected) ? listSeatSelected : [],
          danhSachVe,
          maLichChieu,
          taiKhoanNguoiDung,
          thongTinPhim,
          savedAt: new Date().toISOString(),
        };
        sessionStorage.setItem(VIETQR_BOOKING_KEY, JSON.stringify(snapshot));
      } catch (err) {
        console.error("Failed to persist pending VietQR booking", err);
      }
    },
    [
      amount,
      dataSubmit.values.email,
      dataSubmit.values.phone,
      danhSachVe,
      listSeatSelected,
      maLichChieu,
      taiKhoanNguoiDung,
      thongTinPhim,
    ]
  );

  const normaliseQrPayload = useCallback(
    (payload) => {
      if (!payload) return null;

      const qrData = payload?.qrData || {};
      const meta = payload?.payload || {};

      const qrImageUrl =
        qrData.qrDataURL ||
        qrData.qrImageUrl ||
        qrData.qrImage ||
        qrData.qrCode ||
        qrData.qrUrl ||
        "";

      return {
        orderId: payload.orderId || "",
        status: payload.status || "",
        addInfo: qrData.addInfo || payload.addInfo || meta.addInfo || "",
        amount:
          Number(
            qrData.amount ?? payload.amount ?? meta.amount ?? amount ?? 0
          ) || 0,
        bankBin: qrData.acqId || qrData.bankBin || meta.acqId || "",
        accountNo: qrData.accountNo || meta.accountNo || "",
        accountName: qrData.accountName || meta.accountName || "",
        deeplink:
          qrData.deeplink ||
          qrData.deeplinkUrl ||
          qrData.deeplinkURL ||
          qrData.deepLink ||
          "",
        qrImageUrl,
        raw: payload,
      };
    },
    [amount]
  );
  // Click "Đặt Vé"
  const handleBookTicket = async () => {
    try {
      if (dataSubmit.values.paymentMethod === "vietqr") {
        const newOrderId = `CINEMA-${maLichChieu}-${taiKhoanNguoiDung}-${Date.now().toString().slice(-8)}`;
        setOrderId(newOrderId);
        setQrError("");
        setQr(null);
        setPolling(false);
        setIsGeneratingQr(true);

        try {
          await BookTicketApi.postDatVe({
            maLichChieu,
            danhSachVe,
            taiKhoanNguoiDung,
            amount,
            tenPhim: thongTinPhim?.tenPhim,
            paymentMethod: "vietqr",
            orderId: newOrderId,
          });
        } catch (err) {
          console.error("Failed to create pending VietQR booking", err);
          setQrError(
            err?.response?.data?.message ||
              "Không thể lưu vé trước khi thanh toán. Vui lòng thử lại."
          );
          setIsGeneratingQr(false);
          return;
        }

        try {
          const res = await usersApi.getVietQR({
            amount,
            maLichChieu,
            taiKhoanNguoiDung,
            orderId: newOrderId,
          });
const payload = res?.data || {};
          const nextOrderId = payload.orderId || newOrderId;

          setOrderId(nextOrderId);

          const normalised = normaliseQrPayload(payload);

          if (!normalised || !normalised.qrImageUrl) {
            setQr(null);
            setPolling(false);
            setQrError(
              "Không nhận được mã VietQR từ hệ thống. Vui lòng thử lại sau."
            );
            return;
          }

          persistOrderToSession(nextOrderId);
          persistPendingBooking(nextOrderId);

          setQr(normalised);
          setQrError("");          
          setCopiedField("");
          setPolling(true);
          return;
        } finally {
          setIsGeneratingQr(false);
        }
      }

      // VNPay (giữ nguyên)
      usersApi
        .creatPaymentUrl(amount, maLichChieu, danhSachVe, taiKhoanNguoiDung)
        .then((result) => (window.location.href = result.data))
        .catch(() => {});
    } catch (e) {
      console.error(e);
      setQr(null);
      setPolling(false);
      setQrError(
        e?.response?.data?.message ||
          "Không thể tạo mã VietQR. Vui lòng thử lại."
      );
      setIsGeneratingQr(false);
    }
  };
  
  const handleCopy = useCallback((field, value) => {
    if (!value) return;
    if (!navigator?.clipboard?.writeText) {
      setCopiedField("error");
      setTimeout(() => setCopiedField(""), 2000);
      return;
    }

    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 2000);
      })
      .catch(() => {
        setCopiedField("error");
        setTimeout(() => setCopiedField(""), 2000);
      });
  }, []);

  const onFocus = (e) => setDataFocus({ ...dataFocus, [e.target.name]: true });
  const onBlur = (e) => setDataFocus({ ...dataFocus, [e.target.name]: false });

  useEffect(() => {
    const successData = successBookTicketTicketMessage;
    if (!successData) return;
    const method =
      successData?.paymentMethod &&
      successData.paymentMethod.toString
        ? successData.paymentMethod.toString().toLowerCase()
        : "";
    if (method !== "vietqr") return;
    if (hasNavigatedToResultRef.current) return;
    hasNavigatedToResultRef.current = true;

    const targetOrderId =
      successData?.orderId ||
      successData?.maGiaoDich ||
      orderId ||
      (typeof window !== "undefined" ? sessionStorage.getItem(VIETQR_ORDER_KEY) : "");

    const searchParams = targetOrderId
      ? `?method=vietqr&orderId=${encodeURIComponent(targetOrderId)}`
      : "?method=vietqr";

    history.push(`/ket-qua-dat-ve${searchParams}`);
  }, [successBookTicketTicketMessage, history, orderId]);

  return (
    <aside className={classes.payMent}>
      <div>
        <p className={`${classes.amount} ${classes.payMentItem}`}>
          {`${amount.toLocaleString("vi-VI")} đ`}
        </p>

        <div className={classes.payMentItem}>
          <p className={classes.tenPhim}>{thongTinPhim?.tenPhim}</p>
          <p>{thongTinPhim?.tenCumRap}</p>
          <p>{`${thongTinPhim?.tenRap}`}</p>
        </div>

        <div className={`${classes.seatInfo} ${classes.payMentItem}`}>
          <span>{`Ghế ${listSeatSelected?.join(", ")}`}</span>
          <p className={classes.amountLittle}>
            {`${amount.toLocaleString("vi-VI")} đ`}
          </p>
        </div>

        {/* email */}
        <div className={classes.payMentItem}>
          <label className={classes.labelEmail}>E-Mail</label>
          <input
            type="text"
            name="email"
            ref={emailRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={dataSubmit.values.email}
            className={classes.fillInEmail}
            onChange={onChange}
            autoComplete="off"
          />
          <p className={classes.error}>{dataSubmit.errors.email}</p>
        </div>

        {/* phone */}
        <div className={classes.payMentItem}>
          <label className={classes.labelPhone}>Phone</label> <br />
          <input
            type="text"
            name="phone"
            ref={phoneRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={dataSubmit.values.phone ?? currentUser?.soDt ?? ""}
            className={classes.fillInPhone}
            onChange={onChange}
            autoComplete="off"
          />
          <p className={classes.error}>{dataSubmit.errors.phone}</p>
        </div>

        {/* Phương thức thanh toán */}
        <div className={classes.payMentItem}>
          <label className={classes.label}>Phương thức</label>
          <div>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="vnpay"
                checked={dataSubmit.values.paymentMethod === "vnpay"}
                onChange={onChange}
              />{" "}
              VNPay
            </label>
            <label style={{ marginLeft: 12 }}>
              <input
                type="radio"
                name="paymentMethod"
                value="vietqr"
                checked={dataSubmit.values.paymentMethod === "vietqr"}
                onChange={onChange}
              />{" "}
              VietQR
            </label>
          </div>
        </div>

        {/* VietQR preview */}
        {dataSubmit.values.paymentMethod === "vietqr" && (
          <div className={classes.payMentItem}>
            <p className={classes.label}>Quét VietQR để thanh toán</p>
             {qrError ? (
              <p className={classes.error}>{qrError}</p>
            ) : qr ? (
              <div className={classes.vietQrContainer}>
                <img
                  src={qr.qrImageUrl}
                  alt="VietQR"
                  className={classes.vietQrImage}
                />
                <div className={classes.vietQrInfo}>
                  <div className={classes.vietQrRow}>
                    <span className={classes.vietQrLabel}>Ngân hàng</span>
                    <span className={classes.vietQrValue}>{qr.bankBin}</span>
                  </div>
                  <div className={classes.vietQrRow}>
                    <span className={classes.vietQrLabel}>Số tài khoản</span>
                    <span className={classes.vietQrValue}>{qr.accountNo}</span>
                    <button
                      type="button"
                      className={classes.copyButton}
                      onClick={() => handleCopy("account", qr.accountNo)}
                    >
                      Sao chép
                    </button>
                  </div>
                  <div className={classes.vietQrRow}>
                    <span className={classes.vietQrLabel}>Chủ tài khoản</span>
                    <span className={classes.vietQrValue}>{qr.accountName}</span>
                  </div>
                  <div className={classes.vietQrRow}>
                    <span className={classes.vietQrLabel}>Số tiền</span>
                    <span className={classes.vietQrValue}>
                      {`${Number(qr.amount || 0).toLocaleString("vi-VI")} đ`}
                    </span>
                    <button
                      type="button"
                      className={classes.copyButton}
                      onClick={() => handleCopy("amount", String(qr.amount))}
                    >
                      Sao chép
                    </button>
                  </div>
                  <div className={classes.vietQrRow}>
                    <span className={classes.vietQrLabel}>Nội dung</span>
                    <span className={classes.vietQrValue}>{qr.addInfo}</span>
                    <button
                      type="button"
                      className={classes.copyButton}
                      onClick={() => handleCopy("addInfo", qr.addInfo)}
                    >
                      Sao chép
                    </button>
                  </div>
                  {qr.deeplink && (
                    <a
                      className={classes.deeplinkButton}
                      href={qr.deeplink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mở app ngân hàng
                    </a>
                  )}
                  <p className={classes.vietQrNote}>
                    Nội dung chuyển khoản phải chứa mã đơn <b>{orderId}</b> để hệ
                    thống tự động xác nhận.
                  </p>
                  {copiedField && copiedField !== "error" && (
                    <p className={classes.copyMessage}>Đã sao chép!</p>
                  )}
                  {copiedField === "error" && (
                    <p className={classes.error}>Không thể sao chép. Vui lòng thử lại.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className={classes.vietQrStatus}>
                {isGeneratingQr ? (
                  <>
                    <p className={classes.vietQrGenerating}>
                      Đang tạo mã VietQR, vui lòng chờ trong giây lát...
                    </p>
                    {orderId ? (
                      <p className={classes.vietQrOrderHint}>
                        Mã đơn tạm thời: <b>{orderId}</b>
                      </p>
                    ) : null}
                  </>
                ) : orderId ? (
                  <p className={classes.vietQrOrderHint}>
                    Đơn <b>{orderId}</b> đang được cập nhật mã VietQR. Nếu mã
                    chưa xuất hiện, vui lòng đợi thêm hoặc thử lại.
                  </p>
                ) : (
                  <p className={classes.label}>
                    Nhấn "Đặt Vé" để tạo mã QR thanh toán VietQR.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mã giảm giá */}
        <div className={classes.payMentItem}>
          <label className={classes.label}>Mã giảm giá</label>
          <input type="text" value="Tạm thời không hỗ trợ..." readOnly className={classes.fillIn} />
          <button className={classes.btnDiscount} disabled>Áp dụng</button>
        </div>

        {/* đặt vé */}
        <div className="">
          <button className={classes.btnDV} onClick={handleBookTicket}>
            Đặt Vé
          </button>
        </div>

        <div className="">
          <a href="/"><button type="button" className={classes.btnDV}>Quay lại trang chủ →</button></a>
        </div>
      </div>
    </aside>
  );
}
