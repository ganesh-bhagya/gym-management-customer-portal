import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

const DatePicker = ({
  value,
  onChange,
  label,
  required = false,
  minYear = 1940,
  maxYear = new Date().getFullYear(),
}) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setDay(String(date.getDate()).padStart(2, "0"));
        setMonth(String(date.getMonth() + 1).padStart(2, "0"));
        setYear(String(date.getFullYear()));
      }
    }
  }, [value]);

  // Update parent when date changes
  useEffect(() => {
    if (day && month && year) {
      const dateStr = `${year}-${month}-${day}`;
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        onChange(dateStr);
      }
    }
  }, [day, month, year]);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const days = Array.from({ length: 31 }, (_, i) => {
    const d = String(i + 1).padStart(2, "0");
    return { value: d, label: d };
  });

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
    const y = maxYear - i;
    return { value: String(y), label: String(y) };
  });

  return (
    <div>
      {label && (
        <label className="block text-sm font-bold text-gray-300 uppercase mb-2">
          <Calendar className="inline w-4 h-4 mr-2" />
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="grid grid-cols-3 gap-3">
        {/* Day */}
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required={required}
          className="px-4 py-3 bg-slate-800 border-2 border-slate-600 focus:border-blue-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* Month */}
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required={required}
          className="px-4 py-3 bg-slate-800 border-2 border-slate-600 focus:border-blue-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required={required}
          className="px-4 py-3 bg-slate-800 border-2 border-slate-600 focus:border-blue-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DatePicker;
