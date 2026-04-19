import { useState } from "react";
import { Lock } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          newPassword: form.newPassword,
        }
      );

      alert(res.data.message || "Password reset successful!");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center px-4 pt-20">
      <div className="backdrop-blur-xl bg-white/10 shadow-xl p-8 rounded-2xl max-w-sm w-full border border-white/20">

        <h2 className="text-center text-3xl font-bold text-white mb-4">
          Reset Password 🔄
        </h2>

        <form onSubmit={handleReset} className="space-y-5">

          {/* New Password */}
          <div className="relative">
            <Lock size={19} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="password"
              className="w-full pl-10 p-3 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="New password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock size={19} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="password"
              className="w-full pl-10 p-3 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-semibold shadow-lg"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
