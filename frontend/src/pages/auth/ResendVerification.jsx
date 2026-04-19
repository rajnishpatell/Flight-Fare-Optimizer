import React, { useState } from "react";
import axios from "axios";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/resend-verification",
        { email }
      );
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Resend Verification Email</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleResend}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Send Verification Email
        </button>

        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
