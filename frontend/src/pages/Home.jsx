import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FlightSearchForm from "../components/FlightSearchForm";
import { ArrowRight, ShieldCheck, BarChart3, Sparkles } from "lucide-react";


const Home = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const handleSearch = async (params) => {
    try {
      await axios.post("http://localhost:5000/api/search/log", params, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/results", { state: params });
    } catch {
      navigate("/results", { state: params });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 via-white to-gray-50">
      {/* ================= HERO ================= */}
      <section
        className="relative h-[640px] bg-cover bg-center flex items-center justify-center px-6"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-3xl w-full text-center animate-fadeIn">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-snug">
            Discover hidden-city routes and save money on your next flight.
          </h1>

          {/* Search Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 hover:shadow-2xl transition-all duration-500 animate-slideUp">
            <FlightSearchForm onSearch={handleSearch} />
          </div>

          {/* Context CTA */}
          <div className="mt-6 text-sm text-gray-600">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline transition"
              >
                View your savings dashboard <ArrowRight size={14} />
              </button>
            ) : (
              <span>Try a search — no booking required</span>
            )}
          </div>
        </div>
      </section>

      {/* ================= LIVE STATS ================= */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <Stat value="₹1.2L+" label="Total Savings Tracked" />
          <Stat value="350+" label="Routes Analyzed" />
          <Stat value="Hidden-City AI" label="Smart Fare Detection" />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-14">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <Step
            icon={<Sparkles size={26} />}
            title="Search Flights"
            desc="Enter your route and travel date like any normal booking site."
          />
          <Step
            icon={<BarChart3 size={26} />}
            title="We Analyze Prices"
            desc="Our engine detects hidden-city and alternative fare opportunities."
          />
          <Step
            icon={<ShieldCheck size={26} />}
            title="Save Money"
            desc="Choose smarter routes and track savings in your dashboard."
          />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="flex-1 py-16 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard
            image="/airplane-placeholder.jpg"
            title="Cheaper Flights"
            desc="Find hidden-city and alternative routes for maximum savings."
            accent="blue"
          />
          <FeatureCard
            image="/world-map-placeholder.jpg"
            title="Global Routes"
            desc="Compare flights across multiple airlines and destinations."
            accent="purple"
          />
          <FeatureCard
            image="/route-map-placeholder.jpg"
            title="Smart Dashboard"
            desc="Visualize savings with charts, maps, and analytics."
            accent="green"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;

/* ================= COMPONENTS ================= */

const Stat = ({ value, label }) => (
  <div className="animate-fadeIn">
    <h3 className="text-3xl font-bold text-blue-600">{value}</h3>
    <p className="text-gray-600 mt-1">{label}</p>
  </div>
);

const Step = ({ icon, title, desc }) => (
  <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:-translate-y-2 transition-all duration-500">
    <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-600 mt-2 leading-relaxed">{desc}</p>
  </div>
);

const FeatureCard = ({ image, title, desc, accent }) => {
  const accentMap = {
    blue: "group-hover:bg-blue-500",
    purple: "group-hover:bg-purple-500",
    green: "group-hover:bg-green-500",
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl border border-gray-200">
      <img
        src={image}
        alt={title}
        className="h-16 mx-auto mb-5 group-hover:scale-110 transition"
      />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2 leading-relaxed">{desc}</p>
      <div
        className={`mt-6 h-[3px] w-10 bg-gray-300 transition-all duration-500 ${accentMap[accent]} group-hover:w-24 mx-auto`}
      />
    </div>
  );
};
