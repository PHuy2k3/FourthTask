import { useState } from 'react';
import api from '../lib/api';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { setToken } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [full, setFull] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      if (mode === 'login') {
        const { data } = await api.post('/api/auth/login', { email, password: pwd });
        setToken(data.accessToken ?? data.AccessToken ?? data.token);
      } else {
        const { data } = await api.post('/api/auth/register', { email, password: pwd, fullName: full });
        setToken(data.accessToken ?? data.AccessToken ?? data.token);
      }
      nav('/showtimes');
    } catch (e) {
      alert(e.response?.data?.message ?? 'Lỗi đăng nhập/đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={mode === 'login' ? 'Đăng nhập' : 'Đăng ký'} className="max-w-24rem mx-auto">
      <div className="flex flex-column gap-3">
        <span className="p-float-label">
          <InputText id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full" />
          <label htmlFor="email">Email</label>
        </span>

        {mode === 'register' && (
          <span className="p-float-label">
            <InputText id="full" value={full} onChange={e => setFull(e.target.value)} className="w-full" />
            <label htmlFor="full">Họ tên</label>
          </span>
        )}

        <span className="p-float-label">
          <Password
            id="pwd"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            toggleMask
            feedback={false}
            className="w-full"
          />          
          <label htmlFor="pwd">Mật khẩu</label>
        </span>

        <div className="flex gap-2">
          <Button label={mode === 'login' ? 'Đăng nhập' : 'Đăng ký'} icon="pi pi-check" loading={loading} onClick={submit} />
          <Button label={mode === 'login' ? 'Chuyển sang đăng ký' : 'Chuyển sang đăng nhập'}
                  severity="secondary" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} />
        </div>
      </div>
    </Card>
  );
}
