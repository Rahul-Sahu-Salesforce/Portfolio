import React, { useEffect, useMemo, useState } from "react";

const START_DATE = new Date(2025, 10, 1);
const TOTAL_DAYS = 120;
const WEEKS = Math.ceil(TOTAL_DAYS / 7);
const STORAGE_KEY = "bulk_plan_v4";
const USER_NAME = "Rahul";

const workoutA = [
  { day: "Monday", workout: "Chest", emoji: "💪" },
  { day: "Tuesday", workout: "Abs + Calves", emoji: "🔥" },
  { day: "Wednesday", workout: "Back + Traps", emoji: "🚣" },
  { day: "Thursday", workout: "Leg day", emoji: "🦵" },
  { day: "Friday", workout: "Arms", emoji: "💪" },
  { day: "Saturday", workout: "Abs + Shoulders", emoji: "🏋️" },
  { day: "Sunday", workout: "Rest day", emoji: "😴" },
];

const workoutB = [
  { day: "Monday", workout: "Chest + Triceps", emoji: "💪" },
  { day: "Tuesday", workout: "Back + Traps", emoji: "🚣" },
  { day: "Wednesday", workout: "Abs + Calves", emoji: "🔥" },
  { day: "Thursday", workout: "Delts + Biceps", emoji: "🏋️" },
  { day: "Friday", workout: "Leg day", emoji: "🦵" },
  { day: "Saturday", workout: "Arms", emoji: "💪" },
  { day: "Sunday", workout: "Rest day", emoji: "😴" },
];

const exercisesMap = {
  Chest: [
    { name: "Barbell Bench Press", emoji: "💪", sets: 4, reps: "8-10" },
    { name: "Incline Dumbbell Press", emoji: "🏋️", sets: 3, reps: "10-12" },
    { name: "Cable Fly", emoji: "🦅", sets: 3, reps: "12-15" },
    { name: "Push-Ups", emoji: "⬇️", sets: 3, reps: "15-20" },
    { name: "Chest Dips", emoji: "💪", sets: 3, reps: "10-12" },
  ],
  Abs: [
    { name: "Hanging Leg Raises", emoji: "🦵", sets: 3, reps: "12-15" },
    { name: "Weighted Cable Crunch", emoji: "💥", sets: 3, reps: "15-20" },
    { name: "Plank", emoji: "⏱️", sets: 3, reps: "60s" },
    { name: "Russian Twist", emoji: "🔄", sets: 3, reps: "20-25" },
  ],
  Calves: [
    { name: "Standing Calf Raises", emoji: "🦵", sets: 4, reps: "15-20" },
    { name: "Seated Calf Raises", emoji: "🦿", sets: 3, reps: "15-20" }
  ],
  Back: [
    { name: "Pull-Ups", emoji: "⬆️", sets: 4, reps: "8-12" },
    { name: "Barbell Row", emoji: "🚣", sets: 4, reps: "8-10" },
    { name: "Lat Pulldown", emoji: "💪", sets: 3, reps: "10-12" },
    { name: "T-Bar Row", emoji: "🏋️", sets: 3, reps: "10-12" },
    { name: "Deadlift", emoji: "🔥", sets: 3, reps: "6-8" },
  ],
  Traps: [{ name: "Barbell Shrugs", emoji: "🤷", sets: 3, reps: "12-15" }],
  Leg: [
    { name: "Barbell Back Squat", emoji: "🦵", sets: 4, reps: "8-10" },
    { name: "Leg Press", emoji: "🚀", sets: 3, reps: "10-12" },
    { name: "Lunges", emoji: "🏃", sets: 3, reps: "12-15" },
    { name: "Leg Extension", emoji: "🦿", sets: 3, reps: "12-15" },
    { name: "Romanian Deadlift", emoji: "🔨", sets: 3, reps: "10-12" },
    { name: "Leg Curl", emoji: "🦵", sets: 3, reps: "12-15" }
  ],
  Arms: [
    { name: "Barbell Curl", emoji: "💪", sets: 3, reps: "10-12" },
    { name: "Incline Dumbbell Curl", emoji: "💪", sets: 3, reps: "10-12" },
    { name: "Close-Grip Bench Press", emoji: "💎", sets: 3, reps: "8-10" },
    { name: "Overhead Extension", emoji: "⬆️", sets: 3, reps: "10-12" },
    { name: "Cable Pushdown", emoji: "⬇️", sets: 3, reps: "12-15" },
    { name: "Wrist Curl", emoji: "✊", sets: 3, reps: "15-20" }
  ],
  Shoulders: [
    { name: "Overhead Press", emoji: "🏋️", sets: 4, reps: "8-10" },
    { name: "Lateral Raises", emoji: "🔼", sets: 3, reps: "12-15" },
    { name: "Front Raises", emoji: "⬆️", sets: 3, reps: "12-15" },
    { name: "Rear Delt Fly", emoji: "🦅", sets: 3, reps: "12-15" },
  ],
  Delts: [
    { name: "Seated Dumbbell Press", emoji: "🏋️", sets: 4, reps: "8-10" },
    { name: "Lateral Raises", emoji: "🔼", sets: 3, reps: "12-15" },
    { name: "Front Raises", emoji: "⬆️", sets: 3, reps: "12-15" },
    { name: "Arnold Press", emoji: "💪", sets: 3, reps: "10-12" },
    { name: "Reverse Pec Deck", emoji: "🦅", sets: 3, reps: "12-15" },
  ],
};

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function calculateDuration(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const diff = new Date(checkOut) - new Date(checkIn);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function getTodayWorkout(data, today) {
  const todayEntry = data.find(d => d.date === today);
  if (!todayEntry) {
    const currentDate = new Date(today);
    const weekday = currentDate.toLocaleDateString(undefined, { weekday: "long" });
    const entry = workoutA.find(r => r.day === weekday) || workoutB.find(r => r.day === weekday);
    return entry ? { workout: entry.workout, emoji: entry.emoji } : { workout: "Rest day", emoji: "😴" };
  }
  return { workout: todayEntry.workoutName || "Rest day", emoji: todayEntry.workoutEmoji || "😴" };
}

function buildExerciseArrayFromWorkout(workoutText) {
  if (!workoutText || workoutText.toLowerCase().includes("rest")) return [{ name: "Rest day", emoji: "😴", sets: 0, reps: "—" }];
  const groups = [];
  const text = workoutText.toLowerCase();
  
  if (text.includes("chest")) groups.push(...exercisesMap.Chest);
  if (text.includes("abs")) groups.push(...exercisesMap.Abs);
  if (text.includes("calves")) groups.push(...exercisesMap.Calves);
  if (text.includes("back")) groups.push(...exercisesMap.Back);
  if (text.includes("traps")) groups.push(...exercisesMap.Traps);
  if (text.includes("leg") || text.includes("quad") || text.includes("hamstring")) groups.push(...exercisesMap.Leg);
  if (text.includes("bicep") || text.includes("tricep") || text.includes("forearm") || text.includes("arms")) groups.push(...exercisesMap.Arms);
  if (text.includes("shoulder") || text.includes("delt")) groups.push(...exercisesMap.Shoulders);
  
  if (groups.length === 0) {
    return [
      { name: "Push-Ups", emoji: "⬇️", sets: 3, reps: "15-20" },
      { name: "Squats", emoji: "🦵", sets: 3, reps: "15-20" },
      { name: "Plank", emoji: "⏱️", sets: 3, reps: "60s" }
    ];
  }
  return groups;
}

function generatePlan() {
  const rows = [];
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const dt = new Date(START_DATE);
    dt.setDate(dt.getDate() + i);
    const weekday = dt.toLocaleDateString(undefined, { weekday: "long" });
    const phase = i < 60 ? "Workout A" : "Workout B";
    const ref = i < 60 ? workoutA : workoutB;
    const entry = ref.find((r) => r.day === weekday) || { workout: "Rest", emoji: "😴" };
    const workout = entry.workout || "Rest";
    const exercises = buildExerciseArrayFromWorkout(workout);
    const week = Math.floor(i / 7) + 1;
    const isoWeek = getISOWeek(dt);
    
    rows.push({
      id: i + 1,
      date: formatDate(dt),
      weekday,
      week,
      isoWeek,
      phase,
      workout,
      workoutName: entry.workout,
      workoutEmoji: entry.emoji,
      exercises: exercises.map(ex => ({ ...ex, done: false })),
      done: false,
      notes: "",
      checkIn: null,
      checkOut: null,
      measurements: weekday === "Monday" ? {
        weight_kg: null,
        belly_cm: null,
        biceps_cm: null,
        chest_cm: null,
        thigh_cm: null,
        arm_cm: null
      } : null,
      lastModified: null
    });
  }
  return rows;
}

function calculatePercentChange(current, previous) {
  if (!previous || previous === 0 || !current) return null;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}

export default function BulkPlanner() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return generatePlan();
  });

  const [visibleWeek, setVisibleWeek] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_week');
      return saved ? Number(saved) : 1;
    } catch (e) {}
    return 1;
  });
  
  const [selectedDate, setSelectedDate] = useState(null);

  const today = formatDate(new Date());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Data saved to localStorage');
    } catch (e) {
      console.error('Failed to save:', e);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_week', String(visibleWeek));
    } catch (e) {}
  }, [visibleWeek]);

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (a.date === today) return -1;
      if (b.date === today) return 1;
      return new Date(a.date) - new Date(b.date);
    });
    return sorted;
  }, [data, today]);

  const filtered = useMemo(() => {
    if (selectedDate) {
      return sortedData.filter(r => r.date === selectedDate);
    }
    return sortedData.filter((r) => r.week === Number(visibleWeek));
  }, [sortedData, visibleWeek, selectedDate]);

  const stats = useMemo(() => {
    const completed = data.filter(d => d.done).length;
    const totalHours = data.reduce((sum, d) => {
      if (d.checkIn && d.checkOut) {
        const diff = (new Date(d.checkOut) - new Date(d.checkIn)) / 3600000;
        return sum + diff;
      }
      return sum;
    }, 0);
    return { completed, totalHours: totalHours.toFixed(1) };
  }, [data]);

  const measurementStats = useMemo(() => {
    const measurements = data.filter(d => d.measurements && d.weekday === "Monday");
    const fields = ['weight_kg', 'belly_cm', 'biceps_cm', 'chest_cm', 'thigh_cm', 'arm_cm'];
    const result = {};

    fields.forEach(field => {
      const values = measurements
        .filter(m => m.measurements[field])
        .map(m => ({ value: m.measurements[field], date: m.date, isoWeek: m.isoWeek }));

      if (values.length === 0) {
        result[field] = { current: null, weeklyChange: null, monthlyChange: null, fourMonthChange: null, history: [] };
        return;
      }

      const current = values[values.length - 1];
      const previousWeek = values[values.length - 2];
      const monthAgo = values.find(v => {
        const diff = (new Date(current.date) - new Date(v.date)) / (1000 * 60 * 60 * 24);
        return diff >= 28 && diff <= 35;
      });
      const fourMonthsAgo = values[0]; // First measurement (start of program)

      result[field] = {
        current: current.value,
        currentDate: current.date,
        weeklyChange: previousWeek ? calculatePercentChange(current.value, previousWeek.value) : null,
        weeklyPrevious: previousWeek?.value,
        monthlyChange: monthAgo ? calculatePercentChange(current.value, monthAgo.value) : null,
        monthlyPrevious: monthAgo?.value,
        fourMonthChange: values.length > 1 ? calculatePercentChange(current.value, fourMonthsAgo.value) : null,
        fourMonthPrevious: fourMonthsAgo?.value,
        history: values.slice(-17).map(v => v.value) // Last ~4 months of weekly data
      };
    });

    return result;
  }, [data]);

  const todayWorkout = getTodayWorkout(data, today);

  function handleCheckIn(id) {
    setData((prev) => prev.map((r) => 
      r.id === id ? { ...r, checkIn: new Date().toISOString(), lastModified: new Date().toISOString() } : r
    ));
  }

  function handleCheckOut(id) {
    setData((prev) => prev.map((r) => 
      r.id === id ? { ...r, checkOut: new Date().toISOString(), lastModified: new Date().toISOString() } : r
    ));
  }

  function toggleDone(id) {
    setData((prev) => prev.map((r) => 
      r.id === id ? { ...r, done: !r.done, lastModified: new Date().toISOString() } : r
    ));
  }

  function toggleExerciseDone(dayId, exIdx) {
    setData((prev) => prev.map((r) => {
      if (r.id === dayId) {
        const newEx = [...r.exercises];
        newEx[exIdx] = { ...newEx[exIdx], done: !newEx[exIdx].done };
        return { ...r, exercises: newEx, lastModified: new Date().toISOString() };
      }
      return r;
    }));
  }

  function setNote(id, note) {
    setData((prev) => prev.map((r) => 
      r.id === id ? { ...r, notes: note, lastModified: new Date().toISOString() } : r
    ));
  }

  function setMeasurement(id, field, value) {
    setData((prev) => prev.map((r) => {
      if (r.id === id && r.measurements) {
        return {
          ...r,
          measurements: { ...r.measurements, [field]: value ? parseFloat(value) : null },
          lastModified: new Date().toISOString()
        };
      }
      return r;
    }));
  }

  function clearDayDetails(id, e) {
    e.preventDefault();
    e.stopPropagation();
    
    const userConfirmed = window.confirm("Reset this day? This will remove check-in, check-out, exercises and measurements for this date.");
    
    if (!userConfirmed) return;
    
    setData((prev) => {
      return prev.map((r) => {
        if (r.id === id) {
          const originalExercises = buildExerciseArrayFromWorkout(r.workout);
          
          return {
            ...r,
            checkIn: null,
            checkOut: null,
            notes: "",
            done: false,
            exercises: originalExercises.map(ex => ({ ...ex, done: false })),
            measurements: r.measurements ? {
              weight_kg: null,
              belly_cm: null,
              biceps_cm: null,
              chest_cm: null,
              thigh_cm: null,
              arm_cm: null
            } : null,
            lastModified: new Date().toISOString()
          };
        }
        return r;
      });
    });
    
    try {
      window.dispatchEvent(new CustomEvent('dayReset', { detail: { dayId: id } }));
    } catch (e) {
      console.log('Event dispatch:', e);
    }
  }

  function exportCSV() {
    const header = ["Day", "Date", "Weekday", "Week", "Phase", "Workout", "Check-In", "Check-Out", "Duration", "Exercises Done", "Weight", "Belly", "Biceps", "Chest", "Thigh", "Arm", "Notes"].join(",");
    const rowsArr = data.map((r) => {
      const exDone = r.exercises.filter(ex => ex.done).length;
      const exTotal = r.exercises.length;
      const duration = calculateDuration(r.checkIn, r.checkOut) || "N/A";
      const m = r.measurements || {};
      return [
        r.id, 
        r.date, 
        r.weekday, 
        r.week, 
        r.phase, 
        `"${r.workout}"`,
        r.checkIn ? formatTime(new Date(r.checkIn)) : "",
        r.checkOut ? formatTime(new Date(r.checkOut)) : "",
        duration,
        `${exDone}/${exTotal}`,
        m.weight_kg || "",
        m.belly_cm || "",
        m.biceps_cm || "",
        m.chest_cm || "",
        m.thigh_cm || "",
        m.arm_cm || "",
        `"${String(r.notes).replace(/"/g, "'")}"`
      ].join(",");
    });
    const csv = [header, ...rowsArr].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "120-day-bulk-plan.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function jumpToWeek(n) {
    const w = Math.max(1, Math.min(WEEKS, Number(n) || 1));
    setVisibleWeek(w);
    setSelectedDate(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function jumpToDate(date) {
    setSelectedDate(date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getArrowAndColor(value) {
    if (!value) return { arrow: "—", color: "text-gray-400" };
    if (Math.abs(value) < 0.3) return { arrow: "—", color: "text-gray-400" };
    if (value > 0) return { arrow: "▲", color: "text-emerald-400" };
    return { arrow: "▼", color: "text-red-400" };
  }

  const measurementLabels = {
    weight_kg: { label: "Weight", unit: "kg", emoji: "⚖️" },
    belly_cm: { label: "Belly", unit: "cm", emoji: "🟠" },
    biceps_cm: { label: "Biceps", unit: "cm", emoji: "💪" },
    chest_cm: { label: "Chest", unit: "cm", emoji: "🫀" },
    thigh_cm: { label: "Thigh", unit: "cm", emoji: "🦵" },
    arm_cm: { label: "Arm", unit: "cm", emoji: "🦾" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 md:p-6">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-2xl shadow-2xl p-4 md:p-6 mb-4">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Good {getGreeting()}, {USER_NAME} 👋
          </h1>
          <p className="text-purple-200 text-lg mt-1">
            Today: {todayWorkout.workout} {todayWorkout.emoji}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-purple-200 text-sm">
            {selectedDate ? `Showing: ${selectedDate}` : `Week ${visibleWeek} of ${WEEKS}`}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedDate && (
              <button onClick={() => setSelectedDate(null)} className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm">
                📅 Show Week
              </button>
            )}
            <button onClick={() => jumpToWeek(visibleWeek - 1)} disabled={visibleWeek === 1 || selectedDate} className="px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white rounded-lg text-sm">
              ◀️
            </button>
            <button onClick={() => jumpToWeek(visibleWeek + 1)} disabled={visibleWeek === WEEKS || selectedDate} className="px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white rounded-lg text-sm">
              ▶️
            </button>
            <button onClick={exportCSV} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">
              📥
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
            <div className="text-purple-200 text-xs">Days Done 🎯</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalHours}</div>
            <div className="text-purple-200 text-xs">Hours ⏱️</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-white">{Math.round((stats.completed / TOTAL_DAYS) * 100)}%</div>
            <div className="text-purple-200 text-xs">Progress 📈</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(measurementStats).map(([field, stat]) => {
            const label = measurementLabels[field];
            const weeklyArrow = getArrowAndColor(stat.weeklyChange);
            
            return (
              <div key={field} className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center" title={stat.current ? `Weekly: ${stat.weeklyPrevious || '—'} → ${stat.current}` : 'No baseline'}>
                <div className="text-xs text-purple-300 mb-1">{label.emoji} {label.label}</div>
                {stat.current ? (
                  <>
                    <div className="text-lg font-bold text-white">{stat.current} {label.unit}</div>
                    <div className={`text-xs ${weeklyArrow.color} font-medium`}>
                      {weeklyArrow.arrow} {stat.weeklyChange !== null ? `${Math.abs(stat.weeklyChange).toFixed(1)}%` : '—'}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 py-2">—</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 justify-center">
          <input 
            type="number" 
            min={1} 
            max={WEEKS} 
            value={visibleWeek} 
            onChange={(e) => jumpToWeek(e.target.value)} 
            className="w-16 px-2 py-1 bg-white/20 border border-white/30 rounded-lg text-white text-center text-sm outline-none"
            placeholder="Wk"
          />
          <input 
            type="date"
            value={selectedDate || ""}
            onChange={(e) => e.target.value && jumpToDate(e.target.value)}
            className="px-2 py-1 bg-white/20 border border-white/30 rounded-lg text-white text-sm outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((row) => {
          const duration = calculateDuration(row.checkIn, row.checkOut);
          const exCompleted = row.exercises.filter(ex => ex.done).length;
          const exTotal = row.exercises.length;
          const isToday = row.date === today;
          const isMonday = row.weekday === "Monday";
          
          return (
            <div 
              key={row.id} 
              className={`rounded-2xl shadow-xl overflow-hidden border-2 ${
                isToday 
                  ? 'bg-gradient-to-r from-amber-800 to-orange-800 border-amber-400' 
                  : row.done 
                    ? 'bg-gradient-to-r from-emerald-800 to-teal-800 border-emerald-400' 
                    : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600'
              }`}
            >
              <div className="p-3 border-b border-white/10">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xl font-bold text-white">Day {row.id}</span>
                      {isToday && <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-bold">TODAY</span>}
                      <span className="text-purple-300 text-sm">• {row.weekday}</span>
                    </div>
                    <div className="text-purple-200 text-xs">{row.date}</div>
                    <div className="mt-1 text-white font-semibold text-sm">{row.workoutEmoji} {row.workout}</div>
                    {duration && (
                      <div className="mt-1 text-emerald-300 text-xs">⏱️ {duration}</div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <span className="text-white text-xs">Done</span>
                      <input 
                        type="checkbox" 
                        checked={row.done} 
                        onChange={() => toggleDone(row.id)} 
                        className="w-5 h-5 rounded"
                      />
                    </label>
                    <div className="text-purple-200 text-xs">{exCompleted}/{exTotal} ✅</div>
                    <button 
                      onClick={() => clearDayDetails(row.id)}
                      className="px-2 py-0.5 bg-red-600/80 hover:bg-red-600 text-white text-xs rounded"
                      type="button"
                    >
                      Clear ✖️
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button 
                    onClick={() => handleCheckIn(row.id)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
                  >
                    🕒 In
                    {row.checkIn && <div className="text-xs mt-0.5">{formatTime(new Date(row.checkIn))}</div>}
                  </button>
                  <button 
                    onClick={() => handleCheckOut(row.id)}
                    disabled={!row.checkIn}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium"
                  >
                    ⏰ Out
                    {row.checkOut && <div className="text-xs mt-0.5">{formatTime(new Date(row.checkOut))}</div>}
                  </button>
                </div>

                {isMonday && row.measurements && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg">
                    <div className="text-purple-200 text-xs font-semibold mb-2">📊 Weekly Measurements</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(measurementLabels).map(([field, info]) => (
                        <div key={field}>
                          <label className="text-xs text-purple-300 block mb-1">{info.emoji} {info.label} ({info.unit})</label>
                          <input 
                            type="number"
                            step={field === 'weight_kg' ? '0.1' : '1'}
                            value={row.measurements[field] || ''}
                            onChange={(e) => setMeasurement(row.id, field, e.target.value)}
                            placeholder="—"
                            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="text-purple-200 text-xs font-semibold mb-2">Exercises:</div>
                <div className="space-y-1.5">
                  {row.exercises.map((ex, idx) => (
                    <label 
                      key={idx} 
                      className="flex items-start gap-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        checked={ex.done}
                        onChange={() => toggleExerciseDone(row.id, idx)}
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-white text-sm flex-1">{idx + 1}. {ex.emoji} {ex.name}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-3">
                  <textarea 
                    value={row.notes} 
                    onChange={(e) => setNote(row.id, e.target.value)} 
                    placeholder="Notes (weights, reps, how you felt...)"
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-purple-300 outline-none resize-none"
                    rows="2"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center text-purple-300 text-xs">
        <p>💾 Auto-saved • Add to home screen for app experience</p>
      </div>
    </div>
  );
}