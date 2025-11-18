// src/pages/AdminStats.jsx
import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Chart } from "recharts"; // not directly used; we'll import specific components
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Money({ value }) {
  if (value == null) return "—";
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
}

export default function AdminStats() {
  const [overview, setOverview] = useState(null);
  const [sales, setSales] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSales, setLoadingSales] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [ovRes, salesRes, recRes] = await Promise.all([
          api.get("/api/admin/stats/overview"),
          api.get("/api/admin/stats/sales?days=30"),
          api.get("/api/admin/stats/recent-bookings?limit=10")
        ]);
        if (!mounted) return;
        setOverview(ovRes.data);
        setSales(Array.isArray(salesRes.data) ? salesRes.data : []);
        setRecentBookings(Array.isArray(recRes.data) ? recRes.data : []);
      } catch (err) {
        console.error("Fetch admin stats failed", err);
        // you can show toast or error UI
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const refreshSales = async (days = 30) => {
    setLoadingSales(true);
    try {
      const res = await api.get(`/api/admin/stats/sales?days=${days}`);
      setSales(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSales(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}><ProgressSpinner /></div>;

  return (
    <div style={{ padding: 18 }}>
      <h2>Dashboard — Admin</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 12 }}>
        <Card>
          <div style={{ fontSize: 12, color: "#666" }}>Tổng số booking</div>
          <div style={{ fontSize: 28, marginTop: 6 }}>{overview?.totalBookings ?? "—"}</div>
        </Card>

        <Card>
          <div style={{ fontSize: 12, color: "#666" }}>Doanh thu hôm nay</div>
          <div style={{ fontSize: 20, marginTop: 6 }}>{Money({ value: overview?.todayRevenue })}</div>
        </Card>

        <Card>
          <div style={{ fontSize: 12, color: "#666" }}>Doanh thu tháng</div>
          <div style={{ fontSize: 20, marginTop: 6 }}>{Money({ value: overview?.monthRevenue })}</div>
        </Card>

        <Card>
          <div style={{ fontSize: 12, color: "#666" }}>Tổng doanh thu</div>
          <div style={{ fontSize: 16, marginTop: 6 }}>{Money({ value: overview?.totalRevenue })}</div>
        </Card>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <div style={{ flex: 1, minHeight: 320, background: "#fff", padding: 12, borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Doanh thu (30 ngày)</h3>
            <div>
              <Button label="7 ngày" className="p-button-text" onClick={() => refreshSales(7)} />
              <Button label="30 ngày" className="p-button-text" onClick={() => refreshSales(30)} />
              <Button label="365 ngày" className="p-button-text" onClick={() => refreshSales(365)} />
            </div>
          </div>

          <div style={{ width: "100%", height: 260, marginTop: 8 }}>
            {loadingSales ? (
              <div style={{ textAlign: "center", paddingTop: 40 }}><ProgressSpinner /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sales} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d) => d?.slice(5)} />
                  <YAxis tickFormatter={(v) => (v ? (v/1000000).toFixed(0) + "M" : v)} />
                  <Tooltip formatter={(val) => new Intl.NumberFormat('vi-VN').format(val) + " VND"} />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={{ width: 420, minHeight: 320 }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>Booking gần nhất</h3>
            <DataTable value={recentBookings} size="small" stripedRows>
              <Column field="orderCode" header="Mã" body={(row) => row.orderCode ?? row.id} style={{ width: 120 }} />
              <Column field="userName" header="Người đặt" />
              <Column field="amount" header="Số tiền" body={(row) => Money({ value: row.amount })} />
              <Column field="status" header="Trạng thái" />
              <Column field="createdAt" header="Thời gian" body={(row) => new Date(row.createdAt).toLocaleString()} />
            </DataTable>
          </Card>

          <Card style={{ marginTop: 12 }}>
            <h4 style={{ marginTop: 0 }}>Trạng thái</h4>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#666" }}>Pending</div>
                <div style={{ fontSize: 18 }}>{overview?.pendingBookings ?? 0}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#666" }}>Paid</div>
                <div style={{ fontSize: 18 }}>{overview?.paidBookings ?? 0}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
}
