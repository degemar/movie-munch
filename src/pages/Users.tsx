import React, { useState } from 'react'
import { useApp } from '../App'
import UserAvatar from '../components/UserAvatar'
import { getUserLeaderboardScore, getUserRatings } from '../store'

const AVATARS = ['🦁', '🐼', '🦊', '🐨', '🐯', '🦋', '🦄', '🐸', '🐙', '🦀', '🐬', '🦜']
const COLORS = ['#FF6B35', '#4ECDC4', '#FFE66D', '#A855F7', '#FF6B9D', '#6BCB77', '#3B82F6', '#F97316', '#EC4899', '#10B981']

export default function Users() {
  const { state, activeUser, setActiveUser, addUser } = useApp()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAvatar, setNewAvatar] = useState(AVATARS[0])
  const [newColor, setNewColor] = useState(COLORS[0])

  function handleAdd() {
    if (!newName.trim()) return
    addUser({ name: newName.trim(), avatar: newAvatar, color: newColor })
    setAdding(false)
    setNewName('')
    setNewAvatar(AVATARS[0])
    setNewColor(COLORS[0])
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">👥 Who's watching?</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
        {state.users.map(user => {
          const { avg, count } = getUserLeaderboardScore(state, user.id)
          const isActive = user.id === activeUser.id
          return (
            <div key={user.id} className={`user-card card ${isActive ? 'active-user' : ''}`}
              onClick={() => setActiveUser(user.id)}>
              <div style={{ fontSize:'2.5rem', width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center',
                background: user.color + '22', borderRadius:'50%', border: isActive ? `3px solid ${user.color}` : 'none', flexShrink:0 }}>
                {user.avatar}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontWeight:800, fontSize:'1.1rem' }}>{user.name}</span>
                  {isActive && <span style={{ background: user.color, color:'white', padding:'2px 8px', borderRadius:100, fontSize:'0.7rem', fontWeight:700 }}>ACTIVE</span>}
                </div>
                <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginTop:2 }}>
                  {count} titles rated {count > 0 ? `· ⭐ ${avg.toFixed(1)} avg` : ''}
                </div>
              </div>
              <div style={{ color: user.color, fontSize:'1.4rem' }}>
                {isActive ? '✅' : '▶'}
              </div>
            </div>
          )
        })}
      </div>

      {!adding ? (
        <button className="btn btn-secondary btn-full" onClick={() => setAdding(true)}>
          ➕ Add New Profile
        </button>
      ) : (
        <div className="card card-pad">
          <h3 style={{ marginBottom:16 }}>New Profile</h3>
          <input
            placeholder="Name (e.g. Grandma 👴)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'2px solid var(--border)', fontSize:'1rem', outline:'none', marginBottom:14 }}
          />
          <div style={{ marginBottom:14 }}>
            <div style={{ fontWeight:700, marginBottom:8, fontSize:'0.9rem' }}>Pick an avatar</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => setNewAvatar(a)}
                  style={{ fontSize:'1.6rem', width:44, height:44, borderRadius:'50%', border: newAvatar===a ? '3px solid var(--orange)' : '2px solid var(--border)', background: newAvatar===a ? '#FFF3EE' : 'white', cursor:'pointer' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700, marginBottom:8, fontSize:'0.9rem' }}>Pick a color</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setNewColor(c)}
                  style={{ width:32, height:32, borderRadius:'50%', background:c, border: newColor===c ? '3px solid var(--text)' : '2px solid transparent', cursor:'pointer' }} />
              ))}
            </div>
          </div>

          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
            <button className="btn btn-primary btn-full" onClick={handleAdd} disabled={!newName.trim()}>
              Create Profile ✨
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
