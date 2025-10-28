import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

import useStyles from "./style";
import { colorTheater } from "../../../constants/theaterData";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { VIETQR_ORDER_KEY, VIETQR_BOOKING_KEY } from "../../../constants/storageKeys";

export default function ResultBookTicket() {
  const location = useLocation();

  const {
    isMobile,
    amount,
    email,
    phone,
    paymentMethod,
    listSeatSelected,
    danhSachVe,
    successBookTicketTicketMessage,
    errorBookTicketMessage,
    danhSachPhongVe: { thongTinPhim },
    maLichChieu,
    taiKhoanNguoiDung,
  } = useSelector((state) => state.BookTicketReducer);
  const { currentUser } = useSelector((state) => state.authReducer);

  // tránh lỗi khi tenCumRap không có hoặc ngắn
  const theaterKey =
    thongTinPhim?.tenCumRap?.slice(0, 3)?.toUpperCase?.() || "CIN";
  const classes = useStyles({
    thongTinPhim,
    color: colorTheater[theaterKey],
    isMobile,
  });

  const [ghe, setGhe] = useState([]);
  const [ticketsForInvoice, setTicketsForInvoice] = useState([]);
  const [orderCode, setOrderCode] = useState("");
  const [issuedAt, setIssuedAt] = useState(() => new Date());
  const [total, setTotal] = useState(0);
  const [isVNPay, setIsVNPay] = useState(false);
  const [vnpStatus, setVnpStatus] = useState(null);
  const [persistedBooking, setPersistedBooking] = useState(null);
  const [vietQrInfo, setVietQrInfo] = useState(null);
  const [copiedField, setCopiedField] = useState("");
  const invoiceRef = useRef(null);

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: orderCode ? `hoa-don-${orderCode}` : "hoa-don-dat-ve",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const transactionStatus = searchParams.get("vnp_TransactionStatus");
    const vnpAmount = searchParams.get("vnp_Amount");
    const vnpTxnRef = searchParams.get("vnp_TxnRef");
    const vnpTransactionNo = searchParams.get("vnp_TransactionNo");
    const vnpPayDate = searchParams.get("vnp_PayDate");
    const queryOrderId = searchParams.get("orderId");

    let storedBooking = null;
    if (typeof window !== "undefined") {
      const storedRaw = sessionStorage.getItem(VIETQR_BOOKING_KEY);
      if (storedRaw) {
        try {
          storedBooking = JSON.parse(storedRaw);
        } catch {
          storedBooking = null;
        }
      }
    }

    if (transactionStatus || vnpAmount) {
      setPersistedBooking(null);
      setVietQrInfo(null);
      setIsVNPay(true);
      setVnpStatus(transactionStatus);

      const t = vnpAmount ? parseInt(vnpAmount, 10) / 100 : 0;
      setTotal(t);

      const danhSachVeFromQuery = [];
      searchParams.forEach((value, key) => {
        if (key.startsWith("danhSachVe")) {
          const indexMatch = key.match(/\[(\d+)\]/);
          if (indexMatch) {
            const index = indexMatch[1];
            try {
              danhSachVeFromQuery[index] = JSON.parse(value);
            } catch {
              danhSachVeFromQuery[index] = value;
            }
          }
        }
      });

      const extractedGhe = (danhSachVeFromQuery || [])
        .filter(Boolean)
        .map((ve) => ve?.tenDayDu || ve?.maGhe || ve)
        .filter(Boolean);
      setGhe(extractedGhe);

      const normalisedTickets = (danhSachVeFromQuery || [])
        .filter(Boolean)
        .map((ticket) => {
          let parsed = ticket;
          if (typeof parsed === "string") {
            try {
              parsed = JSON.parse(parsed);
            } catch {
              parsed = { tenDayDu: ticket };
            }
          }
          return {
            maGhe: parsed?.maGhe,
            tenDayDu: parsed?.tenDayDu || parsed?.maGhe || "",
            giaVe:
              parsed?.giaVe !== undefined && parsed?.giaVe !== null
                ? Number(parsed.giaVe)
                : null,
          };
        })
        .filter((ticket) => ticket.tenDayDu);

      const computedTotal = t || 0;
      if (normalisedTickets.length) {
        const basePrice =
          normalisedTickets.some((ticket) => ticket.giaVe == null) &&
          normalisedTickets.length
            ? Math.round(computedTotal / normalisedTickets.length || 0)
            : null;
        const remainder =
          basePrice && normalisedTickets.length
            ? computedTotal - basePrice * normalisedTickets.length
            : 0;
        setTicketsForInvoice(
          normalisedTickets.map((ticket, index) => ({
            ...ticket,
            giaVe:
              ticket.giaVe != null
                ? ticket.giaVe
                : basePrice + (index === normalisedTickets.length - 1 ? remainder : 0),
          }))
        );
      } else {
        setTicketsForInvoice([]);
      }

      if (vnpTxnRef || vnpTransactionNo) {
        setOrderCode(vnpTxnRef || vnpTransactionNo);
      } else {
        setOrderCode("");
      }

      if (vnpPayDate && vnpPayDate.length === 14) {
        const year = parseInt(vnpPayDate.slice(0, 4), 10);
        const month = parseInt(vnpPayDate.slice(4, 6), 10) - 1;
        const day = parseInt(vnpPayDate.slice(6, 8), 10);
        const hour = parseInt(vnpPayDate.slice(8, 10), 10);
        const minute = parseInt(vnpPayDate.slice(10, 12), 10);
        const second = parseInt(vnpPayDate.slice(12, 14), 10);
        const parsedDate = new Date(year, month, day, hour, minute, second);
        if (!Number.isNaN(parsedDate.getTime())) {
          setIssuedAt(parsedDate);
        } else {
          setIssuedAt(new Date());
        }
      } else {
        setIssuedAt(new Date());
      }
    } else {
      setPersistedBooking(storedBooking);
      setVietQrInfo(storedBooking?.vietQr || null);
      setIsVNPay(false);
      setVnpStatus(null);

      const vietQrTotal = Number(amount) || Number(storedBooking?.amount) || 0;
      setTotal(vietQrTotal);

      const extractedSeats = (listSeatSelected || []).map((x) => String(x));
      const storedSeats = Array.isArray(storedBooking?.seats)
        ? storedBooking.seats.map((x) => String(x)).filter(Boolean)
        : [];
      setGhe(extractedSeats.length ? extractedSeats : storedSeats);

      const ticketsFromState = Array.isArray(danhSachVe)
        ? danhSachVe
        : Array.isArray(successBookTicketTicketMessage?.danhSachVe)
        ? successBookTicketTicketMessage.danhSachVe
        : Array.isArray(storedBooking?.danhSachVe)
        ? storedBooking.danhSachVe
        : Array.isArray(storedBooking?.booking?.danhSachVe)
        ? storedBooking.booking.danhSachVe
        : [];

      const normalisedTickets = (ticketsFromState || [])
        .filter(Boolean)
        .map((ticket) => {
          let parsed = ticket;
          if (typeof parsed === "string") {
            try {
              parsed = JSON.parse(parsed);
            } catch {
              parsed = { tenDayDu: ticket };
            }
          }
          return {
            maGhe: parsed?.maGhe,
            tenDayDu: parsed?.tenDayDu || parsed?.maGhe || "",
            giaVe:
              parsed?.giaVe !== undefined && parsed?.giaVe !== null
                ? Number(parsed.giaVe)
                : null,
          };
        })
        .filter((ticket) => ticket.tenDayDu);

      if (normalisedTickets.length) {
        const basePrice =
          normalisedTickets.some((ticket) => ticket.giaVe == null) &&
          normalisedTickets.length
            ? Math.round((vietQrTotal || 0) / normalisedTickets.length || 0)
            : null;
        const remainder =
          basePrice && normalisedTickets.length
            ? (vietQrTotal || 0) - basePrice * normalisedTickets.length
            : 0;
        setTicketsForInvoice(
          normalisedTickets.map((ticket, index) => ({
            ...ticket,
            giaVe:
              ticket.giaVe != null
                ? ticket.giaVe
                : basePrice + (index === normalisedTickets.length - 1 ? remainder : 0),
          }))
        );
      } else {
        setTicketsForInvoice([]);
      }

      const fallbackOrderId =
        queryOrderId ||
        successBookTicketTicketMessage?.orderId ||
        successBookTicketTicketMessage?.maGiaoDich ||
        storedBooking?.orderId ||
        storedBooking?.booking?.orderId ||
        (typeof window !== "undefined" ? sessionStorage.getItem(VIETQR_ORDER_KEY) : null) ||
        (maLichChieu && taiKhoanNguoiDung
          ? `CINEMA-${maLichChieu}-${taiKhoanNguoiDung}`
          : "");
      setOrderCode(fallbackOrderId || "");

      const persistedIssuedAt = storedBooking?.savedAt
        ? new Date(storedBooking.savedAt)
        : null;
      setIssuedAt(
        persistedIssuedAt && !Number.isNaN(persistedIssuedAt.getTime())
          ? persistedIssuedAt
          : new Date()
      );
    }
  }, [
    location.search,
    amount,
    listSeatSelected,
    danhSachVe,
    successBookTicketTicketMessage,
    maLichChieu,
    taiKhoanNguoiDung,
  ]);

  const cumRap = thongTinPhim?.tenCumRap || "";
  const [cumLeft, cumRight] = cumRap.split("-");

  // Trạng thái hiển thị:
  // - VNPay: ưu tiên theo vnp_TransactionStatus === "00"
  // - VietQR: dùng successBookTicketTicketMessage / errorBookTicketMessage
  const isSuccessVNPay = isVNPay ? vnpStatus === "00" : null;

  const canPrintInvoice = useMemo(() => {
    const hasSuccess = Boolean(
      successBookTicketTicketMessage ||
        isSuccessVNPay ||
        persistedBooking
    );
    return hasSuccess && ticketsForInvoice.length > 0;
  }, [successBookTicketTicketMessage, isSuccessVNPay, persistedBooking, ticketsForInvoice]);

  const formattedIssuedAt = useMemo(() => {
    if (!issuedAt) return "";
    try {
      return new Date(issuedAt).toLocaleString("vi-VN");
    } catch {
      return "";
    }
  }, [issuedAt]);

  const invoiceMethodLabel = useMemo(() => {
    if (isVNPay) return "VNPAY";
    const method =
      paymentMethod ||
      persistedBooking?.paymentMethod ||
      persistedBooking?.booking?.paymentMethod ||
      "VietQR";
    return method.toString().toUpperCase();
  }, [isVNPay, paymentMethod, persistedBooking]);

  const invoiceMethodDisplay = useMemo(() => {
    return invoiceMethodLabel?.toLowerCase?.() || "";
  }, [invoiceMethodLabel]);

  const invoiceHelperText = useMemo(() => {
    if (canPrintInvoice) {
      return "Hóa đơn sẽ mở trong cửa sổ in của trình duyệt.";
    }
    return "Không thể tạo hóa đơn tự động do thiếu dữ liệu vé. Vui lòng liên hệ hỗ trợ khi cần.";
  }, [canPrintInvoice]);

  const resolvedEmail = useMemo(() => {
    return (
      email ||
      currentUser?.email ||
      persistedBooking?.email ||
      persistedBooking?.booking?.email ||
      ""
    );
  }, [email, currentUser, persistedBooking]);

  const resolvedPhone = useMemo(() => {
    return (
      currentUser?.soDt ||
      phone ||
      persistedBooking?.phone ||
      persistedBooking?.booking?.phone ||
      ""
    );
  }, [currentUser, phone, persistedBooking]);

  const resolvedPaymentMethodDisplay = useMemo(() => {
    if (isVNPay) return "vnpay";
    return (
      invoiceMethodDisplay ||
      paymentMethod ||
      persistedBooking?.paymentMethod ||
      persistedBooking?.booking?.paymentMethod ||
      "vietqr"
    ).toString();
  }, [isVNPay, invoiceMethodDisplay, paymentMethod, persistedBooking]);

  const isVietQrFlow = useMemo(() => {
    if (isVNPay) return false;
    const currentMethod = (resolvedPaymentMethodDisplay || "").toString().toLowerCase();
    const persistedMethod = (
      persistedBooking?.paymentMethod ||
      persistedBooking?.booking?.paymentMethod ||
      ""
    )
      .toString()
      .toLowerCase();
    return currentMethod === "vietqr" || persistedMethod === "vietqr";
  }, [isVNPay, resolvedPaymentMethodDisplay, persistedBooking]);

  useEffect(() => {
    if (!successBookTicketTicketMessage) return;
    if (isVNPay) return;
    if (typeof window === "undefined") return;

    const fallbackOrderId =
      orderCode ||
      successBookTicketTicketMessage?.orderId ||
      successBookTicketTicketMessage?.maGiaoDich ||
      (typeof window !== "undefined" ? sessionStorage.getItem(VIETQR_ORDER_KEY) : null) ||
      (maLichChieu && taiKhoanNguoiDung
        ? `CINEMA-${maLichChieu}-${taiKhoanNguoiDung}`
        : "");

    const payload = {
      orderId: fallbackOrderId || "",
      booking: successBookTicketTicketMessage,
      amount: Number(total || amount || 0),
      email: resolvedEmail,
      phone: resolvedPhone,
      paymentMethod: resolvedPaymentMethodDisplay,
      seats:
        Array.isArray(listSeatSelected) && listSeatSelected.length
          ? listSeatSelected
          : ghe,
      danhSachVe: Array.isArray(successBookTicketTicketMessage?.danhSachVe)
        ? successBookTicketTicketMessage.danhSachVe
        : danhSachVe,
      maLichChieu,
      taiKhoanNguoiDung,
      thongTinPhim,
      savedAt: new Date().toISOString(),
      vietQr: vietQrInfo || persistedBooking?.vietQr || null,

    };

    try {
      sessionStorage.setItem(VIETQR_BOOKING_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error("Failed to persist VietQR booking summary", err);
    }
  }, [
    successBookTicketTicketMessage,
    isVNPay,
    orderCode,
    total,
    amount,
    resolvedEmail,
    resolvedPhone,
    resolvedPaymentMethodDisplay,
    listSeatSelected,
    ghe,
    danhSachVe,
    maLichChieu,
    taiKhoanNguoiDung,
    thongTinPhim,
    vietQrInfo,
    persistedBooking,
  ]);

  const handleCopy = useCallback((field, value) => {
    if (!value) {
      return;
    }

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


  const handleInvoiceClick = useCallback(() => {
    if (!canPrintInvoice) return;
    handlePrintInvoice();
  }, [canPrintInvoice, handlePrintInvoice]);

  return (
    <div className={classes.resultBookTicket}>
      <div className={classes.infoTicked}>
        <div className={classes.infoTicked__img} />
        <div className={classes.infoTicked__txt}>
          <p className={classes.tenPhim}>{thongTinPhim?.tenPhim}</p>
          <p className={classes.text__first}>
            <span>{cumLeft || ""}</span>
            {cumRight ? (
              <span className={classes.text__second}>-{cumRight}</span>
            ) : null}
          </p>
          <p className={classes.diaChi}>{thongTinPhim?.diaChi}</p>
          <table className={classes.table}>
            <tbody>
              <tr>
                <td valign="top">Suất chiếu:</td>
                <td valign="top">
                  {`${thongTinPhim?.gioChieu || ""} ${
                    thongTinPhim?.ngayChieu || ""
                  }`}
                </td>
              </tr>
              <tr>
                <td valign="top">Phòng:</td>
                <td>{thongTinPhim?.tenRap}</td>
              </tr>
              <tr>
                <td valign="top">Ghế:</td>
                <td>{(ghe || []).join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
         {isVietQrFlow && (
        <div className={classes.vietQrSection}>
          {vietQrInfo?.qrImageUrl ? (
            <>
              <img
                src={vietQrInfo.qrImageUrl}
                alt="Mã VietQR"
                className={classes.vietQrImage}
              />
              <div className={classes.vietQrDetails}>
                <h3 className={classes.vietQrHeading}>Thanh toán VietQR</h3>
                <div className={classes.vietQrRow}>
                  <span className={classes.vietQrLabel}>Ngân hàng</span>
                  <span className={classes.vietQrValue}>{vietQrInfo.bankBin || vietQrInfo.bankName || ""}</span>
                </div>
                <div className={classes.vietQrRow}>
                  <span className={classes.vietQrLabel}>Số tài khoản</span>
                  <span className={classes.vietQrValue}>{vietQrInfo.accountNo || ""}</span>
                  <button
                    type="button"
                    className={classes.vietQrCopyButton}
                    onClick={() => handleCopy('account', vietQrInfo.accountNo)}
                  >
                    Sao chép
                  </button>
                </div>
                <div className={classes.vietQrRow}>
                  <span className={classes.vietQrLabel}>Chủ tài khoản</span>
                  <span className={classes.vietQrValue}>{vietQrInfo.accountName || ""}</span>
                </div>
                <div className={classes.vietQrRow}>
                  <span className={classes.vietQrLabel}>Số tiền</span>
                  <span className={classes.vietQrValue}>{`${Number(vietQrInfo.amount || total || 0).toLocaleString('vi-VI')} đ`}</span>
                  <button
                    type="button"
                    className={classes.vietQrCopyButton}
                    onClick={() => handleCopy('amount', String(vietQrInfo.amount || total || 0))}
                  >
                    Sao chép
                  </button>
                </div>
                <div className={classes.vietQrRow}>
                  <span className={classes.vietQrLabel}>Nội dung</span>
                  <span className={classes.vietQrValue}>{vietQrInfo.addInfo || orderCode}</span>
                  <button
                    type="button"
                    className={classes.vietQrCopyButton}
                    onClick={() => handleCopy('addInfo', vietQrInfo.addInfo || orderCode)}
                  >
                    Sao chép
                  </button>
                </div>
                {vietQrInfo.deeplink && (
                  <a
                    className={classes.vietQrDeeplinkButton}
                    href={vietQrInfo.deeplink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mở app ngân hàng
                  </a>
                )}
                <p className={classes.vietQrNote}>
                  Nội dung chuyển khoản cần chứa mã đơn <b>{orderCode}</b> để hệ thống tự động xác nhận.
                </p>
                {copiedField && copiedField !== 'error' && (
                  <p className={classes.vietQrCopyMessage}>Đã sao chép!</p>
                )}
                {copiedField === 'error' && (
                  <p className={classes.vietQrCopyError}>Không thể sao chép. Vui lòng thử lại.</p>
                )}
              </div>
            </>
          ) : (
            <p className={classes.vietQrFallback}>Không tìm thấy thông tin VietQR. Vui lòng kiểm tra lịch sử đặt vé hoặc liên hệ hỗ trợ.</p>
          )}
        </div>
      )}

        <div>
          <h3 className={classes.infoResult_label}>Thông tin đặt vé</h3>
          <table className={`${classes.table} table`}>
            <tbody>
              <tr>
                <td valign="top">Họ tên:</td>
                <td>{currentUser?.hoTen}</td>
              </tr>
              <tr>
                <td valign="top">Điện thoại:</td>
                <td valign="top">{resolvedPhone}</td>
              </tr>
              <tr>
                <td valign="top">Email:</td>
                <td>{resolvedEmail}</td>
              </tr>
              <tr>
                <td valign="top">Phương thức:</td>
                <td>
                  <span className={classes.paymentColor}>
                    {resolvedPaymentMethodDisplay}
                  </span>
                </td>
              </tr>
              {orderCode && (
                <tr>
                  <td valign="top">Mã giao dịch:</td>
                  <td>{orderCode}</td>
                </tr>
              )}
              <tr>
                <td valign="top">Trạng thái:</td>
                <td>
                  {isVNPay ? (
                    isSuccessVNPay ? (
                      <span>
                        Đặt vé thành công qua{" "}
                        <span className={classes.paymentColor}>vnpay</span>
                      </span>
                    ) : (
                      <span>
                        Đặt vé thất bại:{" "}
                        <span className={classes.errorColor}>
                          Giao dịch không thành công
                        </span>
                      </span>
                    )
                  ) : (
                    <>
                      {successBookTicketTicketMessage && (
                        <span>
                          Đặt vé thành công qua{" "}
                          <span className={classes.paymentColor}>
                            {resolvedPaymentMethodDisplay}
                          </span>
                        </span>
                      )}
                      {errorBookTicketMessage && (
                        <span>
                          Đặt vé thất bại:{" "}
                          <span className={classes.errorColor}>
                            {errorBookTicketMessage}
                          </span>
                        </span>
                      )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td valign="top">Tổng tiền:</td>
                <td valign="top">
                  <span>{`${Number(total || 0).toLocaleString("vi-VI")} đ`}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {(successBookTicketTicketMessage || isSuccessVNPay) && (
            <>
              <div className={classes.invoiceActions}>
                <button
                  type="button"
                  onClick={handleInvoiceClick}
                  className={classes.invoiceButton}
                  disabled={!canPrintInvoice}
                >
                  In hóa đơn
                </button>
                <span className={classes.invoiceHint}>{invoiceHelperText}</span>
              </div>
              <p className={classes.noteresult}>
                Kiểm tra lại vé đã mua trong thông tin tài khoản của bạn!
              </p>
            </>
          )}
        </div>
      </div>

      <div className={classes.invoicePrintRoot}>
        <div ref={invoiceRef} className={classes.invoicePaper}>
          <div className={classes.invoiceHeader}>
            <h2 className={classes.invoiceHeaderTitle}>Hóa đơn vé xem phim</h2>
            <p>Đơn vị phát hành: Cinema Ticket</p>
          </div>
          <div className={classes.invoiceMeta}>
            <div className={classes.invoiceMetaRow}>
              <span>
                <strong>Khách hàng:</strong> {currentUser?.hoTen || ""}
              </span>
              <span>
                <strong>Mã giao dịch:</strong> {orderCode || "N/A"}
              </span>
            </div>
            <div className={classes.invoiceMetaRow}>
              <span>
                <strong>Tài khoản:</strong> {currentUser?.taiKhoan || taiKhoanNguoiDung || ""}
              </span>
              <span>
                <strong>Ngày lập:</strong> {formattedIssuedAt || ""}
              </span>
            </div>
            <div className={classes.invoiceMetaRow}>
              <span>
                <strong>Email:</strong> {resolvedEmail}
              </span>
              <span>
                <strong>Điện thoại:</strong> {resolvedPhone}
              </span>
            </div>
            <div className={classes.invoiceMetaRow}>
              <span>
                <strong>Phương thức:</strong> {invoiceMethodLabel}
              </span>
              <span>
                <strong>Mã lịch chiếu:</strong> {maLichChieu || ""}
              </span>
            </div>
          </div>
          <div className={classes.invoiceMeta}>
            <div className={classes.invoiceMetaRow}>
              <span>
                <strong>Phim:</strong> {thongTinPhim?.tenPhim || ""}
              </span>
              <span>
                <strong>Rạp:</strong> {thongTinPhim?.tenCumRap || ""}
              </span>
            </div>
            <div className={classes.invoiceMetaRow}>
              <span>
                <strong>Phòng chiếu:</strong> {thongTinPhim?.tenRap || ""}
              </span>
              <span>
                <strong>Suất chiếu:</strong> {`${thongTinPhim?.gioChieu || ""} ${
                  thongTinPhim?.ngayChieu || ""
                }`}
              </span>
            </div>
          </div>
          <table className={classes.invoiceTable}>
            <thead>
              <tr>
                <th className={classes.invoiceTableHeadCell}>#</th>
                <th className={classes.invoiceTableHeadCell}>Ghế</th>
                <th className={classes.invoiceTableHeadCell}>Mã ghế</th>
                <th
                  className={classes.invoiceTableHeadCell}
                  style={{ textAlign: "right" }}
                >
                  Giá vé
                </th>
              </tr>
            </thead>
            <tbody>
              {ticketsForInvoice.map((ticket, index) => (
                <tr key={`${ticket.maGhe || ticket.tenDayDu}-${index}`}>
                  <td className={classes.invoiceTableCell}>{index + 1}</td>
                  <td className={classes.invoiceTableCell}>{ticket.tenDayDu}</td>
                  <td className={classes.invoiceTableCell}>{ticket.maGhe || ""}</td>
                  <td
                    className={classes.invoiceTableCell}
                    style={{ textAlign: "right" }}
                  >
                    {`${Number(ticket.giaVe || 0).toLocaleString("vi-VI")} đ`}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className={classes.invoiceTableTotal} colSpan={3}>
                  Tổng cộng
                </td>
                <td className={classes.invoiceTableTotal}>
                  {`${Number(total || 0).toLocaleString("vi-VI")} đ`}
                </td>
              </tr>
            </tfoot>
          </table>
          <div className={classes.invoiceFooter}>
            <p>
              Quý khách vui lòng giữ hóa đơn để được hỗ trợ đổi trả hoặc đối soát
              giao dịch khi cần.
            </p>
            <p>Xin cảm ơn và chúc quý khách có trải nghiệm xem phim vui vẻ!</p>
          </div>
        </div>
      </div>
    </div>
  );
}