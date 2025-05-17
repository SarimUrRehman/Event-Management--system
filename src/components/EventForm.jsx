import { useState, useEffect } from 'react'
import Input from './Input'
import Button from './Button'

export default function EventForm({ event, onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description)
      setDate(event.date)
      setTime(event.time)
      setLocation(event.location)
    }
  }, [event])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      date,
      time,
      location,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Event Title"
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="input min-h-[100px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          label="Time"
          type="time"
          required
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <Input
        label="Location"
        type="text"
        required
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          className="!bg-gray-500 hover:!bg-gray-600"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  )
}
