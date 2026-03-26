import { AppState, User, Title, Rating } from './types'

const STORAGE_KEY = 'movie-munch-v2'

const DEFAULT_USERS: User[] = [
  { id: 'u1', name: 'Martin',  avatar: '⚽', color: '#3B82F6' },
  { id: 'u2', name: 'Carmen',  avatar: '🦋', color: '#EC4899' },
  { id: 'u3', name: 'Gonzalo', avatar: '🦕', color: '#22C55E' },
]

export function getDefaultState(): AppState {
  return {
    users: DEFAULT_USERS,
    titles: [],
    ratings: [],
    activeUserId: 'u1',
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    return JSON.parse(raw) as AppState
  } catch {
    return getDefaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

// ── Derived / helper selectors ───────────────────────────────────────────────

/** Latest rating per user for a given title */
export function getLatestRatingsForTitle(state: AppState, titleId: string): Map<string, Rating> {
  const map = new Map<string, Rating>()
  const sorted = [...state.ratings]
    .filter(r => r.titleId === titleId)
    .sort((a, b) => a.timestamp - b.timestamp)
  for (const r of sorted) map.set(r.userId, r)
  return map
}

/** Group average using only the latest rating from each user */
export function getGroupAverage(state: AppState, titleId: string): number | null {
  const latest = getLatestRatingsForTitle(state, titleId)
  if (latest.size === 0) return null
  const sum = [...latest.values()].reduce((acc, r) => acc + r.score, 0)
  return sum / latest.size
}

/** User's latest rating for a title */
export function getUserLatestRating(state: AppState, userId: string, titleId: string): Rating | undefined {
  return [...state.ratings]
    .filter(r => r.userId === userId && r.titleId === titleId)
    .sort((a, b) => b.timestamp - a.timestamp)[0]
}

/** Full rating history for a title (all users, all time) */
export function getTitleHistory(state: AppState, titleId: string): Rating[] {
  return [...state.ratings]
    .filter(r => r.titleId === titleId)
    .sort((a, b) => b.timestamp - a.timestamp)
}

/** Title leaderboard score: avg + small bonus for more raters */
export function getTitleLeaderboardScore(state: AppState, titleId: string): number {
  const latest = getLatestRatingsForTitle(state, titleId)
  if (latest.size === 0) return -1
  const avg = [...latest.values()].reduce((acc, r) => acc + r.score, 0) / latest.size
  const bonus = Math.log1p(latest.size - 1) * 0.05
  return avg + bonus
}

/** User leaderboard: avg of their latest ratings + small activity bonus */
export function getUserLeaderboardScore(state: AppState, userId: string): { avg: number; score: number; count: number } {
  const byTitle = new Map<string, Rating>()
  const sorted = [...state.ratings]
    .filter(r => r.userId === userId)
    .sort((a, b) => a.timestamp - b.timestamp)
  for (const r of sorted) byTitle.set(r.titleId, r)
  if (byTitle.size === 0) return { avg: 0, score: 0, count: 0 }
  const avg = [...byTitle.values()].reduce((acc, r) => acc + r.score, 0) / byTitle.size
  const totalSubmissions = state.ratings.filter(r => r.userId === userId).length
  const bonus = Math.log1p(totalSubmissions) * 0.08
  return { avg, score: avg + bonus, count: byTitle.size }
}

/** All ratings from a user (sorted newest first) */
export function getUserRatings(state: AppState, userId: string): Rating[] {
  return [...state.ratings]
    .filter(r => r.userId === userId)
    .sort((a, b) => b.timestamp - a.timestamp)
}
