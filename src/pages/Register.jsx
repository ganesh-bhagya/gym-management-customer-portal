import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Ruler,
  Weight,
  Ticket,
  Eye,
  EyeOff,
  CheckCircle,
  Dumbbell,
  Zap,
  ArrowRight,
  ArrowLeft,
  Flame,
  Target,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";
import DatePicker from "../components/DatePicker";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifiedInvite, setVerifiedInvite] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const [formData, setFormData] = useState({
    inviteCode: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    gender: "MALE",
    dateOfBirth: "",
    heightCm: "",
    initialWeightKg: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalNotes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPrograms = async () => {
    try {
      const response = await axiosClient.get("/programs?active=true&limit=100");
      const data = response.data.data || response.data;
      const programsArray = data.data || data;
      setPrograms(Array.isArray(programsArray) ? programsArray : []);
    } catch (error) {
      console.error("Fetch programs error:", error);
      setPrograms([]);
    }
  };

  const verifyInviteCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosClient.post("/invites/verify", {
        code: formData.inviteCode.trim().toUpperCase(),
      });

      const invite = response.data.data || response.data;
      setVerifiedInvite(invite);

      await fetchPrograms();

      toast.success("Invite code verified! ✓");
      setStep(2);
    } catch (error) {
      console.error("Invite verification error:", error);
      toast.error(
        error.response?.data?.message || "Invalid or expired invite code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        code: formData.inviteCode.trim().toUpperCase(),
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        heightCm: parseInt(formData.heightCm),
        initialWeightKg: formData.initialWeightKg,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        medicalNotes: formData.medicalNotes || undefined,
        programIds: selectedPrograms,
      };

      await axiosClient.post("/auth/register", payload);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { num: 1, label: "Invite", icon: Ticket },
      { num: 2, label: "Info", icon: User },
      { num: 3, label: "Programs", icon: Dumbbell },
      { num: 4, label: "Account", icon: Shield },
    ];

    return (
      <div className="flex items-start justify-center gap-1 sm:gap-2 mb-8 px-2">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isComplete = step > s.num;

          return (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black transition-all ${
                    isComplete
                      ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                      : isActive
                      ? "bg-gradient-to-br from-orange-500 to-red-500 text-white scale-110 shadow-lg"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle size={18} className="sm:w-6 sm:h-6" />
                  ) : (
                    <Icon size={16} className="sm:w-5 sm:h-5" />
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-bold mt-2 uppercase ${
                    isActive
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-slate-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-4 sm:w-8 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded-full self-start mt-5 sm:mt-6 ${
                    step > s.num
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
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
      </div>

      <div className="relative z-30 min-h-screen flex flex-col p-4 py-4 sm:py-6">
        {/* Header - Compact */}
        <div className="max-w-3xl mx-auto mb-4 sm:mb-6 w-full">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-3">
              <Zap className="text-orange-400" size={20} />
              <span className="font-black text-base text-white uppercase">
                FitLife Gym
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 uppercase leading-tight">
              Join The
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
                Fitness Revolution
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-200 font-medium hidden sm:block">
              Start your transformation journey today! 💪
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700/50">
            {renderStepIndicator()}

            {/* Step 1: Invite Code */}
            {step === 1 && (
              <form
                onSubmit={verifyInviteCode}
                className="space-y-4 sm:space-y-5"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Ticket className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                    Enter Your Invite Code
                  </h2>
                  <p className="text-sm text-gray-300 mt-2">
                    You need an invite code from our gym to register
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wide">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    name="inviteCode"
                    value={formData.inviteCode}
                    onChange={handleChange}
                    placeholder="XXXXX-XXXXX"
                    required
                    className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl bg-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold text-center text-lg uppercase tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold text-base rounded-xl transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl hover:scale-[1.02] group uppercase"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Verifying...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-sm">Verify & Continue</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
                    </span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-gray-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-orange-400 hover:text-orange-300 font-bold"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(3);
                }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase">
                    Personal Information
                  </h2>
                  <p className="text-gray-300 mt-2">Tell us about yourself</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        size={20}
                      />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        size={20}
                      />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dateOfBirth}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, dateOfBirth: value }))
                      }
                      required
                      minYear={1940}
                      maxYear={new Date().getFullYear() - 10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Height (cm)
                    </label>
                    <div className="relative">
                      <Ruler
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        size={20}
                      />
                      <input
                        type="number"
                        name="heightCm"
                        value={formData.heightCm}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Weight (kg)
                    </label>
                    <div className="relative">
                      <Weight
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        size={20}
                      />
                      <input
                        type="number"
                        step="0.1"
                        name="initialWeightKg"
                        value={formData.initialWeightKg}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Medical Notes (Optional)
                    </label>
                    <textarea
                      name="medicalNotes"
                      value={formData.medicalNotes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-black text-lg rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] group uppercase"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Continue
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Choose Programs */}
            {step === 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(4);
                }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Dumbbell className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase">
                    Choose Your Programs
                  </h2>
                  <p className="text-gray-300 mt-2">
                    Select the fitness programs you want to join
                  </p>
                </div>

                {programs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {programs.map((program) => (
                      <label
                        key={program.id}
                        className={`group relative flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedPrograms.includes(program.id)
                            ? "border-orange-500 bg-gradient-to-r from-orange-600/20 to-red-600/20 shadow-lg shadow-orange-500/20"
                            : "border-slate-600 hover:border-orange-500/50 bg-slate-800 hover:bg-slate-750"
                        }`}
                      >
                        <div className="flex items-center h-full pt-1">
                          <input
                            type="checkbox"
                            checked={selectedPrograms.includes(program.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPrograms([
                                  ...selectedPrograms,
                                  program.id,
                                ]);
                              } else {
                                setSelectedPrograms(
                                  selectedPrograms.filter(
                                    (id) => id !== program.id
                                  )
                                );
                              }
                            }}
                            className="w-5 h-5 text-orange-600 bg-slate-700 border-2 border-slate-500 rounded-md focus:ring-2 focus:ring-orange-500 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Flame
                              className={`w-5 h-5 ${
                                selectedPrograms.includes(program.id)
                                  ? "text-orange-400 animate-pulse"
                                  : "text-slate-500"
                              }`}
                            />
                            <h3 className="text-lg font-black text-white uppercase">
                              {program.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            {program.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-md">
                              💰 LKR {program.monthlyFee}/mo
                            </span>
                            {program.sixMonthFee && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-md">
                                💎 LKR {program.sixMonthFee}/6mo
                              </span>
                            )}
                            {program.yearlyFee && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-md">
                                ⭐ LKR {program.yearlyFee}/yr
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-3 border-slate-600 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400 font-medium">
                      Loading programs...
                    </p>
                  </div>
                )}

                {selectedPrograms.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-600/30 to-red-600/30 border-2 border-orange-500 rounded-xl p-4 shadow-lg shadow-orange-500/20">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <p className="text-white font-bold text-center">
                        {selectedPrograms.length} program
                        {selectedPrograms.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-4 bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-black text-lg rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] group uppercase"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Continue
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Account Setup */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase">
                    Create Your Account
                  </h2>
                  <p className="text-gray-300 mt-2">
                    Final step - set up your login credentials
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        size={20}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-12 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-600 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-4 bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black text-lg rounded-xl transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl hover:scale-[1.02] group uppercase"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle size={24} />
                        Complete Registration
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80">
          <p className="text-sm font-medium">
            "Your fitness journey begins with one step" 💪
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
