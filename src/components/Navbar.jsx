import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center space-x-2">
              <span role="img" aria-label="logo" className="text-2xl">🎪</span>
              <span>EventSphere</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              {/* Common links for all users */}
              <Link to="/events" className="text-gray-600 hover:text-primary-600">Browse Events</Link>
              <Link to="/categories" className="text-gray-600 hover:text-primary-600">Categories</Link>
              
              {/* Admin-only links */}
              {user?.role === 'admin' && (
                <Link to="/admin-dashboard" className="text-gray-600 hover:text-primary-600">Admin Panel</Link>
              )}
              
              {/* Exhibitor-only links */}
              {user?.role === 'exhibitor' && (
                <>
                  <Link to="/create" className="text-gray-600 hover:text-primary-600">Create Event</Link>
                  <Link to="/exhibitor-dashboard" className="text-gray-600 hover:text-primary-600">Exhibitor Dashboard</Link>
                </>
              )}
            </div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Search events..."
                className="bg-gray-50 border-none rounded-full px-5 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 p-1 text-gray-400 hover:text-primary-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user?.role === 'attendee' && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                    My Events
                  </Link>
                )}
                {user?.role === 'exhibitor' && (
                  <Link to="/exhibitor-dashboard" className="text-gray-700 hover:text-primary-600">
                    Exhibitor Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin-dashboard" className="text-gray-700 hover:text-primary-600">
                    Admin Panel
                  </Link>
                )}
                {/* Profile Circle with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-sm group-hover:shadow transition-shadow duration-200">
                      {user?.email ? user.email[0].toUpperCase() : user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100 animate-fadeIn">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className="!px-6">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="!px-6 !bg-primary-100 !text-primary-700 hover:!bg-primary-200">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
