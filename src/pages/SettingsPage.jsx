import { useState } from "react";
import {
  Settings,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Save,
  Bell,
  Moon,
  Sun,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Show success message
    toast.success("Logged out successfully!");

    // Redirect to login
    navigate("/login");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSavingPassword(true);
    try {
      await axiosClient.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/account")}
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Account</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
              Settings
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your account preferences
            </p>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase">
              Change Password
            </h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password (min 8 characters)"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={savingPassword}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {savingPassword ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Password
                </>
              )}
            </button>
          </form>

          {/* Password Requirements */}
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
            <p className="text-blue-200 text-xs font-bold uppercase mb-2">
              Password Requirements:
            </p>
            <ul className="text-blue-200 text-sm space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Must match confirmation
              </li>
            </ul>
          </div>
        </div>

        {/* Notification Preferences - Coming Soon */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase">
              Notification Preferences
            </h2>
          </div>
          <p className="text-gray-400 text-sm italic">Coming soon...</p>
        </div>

        {/* Theme Preferences - Coming Soon */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase">
              Theme Preferences
            </h2>
          </div>
          <p className="text-gray-400 text-sm italic">Coming soon...</p>
        </div>

        {/* Logout Section */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <LogOut className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase">Account</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Sign out of your account. You'll need to log in again to access
              your data.
            </p>

            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
