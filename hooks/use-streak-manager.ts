"use client"

import { useState, useEffect, useCallback } from "react"

export interface Streak {
  id: string
  name: string
  completedDays: string[]
  currentStreak: number
  createdAt: string
}

export interface StreaksData {
  streaks: Streak[]
  selectedStreakId: string
}

const DEFAULT_STREAKS_DATA: StreaksData = {
  streaks: [],
  selectedStreakId: "",
}

export function useStreakManager() {
  const [data, setData] = useState<StreaksData>(DEFAULT_STREAKS_DATA)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("streaksData")
    if (saved) {
      try {
        setData(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load streaks data:", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  const saveData = useCallback((newData: StreaksData) => {
    setData(newData)
    localStorage.setItem("streaksData", JSON.stringify(newData))
  }, [])

  const createStreak = useCallback(
    (name: string) => {
      const newStreak: Streak = {
        id: Date.now().toString(),
        name,
        completedDays: [],
        currentStreak: 0,
        createdAt: new Date().toISOString(),
      }

      const newData: StreaksData = {
        streaks: [...data.streaks, newStreak],
        selectedStreakId: newStreak.id,
      }

      saveData(newData)
      return newStreak
    },
    [data.streaks, saveData],
  )

  const deleteStreak = useCallback(
    (streakId: string) => {
      const newData: StreaksData = {
        streaks: data.streaks.filter((s) => s.id !== streakId),
        selectedStreakId: data.streaks.length > 1 ? data.streaks[0].id : "",
      }

      saveData(newData)
    },
    [data.streaks, saveData],
  )

  const selectStreak = useCallback(
    (streakId: string) => {
      const newData = { ...data, selectedStreakId: streakId }
      saveData(newData)
    },
    [data, saveData],
  )

  const toggleDay = useCallback(
    (streakId: string, dateStr: string) => {
      const newData = { ...data }
      const streak = newData.streaks.find((s) => s.id === streakId)

      if (!streak) return

      const index = streak.completedDays.indexOf(dateStr)
      if (index > -1) {
        streak.completedDays.splice(index, 1)
      } else {
        streak.completedDays.push(dateStr)
      }

      streak.currentStreak = calculateStreak(streak.completedDays)
      saveData(newData)
    },
    [data, saveData],
  )

  const resetStreak = useCallback(
    (streakId: string) => {
      const newData = { ...data }
      const streak = newData.streaks.find((s) => s.id === streakId)

      if (streak) {
        streak.completedDays = []
        streak.currentStreak = 0
        saveData(newData)
      }
    },
    [data, saveData],
  )

  const getSelectedStreak = useCallback(() => {
    return data.streaks.find((s) => s.id === data.selectedStreakId)
  }, [data.streaks, data.selectedStreakId])

  return {
    data,
    isLoaded,
    createStreak,
    deleteStreak,
    selectStreak,
    toggleDay,
    resetStreak,
    getSelectedStreak,
  }
}

function calculateStreak(completedDays: string[]): number {
  let count = 0
  const today = new Date()

  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    if (completedDays.includes(dateStr)) {
      count++
    } else if (i > 0) {
      break
    }
  }

  return count
}
