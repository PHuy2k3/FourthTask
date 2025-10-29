import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAuth } from '../context/AuthContext';


export default function SeatMap() {
  const { showtimeId } = useParams();
  const nav = useNavigate();
  const { profile } = useAuth();
  const [data, setData] = useState(null);
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShowtime = useCallback(async () => {
    const { data } = await api.get(`/api/showtimes/${showtimeId}`);
    return data;
  }, [showtimeId]);

  const refreshShowtime = useCallback(async () => {
    const latest = await fetchShowtime();
    setData(latest);
    return latest;
  }, [fetchShowtime]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const latest = await fetchShowtime();
        if (mounted) setData(latest);
      } catch {
        alert('Không tải được sơ đồ ghế'); nav('/showtimes');
      }
    })();
    return () => (mounted = false);
  }, [fetchShowtime, nav]);

  const seatGrid = useMemo(() => {
    if (!data?.seats) return [];
    const map = new Map();
    for (const ss of data.seats) {
      const row = ss.seat.code[0];
      if (!map.has(row)) map.set(row, []);
      map.get(row).push(ss);
    }
    for (const [, arr] of map.entries()) {
      arr.sort((a, b) => parseInt(a.seat.code.slice(1)) - parseInt(b.seat.code.slice(1)));
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [data]);

  const toggle = (ss) => {
    if (ss.status !== 'Available') return;
    const code = ss.seat.code;
    setSelectedCodes(s => s.includes(code) ? s.filter(x => x !== code) : [...s, code]);
  };

  const ensureSelectionUpToDate = useCallback((latestSeats) => {
    const seatsArray = Array.isArray(latestSeats) ? latestSeats : [];
    const seatByCode = new Map(seatsArray.map(ss => [ss.seat.code, ss]));
    const seats = selectedCodes
      .map(code => seatByCode.get(code))
      .filter(Boolean);

    const availableSeats = seats.filter(ss => ss.status === 'Available');
    if (availableSeats.length !== selectedCodes.length) {
      setSelectedCodes(availableSeats.map(ss => ss.seat.code));
    }
    return availableSeats;
  }, [selectedCodes]);

  useEffect(() => {
    if (data?.seats) ensureSelectionUpToDate(data.seats);
  }, [data?.seats, ensureSelectionUpToDate]);

  const doLockAndBook = async () => {
    if (!data) return;
    if (selectedCodes.length === 0) { alert('Chưa chọn ghế'); return; }

    setLoading(true);
    const parsedShowtimeId = parseInt(showtimeId, 10);

    let showtimeSeatIds = [];

    try {
      const latest = await refreshShowtime();
      const selectedSeats = ensureSelectionUpToDate(latest?.seats ?? []);
      if (selectedSeats.length === 0) {
        alert('Một hoặc nhiều ghế không còn khả dụng. Vui lòng chọn lại.');
        return;
      }

      showtimeSeatIds = [...new Set(selectedSeats.map(ss => ss.id))];
      const seatIds = [...new Set(selectedSeats.map(ss => ss.seatId))];
      if (seatIds.length === 0 || showtimeSeatIds.length === 0) {
        alert('Không tìm thấy ghế hợp lệ. Vui lòng chọn lại.');
        return;
      }

      const lockRes = await api.post('/api/showtimes/lock-seats', {
        showtimeId: parsedShowtimeId,
        seatIds,
        lockSeconds: 300
      });

      if (lockRes?.data?.locked !== true) {
        throw new Error('LOCK_FAILED');
      }

      const parsedUserId = Number.parseInt(profile?.uid, 10);
      const bookingPayload = {
        showtimeId: parsedShowtimeId,
        showtimeSeatIds
      };
      if (Number.isInteger(parsedUserId) && parsedUserId > 0) {
        bookingPayload.userId = parsedUserId;
      }
      const { data: booking } = await api.post('/api/bookings', bookingPayload);
      alert(`Đặt vé thành công: ${booking.orderCode} - Tổng ${booking.amount}`);
      nav('/showtimes');
    } catch (e) {
      if (e?.message === 'LOCK_FAILED') {
        alert('Không thể giữ ghế. Vui lòng thử lại.');
      } else {
        if (e.response?.status === 409) {
          try {
            const latest = await refreshShowtime();
            const validSeats = ensureSelectionUpToDate(latest.seats ?? []);
            if (validSeats.length !== selectedCodes.length) {
              alert('Một hoặc nhiều ghế không còn khả dụng. Vui lòng chọn lại.');
            }
          } catch {
            // ignore refresh errors, primary error message shown below
          }
        }

        const payload = e.response?.data;
        const validation = payload?.errors
          ? Object.values(payload.errors).flat().join('\n')
          : null;

        const reasonLines = Array.isArray(payload?.reasons)
          ? payload.reasons
              .map((reason) => {
                const seatLabel = reason?.seatCode
                  || (typeof reason?.seatId === 'number' ? `Ghế ${reason.seatId}` : null)
                  || (typeof reason?.showtimeSeatId === 'number' ? `Ghế #${reason.showtimeSeatId}` : null);
                const detail = reason?.reasonMessage || reason?.status;
                if (!seatLabel && !detail) return null;
                if (!detail) return seatLabel;
                return seatLabel ? `${seatLabel}: ${detail}` : detail;
              })
              .filter(Boolean)
          : [];

        const baseMessage = validation
          || (typeof payload === 'string' ? payload : payload?.message)
          || 'Không giữ được ghế/đặt vé';

        const message = reasonLines.length > 0
          ? `${baseMessage}\n${reasonLines.join('\n')}`
          : baseMessage;

        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };


  if (!data) return null;
  return (
    <Card title={`Chọn ghế - ${data.movie?.title ?? ''} (${data.room?.name ?? ''})`}>
      <div className="flex flex-column gap-3">
        <div className="text-center mb-2">Màn hình</div>
        <div className="surface-200 h-2rem border-round mb-3"></div>

        {seatGrid.map(([row, arr]) => (
          <div key={row} className="flex gap-2 align-items-center">
            <div className="w-2rem text-right">{row}</div>
            <div className="flex gap-2 flex-wrap">
              {arr.map(ss => {
                const code = ss.seat.code;
                const isSel = selectedCodes.includes(code);
                const disabled = ss.status !== 'Available';
                return (
                  <Button key={ss.id}
                          label={code}
                          className={`p-button-sm ${isSel ? '' : 'p-button-outlined'}`}
                          disabled={disabled}
                          onClick={() => toggle(ss)} />
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex gap-2 mt-3">
          <Button label="Giữ & Đặt vé" icon="pi pi-shopping-cart" loading={loading} onClick={doLockAndBook} />
          <Button label="Quay lại" icon="pi pi-arrow-left" severity="secondary" onClick={() => nav('/showtimes')} />
        </div>
      </div>
    </Card>
  );
}
