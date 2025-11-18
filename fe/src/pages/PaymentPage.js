// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../lib/api";
import VietQrClient from "../components/VietQrClient";

export default function PaymentPage() {
  const location = useLocation();
  const state = location.state || {};
  const query = new URLSearchParams(location.search || "");

  // bookingId may come from location.state.bookingId or query bookingId
  const bookingId = state.bookingId || query.get("bookingId");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!bookingId) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/bookings/${bookingId}`);
        if (!mounted) return;
        setBooking(data);
      } catch (err) {
        console.error(err);
        setError("Không lấy được thông tin booking");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [bookingId]);

  // If booking fetched, feed amount & orderRef. Otherwise allow manual input in VietQrClient.
  const amount = booking?.amount ?? booking?.total ?? booking?.price ?? "";
  const orderRef = booking?.orderCode ?? booking?.orderNo ?? booking?.id ?? "";

  return (
    <div style={{ padding: 20 }}>
      <h2>Thanh toán</h2>

      {bookingId && <p>Booking ID: <strong>{bookingId}</strong></p>}
      {loading && <p>Đang tải chi tiết booking...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <VietQrClient
        defaultAmount={String(amount)}
        defaultOrderRef={String(orderRef)}
        defaultName={booking?.customerName ?? "CINEMA CO"}
        defaultCity={booking?.city ?? "HANOI"}
      />
    </div>
  );
}
