import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const nav = useNavigate();
  return (
    <Card title="Bảng điều khiển Admin">
      <div className="flex flex-wrap gap-2">
        <Button
          label="Quản lý Phim"
          icon="pi pi-video"
          onClick={() => nav('/admin/movies')}
        />
        <Button
          label="Quản lý Người dùng"
          icon="pi pi-users"
          onClick={() => nav('/admin/users')}
        />
        <Button
          label="Quản lý Rạp"
          icon="pi pi-building"
          onClick={() => nav('/admin/cinemas')}
        />
        <Button
          label="Quản lý Suất chiếu"
          icon="pi pi-calendar"
          onClick={() => nav('/admin/showtimes')}
        />
        <Button
          label="Duyệt vé người dùng"
          icon="pi pi-ticket"
          onClick={() => nav('/admin/bookings')}
        />
      </div>
    </Card>
  );
}
