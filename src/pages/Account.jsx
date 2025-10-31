import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Wallet,
  Banknote,
  User,
  Settings,
  ChevronRight,
  Upload,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";
import MakePaymentModal from "../components/MakePaymentModal";

const Account = () => {
  const [membership, setMembership] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [makePaymentModal, setMakePaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both membership and payments in parallel
      const [membershipRes, paymentsRes] = await Promise.all([
        axiosClient.get("/memberships/my-membership"),
        axiosClient.get("/payments/my?limit=100"),
      ]);

      const membershipData = membershipRes.data.data || membershipRes.data;
      setMembership(membershipData);

      const paymentsData = paymentsRes.data.data || paymentsRes.data;
      const paymentsArray = Array.isArray(paymentsData.data)
        ? paymentsData.data
        : Array.isArray(paymentsData)
        ? paymentsData
        : [];
      setPayments(paymentsArray);
    } catch (error) {
      console.error("Fetch account data error:", error);
      toast.error("Failed to load account data");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentPeriodLabel = (period) => {
    switch (period) {
      case "MONTHLY":
        return "Monthly";
      case "SIX_MONTHS":
        return "Every 6 Months";
      case "YEARLY":
        return "Yearly";
      default:
        return period;
    }
  };

  const handleMakePayment = (payment) => {
    setSelectedPayment(payment);
    setMakePaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    fetchData();
  };

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Show success message
    toast.success("Logged out successfully!");

    // Redirect to login
    window.location.href = "/login";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return {
          text: "Paid",
          icon: CheckCircle,
          bg: "bg-green-500/20",
          border: "border-green-400",
          text_color: "text-green-300",
        };
      case "PENDING_REVIEW":
        return {
          text: "Pending",
          icon: Clock,
          bg: "bg-amber-500/20",
          border: "border-amber-400",
          text_color: "text-amber-300",
        };
      case "UNPAID":
        return {
          text: "Unpaid",
          icon: XCircle,
          bg: "bg-red-500/20",
          border: "border-red-400",
          text_color: "text-red-300",
        };
      default:
        return {
          text: "Unknown",
          icon: XCircle,
          bg: "bg-gray-500/20",
          border: "border-gray-400",
          text_color: "text-gray-300",
        };
    }
  };

  const getMonthName = (month) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month - 1] || month;
  };

  const isMembershipActive =
    membership &&
    (!membership.endDate || new Date(membership.endDate) >= new Date());

  const paymentStats = {
    total: payments.reduce((sum, p) => sum + parseFloat(p.expectedAmount), 0),
    paid: payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + parseFloat(p.expectedAmount), 0),
    pending: payments
      .filter((p) => p.status === "PENDING_REVIEW")
      .reduce((sum, p) => sum + parseFloat(p.expectedAmount), 0),
    unpaid: payments
      .filter((p) => p.status === "UNPAID")
      .reduce((sum, p) => sum + parseFloat(p.expectedAmount), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
              My Account
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 sm:p-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Link
            to="/profile"
            className="group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/95 hover:bg-slate-700 rounded-xl shadow-lg border border-slate-700/50 transition-all"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-xs sm:text-sm truncate">
                My Profile
              </h3>
              <p className="text-xs text-gray-400 truncate hidden sm:block">
                View & edit details
              </p>
              <p className="text-xs text-gray-400 truncate sm:hidden">
                Edit info
              </p>
            </div>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
          </Link>
          <Link
            to="/settings"
            className="group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/95 hover:bg-slate-700 rounded-xl shadow-lg border border-slate-700/50 transition-all"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-xs sm:text-sm truncate">
                Settings
              </h3>
              <p className="text-xs text-gray-400 truncate hidden sm:block">
                Password & prefs
              </p>
              <p className="text-xs text-gray-400 truncate sm:hidden">
                Preferences
              </p>
            </div>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-purple-400 transition-colors flex-shrink-0" />
          </Link>
        </div>

        {/* Membership Card */}
        {membership ? (
          <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-purple-600 rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <CreditCard className="w-7 h-7 sm:w-9 sm:h-9 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase truncate">
                      My Membership
                    </h2>
                    <p className="text-orange-100 font-medium text-xs sm:text-sm truncate">
                      {membership.client?.fullName}
                    </p>
                  </div>
                </div>
                {isMembershipActive ? (
                  <span className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 bg-green-500/20 text-green-300 font-bold rounded-full text-xs sm:text-sm border border-green-400 self-start sm:self-auto">
                    <CheckCircle size={14} className="sm:w-4 sm:h-4" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 bg-red-500/20 text-red-300 font-bold rounded-full text-xs sm:text-sm border border-red-400 self-start sm:self-auto">
                    <XCircle size={14} className="sm:w-4 sm:h-4" /> Expired
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-white">
                <div>
                  <p className="text-orange-100 text-xs uppercase font-bold mb-1">
                    Monthly Fee
                  </p>
                  <p className="text-lg sm:text-2xl font-black truncate">
                    LKR {membership.baseMonthlyFee}
                  </p>
                </div>
                <div>
                  <p className="text-orange-100 text-xs uppercase font-bold mb-1">
                    Payment Period
                  </p>
                  <p className="text-lg sm:text-2xl font-black truncate">
                    {getPaymentPeriodLabel(membership.paymentPeriod)}
                  </p>
                </div>
                <div>
                  <p className="text-orange-100 text-xs uppercase font-bold mb-1">
                    Start Date
                  </p>
                  <p className="text-sm sm:text-lg font-bold">
                    {new Date(membership.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-orange-100 text-xs uppercase font-bold mb-1">
                    End Date
                  </p>
                  <p className="text-sm sm:text-lg font-bold truncate">
                    {membership.endDate
                      ? new Date(membership.endDate).toLocaleDateString()
                      : "Ongoing"}
                  </p>
                </div>
              </div>

              {/* Enrolled Programs */}
              {membership.client?.programs &&
                membership.client.programs.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h3 className="text-white font-black uppercase mb-3 text-sm">
                      Enrolled Programs
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {membership.client.programs.map((program) => (
                        <div
                          key={program.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-bold"
                        >
                          <Dumbbell className="w-4 h-4" />
                          {program.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-slate-700/50 text-center">
            <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2 uppercase">
              No Active Membership
            </h3>
            <p className="text-gray-400">
              Contact the gym to activate your membership
            </p>
          </div>
        )}

        {/* Payment Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <DollarSign className="w-7 h-7 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">
              Total
            </p>
            <p className="text-xl sm:text-2xl font-black text-white">
              LKR {paymentStats.total.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <CheckCircle className="w-7 h-7 text-green-400 mx-auto mb-2" />
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">
              Paid
            </p>
            <p className="text-xl sm:text-2xl font-black text-green-400">
              LKR {paymentStats.paid.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <Clock className="w-7 h-7 text-amber-400 mx-auto mb-2" />
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">
              Pending
            </p>
            <p className="text-xl sm:text-2xl font-black text-amber-400">
              LKR {paymentStats.pending.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <XCircle className="w-7 h-7 text-red-400 mx-auto mb-2" />
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">
              Unpaid
            </p>
            <p className="text-xl sm:text-2xl font-black text-red-400">
              LKR {paymentStats.unpaid.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Unpaid Payments - Action Required */}
        {payments.filter((p) => p.status === "UNPAID").length > 0 && (
          <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-red-500/50 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase">
                    Unpaid Payments
                  </h2>
                  <p className="text-red-200 text-sm">Action required</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-red-200 uppercase font-bold">
                  Total Due
                </p>
                <p className="text-2xl font-black text-white">
                  LKR{" "}
                  {payments
                    .filter((p) => p.status === "UNPAID")
                    .reduce((sum, p) => sum + parseFloat(p.expectedAmount), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {payments
                .filter((p) => p.status === "UNPAID")
                .map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-slate-900/60 rounded-xl p-4 border border-red-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-red-400" />
                        <div>
                          <h4 className="font-bold text-white">
                            {getMonthName(payment.paymentMonth)}{" "}
                            {payment.paymentYear}
                          </h4>
                          <p className="text-sm text-gray-400">
                            LKR {payment.expectedAmount}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMakePayment(payment)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Make Payment</span>
                        <span className="sm:hidden">Pay</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
              <p className="text-blue-200 text-sm">
                💡 <strong>Upload your bank receipt</strong> to mark these
                payments as pending review. Admin will approve within 1-2
                business days.
              </p>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <h2 className="text-2xl font-black text-white uppercase mb-6 flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-blue-400" />
            Payment History
          </h2>

          {payments.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-gray-400">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => {
                const badge = getStatusBadge(payment.status);
                const BadgeIcon = badge.icon;
                const paymentDate = new Date(
                  payment.year,
                  payment.month - 1,
                  1
                );
                return (
                  <div
                    key={payment.id}
                    className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-orange-400" />
                        <h4 className="font-bold text-white text-lg">
                          {paymentDate.toLocaleString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </h4>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 ${badge.bg} border ${badge.border} rounded-full`}
                      >
                        <BadgeIcon className={`w-4 h-4 ${badge.text_color}`} />
                        <span
                          className={`text-xs font-bold ${badge.text_color}`}
                        >
                          {badge.text}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-400 border-t border-slate-700 pt-3 mt-3">
                      <div>
                        <p className="text-xs uppercase font-bold text-gray-500 mb-1">
                          Expected Amount
                        </p>
                        <p className="font-semibold text-white">
                          LKR {payment.expectedAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-bold text-gray-500 mb-1">
                          Amount Paid
                        </p>
                        <p className="font-semibold text-white">
                          LKR {payment.amountPaid}
                        </p>
                      </div>
                      {payment.paymentMethod && (
                        <div className="col-span-2">
                          <p className="text-xs uppercase font-bold text-gray-500 mb-1">
                            Method
                          </p>
                          <span className="inline-flex items-center gap-2 font-semibold text-white">
                            {payment.paymentMethod === "BANK_TRANSFER" ? (
                              <Banknote className="w-4 h-4" />
                            ) : (
                              <CreditCard className="w-4 h-4" />
                            )}
                            {payment.paymentMethod === "CASH"
                              ? "Cash"
                              : "Bank Transfer"}
                          </span>
                        </div>
                      )}
                    </div>
                    {payment.approvedAt && (
                      <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-slate-700">
                        Approved on{" "}
                        {new Date(payment.approvedAt).toLocaleDateString()} by{" "}
                        {payment.approvedBy?.fullName || "Admin"}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full mb-4">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 animate-pulse" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 uppercase">
            Stay Committed!
          </h3>
          <p className="text-lg sm:text-xl text-orange-100 font-medium max-w-2xl mx-auto">
            Consistent payments ensure uninterrupted access to your fitness
            journey
          </p>
        </div>
      </div>

      {/* Make Payment Modal */}
      {makePaymentModal && (
        <MakePaymentModal
          payment={selectedPayment}
          onClose={() => {
            setMakePaymentModal(false);
            setSelectedPayment(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Account;
