import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { InputTextarea } from 'primereact/inputtextarea';

export default function AdminShowtimes() {
  const [rows, setRows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleBulk, setVisibleBulk] = useState(false);
  const [form, setForm] = useState({ id: 0, movieId: null, cinemaId: null, roomId: null, startAt: new Date(), basePrice: 80000 });
  const [bulkText, setBulkText] = useState('');

  const load = async () => {
    const [{ data: sts }, { data: ms }, { data: cs }] = await Promise.all([
      api.get('/api/admin/showtimes'),
      api.get('/api/admin/lookups/movies'),
      api.get('/api/admin/lookups/cinemas')
    ]);
    setRows(sts);
    setMovies(ms.map(m => ({ label: `${m.title} (${m.durationMin}p)`, value: m.id, durationMin: m.durationMin })));
    setCinemas(cs.map(c => ({ label: c.name, value: c.id })));
  };

  const loadRooms = async (cinemaId) => {
    if (!cinemaId) { setRooms([]); return; }
    const { data } = await api.get('/api/admin/lookups/rooms', { params: { cinemaId } });
    setRooms(data.map(r => ({ label: r.name, value: r.id })));
  };

  useEffect(() => { load(); }, []);

  const add = () => {
    setForm({ id: 0, movieId: null, cinemaId: null, roomId: null, startAt: new Date(), basePrice: 80000 });
    setRooms([]);
    setVisible(true);
  };

  const edit = (r) => {
    setForm({
      id: r.id, movieId: r.movieId,
      cinemaId: null, roomId: r.roomId,
      startAt: new Date(r.startAt),
      basePrice: r.basePrice
    });
    setVisible(true);
  };

  const del = (r) => {
    confirmDialog({
      message: `Xoá suất chiếu của "${r.movieTitle}" (${r.cinemaName} - ${r.roomName})?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => { await api.delete(`/api/admin/showtimes/${r.id}`); load(); }
    });
  };

  const save = async () => {
    if (!form.movieId || !form.roomId || !form.startAt) { alert('Chọn phim/phòng/giờ bắt đầu.'); return; }
    const payload = {
      movieId: form.movieId,
      roomId: form.roomId,
      startAt: form.startAt,            // local VN, BE sẽ convert sang UTC
      basePrice: form.basePrice || 0
    };
    if (form.id > 0) await api.put(`/api/admin/showtimes/${form.id}`, payload);
    else await api.post('/api/admin/showtimes', payload);
    setVisible(false); load();
  };

  // ===== Bulk: nhập nhiều dòng "movieId,roomId,YYYY-MM-DD HH:mm,price"
  const openBulk = () => {
    setBulkText(
`1,3,2025-10-08 10:00,80000
1,3,2025-10-08 13:00,80000
2,5,2025-10-08 19:30,90000`);
    setVisibleBulk(true);
  };

  const doBulk = async () => {
    const items = [];
    const lines = bulkText.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    for (const line of lines) {
      // movieId,roomId,YYYY-MM-DD HH:mm,price
      const m = line.split(',').map(s => s.trim());
      if (m.length < 4) continue;
      const movieId = parseInt(m[0], 10);
      const roomId = parseInt(m[1], 10);
      const startAt = m[2].replace(' ', 'T') + ':00'; // to "YYYY-MM-DDTHH:mm:00"
      const basePrice = parseInt(m[3], 10) || 0;
      if (Number.isFinite(movieId) && Number.isFinite(roomId)) {
        items.push({ movieId, roomId, startAt, basePrice });
      }
    }
    if (items.length === 0) { alert('Không có dòng hợp lệ.'); return; }

    const { data } = await api.post('/api/admin/showtimes/bulk', {
      treatAsLocalAsiaBangkok: true,
      items
    });
    // Bạn có thể hiện toast thống kê: data.createdCount, data.skippedCount
    setVisibleBulk(false);
    await load();
  };

  return (
    <div className="flex flex-column gap-3">
      <ConfirmDialog />
      <div className="flex justify-content-between align-items-center">
        <h3>Quản lý Suất chiếu</h3>
        <div className="flex gap-2">
          <Button label="Thêm nhiều" icon="pi pi-list-plus" onClick={openBulk} />
          <Button label="Thêm" icon="pi pi-plus" onClick={add} />
        </div>
      </div>

      <DataTable value={rows} size="small" tableStyle={{ minWidth: 900 }}>
        <Column field="id" header="ID" style={{ width: '6rem' }} />
        <Column field="movieTitle" header="Phim" />
        <Column field="cinemaName" header="Rạp" />
        <Column field="roomName" header="Phòng" />
        <Column field="startAt" header="Bắt đầu" body={(r) => new Date(r.startAt).toLocaleString()} />
        <Column field="basePrice" header="Giá" body={(r) => r.basePrice?.toLocaleString('vi-VN')} />
        <Column header="Ghế" body={(r) => (
          <div className="flex gap-2">
            <Tag value={`Tổng ${r.seatsTotal}`} />
            <Tag severity="success" value={`Đã đặt ${r.seatsBooked}`} />
          </div>
        )} />
        <Column header="Thao tác" style={{ width: '10rem' }} body={(r) => (
          <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text onClick={() => edit(r)} />
            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => del(r)} />
          </div>
        )} />
      </DataTable>

      {/* Dialog đơn lẻ */}
      <Dialog header={form.id ? 'Sửa suất chiếu' : 'Thêm suất chiếu'} visible={visible} onHide={() => setVisible(false)}>
        <div className="flex flex-column gap-3" style={{ width: 420 }}>
          <div className="p-float-label">
            <Dropdown id="movie" className="w-full" options={movies} value={form.movieId}
              onChange={(e) => setForm({ ...form, movieId: e.value })} />
            <label htmlFor="movie">Phim</label>
          </div>

          <div className="p-float-label">
            <Dropdown id="cinema" className="w-full" options={cinemas} value={form.cinemaId}
              onChange={async (e) => { setForm({ ...form, cinemaId: e.value, roomId: null }); await loadRooms(e.value); }} />
            <label htmlFor="cinema">Rạp</label>
          </div>

          <div className="p-float-label">
            <Dropdown id="room" className="w-full" options={rooms} value={form.roomId}
              onChange={(e) => setForm({ ...form, roomId: e.value })} />
            <label htmlFor="room">Phòng</label>
          </div>

          <div className="p-float-label">
            <Calendar id="start" className="w-full" value={form.startAt}
              onChange={(e) => setForm({ ...form, startAt: e.value })} showIcon showTime hourFormat="24" />
            <label htmlFor="start">Bắt đầu (giờ VN)</label>
          </div>

          <div className="p-float-label">
            <InputNumber id="price" className="w-full" value={form.basePrice}
              onValueChange={(e) => setForm({ ...form, basePrice: e.value || 0 })}
              mode="currency" currency="VND" locale="vi-VN" />
            <label htmlFor="price">Giá cơ bản</label>
          </div>

          <div className="flex justify-content-end gap-2">
            <Button label="Lưu" icon="pi pi-check" onClick={save} />
            <Button label="Huỷ" icon="pi pi-times" severity="secondary" onClick={() => setVisible(false)} />
          </div>
        </div>
      </Dialog>

      {/* Dialog Bulk */}
      <Dialog header="Thêm nhiều suất chiếu" visible={visibleBulk} onHide={() => setVisibleBulk(false)}>
        <div className="flex flex-column gap-3" style={{ width: 520 }}>
          <div>Nhập mỗi dòng: <code>movieId,roomId,YYYY-MM-DD HH:mm,price</code> (giờ VN)</div>
          <InputTextarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={10} className="w-full" />
          <div className="flex justify-content-end gap-2">
            <Button label="Tạo" icon="pi pi-check" onClick={doBulk} />
            <Button label="Đóng" icon="pi pi-times" severity="secondary" onClick={() => setVisibleBulk(false)} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
