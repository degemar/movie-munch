import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  score: number | null
  onChange?: (score: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
}

const SIZES = { sm: 18, md: 26, lg: 38 }

export default function StarRating({ score, onChange, size = 'md', readonly = false }: StarRatingProps) {
  const px = SIZES[size]

  return (
    <div className="stars" aria-label={score === null ? 'No rating' : `${score} out of 3 stars`}>
      {[1, 2, 3].map(n => {
        const filled = score !== null && score >= n

        return (
          <button
            key={n}
            className={`star-btn ${filled ? 'filled' : ''}`}
            style={{
              width: px + 8,
              height: px + 8,
              opacity: readonly && !filled ? 0.35 : 1,
            }}
            onClick={() => !readonly && onChange && onChange(score === n ? n - 1 : n)}
            aria-label={`${n} star`}
            type="button"
            disabled={readonly}
          >
            <Star
              size={px}
              strokeWidth={filled ? 0 : 2.2}
              fill={filled ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
          </button>
        )
      })}
    </div>
  )
}
