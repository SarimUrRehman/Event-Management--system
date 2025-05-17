import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Link, useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, isAttendee } = useAuth()
  const [enrolledEvents, setEnrolledEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    // In a real app, this would be an API call
    const allEvents = JSON.parse(localStorage.getItem('events') || '[]')
    
    // Get enrolled events
    const userEvents = allEvents.filter(event => 
      event.attendees?.includes(user.id)
    )
    setEnrolledEvents(userEvents)

    // Get upcoming events
    const now = new Date()
    const upcoming = allEvents
      .filter(event => new Date(event.datetime) > now && !event.attendees?.includes(user.id))
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    setUpcomingEvents(upcoming)
  }, [user])

  if (!user || !isAttendee()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Events</h1>
      
      {/* Enrolled Events */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Enrolled Events</h2>
        </div>
        <div className="divide-y">
          {enrolledEvents.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              You haven't enrolled in any events yet.
              <div className="mt-2">
                <Link to="/events" className="text-primary-600 hover:text-primary-700">
                  Browse events →
                </Link>
              </div>
            </div>
          ) : (
            enrolledEvents.map(event => (
              <div key={event.id} className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                  <Link 
                    to={`/events/${event.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View Details
                  </Link>
                </div>
                {event.description && (
                  <p className="text-gray-600 mt-2 text-sm">
                    {event.description.slice(0, 150)}...
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
        </div>
        <div className="divide-y">
          {upcomingEvents.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No upcoming events available.
            </div>
          ) : (
            upcomingEvents.map(event => (
              <div key={event.id} className="px-6 py-4">
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
                    {event.description && (
                      <p className="text-gray-600 mt-2 text-sm">
                        {event.description.slice(0, 150)}...
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleEnroll(event.id)}
                    className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
