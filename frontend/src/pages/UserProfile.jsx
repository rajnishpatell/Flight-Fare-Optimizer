import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Camera, Mail, User, Lock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
export default function UserProfile() {
  const { user, token, login, logout } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          name: res.data.user.name,
          email: res.data.user.email,
          avatar: res.data.user.avatar,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle profile update
  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/update",
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profile updated!");
      login(res.data.user, token);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }

    setLoading(false);
  };

  // Handle password update
  const changePassword = async (e) => {
    e.preventDefault();

    if (!passwords.oldPassword || !passwords.newPassword) {
      return alert("Fill all password fields");
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/change-password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    }
  };

  // Avatar upload
  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
   
    if (!file) return;

    let formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/upload-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Avatar updated!");
      setProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
      login({ ...user, avatar: res.data.avatar }, token);
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  // Delete account API call
  const handleDeleteAccount = async () => {
    try {
      await axios.delete("http://localhost:5000/api/user/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: deletePassword },
      });

      setDeleteModal(false);
      toast.success("Account deleted");

      logout(); // clear local storage
      window.location.href = "/"; // redirect to homepage
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const sendEmailChangeRequest = async () => {
    if (!newEmail) return alert("Enter a new email");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/request-email-change",
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      ); 

      alert("Verification email sent to new email address!");
      setEmailModal(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Failed to send verification");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24 px-4 flex justify-center">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-3xl my-5">
        {/* PROFILE HEADER */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={`http://localhost:5000${profile.avatar}`}
                className="h-20 w-20 rounded-full border-2 border-white shadow-lg object-cover"
                alt="avatar"
              />
            ) : (
              <div className="h-20 w-20 rounded-full border-2 border-white shadow-lg bg-gray-700 flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 transition p-2 rounded-full cursor-pointer shadow-md">
              <Camera size={16} className="text-white" />
              <input
                type="file"
                className="hidden"
                onChange={uploadAvatar}
                accept="image/*"
              />
            </label>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">My Profile</h2>
            <p className="text-gray-300">Manage your account settings</p>
          </div>
        </div>

        <hr className="my-6 border-white/20" />

        {/* UPDATE PROFILE FORM */}
        <form onSubmit={updateProfile} className="space-y-5">
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 pl-10 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-blue-400 outline-none"
              placeholder="Name"
            />
          </div>

          {/* Email Section */}
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full p-3 pl-10 bg-white/10 text-gray-400 rounded-lg border border-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Save name changes */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow-md"
          >
            {loading ? "Saving..." : "Save Name"}
          </button>

          <button
            type="button"
            onClick={() => setEmailModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            Change Email
          </button>
        </form>

        <hr className="my-6 border-white/20" />

        {/* CHANGE PASSWORD */}
        <h3 className="text-xl font-semibold text-white mb-3">
          Change Password
        </h3>

        <form onSubmit={changePassword} className="space-y-5 mb-4">
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="password"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
              className="w-full p-3 pl-10 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-blue-400 outline-none"
              placeholder="Old Password"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              className="w-full p-3 pl-10 bg-white/10 text-white rounded-lg border border-gray-600 focus:border-blue-400 outline-none"
              placeholder="New Password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
          >
            Update Password
          </button>
        </form>

        <hr className="my-6 border-white/20" />

        {/* ---------------------------- */}
        {/*     DELETE ACCOUNT BUTTON     */}
        {/* ---------------------------- */}
        <div className="text-center mt-6">
          <button
            onClick={() => setDeleteModal(true)}
            className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-lg"
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </div>

      {/* CHANGE EMAIL MODAL */}
      {emailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-800">Change Email</h3>

            <input
              type="email"
              className="w-full mt-3 p-3 bg-gray-100 rounded-lg border"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setEmailModal(false)}
                className="flex-1 py-2 bg-gray-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={sendEmailChangeRequest}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold"
              >
                {loading ? "Sending..." : "Send Verification"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
            <p className="text-gray-600 mt-2">
              Enter your password to permanently delete your account.
            </p>

            {/* PASSWORD INPUT */}
            <input
              type="password"
              placeholder="Enter password"
              className="w-full mt-4 p-3 bg-gray-100 rounded-lg border"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="flex-1 py-2 bg-gray-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
