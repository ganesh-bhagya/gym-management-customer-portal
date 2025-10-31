import { useState, useEffect } from "react";
import {
  Apple,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Cookie,
  Clock,
  RefreshCw,
  Flame,
  Target,
  Utensils,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../lib/axios";

const Diet = () => {
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/diet-plans/my");
      const data = response.data.data || response.data;
      const plansArray = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setDietPlans(plansArray);

      if (plansArray.length > 0) {
        setSelectedPlan(plansArray[0]);
      }
    } catch (error) {
      console.error("Fetch diet plans error:", error);
      toast.error("Failed to load diet plans");
      setDietPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const parsePlanText = (planText) => {
    try {
      return JSON.parse(planText);
    } catch (error) {
      console.error("Parse diet plan error:", error);
      return null;
    }
  };

  const getMealIcon = (mealKey) => {
    const icons = {
      breakfast: Sun,
      "morning-snack": Coffee,
      lunch: Utensils,
      "afternoon-snack": Cookie,
      dinner: Moon,
      "evening-snack": Apple,
    };
    return icons[mealKey] || Apple;
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
    return labels[mealKey] || mealKey;
  };

  const getMealEmoji = (mealKey) => {
    const emojis = {
      breakfast: "🌅",
      "morning-snack": "☕",
      lunch: "🍽️",
      "afternoon-snack": "🍪",
      dinner: "🌙",
      "evening-snack": "🍎",
    };
    return emojis[mealKey] || "🍴";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading your diet plan...</p>
        </div>
      </div>
    );
  }

  if (dietPlans.length === 0) {
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Apple className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
              My Nutrition
            </h1>
          </div>

          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-slate-700/50 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Apple className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-3">
                No Diet Plan Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Your nutritionist will create a personalized plan for you soon!
              </p>
              <button
                onClick={fetchDietPlans}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
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

  const planData = selectedPlan ? parsePlanText(selectedPlan.planText) : null;
  const meals = planData?.meals || {};

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

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Apple className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
                My Nutrition
              </h1>
              <p className="text-gray-400 text-sm">
                {selectedPlan?.title || "Diet Plan"}
              </p>
            </div>
          </div>

          <button
            onClick={fetchDietPlans}
            className="p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Period */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-white" />
              <div>
                <p className="text-white/80 text-xs font-bold uppercase">
                  Plan Duration
                </p>
                <p className="text-white text-lg font-black">
                  {selectedPlan?.effectiveFrom}
                  {selectedPlan?.effectiveTo &&
                    ` → ${selectedPlan.effectiveTo}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Macros Summary */}
        {planData?.macros && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {planData.macros.calories && (
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl p-4 border border-orange-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <p className="text-gray-400 text-xs font-bold uppercase">
                    Calories
                  </p>
                </div>
                <p className="text-3xl font-black text-white">
                  {planData.macros.calories}
                </p>
              </div>
            )}
            {planData.macros.protein && (
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl p-4 border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-red-400" />
                  <p className="text-gray-400 text-xs font-bold uppercase">
                    Protein
                  </p>
                </div>
                <p className="text-3xl font-black text-white">
                  {planData.macros.protein}
                  <span className="text-lg text-gray-400">g</span>
                </p>
              </div>
            )}
            {planData.macros.carbs && (
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Apple className="w-5 h-5 text-purple-400" />
                  <p className="text-gray-400 text-xs font-bold uppercase">
                    Carbs
                  </p>
                </div>
                <p className="text-3xl font-black text-white">
                  {planData.macros.carbs}
                  <span className="text-lg text-gray-400">g</span>
                </p>
              </div>
            )}
            {planData.macros.fats && (
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="w-5 h-5 text-green-400" />
                  <p className="text-gray-400 text-xs font-bold uppercase">
                    Fats
                  </p>
                </div>
                <p className="text-3xl font-black text-white">
                  {planData.macros.fats}
                  <span className="text-lg text-gray-400">g</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Daily Meals */}
        {Object.keys(meals).length > 0 && (
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5">
              <h2 className="text-2xl font-black text-white uppercase">
                Daily Meal Plan
              </h2>
            </div>

            {/* Meals List */}
            <div className="divide-y divide-slate-700/50">
              {Object.entries(meals)
                .filter(([_, mealData]) => mealData.enabled)
                .map(([mealKey, mealData]) => {
                  const Icon = getMealIcon(mealKey);

                  return (
                    <div
                      key={mealKey}
                      className="p-5 hover:bg-slate-800/50 transition-all"
                    >
                      {/* Meal Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl">{getMealEmoji(mealKey)}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-white uppercase">
                            {getMealLabel(mealKey)}
                          </h3>
                          {mealData.time && (
                            <p className="text-gray-400 text-sm flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {mealData.time}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Food Items */}
                      {mealData.items && mealData.items.length > 0 && (
                        <div className="ml-16 space-y-2">
                          {mealData.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 bg-slate-800 rounded-lg p-3"
                            >
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-300 flex-1">{item}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Trainer Notes */}
        {planData?.notes && (
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-white uppercase">
                Important Notes
              </h3>
            </div>
            <div className="space-y-2 ml-13">
              {planData.notes.split("\n").map((note, index) => (
                <p key={index} className="text-gray-300 flex items-start gap-2">
                  <span className="text-orange-400 font-bold">→</span>
                  <span>{note}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Card */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-center">
          <Apple className="w-12 h-12 text-white mx-auto mb-3" />
          <h3 className="text-2xl font-black text-white uppercase mb-2">
            Fuel Your Body Right!
          </h3>
          <p className="text-purple-100 font-medium">
            Consistent nutrition + hard work = Amazing results 💪
          </p>
        </div>
      </div>
    </div>
  );
};

export default Diet;
