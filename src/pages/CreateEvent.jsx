import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'

export default function CreateEvent() {
  const { user, isExhibitor } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: '',
    price: '',
    image: null
  })
  const [error, setError] = useState('')

  if (!user || !isExhibitor()) {
    navigate('/')
    return null
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.date || !formData.time) {
        setError('Please fill in all required fields')
        return
      }

      // Create event object
      const newEvent = {
        ...formData,
        id: Date.now(),
        exhibitorId: user.id,
        exhibitorName: user.name,
        companyName: user.companyName,
        createdAt: new Date().toISOString(),
        attendees: [],
        datetime: new Date(formData.date + 'T' + formData.time).toISOString()
      }

      // Save to localStorage (in a real app, this would be an API call)
      const events = JSON.parse(localStorage.getItem('events') || '[]')
      events.push(newEvent)
      localStorage.setItem('events', JSON.stringify(events))

      // Update exhibitor's events
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            events: [...(u.events || []), newEvent.id]
          }
        }
        return u
      })
      localStorage.setItem('users', JSON.stringify(updatedUsers))

      navigate('/exhibitor-dashboard')
    } catch (err) {
      setError('Failed to create event')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Event Title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />

            <div>
              <label className="block font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select Category</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="expo">Expo</option>
                <option value="networking">Networking</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                required
              />
            </div>

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              required
            />

            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />

            <Input
              label="Location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />

            <Input
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              min="1"
              required
            />

            <Input
              label="Price ($)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              min="0"
              step="0.01"
              required
            />

            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Event Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => navigate('/exhibitor-dashboard')}
              className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
