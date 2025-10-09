import { useEffect, useState } from 'react';
import api from '../lib/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function Showtimes() {
  const [date, setDate] = useState(new Date());
  const [rows, setRows] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const d = dayjs(date).format('YYYY-MM-DD');
      try {
        const { data } = await api.get('/api/showtimes', { params: { date: d } });
        if (mounted) setRows(data);
      } catch {
        setRows([]);
      }
    })();
    return () => (mounted = false);
  }, [date]);

  return (
    <div className="flex flex-column gap-3">
      <div className="flex align-items-center gap-2">
        <span>Ngày:</span>
        <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" />
      </div>

      <DataTable value={rows} size="small" tableStyle={{ minWidth: 700 }}>
        <Column field="id" header="ID" style={{ width: '6rem' }} />
        <Column field="movie.title" header="Phim" />
        <Column field="room.name" header="Phòng" />
        <Column field="room.cinema.name" header="Rạp" />
        <Column header="Giờ" body={(r) => dayjs(r.startAt).format('HH:mm DD/MM')} />
        <Column header="Ghế" body={(r) =>
          <Button label="Chọn ghế" icon="pi pi-th-large" onClick={() => nav(`/seatmap/${r.id}`)} />
        } style={{ width: '12rem' }} />
      </DataTable>
    </div>
  );
}
