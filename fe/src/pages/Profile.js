// src/pages/Profile.js
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

export default function Profile() {
  const { token, profile } = useAuth();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      if (!token) {
        setErr('Bạn chưa đăng nhập.');
        setMe(null);
        return;
      }
      const { data } = await api.get('/api/profile'); // BE: ProfileController
      setMe(data);
    } catch (e) {
      setErr((e?.response?.data && (e.response.data.message || e.response.data)) || 'Không thể tải hồ sơ.');
      setMe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const name = me?.fullName ?? profile?.name ?? 'Người dùng';
  const email = me?.email ?? profile?.email ?? '';
  const role = me?.role ?? profile?.role ?? 'User';

  return (
    <div className="flex justify-content-center">
      <Card title="Thông tin tài khoản" className="w-full md:w-6 lg:w-4">
        {loading ? (
          <div className="flex flex-column gap-3">
            <Skeleton width="10rem" height="1rem" />
            <Skeleton width="16rem" height="1rem" />
            <Skeleton width="8rem" height="1rem" />
          </div>
        ) : (
          <>
            {err ? (
              <div className="mb-3">
                <Message severity="error" text={String(err)} />
              </div>
            ) : null}

            <div className="flex flex-column gap-3">
              <div><strong>Họ tên:</strong> {name}</div>
              <div><strong>Email:</strong> {email}</div>
              <div className="flex align-items-center gap-2">
                <strong>Quyền:</strong>
                <Tag value={role} severity={role === 'Admin' ? 'warning' : 'info'} />
              </div>
            </div>

            <div className="mt-4 flex justify-content-end">
              <Button label="Tải lại" icon="pi pi-refresh" onClick={load} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
