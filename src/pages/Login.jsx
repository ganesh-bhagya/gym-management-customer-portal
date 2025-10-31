import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Dumbbell,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosClient.post("/auth/login", formData);
      const data = response.data.data || response.data;

      // Save token and user info
      localStorage.setItem("token", data.access_token || data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Check if user is a client
      if (data.user.role !== "CLIENT") {
        toast.error("This portal is for clients only");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      // Check if client profile is approved
      if (data.user.clientProfile && !data.user.clientProfile.approved) {
        toast.info("Your account is waiting for admin approval");
        navigate("/waiting-approval");
        return;
      }

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Gym Background */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-red-600/90 to-purple-900/90 z-10"></div>

        {/* Gym pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 z-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000 z-0"></div>
      </div>

      <div className="relative z-30 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left side - Branding */}
          <div className="text-white space-y-6 hidden lg:block">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full border border-white/20">
                <Zap className="text-orange-400" size={20} />
                <span className="font-bold text-base">FITLIFE GYM</span>
              </div>

              <h1 className="text-4xl font-black leading-tight">
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
                  Body & Mind
                </span>
              </h1>

              <p className="text-lg text-gray-200 font-light">
                Your fitness journey starts here
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Personalized Programs</h3>
                  <p className="text-gray-300 text-xs">
                    Tailored to your goals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Track Your Progress</h3>
                  <p className="text-gray-300 text-xs">See your improvements</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Expert Guidance</h3>
                  <p className="text-gray-300 text-xs">Professional trainers</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-black text-orange-400">500+</div>
                <div className="text-xs text-gray-300">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-red-400">50+</div>
                <div className="text-xs text-gray-300">Expert Trainers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-400">10+</div>
                <div className="text-xs text-gray-300">Programs</div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-4">
                <Zap className="text-orange-400" size={24} />
                <span className="font-bold text-lg text-white">
                  FITLIFE GYM
                </span>
              </div>
            </div>

            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700/50">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white mb-2">
                  Welcome Back!
                </h2>
                <p className="text-sm text-gray-300">
                  Login to continue your fitness journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="text-orange-400" size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="text-orange-400" size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-12 pr-12 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-black text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-[1.02] group uppercase tracking-wide"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Start Training
                      <ArrowRight
                        className="group-hover:translate-x-1 transition-transform"
                        size={24}
                      />
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <p className="text-center text-sm text-gray-300">
                  New to our gym?{" "}
                  <Link
                    to="/register"
                    className="text-orange-400 hover:text-orange-300 font-bold"
                  >
                    Join Now with Invite Code
                  </Link>
                </p>
              </div>
            </div>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8 grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <Target className="text-orange-400 mx-auto mb-2" size={32} />
                <p className="text-white text-xs font-bold">Goals</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <TrendingUp className="text-red-400 mx-auto mb-2" size={32} />
                <p className="text-white text-xs font-bold">Progress</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <Dumbbell className="text-purple-400 mx-auto mb-2" size={32} />
                <p className="text-white text-xs font-bold">Training</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating motivational text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-30 hidden lg:block">
        <p className="text-white/80 text-sm font-medium">
          "The only bad workout is the one that didn't happen"
        </p>
      </div>
    </div>
  );
};

export default Login;
