import { useState, useEffect } from "react";
import {
  Calendar,
  Apple,
  Dumbbell,
  Clock,
  RefreshCw,
  Flame,
  ChevronRight,
  Target,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cookie,
  TrendingUp,
  TrendingDown,
  Scale,
  Ruler,
  Camera,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";
import ReactApexChart from "react-apexcharts";

const Training = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [schedules, setSchedules] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch schedule, diet, and progress in parallel
      const [scheduleRes, dietRes, progressRes] = await Promise.all([
        axiosClient.get("/schedules/my-schedule"),
        axiosClient.get("/diet-plans/my"),
        axiosClient.get("/progress/my?limit=100"),
      ]);

      const schedulesData = scheduleRes.data.data || scheduleRes.data;
      const schedulesArray = Array.isArray(schedulesData) ? schedulesData : [];
      setSchedules(schedulesArray);
      if (schedulesArray.length > 0) {
        setSelectedSchedule(schedulesArray[0]);
      }

      const dietData = dietRes.data.data || dietRes.data;
      const dietArray = Array.isArray(dietData.data)
        ? dietData.data
        : Array.isArray(dietData)
        ? dietData
        : [];
      setDietPlans(dietArray);

      const progressData = progressRes.data.data || progressRes.data;
      const progressArray = Array.isArray(progressData.data)
        ? progressData.data
        : Array.isArray(progressData)
        ? progressData
        : [];
      setProgressEntries(progressArray);
    } catch (error) {
      console.error("Fetch training data error:", error);
      toast.error("Failed to load training data");
    } finally {
      setLoading(false);
    }
  };

  const parsePlanText = (planText) => {
    try {
      return JSON.parse(planText);
    } catch (error) {
      return null;
    }
  };

  // Prepare chart data from progress entries
  const prepareChartData = () => {
    if (progressEntries.length === 0) return null;

    // Sort entries by date (oldest first)
    const sorted = [...progressEntries].sort(
      (a, b) =>
        new Date(a.dateRecorded).getTime() - new Date(b.dateRecorded).getTime()
    );

    const dates = sorted.map((entry) =>
      new Date(entry.dateRecorded).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );

    const weightData = sorted.map(
      (entry) => parseFloat(entry.weightKg) || null
    );
    const chestData = sorted.map((entry) =>
      entry.chestCm ? parseFloat(entry.chestCm) : null
    );
    const waistData = sorted.map((entry) =>
      entry.waistCm ? parseFloat(entry.waistCm) : null
    );
    const armData = sorted.map((entry) =>
      entry.armCm ? parseFloat(entry.armCm) : null
    );
    const hipData = sorted.map((entry) =>
      entry.hipCm ? parseFloat(entry.hipCm) : null
    );
    const bodyFatData = sorted.map((entry) =>
      entry.bodyFatPercent ? parseFloat(entry.bodyFatPercent) : null
    );

    // Calculate trends (first vs last)
    const getTrend = (data) => {
      const filtered = data.filter((v) => v !== null);
      if (filtered.length < 2) return null;
      const first = filtered[0];
      const last = filtered[filtered.length - 1];
      return { first, last, change: last - first };
    };

    const weightTrend = getTrend(weightData);
    const chestTrend = getTrend(chestData);
    const waistTrend = getTrend(waistData);

    return {
      dates,
      weightData,
      chestData,
      waistData,
      armData,
      hipData,
      bodyFatData,
      weightTrend,
      chestTrend,
      waistTrend,
    };
  };

  const chartData = prepareChartData();
  const isDark = true; // Always dark theme

  const getMealIcon = (mealKey) => {
    const icons = {
      breakfast: Sun,
      "morning-snack": Coffee,
      lunch: Utensils,
      "afternoon-snack": Cookie,
      dinner: Moon,
      "evening-snack": Apple,
    };
    return icons[mealKey] || Utensils;
  };

  const getMealLabel = (mealKey) => {
    const labels = {
      breakfast: "Breakfast",
      "morning-snack": "Morning Snack",
      lunch: "Lunch",
      "afternoon-snack": "Afternoon Snack",
      dinner: "Dinner",
      "evening-snack": "Evening Snack",
    };
    return (
      labels[mealKey] ||
      mealKey
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading your training plan...</p>
        </div>
      </div>
    );
  }

  const currentDietPlan = dietPlans[0];
  const dietData = currentDietPlan
    ? parsePlanText(currentDietPlan.planText)
    : null;
  const meals = dietData?.meals || {};
  const enabledMeals = Object.entries(meals).filter(([, meal]) => meal.enabled);

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
              My Training
            </h1>
          </div>
          <button
            onClick={fetchData}
            className="p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === "schedule"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="hidden sm:inline">Workout </span>Schedule
          </button>
          <button
            onClick={() => setActiveTab("diet")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === "diet"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
            }`}
          >
            <Apple className="w-5 h-5" />
            <span className="hidden sm:inline">Diet </span>Plan
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === "progress"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Progress
          </button>
        </div>

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <>
            {schedules.length === 0 ? (
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
                <Dumbbell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2 uppercase">
                  No Workouts Assigned Yet
                </h3>
                <p className="text-gray-400">
                  Your trainer hasn't created your workout schedule yet. Check
                  back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Workout List */}
                <div className="lg:col-span-1 space-y-3">
                  <h2 className="text-lg font-black text-white uppercase mb-4">
                    Your Workouts
                  </h2>
                  {schedules.map((schedule, index) => (
                    <button
                      key={schedule.id}
                      onClick={() => setSelectedSchedule(schedule)}
                      className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                        selectedSchedule?.id === schedule.id
                          ? "border-orange-500 bg-gradient-to-r from-orange-600/20 to-red-600/20"
                          : "border-slate-700 bg-slate-800 hover:border-orange-500/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full font-bold text-sm text-white">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-bold text-white">
                            {schedule.title}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {schedule.estimatedDurationMinutes} min |{" "}
                            {schedule.exercises?.length || 0} exercises
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Workout Details */}
                <div className="lg:col-span-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  {selectedSchedule ? (
                    <>
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/50">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                          <Dumbbell className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-white uppercase">
                            {selectedSchedule.title}
                          </h2>
                          <p className="text-sm text-gray-400">
                            {selectedSchedule.program?.name} |{" "}
                            {selectedSchedule.estimatedDurationMinutes} minutes
                          </p>
                        </div>
                      </div>

                      {selectedSchedule.description && (
                        <div className="mb-6 p-4 bg-slate-800 rounded-lg">
                          <p className="text-gray-400 text-sm">
                            {selectedSchedule.description}
                          </p>
                        </div>
                      )}

                      <h3 className="text-xl font-black text-white uppercase mb-4">
                        Exercises
                      </h3>
                      <div className="space-y-4">
                        {selectedSchedule.exercises?.map((exercise, index) => (
                          <div
                            key={index}
                            className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                          >
                            <h4 className="font-bold text-white text-lg mb-2">
                              {exercise.name}
                            </h4>
                            <div className="grid grid-cols-3 gap-3 text-sm text-gray-400">
                              <p>
                                <Flame className="inline w-4 h-4 mr-1 text-red-400" />
                                Sets:{" "}
                                <span className="font-semibold">
                                  {exercise.sets}
                                </span>
                              </p>
                              <p>
                                <RefreshCw className="inline w-4 h-4 mr-1 text-blue-400" />
                                Reps:{" "}
                                <span className="font-semibold">
                                  {exercise.reps}
                                </span>
                              </p>
                              <p>
                                <Clock className="inline w-4 h-4 mr-1 text-purple-400" />
                                Rest:{" "}
                                <span className="font-semibold">
                                  {exercise.restSeconds}s
                                </span>
                              </p>
                            </div>
                            {exercise.notes && (
                              <p className="text-xs text-gray-500 mt-3 p-2 bg-slate-700 rounded-md">
                                💡 {exercise.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Dumbbell className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-gray-400">
                        Select a workout to see details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Diet Tab */}
        {activeTab === "diet" && (
          <>
            {!currentDietPlan ? (
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
                <Apple className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2 uppercase">
                  No Diet Plan Assigned Yet
                </h3>
                <p className="text-gray-400">
                  Your nutritionist hasn't created your diet plan yet. Check
                  back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Diet Plan Header */}
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-center shadow-xl">
                  <h2 className="text-2xl font-black text-white uppercase mb-2">
                    {currentDietPlan.title}
                  </h2>
                  <p className="text-purple-100 font-medium text-sm">
                    Effective from{" "}
                    {new Date(
                      currentDietPlan.effectiveFrom
                    ).toLocaleDateString()}
                    {currentDietPlan.effectiveTo &&
                      ` to ${new Date(
                        currentDietPlan.effectiveTo
                      ).toLocaleDateString()}`}
                  </p>
                </div>

                {/* Macros */}
                {dietData?.macros && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dietData.macros.calories && (
                      <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                        <Flame className="w-7 h-7 text-orange-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-xs font-bold uppercase">
                          Calories
                        </p>
                        <p className="text-2xl font-black text-white">
                          {dietData.macros.calories}
                        </p>
                      </div>
                    )}
                    {dietData.macros.protein && (
                      <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                        <Target className="w-7 h-7 text-red-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-xs font-bold uppercase">
                          Protein
                        </p>
                        <p className="text-2xl font-black text-white">
                          {dietData.macros.protein}g
                        </p>
                      </div>
                    )}
                    {dietData.macros.carbs && (
                      <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                        <Apple className="w-7 h-7 text-purple-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-xs font-bold uppercase">
                          Carbs
                        </p>
                        <p className="text-2xl font-black text-white">
                          {dietData.macros.carbs}g
                        </p>
                      </div>
                    )}
                    {dietData.macros.fats && (
                      <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                        <Coffee className="w-7 h-7 text-green-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-xs font-bold uppercase">
                          Fats
                        </p>
                        <p className="text-2xl font-black text-white">
                          {dietData.macros.fats}g
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Meals */}
                <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-black text-white uppercase mb-4">
                    Your Daily Meals
                  </h3>
                  <div className="space-y-4">
                    {enabledMeals.length > 0 ? (
                      enabledMeals.map(([mealKey, meal], index) => {
                        const MealIcon = getMealIcon(mealKey);
                        return (
                          <div
                            key={index}
                            className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <MealIcon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-white uppercase">
                                  {getMealLabel(mealKey)}
                                </h4>
                                {meal.time && (
                                  <p className="text-xs text-gray-400">
                                    ⏰ {meal.time}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              {meal.items?.map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex items-start gap-2 p-2 bg-slate-700 rounded-lg"
                                >
                                  <span className="text-orange-400 font-bold">
                                    •
                                  </span>
                                  <p className="text-gray-200 text-sm flex-1">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Utensils className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-gray-400">No meals defined</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {dietData?.notes && (
                  <div className="bg-blue-900/20 border-2 border-blue-800 rounded-2xl p-6">
                    <h4 className="text-lg font-black text-white uppercase mb-3">
                      Trainer Notes
                    </h4>
                    <p className="text-blue-200 text-sm whitespace-pre-line">
                      {dietData.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <>
            {progressEntries.length === 0 ? (
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
                <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2 uppercase">
                  No Progress Entries Yet
                </h3>
                <p className="text-gray-400">
                  Start tracking your progress! Weight, measurements, and photos
                  will be shown here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Summary Cards */}
                {chartData && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {chartData.weightTrend && (
                      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-5 border border-blue-500/50">
                        <div className="flex items-center justify-between mb-2">
                          <Scale className="w-6 h-6 text-white/80" />
                          {chartData.weightTrend.change < 0 ? (
                            <TrendingDown className="w-5 h-5 text-green-200" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-red-200" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-white/80 uppercase mb-1">
                          Weight Change
                        </p>
                        <p className="text-2xl font-black text-white">
                          {chartData.weightTrend.change > 0 ? "+" : ""}
                          {chartData.weightTrend.change.toFixed(1)} kg
                        </p>
                        <p className="text-xs text-white/70 mt-1">
                          {chartData.weightTrend.first}kg →{" "}
                          {chartData.weightTrend.last}kg
                        </p>
                      </div>
                    )}

                    {chartData.chestTrend && (
                      <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-5 border border-orange-500/50">
                        <div className="flex items-center justify-between mb-2">
                          <Ruler className="w-6 h-6 text-white/80" />
                          {chartData.chestTrend.change > 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-200" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-200" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-white/80 uppercase mb-1">
                          Chest Change
                        </p>
                        <p className="text-2xl font-black text-white">
                          {chartData.chestTrend.change > 0 ? "+" : ""}
                          {chartData.chestTrend.change.toFixed(1)} cm
                        </p>
                        <p className="text-xs text-white/70 mt-1">
                          {chartData.chestTrend.first}cm →{" "}
                          {chartData.chestTrend.last}cm
                        </p>
                      </div>
                    )}

                    {chartData.waistTrend && (
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-5 border border-purple-500/50">
                        <div className="flex items-center justify-between mb-2">
                          <Ruler className="w-6 h-6 text-white/80" />
                          {chartData.waistTrend.change < 0 ? (
                            <TrendingDown className="w-5 h-5 text-green-200" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-red-200" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-white/80 uppercase mb-1">
                          Waist Change
                        </p>
                        <p className="text-2xl font-black text-white">
                          {chartData.waistTrend.change > 0 ? "+" : ""}
                          {chartData.waistTrend.change.toFixed(1)} cm
                        </p>
                        <p className="text-xs text-white/70 mt-1">
                          {chartData.waistTrend.first}cm →{" "}
                          {chartData.waistTrend.last}cm
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Charts */}
                {chartData && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weight Chart */}
                    {chartData.weightData.filter((v) => v !== null).length >
                      0 && (
                      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                        <h3 className="text-lg font-black text-white uppercase mb-4 flex items-center gap-2">
                          <Scale className="w-5 h-5 text-blue-400" />
                          Weight Trend
                        </h3>
                        <ReactApexChart
                          type="line"
                          height={280}
                          series={[
                            {
                              name: "Weight (kg)",
                              data: chartData.weightData,
                            },
                          ]}
                          options={{
                            chart: {
                              type: "line",
                              height: 280,
                              toolbar: { show: false },
                              zoom: { enabled: false },
                              background: "transparent",
                            },
                            theme: { mode: "dark" },
                            stroke: {
                              curve: "smooth",
                              width: 3,
                              colors: ["#3B82F6"],
                            },
                            markers: {
                              size: 5,
                              colors: ["#3B82F6"],
                              strokeColors: "#fff",
                              strokeWidth: 2,
                            },
                            grid: {
                              borderColor: "#475569",
                              strokeDashArray: 5,
                            },
                            xaxis: {
                              categories: chartData.dates,
                              labels: {
                                style: { colors: "#94a3b8", fontSize: "11px" },
                              },
                            },
                            yaxis: {
                              labels: {
                                style: { colors: "#94a3b8" },
                                formatter: (val) => `${val} kg`,
                              },
                            },
                            colors: ["#3B82F6"],
                            tooltip: {
                              theme: "dark",
                              y: { formatter: (val) => `${val} kg` },
                            },
                          }}
                        />
                      </div>
                    )}

                    {/* Body Measurements Chart */}
                    {(chartData.chestData.filter((v) => v !== null).length >
                      0 ||
                      chartData.waistData.filter((v) => v !== null).length >
                        0 ||
                      chartData.armData.filter((v) => v !== null).length > 0 ||
                      chartData.hipData.filter((v) => v !== null).length >
                        0) && (
                      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                        <h3 className="text-lg font-black text-white uppercase mb-4 flex items-center gap-2">
                          <Ruler className="w-5 h-5 text-orange-400" />
                          Body Measurements
                        </h3>
                        <ReactApexChart
                          type="line"
                          height={280}
                          series={[
                            {
                              name: "Chest",
                              data: chartData.chestData,
                            },
                            {
                              name: "Waist",
                              data: chartData.waistData,
                            },
                            {
                              name: "Arms",
                              data: chartData.armData,
                            },
                            {
                              name: "Hips",
                              data: chartData.hipData,
                            },
                          ]}
                          options={{
                            chart: {
                              type: "line",
                              height: 280,
                              toolbar: { show: false },
                              zoom: { enabled: false },
                              background: "transparent",
                            },
                            theme: { mode: "dark" },
                            stroke: {
                              curve: "smooth",
                              width: 3,
                            },
                            markers: {
                              size: 4,
                              strokeColors: "#fff",
                              strokeWidth: 2,
                            },
                            grid: {
                              borderColor: "#475569",
                              strokeDashArray: 5,
                            },
                            xaxis: {
                              categories: chartData.dates,
                              labels: {
                                style: { colors: "#94a3b8", fontSize: "11px" },
                              },
                            },
                            yaxis: {
                              labels: {
                                style: { colors: "#94a3b8" },
                                formatter: (val) => `${val} cm`,
                              },
                            },
                            colors: [
                              "#F97316",
                              "#A855F7",
                              "#10B981",
                              "#EC4899",
                            ],
                            legend: {
                              position: "top",
                              labels: { colors: "#94a3b8" },
                            },
                            tooltip: {
                              theme: "dark",
                              y: { formatter: (val) => `${val} cm` },
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Body Fat Chart */}
                {chartData &&
                  chartData.bodyFatData.filter((v) => v !== null).length >
                    0 && (
                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                      <h3 className="text-lg font-black text-white uppercase mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-yellow-400" />
                        Body Fat Percentage
                      </h3>
                      <ReactApexChart
                        type="area"
                        height={250}
                        series={[
                          {
                            name: "Body Fat %",
                            data: chartData.bodyFatData,
                          },
                        ]}
                        options={{
                          chart: {
                            type: "area",
                            height: 250,
                            toolbar: { show: false },
                            zoom: { enabled: false },
                            background: "transparent",
                          },
                          theme: { mode: "dark" },
                          stroke: {
                            curve: "smooth",
                            width: 3,
                            colors: ["#EAB308"],
                          },
                          fill: {
                            type: "gradient",
                            gradient: {
                              shadeIntensity: 1,
                              opacityFrom: 0.7,
                              opacityTo: 0.1,
                              colorStops: [
                                {
                                  offset: 0,
                                  color: "#EAB308",
                                  opacity: 0.8,
                                },
                                {
                                  offset: 100,
                                  color: "#EAB308",
                                  opacity: 0.1,
                                },
                              ],
                            },
                          },
                          markers: {
                            size: 5,
                            colors: ["#EAB308"],
                            strokeColors: "#fff",
                            strokeWidth: 2,
                          },
                          grid: {
                            borderColor: "#475569",
                            strokeDashArray: 5,
                          },
                          xaxis: {
                            categories: chartData.dates,
                            labels: {
                              style: { colors: "#94a3b8", fontSize: "11px" },
                            },
                          },
                          yaxis: {
                            labels: {
                              style: { colors: "#94a3b8" },
                              formatter: (val) => `${val}%`,
                            },
                          },
                          colors: ["#EAB308"],
                          tooltip: {
                            theme: "dark",
                            y: { formatter: (val) => `${val}%` },
                          },
                        }}
                      />
                    </div>
                  )}

                {/* Progress Entries List */}
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white uppercase mb-4">
                    Progress History
                  </h3>
                  {progressEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-black text-white uppercase">
                            {new Date(entry.dateRecorded).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Recorded by{" "}
                            {entry.recordedBy?.email?.split("@")[0] || "Admin"}
                          </p>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Scale className="w-5 h-5 text-blue-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase">
                              Weight
                            </span>
                          </div>
                          <p className="text-2xl font-black text-white">
                            {entry.weightKg}
                            <span className="text-sm text-gray-400 ml-1">
                              kg
                            </span>
                          </p>
                        </div>

                        {entry.chestCm && (
                          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Ruler className="w-5 h-5 text-orange-400" />
                              <span className="text-xs font-bold text-gray-400 uppercase">
                                Chest
                              </span>
                            </div>
                            <p className="text-2xl font-black text-white">
                              {entry.chestCm}
                              <span className="text-sm text-gray-400 ml-1">
                                cm
                              </span>
                            </p>
                          </div>
                        )}

                        {entry.waistCm && (
                          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Ruler className="w-5 h-5 text-purple-400" />
                              <span className="text-xs font-bold text-gray-400 uppercase">
                                Waist
                              </span>
                            </div>
                            <p className="text-2xl font-black text-white">
                              {entry.waistCm}
                              <span className="text-sm text-gray-400 ml-1">
                                cm
                              </span>
                            </p>
                          </div>
                        )}

                        {entry.armCm && (
                          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Ruler className="w-5 h-5 text-green-400" />
                              <span className="text-xs font-bold text-gray-400 uppercase">
                                Arms
                              </span>
                            </div>
                            <p className="text-2xl font-black text-white">
                              {entry.armCm}
                              <span className="text-sm text-gray-400 ml-1">
                                cm
                              </span>
                            </p>
                          </div>
                        )}

                        {entry.hipCm && (
                          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Ruler className="w-5 h-5 text-pink-400" />
                              <span className="text-xs font-bold text-gray-400 uppercase">
                                Hips
                              </span>
                            </div>
                            <p className="text-2xl font-black text-white">
                              {entry.hipCm}
                              <span className="text-sm text-gray-400 ml-1">
                                cm
                              </span>
                            </p>
                          </div>
                        )}

                        {entry.bodyFatPercent && (
                          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-5 h-5 text-yellow-400" />
                              <span className="text-xs font-bold text-gray-400 uppercase">
                                Body Fat
                              </span>
                            </div>
                            <p className="text-2xl font-black text-white">
                              {entry.bodyFatPercent}
                              <span className="text-sm text-gray-400 ml-1">
                                %
                              </span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {entry.notes && (
                        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                          <p className="text-gray-300 text-sm">{entry.notes}</p>
                        </div>
                      )}

                      {/* Photos */}
                      {entry.photoUrl && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Camera className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-bold text-gray-400 uppercase">
                              Progress Photo
                            </span>
                          </div>
                          <img
                            src={entry.photoUrl}
                            alt="Progress"
                            className="w-full max-w-md rounded-lg border-2 border-slate-700"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Training;
