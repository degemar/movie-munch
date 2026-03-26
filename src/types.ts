export interface User {
  id: string
  name: string
  avatar: string // emoji
  color: string // hex color
}

export interface Title {
  id: string
  type: 'movie' | 'tv'
  title: string
  platform: string
  year?: number
  overview?: string
  genre?: string
  runtimeMinutes?: number
  seasonsCount?: number
}

export interface Rating {
  id: string
  userId: string
  titleId: string
  score: number // 0-3
  favorite: boolean
  timestamp: number
}

export interface AppState {
  users: User[]
  titles: Title[]
  ratings: Rating[]
  activeUserId: string
}
