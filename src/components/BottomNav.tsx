import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/add', label: 'Add Title', icon: '➕' },
  { path: '/library', label: 'Library', icon: '🎬' },
  { path: '/leaderboard', label: 'Scores', icon: '🏆' },
  { path: '/users', label: 'Who?', icon: '👤' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav">
      {TABS.map(tab => (
        <button
          key={tab.path}
          className={`nav-item ${pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
          aria-label={tab.label}
        >
          <span style={{ fontSize: 22 }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
