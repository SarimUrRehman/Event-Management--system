import { useState } from 'react';
import Button from './Button';
import { BiTime, BiMapPin, BiUser, BiEdit, BiTrash } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';

function EventCard({ event, onEdit, onDelete, showActions = false, onEnrollClick }) {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTagColor = (category) => {
    const colors = {
      conference: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      seminar: 'bg-yellow-100 text-yellow-800',
      expo: 'bg-purple-100 text-purple-800',
      networking: 'bg-pink-100 text-pink-800',
      default: 'bg-gray-100 text-gray-800',
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {event.image && (
        <div className="overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
          {event.category && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTagColor(event.category)}`}>
              {event.category}
            </span>
          )}
        </div>

        {!showDetails && (
          <>
            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

            <div className="space-y-2 text-gray-500 text-sm mb-4">
              <div className="flex items-center gap-2">
                <BiTime className="text-gray-400" />
                <span>{formatDate(event.datetime)}</span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2">
                  <BiMapPin className="text-gray-400" />
                  <span>{event.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <BiUser className="text-gray-400" />
                <span>{event.attendees?.length || 0} attendees</span>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between items-center mt-5">
          <div className="text-sm text-gray-500">By {event.companyName}</div>

          <div className="flex gap-2 items-center">
            {showActions && user?.id === event.exhibitorId && (
              <>
                <button onClick={onEdit} className="p-2 rounded-full text-blue-600 hover:bg-blue-50">
                  <BiEdit size={20} />
                </button>
                <button onClick={onDelete} className="p-2 rounded-full text-red-600 hover:bg-red-50">
                  <BiTrash size={20} />
                </button>
              </>
            )}

            <Button onClick={() => setShowDetails(!showDetails)} className="px-4 py-1 text-sm">
              {showDetails ? 'Hide Details' : user ? 'View Details' : 'Login to View'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
