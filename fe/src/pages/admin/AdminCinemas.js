import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function AdminCinemas() {
  const [rows, setRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ id: 0, name: '', address: '' });

  const load = async () => {
    const { data } = await api.get('/api/admin/cinemas');
    setRows(data);
  };
  useEffect(() => { load(); }, []);

  const add = () => { setForm({ id: 0, name: '', address: '' }); setVisible(true); };
  const edit = (r) => { setForm(r); setVisible(true); };
  const del = (r) => {
    confirmDialog({
      message: `Xoá rạp "${r.name}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => { await api.delete(`/api/admin/cinemas/${r.id}`); load(); }
    });
  };
  const save = async () => {
    if (!form.name.trim()) { alert('Nhập tên rạp'); return; }
    if (form.id > 0) await api.put(`/api/admin/cinemas/${form.id}`, { name: form.name, address: form.address });
    else await api.post('/api/admin/cinemas', { name: form.name, address: form.address });
    setVisible(false); load();
  };

  return (
    <div className="flex flex-column gap-3">
      <ConfirmDialog />
      <div className="flex justify-content-between align-items-center">
        <h3>Quản lý Rạp</h3>
        <Button label="Thêm" icon="pi pi-plus" onClick={add} />
      </div>

      <DataTable value={rows} size="small" tableStyle={{ minWidth: 700 }}>
        <Column field="id" header="ID" style={{ width: '6rem' }} />
        <Column field="name" header="Tên rạp" />
        <Column field="address" header="Địa chỉ" />
        <Column header="Thao tác" style={{ width: '10rem' }} body={(r) => (
          <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text onClick={() => edit(r)} />
            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => del(r)} />
          </div>
        )} />
      </DataTable>

      <Dialog header={form.id ? 'Sửa rạp' : 'Thêm rạp'} visible={visible} onHide={() => setVisible(false)}>
        <div className="flex flex-column gap-3" style={{ width: 420 }}>
          <span className="p-float-label">
            <InputText id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full" />
            <label htmlFor="name">Tên rạp</label>
          </span>
          <span className="p-float-label">
            <InputText id="addr" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full" />
            <label htmlFor="addr">Địa chỉ</label>
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
