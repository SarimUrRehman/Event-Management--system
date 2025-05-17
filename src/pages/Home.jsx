import { Link } from 'react-router-dom'
import Button from '../components/Button'
import EventCard from '../components/EventCard'
import Footer from '../components/Footer'
import { useEvents } from '../hooks/useEvents'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { BiSearch, BiMapPin } from 'react-icons/bi'

export default function Home() {
  const { user } = useAuth()
  const { events } = useEvents()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  
  // Get upcoming events
  const allEvents = JSON.parse(localStorage.getItem('events') || '[]')
  const now = new Date()
  const upcomingEvents = allEvents
    .filter(event => new Date(event.datetime) > now)
    .filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (event.location || '').toLowerCase().includes(searchLocation.toLowerCase())
    )
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .slice(0, 6)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative py-20 text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80)',
            filter: 'brightness(0.7)'
          }}
        />
        <div className="relative z-10 text-white">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find and join events that match your interests
          </p>
          <div className="max-w-3xl mx-auto bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded">
              <BiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full p-2 bg-transparent outline-none text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded">
              <BiMapPin className="text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="w-full p-2 bg-transparent outline-none text-gray-800"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <Button className="px-8 py-2 whitespace-nowrap">
              Find Events
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center gap-2"
            >
              {category.icon}
              <span className="font-medium text-gray-800">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <Link to={user ? "/dashboard" : "/login"}>
            <Button className="text-sm px-4 py-2">
              {user ? 'View All Events' : 'Login to View Events'}
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showActions={false}
              />
            ))
          ) : (
            <p className="text-gray-600 col-span-3 text-center py-8">No upcoming events</p>
          )}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What People Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <div className="font-semibold">{testimonial.author}</div>
              <div className="text-gray-500 text-sm">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

const categories = [
  { name: 'Music', icon: '🎵' },
  { name: 'Tech', icon: '💻' },
  { name: 'Food', icon: '🍽️' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Arts', icon: '🎨' },
  { name: 'Business', icon: '💼' },
  { name: 'Education', icon: '📚' },
  { name: 'Health', icon: '🏥' },
  { name: 'Online', icon: '🌐' },
  { name: 'Free', icon: '🎁' },
  { name: 'Outdoors', icon: '🏞️' },
  { name: 'Community', icon: '👥' }
]

const testimonials = [
  {
    text: "This platform made organizing our company conference a breeze. Highly recommended!",
    author: "Sarah Johnson",
    role: "Event Manager"
  },
  {
    text: "The best event management tool I've used. Simple yet powerful.",
    author: "Mike Chen",
    role: "Community Organizer"
  },
]
