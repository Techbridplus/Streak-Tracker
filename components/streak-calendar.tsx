"use client"

import { useState, useEffect } from "react"
import DayCard from "./day-card"
import type { Streak } from "@/hooks/use-streak-manager"

interface StreakCalendarProps {
  streak: Streak | undefined
  onToggleDay: (dateStr: string) => void
  onResetStreak: () => void
  onStreakMilestone: () => void
  onDayCompleted?: () => void
  isDeveloperMode: boolean
  setIsDeveloperMode: (mode: boolean) => void
}

export default function StreakCalendar({
  streak,
  onToggleDay,
  onResetStreak,
  onStreakMilestone,
  onDayCompleted,
  isDeveloperMode,
  setIsDeveloperMode,
}: StreakCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Trigger celebration at 7-day streak
  useEffect(() => {
    if (streak && (streak.currentStreak === 7 || (streak.currentStreak > 7 && streak.currentStreak % 7 === 0))) {
      onStreakMilestone()
    }
  }, [streak, onStreakMilestone])

  if (!streak) {
    return (
      <div className="bg-white dark:bg-slate-950 rounded-lg p-12 border border-gray-200 dark:border-slate-700 text-center shadow-lg">
        <p className="text-gray-600 dark:text-slate-400 text-lg">Create a streak to get started</p>
      </div>
    )
  }

  const toggleDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    // Fix: Use local date formatting to match the calendar display
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    onToggleDay(dateStr)
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const completedThisMonth = streak.completedDays.filter((dateStr) => {
    const date = new Date(dateStr)
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
  }).length

  const today = new Date()
  // Fix: Use local date instead of UTC to avoid timezone issues
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="space-y-8">
      {/* Month Navigation - Formal Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-6">
        <button
          onClick={previousMonth}
          className="px-3 sm:px-6 py-2 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 font-semibold text-lg transition-colors"
          aria-label="Previous month"
        >
          <span className="hidden sm:inline">← Previous</span>
          <span className="sm:hidden">←</span>
        </button>

        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100 tracking-tight text-center">{monthName}</h2>

        <button
          onClick={nextMonth}
          className="px-3 sm:px-6 py-2 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 font-semibold text-lg transition-colors"
          aria-label="Next month"
        >
          <span className="hidden sm:inline">Next →</span>
          <span className="sm:hidden">→</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-700 dark:text-slate-300">Progress this month</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {completedThisMonth}/{daysInMonth}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-emerald-500 dark:bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(completedThisMonth / daysInMonth) * 100}%` }}
          />
        </div>
      </div>

      {/* Calendar Grid - Formal layout with light/dark support */}
      <div className="bg-white dark:bg-slate-950 rounded-lg p-4 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden">
        {/* Day headers - Formal styling */}
        <div className="grid grid-cols-7 gap-0 mb-4 sm:mb-8 pb-3 sm:pb-6 border-b border-gray-200 dark:border-slate-700">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest py-2 sm:py-4"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid - Large cells with borders */}
        <div className="grid grid-cols-7 gap-0 border-collapse">
          {days.map((day, index) => {
            const dateStr = day
              ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              : null
            const isToday = dateStr === todayStr
            // Fix: Compare date strings directly to avoid time comparison issues
            // In developer mode, allow clicking any date; otherwise only today
            const isDisabled = dateStr ? (!isDeveloperMode && dateStr !== todayStr) : true
            const isCompleted = dateStr ? streak.completedDays.includes(dateStr) : false

            return (
              <div
                key={index}
                className="border-r border-b border-gray-200 dark:border-slate-700 last:border-r-0"
                style={{
                  borderRight: (index + 1) % 7 === 0 ? "none" : undefined,
                }}
              >
                {day ? (
                  <DayCard
                    day={day}
                    isCompleted={isCompleted}
                    isToday={isToday}
                    isDisabled={isDisabled}
                    onClick={() => toggleDay(day)}
                    onCompleted={onDayCompleted}
                  />
                ) : (
                  <div className="aspect-square bg-gray-50 dark:bg-slate-900" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Developer Mode Button */}
      <div className="space-y-4">
        <button
          onClick={() => setIsDeveloperMode(!isDeveloperMode)}
          className={`w-full px-4 sm:px-6 py-3 rounded-lg transition-colors font-semibold text-sm sm:text-base border ${
            isDeveloperMode
              ? "bg-orange-100 dark:bg-orange-950 hover:bg-orange-200 dark:hover:bg-orange-900 text-orange-700 dark:text-orange-200 border-orange-300 dark:border-orange-700"
              : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600"
          }`}
        >
          <span className="hidden sm:inline">
            {isDeveloperMode ? "🔧 Developer Mode (ON)" : "🔧 Developer Mode"}
          </span>
          <span className="sm:hidden">
            {isDeveloperMode ? "🔧 Dev (ON)" : "🔧 Dev"}
          </span>
        </button>

        {/* Developer Options Panel */}
        {isDeveloperMode && (
          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4 sm:p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-orange-800 dark:text-orange-200 mb-4">
              Developer Options
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to reset this streak? This cannot be undone.")) {
                    onResetStreak()
                  }
                }}
                className="w-full px-4 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-200 rounded-lg transition-colors font-semibold text-sm border border-red-300 dark:border-red-700"
              >
                Reset Streak
              </button>
              
              <div className="text-sm text-orange-700 dark:text-orange-300">
                <p className="font-semibold mb-2">Date Customization:</p>
                <p>In developer mode, you can click on any date to toggle it on/off, regardless of whether it's today or not.</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
