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
  const airlineMap = {};

  flights.forEach((f) => {
    const airline = f.airline;

    if (!airlineMap[airline]) {
      airlineMap[airline] = {
        name: airline,
        price: Infinity,
        optimized: Infinity,
      };
    }

    // Direct flights → lowest listed price
    if (!f.hidden_city) {
      airlineMap[airline].price = Math.min(airlineMap[airline].price, f.price);
    }

    // Hidden-city flights → lowest optimized price
    if (f.hidden_city) {
      airlineMap[airline].optimized = Math.min(
        airlineMap[airline].optimized,
        f.price,
      );
    }
  });

  const data = Object.values(airlineMap).map((item) => ({
    name: item.name,
    price: item.price === Infinity ? 0 : item.price,
    optimized: item.optimized === Infinity ? 0 : item.optimized,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">
        Price Comparison
      </h4>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#2563eb" name="Listed Price" />
            <Bar
              dataKey="optimized"
              fill="#16a34a"
              name="Optimized / Hidden-city"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
