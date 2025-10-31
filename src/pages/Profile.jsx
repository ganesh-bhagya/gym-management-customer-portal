import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Ruler,
  Scale,
  Heart,
  UserCircle,
  Edit2,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    heightCm: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalNotes: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/clients/me");
      const data = response.data.data || response.data;
      setProfile(data);
      setFormData({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        heightCm: data.heightCm || "",
        emergencyContactName: data.emergencyContactName || "",
        emergencyContactPhone: data.emergencyContactPhone || "",
        medicalNotes: data.medicalNotes || "",
      });
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosClient.patch(`/clients/${profile.id}`, formData);
      toast.success("Profile updated successfully!");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data to original profile
    setFormData({
      fullName: profile.fullName || "",
      phoneNumber: profile.phoneNumber || "",
      heightCm: profile.heightCm || "",
      emergencyContactName: profile.emergencyContactName || "",
      emergencyContactPhone: profile.emergencyContactPhone || "",
      medicalNotes: profile.medicalNotes || "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white mb-2">
            Profile Not Found
          </h3>
          <p className="text-gray-400">
            Unable to load your profile information
          </p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
                My Profile
              </h1>
              <p className="text-gray-400 text-sm">
                View and edit your personal information
              </p>
            </div>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {saving ? "Saving..." : "Save"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          {/* Account Info (Read-only) */}
          <div className="mb-6 pb-6 border-b border-slate-700">
            <h2 className="text-lg font-black text-white uppercase mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                  <p className="text-white font-medium">
                    {profile.user?.email}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  <UserCircle className="inline w-4 h-4 mr-1" />
                  Gender
                </label>
                <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                  <p className="text-white font-medium">{profile.gender}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Date of Birth
                </label>
                <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                  <p className="text-white font-medium">
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  <Scale className="inline w-4 h-4 mr-1" />
                  Initial Weight
                </label>
                <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                  <p className="text-white font-medium">
                    {profile.initialWeightKg} kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Personal Info */}
          <div className="mb-6 pb-6 border-b border-slate-700">
            <h2 className="text-lg font-black text-white uppercase mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                    <p className="text-white font-medium">{profile.fullName}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone Number *
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                    <p className="text-white font-medium">
                      {profile.phoneNumber}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  <Ruler className="inline w-4 h-4 mr-1" />
                  Height (cm) *
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) =>
                      setFormData({ ...formData, heightCm: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                    <p className="text-white font-medium">
                      {profile.heightCm} cm
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-6 pb-6 border-b border-slate-700">
            <h2 className="text-lg font-black text-white uppercase mb-4">
              Emergency Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Contact Name *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                    <p className="text-white font-medium">
                      {profile.emergencyContactName}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Contact Phone *
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                    <p className="text-white font-medium">
                      {profile.emergencyContactPhone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Medical Notes */}
          <div>
            <h2 className="text-lg font-black text-white uppercase mb-4">
              Medical Information
            </h2>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                <Heart className="inline w-4 h-4 mr-1" />
                Medical Notes
              </label>
              {editing ? (
                <textarea
                  value={formData.medicalNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, medicalNotes: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Any allergies, conditions, or health notes..."
                />
              ) : (
                <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700 min-h-[100px]">
                  <p className="text-white">
                    {profile.medicalNotes || (
                      <span className="text-gray-500 italic">
                        No medical notes
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        {editing && (
          <div className="bg-blue-900/20 border-2 border-blue-800 rounded-2xl p-4">
            <p className="text-blue-200 text-sm text-center">
              💡 Some fields like email, gender, and date of birth cannot be
              changed. Contact the gym administration if you need to update
              these.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
