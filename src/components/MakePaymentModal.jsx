import { useState } from "react";
import {
  X,
  Upload,
  DollarSign,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const MakePaymentModal = ({ payment, onClose, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(
    payment?.expectedAmount || "0"
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload an image file (JPG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a receipt image to upload");
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("amountPaid", parseFloat(paymentAmount).toFixed(2));

      await axiosClient.post(
        `/payments/${payment.id}/upload-receipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Payment receipt uploaded! Waiting for admin approval.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Upload receipt error:", error);
      toast.error(error.response?.data?.message || "Failed to upload receipt");
    } finally {
      setUploading(false);
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

  if (!payment) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border-2 border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-white uppercase">
                Make Payment
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Upload your payment receipt
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Payment Details */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">
              Payment Details
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400 uppercase font-bold">
                    Period
                  </span>
                </div>
                <p className="text-white font-bold">
                  {getMonthName(payment.paymentMonth)} {payment.paymentYear}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400 uppercase font-bold">
                    Payment Amount *
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      LKR
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-slate-900 border-2 border-slate-600 focus:border-blue-500 rounded-lg text-white text-lg font-bold focus:ring-2 focus:ring-blue-500/50"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="text-gray-400 text-sm">
                    <p className="text-xs uppercase font-bold mb-1">
                      Expected:
                    </p>
                    <p className="text-white font-bold">
                      LKR {payment.expectedAmount}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  💡 You can pay partial amount or more than expected
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-200 text-sm font-bold mb-2">
                  Payment Instructions:
                </p>
                <ul className="text-blue-200 text-xs space-y-1">
                  <li>• Make the payment via bank transfer</li>
                  <li>• Take a clear photo of the receipt or transaction</li>
                  <li>• Upload the receipt using the form below</li>
                  <li>• Wait for admin approval (usually 1-2 business days)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white uppercase mb-3">
                Upload Receipt Image *
              </label>

              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  id="receipt-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="receipt-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 transition-colors bg-slate-800/50"
                >
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">
                    Click to upload receipt
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPG, PNG, or GIF (max 5MB)
                  </span>
                </label>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">
                    Preview:
                  </p>
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="w-full rounded-lg border-2 border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {selectedFile?.name} (
                    {(selectedFile?.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Payment Receipt
                </>
              )}
            </button>
          </form>

          {/* Bank Details (Optional - you can customize this) */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-gray-400 uppercase">
                Bank Details
              </h3>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                <span className="text-gray-500">Bank:</span> Commercial Bank
              </p>
              <p>
                <span className="text-gray-500">Account:</span> 1234567890
              </p>
              <p>
                <span className="text-gray-500">Branch:</span> Colombo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePaymentModal;
