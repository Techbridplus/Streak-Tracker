"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  color: string
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = ["#b8a8db", "#a8d5e2", "#ffd4a3", "#d4f1a8", "#f1a8d4"]
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setPieces(newPieces)
  }, [])

  return (
    <>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            top: "-10px",
            width: "10px",
            height: "10px",
            backgroundColor: piece.color,
            borderRadius: "50%",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </>
  )
}
