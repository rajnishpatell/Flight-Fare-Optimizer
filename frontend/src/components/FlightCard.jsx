import SavingsBadge from "./SavingsBadge";

export default function FlightCard({ flight, onSelectFlight }) {
  return (
    <article className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4">
      {/* Left: main info */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {flight.airline}
            </h3>
            <div className="text-sm text-gray-600">
              {flight.from} → {flight.to} · {flight.duration}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Depart: {flight.departTime} · Arrive: {flight.arriveTime}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Stops: {flight.stops.length}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">
              {flight.currency}
              {flight.price}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total fare</div>
            {flight.hidden_city && (
              <div className="mt-2">
                <SavingsBadge saving={flight.saving || "Hidden-city"} />
              </div>
            )}
          </div>
        </div>

        {/* Expand for details */}
        <details className="mt-4">
          <summary className="text-sm text-blue-600 cursor-pointer">
            View details
          </summary>

          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Itinerary
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                {flight.legs.map((leg, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {leg.from} → {leg.to}
                      </div>
                      <div className="text-xs text-gray-500">
                        {leg.dep} — {leg.arr}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {leg.aircraft || ""}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Fare Info
              </h4>
              <div className="text-sm text-gray-600">
                <div className="w-max">
                  Baggage:{" "}
                  {flight.hidden_city ? (
                    <span className=" bg-red-400 border-2 ">
                      No check-in Luggage, only cabin
                    </span>
                  ) : (
                    " 1 Checked , 1 cabin"
                  )}
                </div>
                <div className="mt-1">
                  Fare rules: {flight.fareRules || "Non-refundable"}
                </div>
                <div className="mt-2 text-sm text-gray-700 font-medium">
                  Why this saves:
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {flight.hidden_city
                    ? flight.hidden_reason || "Cheaper via intermediate stop"
                    : "Standard direct/optimal fare"}
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* Right: mini route preview */}
      <div className="w-full md:w-48 flex flex-col items-center justify-between">
        <img
          src="/route-map-placeholder.jpg"
          alt="route"
          className="w-full h-24 object-cover rounded-md mb-2"
        />
        <button
          onClick={() => onSelectFlight(flight)}
          className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          Book (Simulated)
        </button>
      </div>
    </article>
  );
}
