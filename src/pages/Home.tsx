import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock3, Film, Flame, Heart, PlusCircle, Trophy, Tv } from 'lucide-react'
import { useApp } from '../App'
import UserAvatar from '../components/UserAvatar'
import StarRating from '../components/StarRating'
import {
  getGroupAverage, getTitleLeaderboardScore, getUserLeaderboardScore,
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

  const recentRatings = [...state.ratings]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)

  const topTitles = [...state.titles]
    .map(t => ({ title: t, score: getTitleLeaderboardScore(state, t.id) }))
    .filter(x => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  const userRanks = [...state.users]
    .map(u => ({ user: u, ...getUserLeaderboardScore(state, u.id) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <>
      <div className="page">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <Film size={23} strokeWidth={2.3} />
            </div>
            <div>
              <span className="brand-name">Movie Munch</span>
              <span className="brand-subtitle">family watch list</span>
            </div>
          </div>
          <UserAvatar user={activeUser} showName size="md" onClick={() => navigate('/users')} />
        </div>

        <div className="home-hero">
          <div className="home-hero-copy">
            <span className="home-kicker">Now watching</span>
            <h2>Hey, {activeUser.name} {activeUser.avatar}</h2>
            <h1>Score the next family pick.</h1>
            <button className="btn hero-action" onClick={() => setShowRate(true)} type="button">
              <PlusCircle size={19} strokeWidth={2.4} aria-hidden="true" />
              Add score
            </button>
          </div>
        </div>

        {topTitles.length > 0 && (
          <div className="section">
            <div className="section-header">
              <span className="section-title">
                <Flame size={18} strokeWidth={2.4} aria-hidden="true" />
                Top Rated
              </span>
            </div>
            <div className="scroll-row">
              {topTitles.map(({ title }) => {
                const avg = getGroupAverage(state, title.id)
                const PosterIcon = title.type === 'movie' ? Film : Tv

                return (
                  <div key={title.id} className="mini-title-card" onClick={() => navigate(`/title/${title.id}`)}>
                    <div className="mini-poster-placeholder" aria-hidden="true">
                      <PosterIcon size={34} strokeWidth={2.1} />
                    </div>
                    <p>{title.title}</p>
                    {avg !== null && (
                      <p className="mini-score">
                        {avg.toFixed(1)} avg
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {recentRatings.length > 0 && (
          <div className="section">
            <div className="section-header">
              <span className="section-title">
                <Clock3 size={18} strokeWidth={2.4} aria-hidden="true" />
                Recent Ratings
              </span>
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
                      className="recent-rating-row"
                      onClick={() => navigate(`/title/${title.id}`)}
                    >
                      <UserAvatar user={user} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {title.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {user.name} - {fmtDate(r.timestamp)}
                        </div>
                      </div>
                      <div className="rating-actions">
                        <StarRating score={r.score} readonly size="sm" />
                        {r.favorite && <Heart className="icon-heart" size={17} aria-label="Favorite" />}
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        )}

        {userRanks.length > 0 && (
          <div className="section">
            <div className="section-header">
              <span className="section-title">
                <Trophy size={18} strokeWidth={2.4} aria-hidden="true" />
                Top Critics
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leaderboard')} type="button">See all</button>
            </div>
            <div className="card">
              {userRanks.map((u, i) => (
                <React.Fragment key={u.user.id}>
                  {i > 0 && <div className="divider" />}
                  <div className="lb-item">
                    <span className="rank-pill">{i + 1}</span>
                    <UserAvatar user={u.user} showName size="sm" />
                    <div className="lb-score">
                      <span className="score-badge">{u.avg.toFixed(1)} avg</span>
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
