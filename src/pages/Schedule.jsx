import { useState, useEffect } from "react";
import {
  Calendar,
  Dumbbell,
  Clock,
  RefreshCw,
  AlertCircle,
  Flame,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const Schedule = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/schedules/my-schedule");
      const data = response.data.data || response.data;
      const schedulesArray = Array.isArray(data) ? data : [];
      setSchedules(schedulesArray);

      // Auto-select first schedule
      if (schedulesArray.length > 0 && !selectedSchedule) {
        setSelectedSchedule(schedulesArray[0]);
      }
    } catch (error) {
      console.error("Fetch schedules error:", error);
      toast.error("Failed to load your schedule");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/training")}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Training</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
              My Workout Schedule
            </h1>
          </div>

          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-slate-700/50 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-3">
                No Workouts Assigned Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Your trainer hasn't created your workout schedule yet. Check
                back soon!
              </p>
              <button
                onClick={fetchSchedules}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/training")}
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Training</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
                My Workout Schedule
              </h1>
              <p className="text-gray-400 text-sm">
                {schedules.length} workout{schedules.length !== 1 ? "s" : ""} in
                your program
              </p>
            </div>
          </div>

          <button
            onClick={fetchSchedules}
            className="p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workout List (Left/Top) */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 p-4">
                <h3 className="text-white font-black uppercase text-sm">
                  Your Workouts
                </h3>
              </div>
              <div className="p-3 space-y-2">
                {schedules.map((schedule, index) => (
                  <button
                    key={schedule.id}
                    onClick={() => setSelectedSchedule(schedule)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedSchedule?.id === schedule.id
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                        : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          selectedSchedule?.id === schedule.id
                            ? "bg-white/20"
                            : "bg-slate-700"
                        }`}
                      >
                        <span
                          className={`font-black text-lg ${
                            selectedSchedule?.id === schedule.id
                              ? "text-white"
                              : "text-orange-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-black uppercase text-sm mb-1 truncate ${
                            selectedSchedule?.id === schedule.id
                              ? "text-white"
                              : "text-white"
                          }`}
                        >
                          {schedule.title || `Workout Day ${index + 1}`}
                        </h4>
                        {schedule.dayOfWeek && (
                          <p
                            className={`text-xs ${
                              selectedSchedule?.id === schedule.id
                                ? "text-white/80"
                                : "text-gray-500"
                            }`}
                          >
                            {schedule.dayOfWeek}
                          </p>
                        )}
                      </div>
                      {selectedSchedule?.id === schedule.id && (
                        <ChevronRight className="w-5 h-5 text-white flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-4">
              <p className="text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Do these workouts in order when you
                visit the gym. Take rest days as needed!
              </p>
            </div>
          </div>

          {/* Workout Details (Right/Bottom) */}
          <div className="lg:col-span-2">
            {selectedSchedule ? (
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                {/* Workout Header */}
                <div className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase mb-1">
                        {selectedSchedule.title || "Workout"}
                      </h3>
                      {selectedSchedule.description && (
                        <p className="text-orange-100 text-sm">
                          {selectedSchedule.description}
                        </p>
                      )}
                    </div>
                    {selectedSchedule.estimatedDurationMinutes && (
                      <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                        <Clock className="w-5 h-5 text-white" />
                        <span className="text-white font-bold">
                          {selectedSchedule.estimatedDurationMinutes}min
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Exercises */}
                <div className="p-5">
                  {selectedSchedule.exercises &&
                  selectedSchedule.exercises.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSchedule.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="bg-slate-800 rounded-xl p-4 hover:bg-slate-750 transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            {/* Exercise Number */}
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-black">
                                {index + 1}
                              </span>
                            </div>

                            {/* Exercise Details */}
                            <div className="flex-1">
                              <h4 className="text-white font-black text-lg mb-3 group-hover:text-orange-400 transition-colors">
                                {exercise.name}
                              </h4>

                              {/* Sets, Reps, Rest */}
                              <div className="flex flex-wrap gap-2">
                                {exercise.sets && (
                                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg">
                                    <Dumbbell className="w-4 h-4 text-orange-400" />
                                    <span className="text-white text-sm font-bold">
                                      {exercise.sets} sets
                                    </span>
                                  </div>
                                )}
                                {exercise.reps && (
                                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg">
                                    <RefreshCw className="w-4 h-4 text-red-400" />
                                    <span className="text-white text-sm font-bold">
                                      {exercise.reps} reps
                                    </span>
                                  </div>
                                )}
                                {exercise.restSeconds && (
                                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    <span className="text-white text-sm font-bold">
                                      {exercise.restSeconds}s rest
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Notes */}
                              {exercise.notes && (
                                <p className="text-gray-400 text-sm mt-3 bg-slate-900 p-3 rounded-lg">
                                  💡 {exercise.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">
                        No exercises assigned for this workout
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Select a workout from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 rounded-2xl p-6 text-center">
          <Flame className="w-10 h-10 text-white mx-auto mb-3 animate-pulse" />
          <h3 className="text-xl font-black text-white uppercase mb-2">
            Stay Consistent!
          </h3>
          <p className="text-orange-100 font-medium">
            Complete these workouts in order for best results 💪
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
