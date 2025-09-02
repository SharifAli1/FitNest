import { useState } from "react";
import axios from "axios";

function HabitForm({ onAdd }) {
  const [habit, setHabit] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habit.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/habits",
        {
          name: habit,
          description: "",
          category: "general",
          type: "habit",
          frequency: "daily",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        onAdd(response.data.habit);
        setHabit("");
      }
    } catch (error) {
      console.error("Error creating habit:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert("Failed to create habit. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="mb-8">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            placeholder="⚔️ Add new quest..."
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl pointer-events-none"></div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
        >
          <span>⚡</span>
          Create Quest
        </button>
      </div>
    </div>
  );
}
