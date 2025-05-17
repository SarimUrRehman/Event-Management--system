import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import EventCard from '../components/EventCard'
import Button from '../components/Button'

export default function ExhibitorDashboard() {
  const { user, isExhibitor } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0
  })

  useEffect(() => {
    if (!user || !isExhibitor()) {
      navigate('/')
      return
    }

    // Load exhibitor's events
    const allEvents = JSON.parse(localStorage.getItem('events') || '[]')
    const exhibitorEvents = allEvents.filter(event => event.exhibitorId === user.id)
    setEvents(exhibitorEvents)

    // Calculate stats
    const now = new Date()
    setStats({
      totalEvents: exhibitorEvents.length,
      totalAttendees: exhibitorEvents.reduce((acc, event) => acc + (event.attendees?.length || 0), 0),
      upcomingEvents: exhibitorEvents.filter(event => new Date(event.datetime) > now).length
    })
  }, [user, isExhibitor, navigate])

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`)
  }

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      // Delete event
      const allEvents = JSON.parse(localStorage.getItem('events') || '[]')
      const updatedEvents = allEvents.filter(event => event.id !== eventId)
      localStorage.setItem('events', JSON.stringify(updatedEvents))

      // Update state
      setEvents(prev => prev.filter(event => event.id !== eventId))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Events</h1>
          <p className="text-gray-600">Manage your events and track attendance</p>
        </div>
        <Button onClick={() => navigate('/create')} className="px-4 py-2">
          Create New Event
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Attendees</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalAttendees}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Upcoming Events</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
          <Button onClick={() => navigate('/create')} className="px-6 py-2">
            Create Your First Event
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              showActions={true}
              onEdit={() => handleEdit(event.id)}
              onDelete={() => handleDelete(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
