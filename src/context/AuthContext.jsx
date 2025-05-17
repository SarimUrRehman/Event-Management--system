import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const user = storedUsers.find(u => u.email === email)
    
    if (!user) {
      throw new Error('User not found')
    }

    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const register = async (userData) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if email already exists
    if (storedUsers.some(user => user.email === userData.email)) {
      throw new Error('Email already exists')
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      role: userData.role || 'attendee',
      createdAt: new Date().toISOString()
    }

    // Initialize role-specific data
    if (newUser.role === 'exhibitor') {
      newUser.events = []
      newUser.analytics = {
        totalEvents: 0,
        totalAttendees: 0
      }
    } else if (newUser.role === 'attendee') {
      newUser.enrolledEvents = []
    } else if (newUser.role === 'admin') {
      // Verify admin registration code (in a real app, this would be more secure)
      if (userData.adminCode !== 'ADMIN123') { // You should change this to a secure method
        throw new Error('Invalid admin registration code')
      }
      newUser.analytics = {
        totalUsers: storedUsers.length,
        totalEvents: 0
      }
    }

    // Save user data
    const updatedUsers = [...storedUsers, newUser]
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    
    // Save profile data
    localStorage.setItem(`user_profile_${newUser.id}`, JSON.stringify(userData))
    
    // Set current user
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
    
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const getProfile = (userId) => {
    const data = localStorage.getItem(`user_profile_${userId}`)
    return data ? JSON.parse(data) : null
  }

  const isAdmin = () => user?.role === 'admin'
  const isExhibitor = () => user?.role === 'exhibitor'
  const isAttendee = () => user?.role === 'attendee'

  const value = {
    user,
    login,
    register,
    logout,
    getProfile,
    isAdmin,
    isExhibitor,
    isAttendee
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
