"use client"

import { motion } from "framer-motion"
import type { Streak } from "@/hooks/use-streak-manager"

interface StreakStatsProps {
  streak: Streak | undefined
}

export default function StreakStats({ streak }: StreakStatsProps) {
  if (!streak) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm opacity-50">
          <p className="text-muted-foreground text-sm font-medium">Current Streak</p>
          <p className="text-4xl font-bold text-primary mt-2">—</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm opacity-50">
          <p className="text-muted-foreground text-sm font-medium">Total Completed</p>
          <p className="text-4xl font-bold text-accent mt-2">—</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Current Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 border border-border shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Current Streak</p>
            <motion.p
              key={streak.currentStreak}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold text-primary"
            >
              {streak.currentStreak}
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">{streak.currentStreak === 1 ? "day" : "days"} in a row</p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-5xl"
          >
            🔥
          </motion.div>
        </div>
      </motion.div>

      {/* Total Completed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Completed</p>
            <motion.p
              key={streak.completedDays.length}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold text-accent"
            >
              {streak.completedDays.length}
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">
              {streak.completedDays.length === 1 ? "task" : "tasks"} completed
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-5xl"
          >
            ⭐
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
