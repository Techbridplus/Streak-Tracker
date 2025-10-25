"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Streak } from "@/hooks/use-streak-manager"

interface StreakSelectorProps {
  streaks: Streak[]
  selectedStreakId: string
  onSelectStreak: (id: string) => void
  onCreateStreak: (name: string) => void
  onDeleteStreak: (id: string) => void
}

export default function StreakSelector({
  streaks,
  selectedStreakId,
  onSelectStreak,
  onCreateStreak,
  onDeleteStreak,
}: StreakSelectorProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newStreakName, setNewStreakName] = useState("")

  const handleCreate = () => {
    if (newStreakName.trim()) {
      onCreateStreak(newStreakName)
      setNewStreakName("")
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Streak Tabs */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {streaks.map((streak) => (
            <motion.div
              key={streak.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <button
                onClick={() => onSelectStreak(streak.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStreakId === streak.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border hover:bg-muted"
                }`}
              >
                {streak.name}
              </button>

              {/* Delete button */}
              {streaks.length > 1 && (
                <button
                  onClick={() => {
                    if (confirm(`Delete "${streak.name}" streak?`)) {
                      onDeleteStreak(streak.id)
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Delete streak"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Create new streak button */}
        {!isCreating && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New
          </motion.button>
        )}
      </div>

      {/* Create streak input */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newStreakName}
              onChange={(e) => setNewStreakName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate()
                if (e.key === "Escape") {
                  setIsCreating(false)
                  setNewStreakName("")
                }
              }}
              placeholder="e.g., Workout, Study, Meditation"
              className="flex-1 px-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false)
                setNewStreakName("")
              }}
              className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
