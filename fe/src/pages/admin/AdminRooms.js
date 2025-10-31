import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../lib/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

export default function AdminRooms() {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ id: 0, name: '', cinemaId: null, seatCount: 0 });

  const cinemaOptions = useMemo(
    () => cinemas.map((c) => ({ label: c.name, value: c.id })),
    [cinemas]
  );

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get('/api/admin/cinemas');
      setCinemas(data);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (cinemas.length && !selectedCinemaId) setSelectedCinemaId(cinemas[0].id);
  }, [cinemas, selectedCinemaId]);

  const loadRooms = useCallback(async (cinemaId) => {
    if (!cinemaId) { setRooms([]); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/rooms', { params: { cinemaId } });
      setRooms(data);
    } catch (err) {
      if (err?.response?.status === 404) setRooms([]);
      else throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms(selectedCinemaId);
  }, [selectedCinemaId, loadRooms]);

  const openAdd = () => {
    if (!selectedCinemaId) { alert('Chọn rạp trước khi thêm phòng.'); return; }
    setForm({ id: 0, name: '', cinemaId: selectedCinemaId, seatCount: 0 });
    setVisible(true);
  };

  const openEdit = (room) => {
    setForm({ id: room.id, name: room.name, cinemaId: room.cinemaId, seatCount: room.seatCount ?? 0 });
    setVisible(true);
  };

  const remove = (room) => {
    confirmDialog({
      message: `Xoá phòng "${room.name}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await api.delete(`/api/admin/rooms/${room.id}`);
          loadRooms(selectedCinemaId);
        } catch (err) {
          alert(err?.response?.data ?? 'Xoá phòng thất bại.');
        }
      },
    });
  };

  const save = async () => {
    if (!form.name.trim()) { alert('Nhập tên phòng.'); return; }
    if (!form.cinemaId) { alert('Chọn rạp.'); return; }
    if (
      form.seatCount == null ||
      Number.isNaN(form.seatCount) ||
      form.seatCount < 0 ||
      !Number.isInteger(form.seatCount)
    ) {
      alert('Nhập số ghế hợp lệ.');
      return;
    }

    const payload = { name: form.name, cinemaId: form.cinemaId, seatCount: form.seatCount };
    try {
      if (form.id > 0) await api.put(`/api/admin/rooms/${form.id}`, payload);
      else await api.post('/api/admin/rooms', payload);

      setVisible(false);
      loadRooms(form.cinemaId);
      if (form.cinemaId !== selectedCinemaId) setSelectedCinemaId(form.cinemaId);
    } catch (err) {
      alert(err?.response?.data ?? 'Lưu phòng thất bại.');
    }
  };

  return (
    <div className="flex flex-column gap-3">
      <ConfirmDialog />
      <div className="flex justify-content-between align-items-center flex-wrap gap-2">
        <h3 className="m-0">Quản lý Phòng chiếu</h3>
        <div className="flex align-items-center gap-2">
          <Dropdown
            value={selectedCinemaId}
            options={cinemaOptions}
            onChange={(e) => setSelectedCinemaId(e.value)}
            placeholder="Chọn rạp"
            className="w-16rem"
            showClear={cinemas.length > 0}
          />
          <Button label="Thêm phòng" icon="pi pi-plus" onClick={openAdd} disabled={!selectedCinemaId} />
        </div>
      </div>

      <DataTable value={rooms} size="small" loading={loading} emptyMessage="Chưa có phòng" tableStyle={{ minWidth: 700 }}>
        <Column field="id" header="ID" style={{ width: '6rem' }} />
        <Column field="name" header="Tên phòng" />
        <Column field="seatCount" header="Số ghế" style={{ width: '8rem' }} />
        <Column field="showtimeCount" header="Suất chiếu" style={{ width: '8rem' }} />
        <Column
          header="Thao tác"
          style={{ width: '10rem' }}
          body={(room) => (
            <div className="flex gap-2">
              <Button icon="pi pi-pencil" rounded text onClick={() => openEdit(room)} />
              <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => remove(room)} />
            </div>
          )}
        />
      </DataTable>

      <Dialog header={form.id ? 'Sửa phòng' : 'Thêm phòng'} visible={visible} onHide={() => setVisible(false)}>
        <div className="flex flex-column gap-3" style={{ width: 420 }}>
          <span className="p-float-label">
            <InputText id="room_name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full" />
            <label htmlFor="room_name">Tên phòng</label>
          </span>
          <span className="p-float-label">
            <Dropdown
              inputId="room_cinema"
              value={form.cinemaId}
              options={cinemaOptions}
              onChange={(e) => setForm({ ...form, cinemaId: e.value })}
              className="w-full"
              placeholder="Chọn rạp"
            />
            <label htmlFor="room_cinema">Thuộc rạp</label>
          </span>
          <span className="p-float-label">
            <InputNumber
              inputId="room_seatcount"
              value={form.seatCount}
              onValueChange={(e) => setForm({ ...form, seatCount: e.value ?? 0 })}
              className="w-full"
              placeholder="Số ghế"
              min={0}
              step={1}
              useGrouping={false}
            />
            <label htmlFor="room_seatcount">Số ghế</label>
          </span>
          <div className="flex justify-content-end gap-2">
            <Button label="Lưu" icon="pi pi-check" onClick={save} />
            <Button label="Huỷ" icon="pi pi-times" severity="secondary" onClick={() => setVisible(false)} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}