import { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });

      alert(res.data.message || "Password reset link sent!");
      setEmail("");

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 flex items-center justify-center px-4 pt-20">
      <div className="backdrop-blur-xl bg-white/10 shadow-xl p-8 rounded-2xl max-w-sm w-full border border-white/20">

        <h2 className="text-center text-3xl font-bold text-white mb-4">
          Forgot Password 🔐
        </h2>

        <p className="text-gray-300 text-center mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleForgot} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <Mail size={19} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="email"
              className="w-full pl-10 p-3 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-indigo-400 outline-none"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded-lg text-white font-semibold shadow-lg"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-gray-300 text-center mt-4 text-sm">
          Back to login?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
