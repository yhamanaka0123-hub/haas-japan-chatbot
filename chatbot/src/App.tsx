import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import type { Chunk } from './types'
import { ChunksContext } from './context/ChunksContext'
import SiteNav from './components/SiteNav'
import SiteFooter from './components/SiteFooter'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home'
import Profiles from './pages/Profiles'
import Curriculum from './pages/Curriculum'
import Career from './pages/Career'
import Clubs from './pages/Clubs'
import Blog from './pages/Blog'
import CoffeeChat from './pages/CoffeeChat'
import './App.css'

export default function App() {
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const base = import.meta.env.BASE_URL ?? '/'
    fetch(`${base}data/chunks.json`)
      .then(r => r.json())
      .then((data: Chunk[]) => { setChunks(data); setReady(true) })
      .catch(e => console.error('Failed to load chunks.json:', e))
  }, [])

  return (
    <ChunksContext.Provider value={{ chunks, ready }}>
      <HashRouter>
        <SiteNav />
        <main style={{ paddingTop: '5rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/career" element={<Career />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/coffee" element={<CoffeeChat />} />
          </Routes>
        </main>
        <SiteFooter />
        <ChatWidget />
      </HashRouter>
    </ChunksContext.Provider>
  )
}
