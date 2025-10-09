import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; // <-- thêm

export default function AdminMovies() {
  const [rows, setRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ id: 0, title: '', durationMin: 120, genres: '' });

  const load = async () => {
    const { data } = await api.get('/api/admin/movies');
    setRows(data);
  };
  useEffect(() => { load(); }, []);

  const edit = (r) => { setForm(r); setVisible(true); };
  const add = () => { setForm({ id: 0, title: '', durationMin: 120, genres: '' }); setVisible(true); };

  const del = async (r) => {
    confirmDialog({
      message: `Xoá phim "${r.title}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xoá',
      rejectLabel: 'Huỷ',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await api.delete(`/api/admin/movies/${r.id}`);
        load();
      },
      reject: () => {}
    });
  };

  const save = async () => {
    if (!form.title) { /* dùng toast ở đây nếu muốn */ alert('Nhập tên phim'); return; }
    if (form.id > 0) await api.put(`/api/admin/movies/${form.id}`, form);
    else await api.post('/api/admin/movies', form);
    setVisible(false); load();
  };

  return (
    <div className="flex flex-column gap-2">
      {/* Hộp thoại confirm phải render trong cây JSX */}
      <ConfirmDialog />

      <div className="flex justify-content-between align-items-center">
        <h3>Quản lý Phim</h3>
        <Button label="Thêm" icon="pi pi-plus" onClick={add} />
      </div>

      <DataTable value={rows} size="small" tableStyle={{ minWidth: 700 }}>
        <Column field="id" header="ID" style={{ width: '6rem' }} />
        <Column field="title" header="Tên phim" />
        <Column field="durationMin" header="Thời lượng" />
        <Column field="genres" header="Thể loại" />
        <Column header="Thao tác" body={(r) => (
          <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text onClick={() => edit(r)} />
            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => del(r)} />
          </div>
        )} style={{ width: '10rem' }} />
      </DataTable>

      <Dialog header={form.id ? 'Sửa phim' : 'Thêm phim'} visible={visible} onHide={() => setVisible(false)}>
        <div className="flex flex-column gap-3" style={{ width: 400 }}>
          <span className="p-float-label">
            <InputText id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full" />
            <label htmlFor="title">Tên phim</label>
          </span>
          <span className="p-float-label">
            <InputNumber id="duration" value={form.durationMin} onValueChange={(e) => setForm({ ...form, durationMin: e.value || 0 })} className="w-full" />
            <label htmlFor="duration">Thời lượng (phút)</label>
          </span>
          <span className="p-float-label">
            <InputText id="genres" value={form.genres} onChange={e => setForm({ ...form, genres: e.target.value })} className="w-full" />
            <label htmlFor="genres">Thể loại</label>
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
