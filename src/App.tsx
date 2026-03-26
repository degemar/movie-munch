import React, { createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppState } from './hooks/useAppState'
import { AppState, User, Title, Rating } from './types'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import AddTitle from './pages/AddTitle'
import Library from './pages/Library'
import TitleDetail from './pages/TitleDetail'
import Leaderboard from './pages/Leaderboard'
import Users from './pages/Users'

interface AppCtx {
  state: AppState
  activeUser: User
  setActiveUser: (id: string) => void
  addTitle: (t: Omit<Title, 'id'>) => string
  addRating: (r: Omit<Rating, 'id' | 'timestamp'>) => void
  deleteRating: (id: string) => void
  addUser: (u: Omit<User, 'id'>) => void
}

export const AppContext = createContext<AppCtx>(null!)
export const useApp = () => useContext(AppContext)

export default function App() {
  const ctx = useAppState()
  return (
    <AppContext.Provider value={ctx}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTitle />} />
          <Route path="/library" element={<Library />} />
          <Route path="/title/:titleId" element={<TitleDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/users" element={<Users />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </AppContext.Provider>
  )
}
