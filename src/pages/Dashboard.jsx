import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Calendar,
  TrendingUp,
  Apple,
  Dumbbell,
  Activity,
  Flame,
  Target,
  Award,
  Zap,
  Clock,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const response = await axiosClient.get("/clients/me");
      const data = response.data.data || response.data;

      // Check if approved
      if (!data.approved) {
        navigate("/waiting-approval");
        return;
      }

      setClient(data);
    } catch (error) {
      console.error("Fetch client error:", error);
      toast.error("Failed to load your profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const calculateBMI = () => {
    if (!client?.heightCm || !client?.initialWeightKg) return null;
    const heightM = client.heightCm / 100;
    const weight = parseFloat(client.initialWeightKg);
    return (weight / (heightM * heightM)).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold text-lg">
            Loading your fitness dashboard...
          </p>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI();

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 rounded-2xl p-6 mb-6 overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Welcome Back, {client?.fullName?.split(" ")[0] || "Champion"}!
                </h2>
                <p className="text-orange-100 font-medium text-sm sm:text-base">
                  Let's crush those goals today 💪
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <Flame className="w-8 h-8 text-white/40" />
            </div>
            <div>
              <p className="text-white/90 text-sm font-bold uppercase tracking-wide mb-1">
                Programs
              </p>
              <p className="text-4xl font-black text-white">
                {client?.programs?.length || 0}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <Target className="w-8 h-8 text-white/40" />
            </div>
            <div>
              <p className="text-white/90 text-sm font-bold uppercase tracking-wide mb-1">
                Weight
              </p>
              <p className="text-4xl font-black text-white">
                {client?.initialWeightKg || 0}{" "}
                <span className="text-2xl">kg</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <Zap className="w-8 h-8 text-white/40" />
            </div>
            <div>
              <p className="text-white/90 text-sm font-bold uppercase tracking-wide mb-1">
                Height
              </p>
              <p className="text-4xl font-black text-white">
                {client?.heightCm || 0} <span className="text-2xl">cm</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <Activity className="w-8 h-8 text-white/40" />
            </div>
            <div>
              <p className="text-white/90 text-sm font-bold uppercase tracking-wide mb-1">
                BMI
              </p>
              <p className="text-4xl font-black text-white">{bmi || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Enrolled Programs */}
        {client?.programs && client.programs.length > 0 && (
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl mb-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase">
                Your Training Programs
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {client.programs.map((program) => (
                <div
                  key={program.id}
                  className="group relative bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600 rounded-2xl p-6 hover:border-orange-500 transition-all"
                >
                  <div className="absolute top-4 right-4">
                    <Flame className="w-6 h-6 text-orange-400 group-hover:animate-pulse" />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 uppercase">
                    {program.name}
                  </h4>
                  <p className="text-sm text-gray-400">{program.description}</p>
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="text-xs font-bold text-orange-400 uppercase">
                      From LKR {program.monthlyFee}/month
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-slate-700 hover:border-orange-500 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 uppercase">
              My Schedule
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              View your personalized weekly workout plans and training sessions
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs font-bold uppercase">
              <Clock size={14} />
              Coming Soon
            </div>
          </div>

          <div className="group bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-slate-700 hover:border-red-500 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 uppercase">
              Progress Tracker
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Track your weight, measurements, and fitness achievements
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs font-bold uppercase">
              <Clock size={14} />
              Coming Soon
            </div>
          </div>

          <div className="group bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-slate-700 hover:border-purple-500 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Apple className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 uppercase">
              Nutrition Plans
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Access your customized diet plans and meal recommendations
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs font-bold uppercase">
              <Clock size={14} />
              Coming Soon
            </div>
          </div>
        </div>

        {/* Motivational Section */}
        <div className="mt-8 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 rounded-3xl p-8 text-center shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Flame className="w-10 h-10 text-orange-600 animate-pulse" />
          </div>
          <h3 className="text-3xl font-black text-white mb-3 uppercase">
            Stay Committed, Stay Strong!
          </h3>
          <p className="text-xl text-orange-100 font-medium max-w-2xl mx-auto">
            Every workout brings you closer to your goals. Keep pushing,
            champion!
          </p>
        </div>
      </div>

      {/* Floating Action Hint */}
      <div className="fixed bottom-8 right-8 hidden lg:block">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-xl border-2 border-orange-500 animate-pulse">
          <p className="text-sm font-bold text-white">
            More features coming soon! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
