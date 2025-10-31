import { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Dumbbell,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Flame,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const Membership = () => {
  const navigate = useNavigate();
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/memberships/my-membership");
      const data = response.data.data || response.data;
      setMembership(data);
    } catch (error) {
      console.error("Fetch membership error:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load membership details");
      }
      setMembership(null);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = (period) => {
    const labels = {
      MONTHLY: "Monthly",
      SIX_MONTHS: "6 Months",
      YEARLY: "Yearly",
    };
    return labels[period] || period;
  };

  const isActive = () => {
    if (!membership?.endDate) return true;
    const endDate = new Date(membership.endDate);
    return endDate >= new Date();
  };

  const getDaysRemaining = () => {
    if (!membership?.endDate) return null;
    const endDate = new Date(membership.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading membership...</p>
        </div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/profile")}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Profile</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
              My Membership
            </h1>
          </div>

          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-slate-700/50 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-3">
                No Active Membership
              </h3>
              <p className="text-gray-400 mb-6">
                Contact the gym to activate your membership
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const active = isActive();
  const daysRemaining = getDaysRemaining();
  const programs = membership.client?.programs || [];

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Profile</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
                My Membership
              </h1>
              <p className="text-gray-400 text-sm">
                {active ? "Active Membership" : "Expired Membership"}
              </p>
            </div>
          </div>

          <button
            onClick={fetchMembership}
            className="p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Membership Card */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative z-10">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                {active ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-sm uppercase">
                      Active
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-sm uppercase">
                      Expired
                    </span>
                  </>
                )}
              </div>
              <div className="text-white text-sm font-bold">
                {getPeriodLabel(membership.paymentPeriod)}
              </div>
            </div>

            {/* Member Info */}
            <div className="mb-8">
              <p className="text-white/80 text-sm uppercase tracking-wide mb-1">
                Member
              </p>
              <h2 className="text-3xl font-black text-white">
                {membership.client?.fullName || "Member"}
              </h2>
            </div>

            {/* Membership Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-xs uppercase mb-1">
                  Start Date
                </p>
                <p className="text-white font-bold">{membership.startDate}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase mb-1">
                  {membership.endDate ? "End Date" : "Duration"}
                </p>
                <p className="text-white font-bold">
                  {membership.endDate || "Ongoing"}
                </p>
              </div>
            </div>

            {/* Days Remaining Alert */}
            {active && daysRemaining !== null && daysRemaining <= 30 && (
              <div className="mt-4 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/50 rounded-xl p-3">
                <p className="text-yellow-100 text-sm font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {daysRemaining} days remaining
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Amount */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-sm uppercase mb-1">
                {getPeriodLabel(membership.paymentPeriod)} Fee
              </p>
              <p className="text-4xl font-black text-white">
                LKR {membership.baseMonthlyFee}
              </p>
            </div>
          </div>
        </div>

        {/* Enrolled Programs */}
        {programs.length > 0 && (
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5">
              <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                <Dumbbell className="w-6 h-6" />
                Enrolled Programs
              </h2>
            </div>

            <div className="p-5 space-y-3">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-slate-800 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Flame className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-black uppercase">
                      {program.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {program.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-bold text-sm">
                      LKR {program.monthlyFee}
                    </p>
                    <p className="text-gray-500 text-xs">/month</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {membership.notes && (
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 mb-6">
            <h3 className="text-white font-black uppercase mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Notes
            </h3>
            <p className="text-gray-300">{membership.notes}</p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-800/50 rounded-xl p-5">
          <p className="text-green-200 text-sm">
            💡 <strong>Need help?</strong> Contact the gym staff for membership
            inquiries or renewals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Membership;
