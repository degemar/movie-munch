import React from 'react'

interface StarRatingProps {
  score: number | null // null = no rating yet
  onChange?: (score: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
}

const SIZES = { sm: 20, md: 28, lg: 40 }

export default function StarRating({ score, onChange, size = 'md', readonly = false }: StarRatingProps) {
  const px = SIZES[size]

  return (
    <div className="stars" aria-label={score === null ? 'No rating' : `${score} out of 3 stars`}>
      {[1, 2, 3].map(n => {
        const filled = score !== null && score >= n
        const emoji = filled ? '⭐' : '☆'
        return (
          <button
            key={n}
            className="star-btn"
            style={{ fontSize: px, cursor: readonly ? 'default' : 'pointer', opacity: readonly && !filled ? 0.3 : 1 }}
            onClick={() => !readonly && onChange && onChange(score === n ? n - 1 : n)}
            aria-label={`${n} star`}
            type="button"
            disabled={readonly}
          >
            {emoji}
          </button>
        )
      })}
    </div>
  )
}
