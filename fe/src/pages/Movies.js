import { useEffect, useState } from 'react';
import api from '../lib/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

export default function Movies() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/api/movies', { params: { q } });
        if (mounted) setRows(data);
      } catch { setRows([]); }
    })();
    return () => (mounted = false);
  }, [q]);

  return (
    <div className="flex flex-column gap-3">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Tìm phim..." value={q} onChange={e => setQ(e.target.value)} />
      </span>
      <DataTable value={rows} size="small" tableStyle={{ minWidth: 600 }}>
        <Column field="id" header="ID" style={{ width: '6rem' }} />
        <Column field="title" header="Tên phim" />
        <Column field="durationMin" header="Thời lượng" />
      </DataTable>
    </div>
  );
}
