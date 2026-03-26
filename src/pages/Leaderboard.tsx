import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import UserAvatar from '../components/UserAvatar'
import StarRating from '../components/StarRating'
import { getTitleLeaderboardScore, getUserLeaderboardScore, getGroupAverage, getLatestRatingsForTitle } from '../store'

type Tab = 'titles' | 'users'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('titles')

  const rankedTitles = [...state.titles]
    .map(t => ({
      title: t,
      score: getTitleLeaderboardScore(state, t.id),
      avg: getGroupAverage(state, t.id),
      raters: getLatestRatingsForTitle(state, t.id).size,
    }))
    .filter(x => x.score >= 0)
    .sort((a, b) => b.score - a.score)

  const rankedUsers = [...state.users]
    .map(u => ({ user: u, ...getUserLeaderboardScore(state, u.id) }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.score - a.score)

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">🏆 Leaderboard</div>
        <div className="filter-tabs" style={{ marginTop: 12 }}>
          <button className={`filter-tab ${tab==='titles'?'active':''}`} onClick={() => setTab('titles')}>🎬 Titles</button>
          <button className={`filter-tab ${tab==='users'?'active':''}`} onClick={() => setTab('users')}>👤 Critics</button>
        </div>
      </div>

      {tab === 'titles' ? (
        rankedTitles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-emoji">🤔</div>
            <div className="empty-state-title">No titles rated yet</div>
            <div className="empty-state-text">Start rating to see the leaderboard!</div>
          </div>
        ) : (
          <div className="card">
            {rankedTitles.map(({ title, avg, raters }, i) => (
              <React.Fragment key={title.id}>
                {i > 0 && <div className="divider" />}
                <div className="lb-item" style={{ cursor:'pointer' }} onClick={() => navigate(`/title/${title.id}`)}>
                  <span className="lb-rank">{MEDALS[i] ?? `#${i+1}`}</span>
                  <div style={{ width:36, height:52, borderRadius:6, background:'linear-gradient(135deg,#FFE66D,#FF6B35)', display:'flex',alignItems:'center',justifyContent:'center', flexShrink:0 }}>
                    {title.type === 'movie' ? '🎬' : '📺'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:'0.9rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {title.title}
                    </div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                      {raters} {raters === 1 ? 'rating' : 'ratings'}
                    </div>
                  </div>
                  <div className="lb-score">
                    {avg !== null && <span className="score-badge">⭐ {avg.toFixed(1)}</span>}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )
      ) : (
        rankedUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-emoji">🤔</div>
            <div className="empty-state-title">No ratings yet</div>
            <div className="empty-state-text">Start rating to climb the ranks!</div>
          </div>
        ) : (
          <div className="card">
            {rankedUsers.map(({ user, avg, score, count }, i) => (
              <React.Fragment key={user.id}>
                {i > 0 && <div className="divider" />}
                <div className="lb-item">
                  <span className="lb-rank">{MEDALS[i] ?? `#${i+1}`}</span>
                  <UserAvatar user={user} showName size="sm" />
                  <div style={{ marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2 }}>
                    <span className="score-badge">⭐ {avg.toFixed(1)} avg</span>
                    <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{count} titles rated</span>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )
      )}
    </div>
  )
}
