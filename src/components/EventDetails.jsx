import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BiTime, BiMapPin, BiUser } from 'react-icons/bi';
import Button from '../components/Button';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/events/${id}`)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching event:', err);
        setLoading(false);
      });
  }, [id]);

  const handleEnroll = () => {
    axios.post(`/api/events/${id}/enroll`)
      .then(() => alert('Enrolled successfully!'))
      .catch(err => alert('Error enrolling: ' + err.message));
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!event) return <div className="p-4 text-red-600">Event not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      {event.image && (
        <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-md mb-4" />
      )}
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <div className="flex flex-wrap gap-3 text-gray-600 text-sm mb-4">
        <span className="flex items-center gap-1"><BiTime /> {new Date(event.datetime).toLocaleString()}</span>
        <span className="flex items-center gap-1"><BiMapPin /> {event.location}</span>
        <span className="flex items-center gap-1"><BiUser /> {event.attendees?.length || 0} attendees</span>
      </div>
      <p className="text-gray-700 mb-6">{event.description}</p>
      <Button onClick={handleEnroll}>Enroll</Button>
    </div>
  );
}

export default EventDetails;
