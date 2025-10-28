import { useEffect, useMemo, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import api from '../../lib/api';

const STATUS_OPTIONS = [
  { label: 'Chờ duyệt', value: 'Pending' },
  { label: 'Đã duyệt', value: 'Paid' },
  { label: 'Đã huỷ', value: 'Canceled' }
];

export default function AdminBookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Pending');

  const load = async () => {
    setLoading(true);
    try {
      const params = status ? { status } : undefined;
      const { data } = await api.get('/api/admin/bookings', { params });
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const approve = async (booking) => {
    await api.post(`/api/admin/bookings/${booking.id}/approve`);
    load();
  };

  const reject = (booking) => {
    confirmDialog({
      message: `Huỷ vé ${booking.orderCode}?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Huỷ vé',
      rejectLabel: 'Đóng',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await api.post(`/api/admin/bookings/${booking.id}/reject`);
        load();
      }
    });
  };

  const statusLabel = useMemo(() => Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s.label])), []);

  return (
    <div className="flex flex-column gap-3">
      <ConfirmDialog />

      <div className="flex justify-content-between align-items-center flex-wrap gap-2">
        <h3 className="m-0">Duyệt vé của người dùng</h3>
        <Dropdown
          value={status}
          options={[{ label: 'Tất cả', value: '' }, ...STATUS_OPTIONS]}
          onChange={(e) => setStatus(e.value)}
          placeholder="Chọn trạng thái"
        />
      </div>

      <DataTable value={rows} loading={loading} size="small" tableStyle={{ minWidth: 900 }}>
        <Column field="id" header="ID" style={{ width: '6rem' }} />
        <Column
          header="Người dùng"
          body={(r) => (
            <div className="flex flex-column">
              <span>{r.user?.name || '(Chưa có tên)'}</span>
              <small className="text-500">{r.user?.email}</small>
            </div>
          )}
        />
        <Column
          header="Suất chiếu"
          body={(r) => (
            <div className="flex flex-column">
              <span>{r.showtime?.movie}</span>
              <small className="text-500">{r.showtime?.cinema} · {r.showtime?.room}</small>
              <small className="text-500">{r.showtime?.startAt ? new Date(r.showtime.startAt).toLocaleString('vi-VN') : ''}</small>
            </div>
          )}
        />
        <Column
          header="Ghế"
          body={(r) => r.seats?.map((s) => s.code).join(', ')}
          style={{ width: '10rem' }}
        />
        <Column
          field="amount"
          header="Tổng tiền"
          body={(r) => r.amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          style={{ width: '10rem' }}
        />
        <Column
          field="status"
          header="Trạng thái"
          body={(r) => statusLabel[r.status] || r.status}
          style={{ width: '8rem' }}
        />
        <Column
          header="Thời gian"
          body={(r) => new Date(r.createdAt).toLocaleString('vi-VN')}
          style={{ width: '12rem' }}
        />
        <Column
          header="Thao tác"
          style={{ width: '10rem' }}
          body={(r) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-check"
                rounded
                text
                severity="success"
                onClick={() => approve(r)}
                disabled={r.status !== 'Pending'}
              />
              <Button
                icon="pi pi-times"
                rounded
                text
                severity="danger"
                onClick={() => reject(r)}
                disabled={r.status !== 'Pending'}
              />
            </div>
          )}
        />
      </DataTable>
    </div>
  );
}