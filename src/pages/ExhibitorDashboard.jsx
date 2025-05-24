import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import EventCard from '../components/EventCard'
import Button from '../components/Button'
import { BiCalendar, BiTime, BiMap, BiUser, BiStore } from 'react-icons/bi';
import { FaChair } from 'react-icons/fa';

export default function ExhibitorDashboard() {
  const { user, isExhibitor } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0,
    totalBooths: 0,
    occupiedBooths: 0
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
    const upcomingEvents = exhibitorEvents.filter(event => new Date(event.datetime) > now)
    const totalBooths = exhibitorEvents.reduce((acc, event) => acc + (event.booths?.length || 0), 0)
    const occupiedBooths = exhibitorEvents.reduce((acc, event) => {
      const eventOccupied = event.booths?.filter(booth => booth.status === 'occupied').length || 0
      return acc + eventOccupied
    }, 0)

    setStats({
      totalEvents: exhibitorEvents.length,
      totalAttendees: exhibitorEvents.reduce((acc, event) => acc + (event.attendees?.length || 0), 0),
      upcomingEvents: upcomingEvents.length,
      totalBooths,
      occupiedBooths
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <BiCalendar size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <BiUser size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttendees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <BiCalendar size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaChair size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Booths</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBooths}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <BiStore size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Occupied Booths</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.occupiedBooths}/{stats.totalBooths}
              </p>
            </div>
          </div>
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
        <div className="space-y-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    <p className="text-gray-600 mt-1">{event.location}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <BiCalendar className="mr-1" />
                      <span>{new Date(event.datetime).toLocaleDateString()}</span>
                      <BiTime className="ml-3 mr-1" />
                      <span>{new Date(event.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      {event.booths?.length > 0 && (
                        <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {event.booths.length} {event.booths.length === 1 ? 'Booth' : 'Booths'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(event.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit Event"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete Event"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Booth Information */}
                {event.booths?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-700 mb-2">Booth Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {event.booths.map((booth, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border ${
                            booth.status === 'reserved' 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-green-50 border-green-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Booth {booth.id}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              booth.status === 'reserved' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {booth.status === 'reserved' ? 'Reserved' : 'Occupied'}
                            </span>
                          </div>
                          {booth.reservedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Reserved on: {new Date(booth.reservedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
