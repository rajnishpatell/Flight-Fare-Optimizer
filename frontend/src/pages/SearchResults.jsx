import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import FlightCard from "../components/FlightCard";
import PriceComparisonChart from "../components/PriceComparisonChart";
import RouteMapPlaceholder from "../components/RouteMapPlaceholder";
import Loader from "../components/Loader"; // you already have Loader.jsx
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { generateMockFlights } from "../utils/mockFlights";

export default function SearchResults() {
  const location = useLocation();
  const searchState = location.state || {}; // from Home navigate
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [sortBy, setSortBy] = useState("price");
  const [filters, setFilters] = useState({ nonStop: false, hiddenOnly: false });

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const results = generateMockFlights(
        searchState.from || "DEL",
        searchState.to || "BOM",
        searchState.date || "2025-10-01",
        searchState.passengers || 1
      );

      setFlights(results);
      setLoading(false);
    }, 1000);
  }, [location.state]);

  // apply filters & sort
  const visibleFlights = flights
    .filter((f) => (filters.hiddenOnly ? f.hidden_city : true))
    .filter((f) => (filters.nonStop ? f.stops.length === 0 : true))
    .sort((a, b) => {
      if (sortBy === "lowtohi") return a.price - b.price;
      if (sortBy === "hitolow") return b.price - a.price;
      if (sortBy === "duration") {
        // naive duration compare: parse hours
        const parse = (d) => {
          const parts = d.split(" ");
          const hours = parseInt(parts[0]) || 0;
          const mins = parseInt(parts[1]) || 0;
          return hours * 60 + mins;
        };
        return parse(a.duration) - parse(b.duration);
      }
      if (sortBy === "savings") {
        return (
          (b.hidden_city ? parseInt(b.saving?.replace(/[^\d]/g, "") || 0) : 0) -
          (a.hidden_city ? parseInt(a.saving?.replace(/[^\d]/g, "") || 0) : 0)
        );
      }
      return 0;
    });

  const handleSelectFlight = async (flight) => {
    try {
      // find cheapest direct flight as baseline
      const directFlights = flights.filter((f) => !f.hidden_city);
      const directPrice =
        directFlights.length > 0
          ? Math.min(...directFlights.map((f) => f.price))
          : flight.price;

      const savedAmount =
        flight.hidden_city && directPrice > flight.price
          ? directPrice - flight.price
          : 0;

      const payload = {
        from: flight.from,
        to: flight.to,
        airline: flight.airline,
        bookingType: flight.hidden_city ? "hidden-city" : "direct",
        bookedPrice: flight.price,
        directPrice,
        savedAmount,
      };

      await axios.post("http://localhost:5000/api/bookings/simulate", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        savedAmount > 0
          ? `Booking simulated! You saved ₹${savedAmount}`
          : "Booking simulated!"
      );
    } catch (err) {
      toast.error("Booking simulation failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mt-15">
        Results for {searchState.from || "---"} → {searchState.to || "---"} on{" "}
        {searchState.date || "---"}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {flights.length} itineraries found
      </p>

      <FilterBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column: cards */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {visibleFlights.length > 0 ? (
              visibleFlights.map((f) => (
                <FlightCard
                  key={f.id}
                  flight={f}
                  onSelectFlight={handleSelectFlight}
                />
              ))
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-md text-gray-600">
                No flights match your filters.
              </div>
            )}
          </div>

          {/* Right column: charts & map */}
          <aside className="flex flex-col gap-4">
            <PriceComparisonChart flights={flights} />
            <RouteMapPlaceholder legs={flights[0]?.legs || []} />
          </aside>
        </div>
      )}
    </div>
  );
}
