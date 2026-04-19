import React, { useState } from "react";
import { MapPin, Calendar, Users, Search } from "lucide-react";


const FlightSearchForm = ({ onSearch }) => {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: today,
    passengers: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.date) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSearch(form);
    }, 1500); // Simulated loading time
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
    >
      {/* From Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">From</label>
        <div className="flex items-center bg-gray-100 rounded-lg px-3">
          <MapPin className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            name="from"
            value={form.from}
            onChange={handleChange}
            placeholder="Delhi (DEL)"
            className="w-full bg-gray-100 py-2 outline-none"
          />
        </div>
      </div>

      {/* To Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">To</label>
        <div className="flex items-center bg-gray-100 rounded-lg px-3">
          <MapPin className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            name="to"
            value={form.to}
            onChange={handleChange}
            placeholder="Mumbai (BOM)"
            className="w-full bg-gray-100 py-2 outline-none"
          />
        </div>
      </div>

      {/* Date Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Date</label>
        <div className="flex items-center bg-gray-100 rounded-lg px-3">
          <Calendar className="text-gray-500 mr-2" size={18} />
          <input
            type="date"
            name="date"
            value={form.date}
            min={today}
            onChange={handleChange}
            className="w-full bg-gray-100 py-2 outline-none"
          />
        </div>
      </div>

      {/* Passengers */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Passengers</label>
        <div className="flex items-center bg-gray-100 rounded-lg px-3">
          <Users className="text-gray-500 mr-2" size={18} />
          <input
            type="number"
            name="passengers"
            value={form.passengers}
            onChange={handleChange}
            min="1"
            className="w-full bg-gray-100 py-2 outline-none"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="md:col-span-4 text-center mt-4">
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:bg-blue-700 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Searching...
            </div>
          ) : (
            <>
              <Search size={18} />
              Search Flights
            </>
          )}
        </button>
      </div>
    </form>    
  );
};

export default FlightSearchForm;
