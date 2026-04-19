import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Registered! Check your email to verify.");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 flex items-center justify-center px-4 pt-20">
      <div className="backdrop-blur-xl bg-white/10 shadow-xl p-8 rounded-2xl max-w-sm w-full border border-white/20 my-4">

        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Create Account ✨
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div className="relative">
            <User size={19} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full pl-10 p-3 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail size={19} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-10 p-3 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={19} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 p-3 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock size={19} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full pl-10 p-3 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded-lg text-white font-semibold shadow-lg"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-gray-300 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
