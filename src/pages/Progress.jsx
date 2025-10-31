import { TrendingUp } from "lucide-react";

const Progress = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase">
            My Progress
          </h1>
        </div>

        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <p className="text-gray-300 text-center">
            Progress tracking coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Progress;
