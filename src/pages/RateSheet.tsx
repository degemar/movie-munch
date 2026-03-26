import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import StarRating from '../components/StarRating'
import TitleCard from '../components/TitleCard'

interface Props {
  preselectedTitleId?: string
  onClose: () => void
}

const LABELS = ['😶 Meh', '👍 OK', '😄 Good', '🤩 Amazing!']

export default function RateSheet({ preselectedTitleId, onClose }: Props) {
  const { state, activeUser, addRating } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState<'pick' | 'rate'>(preselectedTitleId ? 'rate' : 'pick')
  const [selectedId, setSelectedId] = useState(preselectedTitleId ?? '')
  const [score, setScore] = useState<number>(2)
  const [favorite, setFavorite] = useState(false)
  const [query, setQuery] = useState('')

  const selectedTitle = state.titles.find(t => t.id === selectedId)

  const filtered = state.titles.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase())
  )

  function handleSubmit() {
    if (!selectedId) return
    addRating({ userId: activeUser.id, titleId: selectedId, score, favorite })
    onClose()
    navigate(`/title/${selectedId}`)
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />

        {step === 'pick' ? (
          <>
            <h2 style={{ marginBottom: 16 }}>🎬 Pick a title</h2>
            <div className="search-box" style={{ marginBottom: 12 }}>
              <span>🔍</span>
              <input
                autoFocus
                placeholder="Search your library…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            {state.titles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-emoji">🎬</div>
                <div className="empty-state-title">Library is empty!</div>
                <div className="empty-state-text">Add a title first, then rate it.</div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }}
                  onClick={() => { onClose(); navigate('/add') }}>
                  ➕ Add a Title
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-emoji">🤔</div>
                <div className="empty-state-title">Not in library yet!</div>
                <div className="empty-state-text">Add it first and then rate it.</div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }}
                  onClick={() => { onClose(); navigate(`/add?name=${encodeURIComponent(query)}`) }}>
                  ➕ Add "{query}"
                </button>
              </div>
            ) : (
              <div style={{ maxHeight: '55dvh', overflowY: 'auto' }}>
                {filtered.map(t => (
                  <div key={t.id} onClick={() => { setSelectedId(t.id); setStep('rate') }}
                    style={{ borderRadius: 12, marginBottom: 4, cursor: 'pointer' }}
                    className="card">
                    <TitleCard title={t} />
                  </div>
                ))}
                <button className="btn btn-ghost btn-full" style={{ marginTop: 8 }}
                  onClick={() => { onClose(); navigate('/add') }}>
                  ➕ Add new title
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {selectedTitle && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 72, borderRadius: 8, background: 'linear-gradient(135deg,#FFE66D,#FF6B35)', display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem', flexShrink: 0 }}>
                  {selectedTitle.type === 'movie' ? '🎬' : '📺'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>{selectedTitle.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {selectedTitle.platform}
                    {selectedTitle.year ? ` · ${selectedTitle.year}` : ''}
                    {' · '}{selectedTitle.type === 'movie' ? 'Movie' : 'TV Show'}
                  </div>
                </div>
              </div>
            )}

            <div className="rating-display">
              <div className="rating-number">{score}</div>
              <StarRating score={score} onChange={setScore} size="lg" />
              <div className="rating-label">{LABELS[score]}</div>
            </div>

            <div
              className={`fav-toggle ${favorite ? 'active' : ''}`}
              onClick={() => setFavorite(!favorite)}
              style={{ marginTop: 16, marginBottom: 20 }}
            >
              <span style={{ fontSize: '1.4rem' }}>{favorite ? '❤️' : '🤍'}</span>
              <div>
                <div style={{ fontWeight: 700 }}>Mark as Favorite</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Favorites don't affect leaderboard scores
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {!preselectedTitleId && (
                <button className="btn btn-ghost" onClick={() => setStep('pick')}>← Back</button>
              )}
              <button className="btn btn-primary btn-full" onClick={handleSubmit}>
                Submit Score 🍿
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
