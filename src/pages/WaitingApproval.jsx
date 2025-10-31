import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  RefreshCw,
  LogOut,
  Zap,
  Target,
  TrendingUp,
  Dumbbell,
  Flame,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const WaitingApproval = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

  const checkApprovalStatus = async () => {
    setChecking(true);
    try {
      const response = await axiosClient.get("/clients/me");
      const data = response.data.data || response.data;

      if (data.approved) {
        toast.success("🎉 Your account has been approved! Welcome aboard!");
        navigate("/dashboard");
      } else {
        toast.info("Your account is still pending approval. Please wait.");
      }
    } catch (error) {
      console.error("Check approval error:", error);
      toast.error("Failed to check approval status");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-red-600/90 to-purple-900/90 z-10"></div>
        <div
          className="absolute inset-0 opacity-10 z-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-500 z-0"></div>
      </div>

      <div className="relative z-30 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-6">
              <Zap className="text-orange-400" size={24} />
              <span className="font-black text-lg text-white uppercase">
                FitLife Gym
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 px-8 py-6">
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-black text-white uppercase">
                    Pending Approval
                  </h1>
                  <p className="text-white/90 font-medium">
                    Your account is under review
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 lg:p-12">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mb-4 sm:mb-6 shadow-xl">
                  <Shield className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4 uppercase">
                  Welcome, {user?.email?.split("@")[0] || "Future Champion"}! 🎉
                </h2>
                <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
                  We're excited to have you join our fitness community! Our team
                  is reviewing your registration and will approve your account
                  shortly.
                </p>
              </div>

              {/* Timeline */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base sm:text-lg font-black text-white uppercase">
                        Registration Complete ✓
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Your account has been created successfully
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                      <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base sm:text-lg font-black text-white uppercase">
                        Admin Review in Progress ⏳
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Our team is verifying your information and invite code
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base sm:text-lg font-black text-gray-400 uppercase">
                        Full Access Coming Soon
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Once approved, you'll have access to all features
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 border-2 border-slate-600">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white uppercase">
                    What You'll Get
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase text-xs sm:text-sm">
                        Custom Programs
                      </h4>
                      <p className="text-xs text-gray-400">
                        Personalized workouts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase text-xs sm:text-sm">
                        Track Progress
                      </h4>
                      <p className="text-xs text-gray-400">
                        Monitor your gains
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase text-xs sm:text-sm">
                        Expert Guidance
                      </h4>
                      <p className="text-xs text-gray-400">
                        Professional support
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={checkApprovalStatus}
                  disabled={checking}
                  className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-black text-base sm:text-lg rounded-xl transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl hover:scale-[1.02] group uppercase"
                >
                  {checking ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">Checking...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw
                        className="group-hover:rotate-180 transition-transform duration-500"
                        size={20}
                      />
                      <span className="text-sm sm:text-base">Check Status</span>
                    </span>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="px-6 py-3 sm:py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2 uppercase"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>

              {/* Info Message */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-2 border-blue-800 rounded-2xl">
                <p className="text-center text-xs sm:text-sm text-blue-200 font-medium">
                  ℹ️{" "}
                  <strong className="font-black">
                    Approval usually takes 24-48 hours.
                  </strong>{" "}
                  You'll receive a notification once your account is approved.
                  Feel free to check back anytime!
                </p>
              </div>
            </div>
          </div>

          {/* Motivational Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Flame className="text-orange-400 animate-pulse" size={20} />
              <p className="text-white font-bold text-sm">
                "Great things take time. Your fitness journey is about to
                begin!" 💪
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingApproval;
