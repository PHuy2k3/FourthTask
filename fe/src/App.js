import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Movies from './pages/Movies';
import Showtimes from './pages/Showtimes';
import SeatMap from './pages/SeatMap';
import AdminHome from './pages/admin/AdminHome';
import AdminMovies from './pages/admin/AdminMovies';
import AdminUsers from './pages/admin/AdminUsers';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import AdminCinemas from './pages/admin/AdminCinemas';
import AdminBookings from './pages/admin/AdminBookings';
import Profile from './pages/Profile';

// PrimeReact UI
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';

/* --------- Guards --------- */
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { token, profile } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (profile?.role !== 'Admin') return <Navigate to="/showtimes" replace />;
  return children;
}

/* ----------------- Shell layout ----------------- */
function Shell({ children }) {
  const { token, setToken, profile } = useAuth();
  const nav = useNavigate();
  const userMenu = useRef(null);

  const items = [
    { label: 'Phim', icon: 'pi pi-video', command: () => nav('/movies') },
    { label: 'Suất chiếu', icon: 'pi pi-calendar', command: () => nav('/showtimes') },
  ];

  if (profile?.role === 'Admin') {
    items.push({ label: 'Quản trị', icon: 'pi pi-shield', command: () => nav('/admin') });
  }

  const end = token ? (
    <div className="flex align-items-center gap-2">
      <Avatar
        label={String((profile?.name ?? profile?.email ?? 'U')).charAt(0).toUpperCase()}
        shape="circle"
      />
      <Button
        type="button"
        text
        onClick={(e) => userMenu.current?.toggle(e)}
        aria-haspopup
        aria-controls="profile_menu"
      >
        {profile?.name ?? profile?.email ?? 'Tài khoản'}
      </Button>
      <Menu
        id="profile_menu"
        ref={userMenu}
        model={[
          { label: 'Thông tin', icon: 'pi pi-user', command: () => nav('/profile') },
          { separator: true },
          {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-out',
            command: () => {
              setToken(null);
              nav('/login');
            },
          },
        ]}
        popup
        appendTo={document.body}
      />
    </div>
  ) : (
    <Button label="Đăng nhập" icon="pi pi-sign-in" onClick={() => nav('/login')} />
  );

  return (
    <div className="app-shell">
      <header className="app-shell__navbar">
        <div className="app-shell__navbar-inner">
          <Menubar model={items} end={end} className="app-shell__menu" />
        </div>
      </header>
      <main className="app-shell__content">
        <div className="app-shell__panel">
          {children}
        </div>
      </main>
    </div>
  );
}

/* ----------------- App ----------------- */
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Shell><Login /></Shell>} />

        {/* Public (tùy chọn) */}
        <Route path="/movies" element={<Shell><Movies /></Shell>} />
        <Route path="/showtimes" element={<Shell><Showtimes /></Shell>} />

        {/* Protected */}
        <Route
          path="/seatmap/:showtimeId"
          element={
            <Shell>
              <PrivateRoute>
                <SeatMap />
              </PrivateRoute>
            </Shell>
          }
        />
        <Route
          path="/profile"
          element={
            <Shell>
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            </Shell>
          }
        />

        {/* Admin area */}
        <Route
          path="/admin"
          element={
            <Shell>
              <AdminRoute>
                <AdminHome />
              </AdminRoute>
            </Shell>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <Shell>
              <AdminRoute>
                <AdminMovies />
              </AdminRoute>
            </Shell>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Shell>
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            </Shell>
          }
        />

        <Route
          path="/admin/showtimes"
          element={
            <Shell>
              <AdminRoute>
                <AdminShowtimes />
              </AdminRoute>
            </Shell>
          }
        />

         <Route
          path="/admin/bookings"
          element={
            <Shell>
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            </Shell>
          }
        />

        <Route
          path="/admin/cinemas"
          element={
            <Shell>
              <AdminRoute>
                <AdminCinemas />
              </AdminRoute>
            </Shell>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/showtimes" replace />} />
      </Routes>
    </AuthProvider>
  );
}
