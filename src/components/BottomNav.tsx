import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Film, Home, PlusCircle, Trophy, Users } from 'lucide-react'

const TABS = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/add', label: 'Add', Icon: PlusCircle },
  { path: '/library', label: 'Library', Icon: Film },
  { path: '/leaderboard', label: 'Scores', Icon: Trophy },
  { path: '/users', label: 'Profiles', Icon: Users },
]

function isActivePath(pathname: string, tabPath: string) {
  if (tabPath === '/') return pathname === '/'
  if (tabPath === '/library') return pathname === '/library' || pathname.startsWith('/title/')
  return pathname === tabPath
}

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {TABS.map(tab => {
        const Icon = tab.Icon
        const active = isActivePath(pathname, tab.path)

        return (
          <button
            key={tab.path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
            type="button"
          >
            <Icon size={22} strokeWidth={2.4} aria-hidden="true" />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
