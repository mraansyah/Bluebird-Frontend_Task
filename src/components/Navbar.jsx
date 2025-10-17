import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate()

  const goSearch = (q) => {
    const trimmed = q.trim()
    if (trimmed.length) {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`)
      setShowSearch(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') goSearch(search)
    if (e.key === 'Escape') {
      setShowSearch(false)
      setSearch('')
    }
  }

  useEffect(() => {
    if (!search.trim()) return
    const t = setTimeout(() => goSearch(search), 500)
    return () => clearTimeout(t)
  }, [search])

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-18">
        <a href="/" className="text-3xl font-extrabold text-white tracking-tight font-serif">
          Bluebird
        </a>

        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-white font-medium hover:text-blue-200 transition-all duration-300 hover:scale-105 tracking-wide">
            Home
          </a>
          <a href="/wishlist" className="text-white font-medium hover:text-blue-200 transition-all duration-300 hover:scale-105 tracking-wide">
            Wishlist
          </a>
          <a href="/mybook" className="text-white font-medium hover:text-blue-200 transition-all duration-300 hover:scale-105 tracking-wide">
            MyBook
          </a>
        </div>

        <div className="relative">
          {!showSearch ? (
            <button
              onClick={() => setShowSearch(true)}
              className="p-3 text-white hover:text-blue-200 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 shadow-md"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center border-2 border-white/20 rounded-xl px-4 py-2 bg-white/95 backdrop-blur-sm focus-within:ring-4 focus-within:ring-blue-300/50 shadow-lg">
              <input
                type="text"
                placeholder="Search vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="outline-none bg-transparent text-gray-800 placeholder-gray-500 w-40 sm:w-56 font-medium"
                autoFocus
              />
              <button onClick={() => goSearch(search)} className="ml-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
                </svg>
              </button>
              <button
                onClick={() => { setShowSearch(false); setSearch('') }}
                className="ml-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}