import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import UserAvatar from '../components/UserAvatar'
import TitleCard from '../components/TitleCard'
import StarRating from '../components/StarRating'
import {
  getGroupAverage, getUserLatestRating, getTitleLeaderboardScore, getUserLeaderboardScore,
} from '../store'
import RateSheet from './RateSheet'

function fmtDate(ts: number) {
  const d = new Date(ts)
  const now = Date.now()
  const diffDays = Math.floor((now - ts) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function Home() {
  const { state, activeUser } = useApp()
  const navigate = useNavigate()
  const [showRate, setShowRate] = useState(false)

  // Recent submissions (all users, last 5)
  const recentRatings = [...state.ratings]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)

  // Top rated titles
  const topTitles = [...state.titles]
    .map(t => ({ title: t, score: getTitleLeaderboardScore(state, t.id) }))
    .filter(x => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  // User leaderboard preview
  const userRanks = [...state.users]
    .map(u => ({ user: u, ...getUserLeaderboardScore(state, u.id) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <>
      <div className="page">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>🍿 Movie Munch</div>
          <UserAvatar user={activeUser} showName size="md" onClick={() => navigate('/users')} />
        </div>

        {/* Hero */}
        <div className="home-hero">
          <h2>Hey, {activeUser.name}! {activeUser.avatar}</h2>
          <h1>What did you watch?</h1>
          <button className="btn" style={{ background: 'white', color: 'var(--orange)' }} onClick={() => setShowRate(true)}>
            ➕ Add score
          </button>
        </div>

        {/* Top Rated */}
        {topTitles.length > 0 && (
          <div className="section">
            <div className="section-header">
              <span className="section-title">🔥 Top Rated</span>
            </div>
            <div className="scroll-row">
              {topTitles.map(({ title, score }) => {
                const avg = getGroupAverage(state, title.id)
                return (
                  <div key={title.id} className="mini-title-card" onClick={() => navigate(`/title/${title.id}`)}>
                    <div className="mini-poster-placeholder">{title.type === 'movie' ? '🎬' : '📺'}</div>
                    <p>{title.title}</p>
                    {avg !== null && (
                      <p style={{ color: 'var(--orange)', fontWeight: 900, fontSize: '0.8rem', textAlign: 'center' }}>
                        ⭐ {avg.toFixed(1)}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent Submissions */}
        {recentRatings.length > 0 && (
          <div className="section">
            <div className="section-header">
              <span className="section-title">⏰ Recent Ratings</span>
            </div>
            <div className="card">
              {recentRatings.map((r, i) => {
                const title = state.titles.find(t => t.id === r.titleId)
                const user = state.users.find(u => u.id === r.userId)
                if (!title || !user) return null
                return (
                  <React.Fragment key={r.id}>
                    {i > 0 && <div className="divider" />}
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer' }}
                      onClick={() => navigate(`/title/${title.id}`)}
                    >
                      <UserAvatar user={user} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {title.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {user.name} · {fmtDate(r.timestamp)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <StarRating score={r.score} readonly size="sm" />
                        {r.favorite && <span>❤️</span>}
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        )}

        {/* Mini leaderboard */}
        {userRanks.length > 0 && (
          <div className="section">
            <div className="section-header">
              <span className="section-title">🏆 Top Critics</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leaderboard')}>See all</button>
            </div>
            <div className="card">
              {userRanks.map((u, i) => (
                <React.Fragment key={u.user.id}>
                  {i > 0 && <div className="divider" />}
                  <div className="lb-item">
                    <span className="lb-rank">{['🥇','🥈','🥉'][i]}</span>
                    <UserAvatar user={u.user} showName size="sm" />
                    <div className="lb-score">
                      <span className="score-badge">⭐ {u.avg.toFixed(1)}</span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {showRate && <RateSheet onClose={() => setShowRate(false)} />}
    </>
  )
}
