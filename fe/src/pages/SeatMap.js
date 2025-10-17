import { useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/api/showtimes/${showtimeId}`);
        if (mounted) setData(data);
      } catch {
        alert('Không tải được sơ đồ ghế'); nav('/showtimes');
      }
    })();
    return () => (mounted = false);
  }, [showtimeId, nav]);

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
    if (ss.status === 'Sold' || ss.status === 'Locked') return;
    const code = ss.seat.code;
    setSelectedCodes(s => s.includes(code) ? s.filter(x => x !== code) : [...s, code]);
  };

  const doLockAndBook = async () => {
    if (!data) return;
    const seatIds = data.seats.filter(ss => selectedCodes.includes(ss.seat.code)).map(ss => ss.seatId);
    const showtimeSeatIds = data.seats.filter(ss => selectedCodes.includes(ss.seat.code)).map(ss => ss.id);
    if (seatIds.length === 0) { alert('Chưa chọn ghế'); return; }

    try {
      setLoading(true);
      await api.post('/api/showtimes/lock-seats', { showtimeId: parseInt(showtimeId, 10), seatIds, lockSeconds: 300 });
      const parsedUserId = Number.parseInt(profile?.uid, 10);
            const bookingPayload = {
              showtimeId: parseInt(showtimeId, 10),
              showtimeSeatIds
            };
            if (Number.isInteger(parsedUserId) && parsedUserId > 0) {
              bookingPayload.userId = parsedUserId;
            }
      const { data: booking } = await api.post('/api/bookings', bookingPayload);      
      alert(`Đặt vé thành công: ${booking.orderCode} - Tổng ${booking.amount}`);
      nav('/showtimes');
    } catch (e) {
      alert(e.response?.data?.message ?? 'Không giữ được ghế/đặt vé'); const payload = e.response?.data;
      const validation = payload?.errors
        ? Object.values(payload.errors).flat().join('\n')
        : null;
      alert(validation || payload?.message || 'Không giữ được ghế/đặt vé');
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
