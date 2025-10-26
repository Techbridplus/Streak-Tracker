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
  isDeveloperMode: boolean
}

export default function StreakSelector({
  streaks,
  selectedStreakId,
  onSelectStreak,
  onCreateStreak,
  onDeleteStreak,
  isDeveloperMode,
}: StreakSelectorProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newStreakName, setNewStreakName] = useState("")
  const [showAll, setShowAll] = useState(false)

  const handleCreate = () => {
    if (newStreakName.trim()) {
      onCreateStreak(newStreakName)
      setNewStreakName("")
      setIsCreating(false)
    }
  }

  // Pagination logic: responsive limits
  // Mobile: show 2, Desktop: show 3 (controlled by CSS classes)
  const mobileLimit = 2
  const desktopLimit = 3
  
  // Sort streaks by most recently used (lastModified) first
  const sortedStreaks = [...streaks].sort((a, b) => {
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  })
  
  // For now, we'll use a simple approach: show 3 by default, CSS will handle responsive display
  const initialLimit = 3
  const streaksToShow = showAll 
    ? sortedStreaks 
    : sortedStreaks.slice(0, initialLimit)
  const hasMoreStreaks = sortedStreaks.length > initialLimit

  return (
    <div className="space-y-4 mb-8">
      {/* Streak Tabs */}
      <div className="flex flex-wrap gap-3 overflow-x-auto pb-2">
        <AnimatePresence>
          {streaksToShow.map((streak, index) => (
            <motion.div
              key={streak.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`inline-flex items-center gap-2 ${
                isDeveloperMode && selectedStreakId === streak.id
                  ? "bg-primary/10 rounded-lg p-1 pr-2"
                  : ""
              } ${index >= 2 ? "hidden sm:inline-flex" : ""}`}
            >
              <button
                onClick={() => onSelectStreak(streak.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedStreakId === streak.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border hover:bg-muted"
                }`}
              >
                {streak.name}
              </button>

              {/* Delete button */}
              {isDeveloperMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete "${streak.name}" streak? This will permanently delete the streak and all its data.`)) {
                      onDeleteStreak(streak.id)
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-colors flex items-center justify-center h-10 aspect-square"
                  aria-label="Delete streak"
                  title="Delete streak"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* More button - shows remaining streaks */}
        {!showAll && hasMoreStreaks && !isCreating && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowAll(true)}
            className="px-6 py-3 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium transition-all whitespace-nowrap"
          >
            +{streaks.length - initialLimit} More
          </motion.button>
        )}

        {/* Create new streak button */}
        {!isCreating && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 font-medium transition-all flex items-center gap-2 whitespace-nowrap"
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
            className="flex flex-col sm:flex-row gap-2"
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
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setNewStreakName("")
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
