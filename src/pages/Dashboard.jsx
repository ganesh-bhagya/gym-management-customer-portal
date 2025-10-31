import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  TrendingUp,
  Apple,
  Dumbbell,
  Heart,
  Flame,
  Target,
  Award,
  Zap,
  ChevronRight,
  User,
  CreditCard,
  BookOpen,
  ArrowRight,
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

  const calculateBMI = () => {
    if (!client?.heightCm || !client?.initialWeightKg) return null;
    const heightM = client.heightCm / 100;
    const weight = parseFloat(client.initialWeightKg);
    return (weight / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { text: "Underweight", color: "text-blue-400" };
    if (bmiNum < 25) return { text: "Normal", color: "text-green-400" };
    if (bmiNum < 30) return { text: "Overweight", color: "text-orange-400" };
    return { text: "Obese", color: "text-red-400" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  const firstName = client?.fullName?.split(" ")[0] || "Champion";

  return (
    <div className="p-4 sm:p-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero Welcome Section */}
        <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-purple-600 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-orange-100 text-sm font-bold uppercase tracking-wide mb-2">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                  Hey {firstName}! 👋
                </h1>
                <p className="text-white/90 text-base sm:text-lg font-medium">
                  Ready to crush your fitness goals today?
                </p>
              </div>
              <div className="hidden sm:block w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
                <Flame className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-white/70 text-xs font-bold uppercase mb-1">
                  Programs
                </p>
                <p className="text-2xl sm:text-3xl font-black text-white">
                  {client?.programs?.length || 0}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-white/70 text-xs font-bold uppercase mb-1">
                  Weight
                </p>
                <p className="text-2xl sm:text-3xl font-black text-white">
                  {client?.initialWeightKg || 0}
                  <span className="text-sm ml-1">kg</span>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-white/70 text-xs font-bold uppercase mb-1">
                  BMI
                </p>
                <p className="text-2xl sm:text-3xl font-black text-white">
                  {bmi || "--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/training"
            className="group bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-700/50 hover:border-orange-500 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1">
              My Workouts
            </h3>
            <p className="text-xs text-gray-400 mb-2">View schedule</p>
            <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/training"
            className="group bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-700/50 hover:border-green-500 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Apple className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1">
              Diet Plan
            </h3>
            <p className="text-xs text-gray-400 mb-2">Meal plans</p>
            <ChevronRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/training"
            className="group bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-700/50 hover:border-blue-500 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1">
              Progress
            </h3>
            <p className="text-xs text-gray-400 mb-2">Track stats</p>
            <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/account"
            className="group bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-700/50 hover:border-purple-500 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1">
              Membership
            </h3>
            <p className="text-xs text-gray-400 mb-2">View details</p>
            <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Your Programs */}
        {client?.programs && client.programs.length > 0 && (
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                  Your Programs
                </h2>
              </div>
              <span className="text-orange-400 font-bold text-sm">
                {client.programs.length} active
              </span>
            </div>

            <div className="space-y-3">
              {client.programs.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-orange-500/50 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm sm:text-base truncate">
                      {program.name}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {program.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Stats */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
              Health Profile
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">
                Height
              </p>
              <p className="text-2xl font-black text-white">
                {client?.heightCm || "--"}
                <span className="text-sm text-gray-400 ml-1">cm</span>
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">
                Weight
              </p>
              <p className="text-2xl font-black text-white">
                {client?.initialWeightKg || "--"}
                <span className="text-sm text-gray-400 ml-1">kg</span>
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">
                BMI
              </p>
              <p className="text-2xl font-black text-white">{bmi || "--"}</p>
              {bmiCategory && (
                <p className={`text-xs font-bold ${bmiCategory.color} mt-1`}>
                  {bmiCategory.text}
                </p>
              )}
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">
                Gender
              </p>
              <p className="text-2xl font-black text-white">
                {client?.gender?.charAt(0) || "--"}
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="bg-gradient-to-r from-orange-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30">
          <div className="flex items-center gap-4">
            <Zap className="w-12 h-12 text-orange-400 animate-pulse" />
            <div>
              <p className="text-white font-black text-lg mb-1">
                Keep pushing forward! 💪
              </p>
              <p className="text-gray-300 text-sm">
                Your fitness journey is a marathon, not a sprint. Every workout
                counts!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
