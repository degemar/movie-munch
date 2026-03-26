import { useState, useCallback } from 'react'
import {
  AppState, User, Title, Rating,
} from '../types'
import { loadState, saveState, generateId } from '../store'

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState)

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
    update(s => ({ ...s, titles: [...s.titles, { ...title, id }] }))
    return id
  }, [update])

  const addRating = useCallback((rating: Omit<Rating, 'id' | 'timestamp'>) => {
    const id = generateId()
    update(s => ({
      ...s,
      ratings: [...s.ratings, { ...rating, id, timestamp: Date.now() }],
    }))
  }, [update])

  const deleteRating = useCallback((ratingId: string) => {
    update(s => ({ ...s, ratings: s.ratings.filter(r => r.id !== ratingId) }))
  }, [update])

  const addUser = useCallback((user: Omit<User, 'id'>) => {
    const id = generateId()
    update(s => ({ ...s, users: [...s.users, { ...user, id }] }))
  }, [update])

  const activeUser = state.users.find(u => u.id === state.activeUserId) ?? state.users[0]

  return { state, activeUser, setActiveUser, addTitle, addRating, deleteRating, addUser }
}
