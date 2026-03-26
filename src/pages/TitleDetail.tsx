import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import StarRating from '../components/StarRating'
import UserAvatar from '../components/UserAvatar'
import {
  getLatestRatingsForTitle, getUserLatestRating, getTitleHistory,
  getGroupAverage,
} from '../store'
import RateSheet from './RateSheet'

const LABELS = ['😶 Meh', '👍 OK', '😄 Good', '🤩 Amazing!']

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function MetaChip({ label }: { label: string }) {
  return (
    <span style={{
      background: 'rgba(255,255,255,0.15)', color: 'white',
      padding: '3px 10px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600,
    }}>{label}</span>
  )
}

export default function TitleDetail() {
  const { titleId } = useParams<{ titleId: string }>()
  const { state, activeUser, deleteRating } = useApp()
  const navigate = useNavigate()
  const [showRate, setShowRate] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const title = state.titles.find(t => t.id === titleId)
  if (!title) return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-state-emoji">🤔</div>
        <div className="empty-state-title">Title not found</div>
        <button className="btn btn-primary" style={{ marginTop:16 }} onClick={() => navigate(-1)}>Go back</button>
      </div>
    </div>
  )

  const latestByUser = getLatestRatingsForTitle(state, title.id)
  const myLatest = getUserLatestRating(state, activeUser.id, title.id)
  const history = getTitleHistory(state, title.id)
  const avg = getGroupAverage(state, title.id)

  return (
    <>
      <div className="page" style={{ paddingTop: 0 }}>
        {/* Header */}
        <div style={{ background:'linear-gradient(180deg, #1A1A2E 0%, var(--bg) 100%)', marginLeft:-16, marginRight:-16, padding:'48px 16px 20px' }}>
          <button className="btn btn-ghost" style={{ color:'white', marginBottom:8 }} onClick={() => navigate(-1)}>← Back</button>
          <div style={{ display:'flex', gap:14, alignItems:'flex-end' }}>
            <div style={{ width:90, height:135, borderRadius:12, background:'linear-gradient(135deg,#FFE66D,#FF6B35)', display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.8rem', flexShrink:0, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
              {title.type === 'movie' ? '🎬' : '📺'}
            </div>
            <div style={{ flex: 1 }}>
              <span className={`type-badge ${title.type}`}>{title.type === 'movie' ? 'Movie' : 'TV Show'}</span>
              <h1 style={{ color:'white', marginTop:4, fontSize:'1.3rem', lineHeight: 1.2 }}>{title.title}</h1>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
                <MetaChip label={`📡 ${title.platform}`} />
                {title.year && <MetaChip label={`📅 ${title.year}`} />}
                {title.genre && <MetaChip label={`🎭 ${title.genre}`} />}
                {title.runtimeMinutes && <MetaChip label={`⏱ ${title.runtimeMinutes}m`} />}
                {title.seasonsCount && <MetaChip label={`📋 ${title.seasonsCount} season${title.seasonsCount > 1 ? 's' : ''}`} />}
                {avg !== null && <MetaChip label={`⭐ ${avg.toFixed(1)} avg`} />}
              </div>
            </div>
          </div>
        </div>

        {title.overview && (
          <div style={{ color:'var(--text-muted)', fontSize:'0.88rem', lineHeight:1.6, marginBottom:16, marginTop:4 }}>
            {title.overview}
          </div>
        )}

        {/* My score */}
        <div className="card card-pad" style={{ marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <h3>Your Score</h3>
              {myLatest !== undefined
                ? <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                    <StarRating score={myLatest.score} readonly size="md" />
                    <span style={{ fontWeight:700, color:'var(--orange)' }}>{LABELS[myLatest.score]}</span>
                    {myLatest.favorite && <span>❤️</span>}
                  </div>
                : <div className="tag-no-rating" style={{ marginTop:6 }}>No rating yet</div>}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowRate(true)}>
              {myLatest !== undefined ? '✏️ Update' : '⭐ Rate'}
            </button>
          </div>
        </div>

        {/* All users latest */}
        {latestByUser.size > 0 && (
          <div className="section">
            <div className="section-header">
              <span className="section-title">👥 Everyone's Score</span>
            </div>
            <div className="card">
              {[...latestByUser.entries()].map(([userId, rating], i) => {
                const user = state.users.find(u => u.id === userId)
                if (!user) return null
                return (
                  <React.Fragment key={userId}>
                    {i > 0 && <div className="divider" />}
                    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px' }}>
                      <UserAvatar user={user} showName size="sm" />
                      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
                        <StarRating score={rating.score} readonly size="sm" />
                        {rating.favorite && <span>❤️</span>}
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        )}

        {/* Rating history */}
        {history.length > 0 && (
          <div className="section">
            <div className="section-header">
              <span className="section-title">📜 Full History</span>
            </div>
            <div className="card">
              {history.map(r => {
                const user = state.users.find(u => u.id === r.userId)
                if (!user) return null
                return (
                  <div key={r.id} className="history-item">
                    <UserAvatar user={user} size="sm" />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'0.85rem' }}>{user.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{fmtDate(r.timestamp)}</div>
                    </div>
                    <StarRating score={r.score} readonly size="sm" />
                    {r.favorite && <span>❤️</span>}
                    {r.userId === activeUser.id && (
                      confirmDelete === r.id
                        ? <div style={{ display:'flex', gap:6 }}>
                            <button className="btn btn-danger btn-sm" onClick={() => { deleteRating(r.id); setConfirmDelete(null) }}>Delete</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>Cancel</button>
                          </div>
                        : <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(r.id)} style={{ color:'#DC2626' }}>🗑</button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {history.length === 0 && (
          <div className="empty-state" style={{ paddingTop:24 }}>
            <div className="empty-state-emoji">🎬</div>
            <div className="empty-state-title">No ratings yet</div>
            <div className="empty-state-text">Be the first to rate this!</div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setShowRate(true)}>
              ⭐ Rate Now
            </button>
          </div>
        )}
      </div>

      {showRate && <RateSheet preselectedTitleId={title.id} onClose={() => setShowRate(false)} />}
    </>
  )
}
