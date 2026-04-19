import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      navigate("/"); // redirect home
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg && msg.toLowerCase().includes("not verified")) {
        if (window.confirm("Email not verified. Resend verification email?")) {
          await axios.post("http://localhost:5000/api/auth/resend-verification", {
            email,
          });
          toast.success("Verification email re-sent. Check your inbox.");
        }
      } else {
        alert(msg || "Login failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 flex items-center justify-center px-4 pt-20">
      <div className="backdrop-blur-xl bg-white/10 shadow-xl p-8 rounded-2xl max-w-sm w-full border border-white/20">

        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Welcome Back ✈️
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <Mail size={19} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="email"
              className="w-full pl-10 p-3 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={19} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="password"
              className="w-full pl-10 p-3 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-semibold shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-300 text-sm text-center mt-4">
          Forgot password?{" "}
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Reset
          </Link>
        </p>

        <p className="text-gray-300 text-sm text-center mt-2">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
