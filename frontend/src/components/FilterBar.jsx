import React from "react";

export default function FilterBar({ sortBy, setSortBy, filters, setFilters }) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
      <div className="flex gap-3 items-center">
        <label className="text-sm font-medium text-gray-700">Sort:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm"
        >
          <option value="lowtohi">Price (Low → High)</option>
          <option value="duration">Duration (Fastest)</option>
          <option value="hitolow">Price (High → Low)</option>
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <label className="text-sm font-medium text-gray-700">Filters:</label>

        <button
          onClick={() => setFilters({ ...filters, nonStop: !filters.nonStop })}
          className={`text-sm px-3 py-1 rounded-lg border ${
            filters.nonStop ? "bg-blue-600 text-white" : "bg-white text-gray-700"
          }`}
        >
          Non-stop
        </button>

        <button
          onClick={() => setFilters({ ...filters, hiddenOnly: !filters.hiddenOnly })}
          className={`text-sm px-3 py-1 rounded-lg border ${
            filters.hiddenOnly ? "bg-green-600 text-white" : "bg-white text-gray-700"
          }`}
        >
          Hidden-city only
        </button>
      </div>
    </div>
  );
}
