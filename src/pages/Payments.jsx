import { useState, useEffect } from "react";
import {
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Calendar,
  CreditCard,
  Banknote,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/payments/my?limit=100");
      const data = response.data.data || response.data;
      const paymentsArray = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setPayments(paymentsArray);
    } catch (error) {
      console.error("Fetch payments error:", error);
      toast.error("Failed to load payment history");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PAID: {
        icon: CheckCircle,
        text: "Paid",
        bg: "bg-green-500/20",
        border: "border-green-500",
        text_color: "text-green-300",
      },
      PENDING_REVIEW: {
        icon: Clock,
        text: "Pending",
        bg: "bg-yellow-500/20",
        border: "border-yellow-500",
        text_color: "text-yellow-300",
      },
      UNPAID: {
        icon: XCircle,
        text: "Unpaid",
        bg: "bg-red-500/20",
        border: "border-red-500",
        text_color: "text-red-300",
      },
    };
    return badges[status] || badges.UNPAID;
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

  const filteredPayments = filterStatus
    ? payments.filter((p) => p.status === filterStatus)
    : payments;

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === "PAID").length,
    pending: payments.filter((p) => p.status === "PENDING_REVIEW").length,
    unpaid: payments.filter((p) => p.status === "UNPAID").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading payments...</p>
        </div>
      </div>
    );
  }

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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
                Payment History
              </h1>
              <p className="text-gray-400 text-sm">
                {stats.total} payment record{stats.total !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <button
            onClick={fetchPayments}
            className="p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <button
            onClick={() => setFilterStatus("")}
            className={`p-4 rounded-xl border-2 transition-all ${
              filterStatus === ""
                ? "bg-slate-800 border-blue-500"
                : "bg-slate-900/95 border-slate-700/50 hover:border-slate-600"
            }`}
          >
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">
              Total
            </p>
            <p className="text-2xl font-black text-white">{stats.total}</p>
          </button>

          <button
            onClick={() => setFilterStatus("PAID")}
            className={`p-4 rounded-xl border-2 transition-all ${
              filterStatus === "PAID"
                ? "bg-slate-800 border-green-500"
                : "bg-slate-900/95 border-slate-700/50 hover:border-slate-600"
            }`}
          >
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">
              Paid
            </p>
            <p className="text-2xl font-black text-green-400">{stats.paid}</p>
          </button>

          <button
            onClick={() => setFilterStatus("PENDING_REVIEW")}
            className={`p-4 rounded-xl border-2 transition-all ${
              filterStatus === "PENDING_REVIEW"
                ? "bg-slate-800 border-yellow-500"
                : "bg-slate-900/95 border-slate-700/50 hover:border-slate-600"
            }`}
          >
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">
              Pending
            </p>
            <p className="text-2xl font-black text-yellow-400">
              {stats.pending}
            </p>
          </button>

          <button
            onClick={() => setFilterStatus("UNPAID")}
            className={`p-4 rounded-xl border-2 transition-all ${
              filterStatus === "UNPAID"
                ? "bg-slate-800 border-red-500"
                : "bg-slate-900/95 border-slate-700/50 hover:border-slate-600"
            }`}
          >
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">
              Unpaid
            </p>
            <p className="text-2xl font-black text-red-400">{stats.unpaid}</p>
          </button>
        </div>

        {/* Payments List */}
        {filteredPayments.length > 0 ? (
          <div className="space-y-3">
            {filteredPayments.map((payment) => {
              const badge = getStatusBadge(payment.status);
              const StatusIcon = badge.icon;

              return (
                <div
                  key={payment.id}
                  className="bg-slate-900/95 backdrop-blur-xl rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Date & Status */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-white font-black text-xs">
                          {getMonthName(payment.month)}
                        </span>
                        <span className="text-white font-black text-lg">
                          {payment.year}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-black text-lg">
                            {getMonthName(payment.month)} {payment.year}
                          </h3>
                          <div
                            className={`inline-flex items-center gap-1 px-3 py-1 ${badge.bg} border ${badge.border} rounded-full`}
                          >
                            <StatusIcon
                              className={`w-4 h-4 ${badge.text_color}`}
                            />
                            <span
                              className={`text-xs font-bold ${badge.text_color}`}
                            >
                              {badge.text}
                            </span>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="text-gray-400">
                            Expected:{" "}
                            <span className="text-white font-bold">
                              LKR {payment.expectedAmount}
                            </span>
                          </span>
                          {payment.amountPaid && payment.amountPaid !== "0" && (
                            <span className="text-gray-400">
                              Paid:{" "}
                              <span className="text-green-400 font-bold">
                                LKR {payment.amountPaid}
                              </span>
                            </span>
                          )}
                          {payment.paymentMethod && (
                            <span className="inline-flex items-center gap-1 text-gray-400">
                              {payment.paymentMethod === "CASH" ? (
                                <Banknote className="w-4 h-4" />
                              ) : (
                                <CreditCard className="w-4 h-4" />
                              )}
                              {payment.paymentMethod === "CASH"
                                ? "Cash"
                                : "Bank Transfer"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">
                        LKR {payment.expectedAmount}
                      </p>
                      {payment.approvedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Paid on{" "}
                          {new Date(payment.approvedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-slate-700/50 text-center">
            <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white uppercase mb-2">
              {filterStatus ? "No Payments Found" : "No Payment Records"}
            </h3>
            <p className="text-gray-400">
              {filterStatus
                ? `No ${filterStatus.toLowerCase()} payments to display`
                : "Your payment history will appear here"}
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-5">
          <p className="text-blue-200 text-sm">
            💡 <strong>Need help?</strong> Contact the gym office for payment
            inquiries or to make a payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payments;
