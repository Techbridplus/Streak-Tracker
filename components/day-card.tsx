"use client"

import { useEffect, useRef } from "react"

interface DayCardProps {
  day: number
  isCompleted: boolean
  isToday: boolean
  isDisabled: boolean
  onClick: () => void
  onCompleted?: () => void
}

export default function DayCard({ day, isCompleted, isToday, isDisabled, onClick, onCompleted }: DayCardProps) {
  const wasCompletedRef = useRef(false)

  useEffect(() => {
    if (isCompleted && !wasCompletedRef.current) {
      wasCompletedRef.current = true
      onCompleted?.()
    } else if (!isCompleted) {
      wasCompletedRef.current = false
    }
  }, [isCompleted, onCompleted])

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full aspect-square font-semibold text-lg transition-all duration-200
        flex items-center justify-center relative overflow-hidden
        ${
          isDisabled
            ? "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed"
            : isCompleted
              ? "bg-emerald-500 dark:bg-emerald-600 text-white shadow-lg hover:shadow-xl hover:bg-emerald-600 dark:hover:bg-emerald-700"
              : isToday
                ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 dark:border-blue-500 text-gray-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800"
                : "bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300"
        }
      `}
    >
      <span className={isCompleted ? "opacity-0" : ""}>{day}</span>
      {isCompleted && <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">✓</span>}
    </button>
  )
}
