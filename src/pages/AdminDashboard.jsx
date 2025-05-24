import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import SideBar from '../components/Sidebar'

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    usersByRole: {
      admin: 0,
      exhibitor: 0,
      attendee: 0
    }
  })
  const [upcomingEvents, setUpcomingEvents] = useState([])

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const events = JSON.parse(localStorage.getItem('events') || '[]')

    setStats({
      totalUsers: users.length,
      totalEvents: events.length,
      usersByRole: {
        admin: users.filter(u => u.role === 'admin').length,
        exhibitor: users.filter(u => u.role === 'exhibitor').length,
        attendee: users.filter(u => u.role === 'attendee').length
      }
    })

    const now = new Date()
    const upcoming = events
      .filter(event => new Date(event.datetime) > now)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    setUpcomingEvents(upcoming)
  }, [])

  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Dashboard content */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Exhibitors</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.usersByRole.exhibitor}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Attendees</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.usersByRole.attendee}</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600" 
                  style={{ 
                    width: `${(stats.usersByRole.attendee / stats.totalUsers) * 100}%` 
                  }}
                />
              </div>
              <p className="text-sm mt-2">Attendees: {stats.usersByRole.attendee}</p>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary-600" 
                  style={{ 
                    width: `${(stats.usersByRole.exhibitor / stats.totalUsers) * 100}%` 
                  }}
                />
              </div>
              <p className="text-sm mt-2">Exhibitors: {stats.usersByRole.exhibitor}</p>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-tertiary-600" 
                  style={{ 
                    width: `${(stats.usersByRole.admin / stats.totalUsers) * 100}%` 
                  }}
                />
              </div>
              <p className="text-sm mt-2">Admins: {stats.usersByRole.admin}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="divide-y">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 py-4">No upcoming events</p>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(event.datetime).toLocaleDateString()} at {new Date(event.datetime).toLocaleTimeString()}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-500 mt-1">
                          📍 {event.location}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        By {event.companyName} • {event.attendees?.length || 0} attendees
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(event.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
