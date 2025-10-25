"use client"

import { useState, useEffect } from "react"
import StreakSelector from "@/components/streak-selector"
import StreakCalendar from "@/components/streak-calendar"
import StreakStats from "@/components/streak-stats"
import Confetti from "@/components/confetti"
import { useStreakManager } from "@/hooks/use-streak-manager"

export default function Home() {
  const [isDark, setIsDark] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { data, isLoaded, createStreak, deleteStreak, selectStreak, toggleDay, resetStreak, getSelectedStreak } =
    useStreakManager()

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDark(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleDayCompleted = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleStreakMilestone = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const selectedStreak = getSelectedStreak()

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
      {showConfetti && <Confetti />}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Streak Tracker</h1>
            <p className="text-muted-foreground">Build your daily habits, one day at a time</p>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        <StreakSelector
          streaks={data.streaks}
          selectedStreakId={data.selectedStreakId}
          onSelectStreak={selectStreak}
          onCreateStreak={createStreak}
          onDeleteStreak={deleteStreak}
        />

        {/* Stats */}
        <StreakStats streak={selectedStreak} />

        {/* Calendar */}
        <StreakCalendar
          streak={selectedStreak}
          onToggleDay={(dateStr) => {
            if (selectedStreak) {
              toggleDay(selectedStreak.id, dateStr)
            }
          }}
          onResetStreak={() => {
            if (selectedStreak) {
              resetStreak(selectedStreak.id)
            }
          }}
          onStreakMilestone={handleStreakMilestone}
          onDayCompleted={handleDayCompleted}
        />
      </div>
    </main>
  )
}
