import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ConfirmEmailChange() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/confirm-email-change/${token}`
        );

        setStatus("success");

        // setTimeout(() => {
        //   navigate("/profile");
        // }, 2000);
      } catch (err) {
        setStatus("failed");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-white/10 p-8 rounded-xl backdrop-blur-lg text-center border border-white/20 max-w-md w-full">

        {status === "loading" && (
          <h2 className="text-xl font-semibold">Verifying email...</h2>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-400">
              Email Change Verified!
            </h2>
            <p className="mt-2 text-gray-300">
              GO BACK
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <h2 className="text-2xl font-bold text-red-400">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-300">
              The link is invalid or expired.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
