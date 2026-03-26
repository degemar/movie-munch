import React from 'react'
import { User } from '../types'

interface Props {
  user: User
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  onClick?: () => void
}

const SIZE_CLASS = { sm: '', md: '', lg: 'avatar-emoji-lg', xl: 'avatar-emoji-xl' }
const FONT_SIZE = { sm: '1rem', md: '1.4rem', lg: '2rem', xl: '3rem' }
const DIM = { sm: '28px', md: '36px', lg: '52px', xl: '72px' }

export default function UserAvatar({ user, size = 'md', showName = false, onClick }: Props) {
  return (
    <div
      className={`avatar-chip ${onClick ? '' : ''}`}
      style={{ background: user.color + '22', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div
        className="avatar-emoji"
        style={{
          background: user.color + '33',
          fontSize: FONT_SIZE[size],
          width: DIM[size],
          height: DIM[size],
        }}
      >
        {user.avatar}
      </div>
      {showName && <span style={{ color: user.color, fontWeight: 700 }}>{user.name}</span>}
    </div>
  )
}
