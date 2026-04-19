import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); 
  // loading | success | failed | already

  useEffect(() => {
    // If already verified BEFORE accessing page again
    if (localStorage.getItem(`verified_${token}`) === "true") {
      setStatus("already");
      return;
    }

    async function verify() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );

        if (res.data.success) {
          // Save verified status so that BACK button doesn't show failure
          localStorage.setItem(`verified_${token}`, "true");

          setStatus("success");

          // Redirect to login after 3 sec
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    }

    verify();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-xl p-10 rounded-2xl text-center max-w-md">

        {status === "loading" && (
          <h2 className="text-xl font-semibold">Verifying your email…</h2>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600">Email Verified 🎉</h2>
            <p className="mt-3 text-gray-600">
              Redirecting you to login…
            </p>
          </>
        )}

        {status === "already" && (
          <>
            <h2 className="text-2xl font-bold text-green-600">
              Email Already Verified ✔
            </h2>
            <p className="mt-3 text-gray-600">
              You have already verified your account.
            </p>

            <a
              href="/login"
              className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Go to Login
            </a>
          </>
        )}

        {status === "failed" && (
          <>
            <h2 className="text-2xl font-bold text-red-600">Verification Failed ❌</h2>
            <p className="mt-3 text-gray-600">
              This verification link is invalid or expired.
            </p>

            <a
              href="/resend-verification"
              className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Resend Verification
            </a>
          </>
        )}

      </div>
    </div>
  );
}
