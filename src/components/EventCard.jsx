import { Link } from 'react-router-dom'
import Button from './Button'
import { BiTime, BiMapPin, BiUser, BiEdit, BiTrash } from 'react-icons/bi'
import { useAuth } from '../context/AuthContext'

function EventCard({ event, onEdit, onDelete, showActions = false }) {
  const { user } = useAuth()
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTagColor = (category) => {
    const colors = {
      'conference': 'bg-blue-100 text-blue-800',
      'workshop': 'bg-green-100 text-green-800',
      'seminar': 'bg-yellow-100 text-yellow-800',
      'expo': 'bg-purple-100 text-purple-800',
      'networking': 'bg-pink-100 text-pink-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          {event.category && (
            <span
              className={`px-2 py-1 rounded text-sm ${getTagColor(event.category)}`}
            >
              {event.category}
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-gray-500 text-sm mb-4">
          <div className="flex items-center gap-2">
            <BiTime className="flex-shrink-0" />
            <span>{formatDate(event.datetime)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <BiMapPin className="flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <BiUser className="flex-shrink-0" />
            <span>{event.attendees?.length || 0} attendees</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            By {event.companyName}
          </div>
          <div className="flex gap-2">
            {showActions && user?.id === event.exhibitorId && (
              <>
                <button
                  onClick={onEdit}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit event"
                >
                  <BiEdit size={20} />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete event"
                >
                  <BiTrash size={20} />
                </button>
              </>
            )}
            <Link to={user ? `/event/${event.id}` : '/login'}>
              <Button className="px-4 py-2">
                {user ? 'View Details' : 'Login to View'}
              </Button>
            </Link>
          </div>
        </div>
        <p className="mt-3 text-gray-600 text-sm line-clamp-2">{event.description}</p>
      </div>
    </div>
  )
}

export default EventCard;
