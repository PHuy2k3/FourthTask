import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const roles = [{ label: 'User', value: 'User' }, { label: 'Admin', value: 'Admin' }];

  const load = async () => {
    const { data } = await api.get('/api/admin/users');
    setRows(data);
  };
  useEffect(() => { load(); }, []);

  const roleBody = (r) => <Tag value={r.role} severity={r.role === 'Admin' ? 'warning' : 'info'} />;

  const roleEditor = (options) => (
    <Dropdown value={options.value} options={roles} onChange={(e) => options.editorCallback(e.value)} />
  );

  const onRowEditComplete = async (e) => {
    const user = e.newData;
    await api.put(`/api/admin/users/${user.id}/role`, { role: user.role });
    load();
  };

  return (
    <div>
      <h3>Quản lý Người dùng</h3>
      <DataTable value={rows} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: 700 }}>
        <Column field="id" header="ID" style={{ width: '6rem' }} />
        <Column field="email" header="Email" />
        <Column field="fullName" header="Họ tên" />
        <Column field="role" header="Quyền" body={roleBody} editor={roleEditor} />
        <Column rowEditor header="Sửa" style={{ width: '8rem' }} />
      </DataTable>
    </div>
  );
}
