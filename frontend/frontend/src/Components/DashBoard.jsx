import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HabitForm from "./HabitForm";
export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchHabits();
  }, [navigate]);

  // Fetch habits from backend
  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/habits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setHabits(response.data.habits);
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate user stats
  useEffect(() => {
    if (habits.length > 0) {
      const xp = habits.reduce((sum, habit) => sum + (habit.xp || 0), 0);
      setTotalXP(xp);
      setUserLevel(Math.floor(xp / 200) + 1);
    }
  }, [habits]);

  const addHabit = (newHabit) => {
    setHabits([
      ...habits,
      { ...newHabit, isCompletedToday: false, streak: 0, xp: 0, level: 1 },
    ]);
  };

  const deleteHabit = async (habitId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/habits/${habitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHabits(habits.filter((h) => h._id !== habitId));
    } catch (error) {
      console.error("Error deleting habit:", error);
      alert("Failed to delete habit. Please try again.");
    }
  };

  const toggleHabit = async (habitId) => {
    try {
      const token = localStorage.getItem("token");
      const habit = habits.find((h) => h._id === habitId);
      const today = new Date().toISOString().split("T")[0];

      if (habit.isCompletedToday) {
        // Unmark completion
        await axios.delete("/api/completions", {
          data: {
            habitId,
            completedDate: today,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Mark as complete
        await axios.post(
          "/api/completions",
          {
            habitId,
            completedDate: today,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Update local state
      setHabits(
        habits.map((h) =>
          h._id === habitId
            ? {
                ...h,
                isCompletedToday: !h.isCompletedToday,
                streak: !h.isCompletedToday
                  ? (h.streak || 0) + 1
                  : Math.max(0, (h.streak || 0) - 1),
                xp: !h.isCompletedToday
                  ? (h.xp || 0) + 25
                  : Math.max(0, (h.xp || 0) - 25),
                level:
                  Math.floor(
                    (!h.isCompletedToday
                      ? (h.xp || 0) + 25
                      : Math.max(0, (h.xp || 0) - 25)) / 100
                  ) + 1,
              }
            : h
        )
      );
    } catch (error) {
      console.error("Error toggling habit:", error);
      alert("Failed to update habit. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your quests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              🎮
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                QUEST LOG
              </h1>
              <p className="text-gray-400">
                Level up your life, one habit at a time
              </p>
            </div>
          </div>

          {/* Player Stats */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-2">
              <div className="text-yellow-400 font-bold">LEVEL {userLevel}</div>
              <div className="text-gray-400 text-sm">Player</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-2">
              <div className="text-purple-400 font-bold">{totalXP} XP</div>
              <div className="text-gray-400 text-sm">Total</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-2">
              <div className="text-orange-400 font-bold">
                {habits.filter((h) => h.isCompletedToday).length}/
                {habits.length}
              </div>
              <div className="text-gray-400 text-sm">Complete</div>
            </div>
          </div>
        </div>

        {/* Quest Creation */}
        <HabitForm onAdd={addHabit} />

        {/* Quest List */}
        <HabitList
          habits={habits}
          onDelete={deleteHabit}
          onToggle={toggleHabit}
        />
      </div>
    </div>
  );
}
