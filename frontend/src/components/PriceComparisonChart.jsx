import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function PriceComparisonChart({ flights }) {
  // Build chart data: show regular price vs optimized price (if hidden-city)
  const data = flights.map((f) => ({
    name: f.airline + (f.hidden_city ? " (opt)" : ""),
    price: f.price,
    optimized: f.hidden_city ? Math.round(f.price * 0.8) : f.price, // example optimization
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Price Comparison</h4>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#2563eb" name="Listed Price" />
            <Bar dataKey="optimized" fill="#16a34a" name="Optimized / Hidden-city" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
