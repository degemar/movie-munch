import { useState, useCallback, useEffect } from 'react'
import {
  AppState, User, Title, Rating,
} from '../types'
import { loadState, saveState, generateId, getDefaultState } from '../store'
import { supabase } from '../lib/supabase'

const toUser = (row: any): User => ({
  id: row.id,
  name: row.name,
  avatar: row.avatar,
  color: row.color,
})

const toTitle = (row: any): Title => ({
  id: row.id,
  type: row.type,
  title: row.title,
  platform: row.platform,
  year: row.year ?? undefined,
  overview: row.overview ?? undefined,
  genre: row.genre ?? undefined,
  runtimeMinutes: row.runtime_minutes ?? undefined,
  seasonsCount: row.seasons_count ?? undefined,
})

const toRating = (row: any): Rating => ({
  id: row.id,
  userId: row.user_id,
  titleId: row.title_id,
  score: row.score,
  favorite: row.favorite,
  timestamp: row.timestamp,
})

const fromTitle = (title: Title) => ({
  ...title,
  runtime_minutes: title.runtimeMinutes ?? null,
  seasons_count: title.seasonsCount ?? null,
  created_at: new Date().toISOString(),
})

const fromRating = (rating: Rating) => ({
  ...rating,
  user_id: rating.userId,
  title_id: rating.titleId,
  created_at: new Date().toISOString(),
})

const fromUser = (user: User) => ({
  ...user,
  created_at: new Date().toISOString(),
})

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    let canceled = false

    async function loadRemote() {
      try {
        const [userRes, titleRes, ratingRes] = await Promise.all([
          supabase.from('users').select('id, name, avatar, color').order('created_at', { ascending: true }),
          supabase.from('titles').select('id, type, title, platform, year, overview, genre, runtime_minutes, seasons_count').order('created_at', { ascending: true }),
          supabase.from('ratings').select('id, user_id, title_id, score, favorite, timestamp').order('timestamp', { ascending: true }),
        ])

        if (userRes.error || titleRes.error || ratingRes.error) {
          throw new Error(`Supabase load failed: ${userRes.error?.message ?? ''} ${titleRes.error?.message ?? ''} ${ratingRes.error?.message ?? ''}`)
        }

        if (canceled) return

        const users: User[] = (userRes.data?.map(toUser) ?? [])
        const titles: Title[] = (titleRes.data?.map(toTitle) ?? [])
        const ratings: Rating[] = (ratingRes.data?.map(toRating) ?? [])

        const nextState: AppState = {
          users: users.length ? users : getDefaultState().users,
          titles,
          ratings,
          activeUserId: users.some((u: User) => u.id === state.activeUserId)
            ? state.activeUserId
            : (users[0]?.id ?? getDefaultState().activeUserId),
        }

        setState(nextState)
        saveState(nextState)
      } catch (error) {
        console.warn('[Supabase] load failed, falling back to local state', error)
        const fallback = loadState()
        if (!canceled) setState(fallback)
      }
    }

    loadRemote()

    return () => { canceled = true }
  }, [])

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState(prev => {
      const next = fn(prev)
      saveState(next)
      return next
    })
  }, [])

  const setActiveUser = useCallback((userId: string) => {
    update(s => ({ ...s, activeUserId: userId }))
  }, [update])

  const addTitle = useCallback((title: Omit<Title, 'id'>) => {
    const id = generateId()
    const newTitle: Title = { ...title, id }

    update(s => ({ ...s, titles: [...s.titles, newTitle] }))

    ;(async () => {
      const { error } = await supabase.from('titles').insert(fromTitle(newTitle))
      if (error) console.error('[Supabase] insert title failed', error)
    })()

    return id
  }, [update])

  const addRating = useCallback((rating: Omit<Rating, 'id' | 'timestamp'>) => {
    const id = generateId()
    const newRating: Rating = { ...rating, id, timestamp: Date.now() }

    update(s => ({ ...s, ratings: [...s.ratings, newRating] }))

    ;(async () => {
      const { error } = await supabase.from('ratings').insert(fromRating(newRating))
      if (error) console.error('[Supabase] insert rating failed', error)
    })()
  }, [update])

  const deleteRating = useCallback((ratingId: string) => {
    update(s => ({ ...s, ratings: s.ratings.filter(r => r.id !== ratingId) }))

    ;(async () => {
      const { error } = await supabase.from('ratings').delete().eq('id', ratingId)
      if (error) console.error('[Supabase] delete rating failed', error)
    })()
  }, [update])

  const addUser = useCallback((user: Omit<User, 'id'>) => {
    const id = generateId()
    const newUser: User = { ...user, id }

    update(s => ({ ...s, users: [...s.users, newUser] }))

    ;(async () => {
      const { error } = await supabase.from('users').insert(fromUser(newUser))
      if (error) console.error('[Supabase] insert user failed', error)
    })()
  }, [update])

  const activeUser = state.users.find(u => u.id === state.activeUserId) ?? state.users[0]

  return { state, activeUser, setActiveUser, addTitle, addRating, deleteRating, addUser }
}
