import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import TitleCard from '../components/TitleCard'
import StarRating from '../components/StarRating'
import { getGroupAverage, getUserLatestRating } from '../store'

type Filter = 'all' | 'movies' | 'tv' | 'favorites' | 'unrated'

export default function Library() {
  const { state, activeUser } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = state.titles.filter(t => {
    if (filter === 'movies') return t.type === 'movie'
    if (filter === 'tv') return t.type === 'tv'
    if (filter === 'favorites') {
      const myRating = getUserLatestRating(state, activeUser.id, t.id)
      return myRating?.favorite === true
    }
    if (filter === 'unrated') {
      const myRating = getUserLatestRating(state, activeUser.id, t.id)
      return myRating === undefined
    }
    return true
  })

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: '🎯 All' },
    { key: 'movies', label: '🎬 Movies' },
    { key: 'tv', label: '📺 TV Shows' },
    { key: 'favorites', label: '❤️ My Favs' },
    { key: 'unrated', label: '🤔 Unrated' },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="page-title">🎬 Library</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/add')}>➕ Add</button>
        </div>
        <div className="filter-tabs" style={{ marginTop: 12 }}>
          {FILTERS.map(f => (
            <button key={f.key} className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-emoji">
            {filter === 'favorites' ? '💔' : filter === 'unrated' ? '✅' : '🎬'}
          </div>
          <div className="empty-state-title">
            {filter === 'favorites' ? 'No favorites yet' :
             filter === 'unrated' ? 'You\'ve rated everything!' :
             'Library is empty'}
          </div>
          <div className="empty-state-text">
            {filter === 'favorites' ? 'Rate titles and mark your favorites!' :
             filter === 'unrated' ? 'Great job!' :
             'Tap ➕ Add to add your first title!'}
          </div>
          {filter === 'all' && (
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }}
              onClick={() => navigate('/add')}>
              ➕ Add a Title
            </button>
          )}
        </div>
      ) : (
        <div className="card">
          {filtered.map((t, i) => {
            const avg = getGroupAverage(state, t.id)
            const myRating = getUserLatestRating(state, activeUser.id, t.id)
            return (
              <React.Fragment key={t.id}>
                {i > 0 && <div className="divider" />}
                <TitleCard
                  title={t}
                  onClick={() => navigate(`/title/${t.id}`)}
                  right={
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                      {avg !== null && <span className="score-badge">⭐ {avg.toFixed(1)} group</span>}
                      {myRating !== undefined
                        ? <StarRating score={myRating.score} readonly size="sm" />
                        : <span className="tag-no-rating">No rating yet</span>}
                      {myRating?.favorite && <span>❤️</span>}
                    </div>
                  }
                />
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}
