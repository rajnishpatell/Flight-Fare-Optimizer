import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [totalSearches, setTotalSearches] = useState(0);
  const [topRoutes, setTopRoutes] = useState([]);
  const [priceTrends, setPriceTrends] = useState([]);

  const [savings, setSavings] = useState({
    totalSaved: 0,
    totalBookings: 0,
    avgSaving: 0,
    hiddenCityCount: 0,
  });

  useEffect(() => {
    if (!token) return;

    const headers = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
      try {
        const [t, r, p, s] = await Promise.all([
          axios.get("http://localhost:5000/api/analytics/total-searches", headers),
          axios.get("http://localhost:5000/api/analytics/top-routes", headers),
          axios.get("http://localhost:5000/api/analytics/price-trends", headers),
          axios.get("http://localhost:5000/api/savings/summary", headers),
        ]);

        setTotalSearches(t.data.totalSearches);
        setTopRoutes(
          r.data.routes.map((x) => ({
            name: `${x._id.from} → ${x._id.to}`,
            value: x.count,
          }))
        );
        setPriceTrends(
          p.data.trends.map((x) => ({
            date: x._id,
            price: Math.round(x.avgPrice),
          }))
        );
        setSavings(s.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black pt-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome back, {user?.name} 👋 — here’s your flight analytics
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading dashboard...</p>
        ) : (
          <>
            {/* ===================== STATS ===================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard title="Total Searches" value={totalSearches} />
              <StatCard title="Total Bookings" value={savings.totalBookings} />
              <StatCard
                title="Money Saved"
                value={`₹${Math.round(savings.totalSaved)}`}
                highlight
              />
              <StatCard
                title="Hidden-City Used"
                value={savings.hiddenCityCount}
              />
            </div>

            {/* ===================== CHARTS ===================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Top Routes */}
              <ChartBox title="Top Routes">
                {topRoutes.length === 0 ? (
                  <Empty />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={topRoutes}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        fill="#3b82f6"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </ChartBox>

              {/* Price Trend */}
              <ChartBox title="Average Price Trend">
                {priceTrends.length === 0 ? (
                  <Empty />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={priceTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartBox>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ===================== COMPONENTS ===================== */

const StatCard = ({ title, value, highlight }) => (
  <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:scale-[1.02] transition">
    <p className="text-gray-400 text-sm">{title}</p>
    <h2
      className={`text-3xl font-bold mt-2 ${
        highlight ? "text-green-400" : "text-white"
      }`}
    >
      {value}
    </h2>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-2">
    <h2 className="text-white font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Empty = () => (
  <p className="text-gray-400 text-sm">No data available</p>
);
