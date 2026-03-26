import React from 'react'
import { Title } from '../types'

interface Props {
  title: Title
  right?: React.ReactNode
  onClick?: () => void
}

export default function TitleCard({ title, right, onClick }: Props) {
  return (
    <div className="title-card" onClick={onClick}>
      <div className="title-poster-placeholder">
        {title.type === 'movie' ? '🎬' : '📺'}
      </div>
      <div className="title-meta">
        <div className="title-name">{title.title}</div>
        <div className="title-sub" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
          <span className={`type-badge ${title.type}`}>{title.type === 'movie' ? 'Movie' : 'TV Show'}</span>
          {title.platform && (
            <span style={{ background: '#F0FDF4', color: '#166534', padding: '2px 7px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 700 }}>
              {title.platform}
            </span>
          )}
          {title.year && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{title.year}</span>}
        </div>
        {right && <div style={{ marginTop: 8 }}>{right}</div>}
      </div>
    </div>
  )
}
