function HabitList({ habits, onDelete, onToggle }) {
  if (!habits || !Array.isArray(habits)) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎮</div>
        <p className="text-gray-400 text-lg">No quests found.</p>
        <p className="text-gray-500 text-sm">
          Start your journey by creating your first quest!
        </p>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⭐</div>
        <p className="text-gray-400 text-lg">Ready to level up?</p>
        <p className="text-gray-500 text-sm">Create your first quest above!</p>
      </div>
    );
  }

  const getLevelColor = (level) => {
    if (level >= 5) return "from-yellow-400 to-orange-500"; // Gold
    if (level >= 3) return "from-purple-400 to-pink-500"; // Epic
    if (level >= 2) return "from-blue-400 to-cyan-500"; // Rare
    return "from-gray-400 to-gray-500"; // Common
  };

  const getLevelBorder = (level) => {
    if (level >= 5) return "border-yellow-500/50 shadow-yellow-500/20";
    if (level >= 3) return "border-purple-500/50 shadow-purple-500/20";
    if (level >= 2) return "border-blue-500/50 shadow-blue-500/20";
    return "border-gray-600/50 shadow-gray-500/20";
  };

  const getLevelName = (level) => {
    if (level >= 5) return "LEGENDARY";
    if (level >= 3) return "EPIC";
    if (level >= 2) return "RARE";
    return "COMMON";
  };

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <div
          key={habit._id}
          className={`relative p-5 rounded-2xl border-2 ${getLevelBorder(
            habit.level
          )} bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/80 transition-all group hover:scale-[1.02] shadow-xl`}
        >
          {/* Level Badge */}
          <div
            className={`absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r ${getLevelColor(
              habit.level
            )} text-xs font-bold text-black shadow-lg`}
          >
            LVL {habit.level}
          </div>

          {/* Rarity Badge */}
          <div
            className={`absolute -top-2 -left-2 px-2 py-1 rounded-full bg-gradient-to-r ${getLevelColor(
              habit.level
            )} text-xs font-bold text-black shadow-lg opacity-75`}
          >
            {getLevelName(habit.level)}
          </div>

          {/* Main Content */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex-1">
              <h3
                className={`text-lg font-bold mb-2 ${
                  habit.done ? "line-through text-gray-400" : "text-white"
                }`}
              >
                {habit.done ? "✅" : "⏳"} {habit.name}
              </h3>

              {/* Stats Row */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-orange-400">🔥</span>
                  <span className="text-gray-300">{habit.streak} streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-purple-400">⭐</span>
                  <span className="text-gray-300">{habit.xp} XP</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onToggle(habit._id)}
                className={`px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-110 ${
                  habit.done
                    ? "bg-gray-600 hover:bg-gray-700 text-gray-300"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/25"
                }`}
              >
                {habit.done ? "↺" : "✓"}
              </button>
              <button
                onClick={() => onDelete(habit._id)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold transition-all transform hover:scale-110 shadow-lg hover:shadow-red-500/25"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getLevelColor(
                habit.level
              )} transition-all duration-500`}
              style={{
                width: `${Math.min(
                  100,
                  (habit.xp / (habit.level * 100)) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
