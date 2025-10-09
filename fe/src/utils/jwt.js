// src/utils/jwt.js
export function decodeJwt(token) {
  if (!token) return null;
  try {
    const p = JSON.parse(atob(token.split('.')[1]));
    return {
      uid: p.uid ?? p.sub ?? null,
      email: p.sub ?? p.email ?? null,
      name: p.name ?? p.fullName ?? null,    // <-- ưu tiên họ tên
      role: p.role ?? p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? 'User',
      raw: p
    };
  } catch { return null; }
}
