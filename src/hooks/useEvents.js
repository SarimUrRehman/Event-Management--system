import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export function useEvents() {
  const [events, setEvents] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const storedEvents = localStorage.getItem(`events_${user.id}`)
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents))
      }
    }
  }, [user])

  const saveEvents = (newEvents) => {
    localStorage.setItem(`events_${user.id}`, JSON.stringify(newEvents))
    setEvents(newEvents)
  }

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now(),
      userId: user.id,
    }
    const newEvents = [...events, newEvent]
    saveEvents(newEvents)
    return newEvent
  }

  const updateEvent = (id, updatedEvent) => {
    const newEvents = events.map(event =>
      event.id === id ? { ...event, ...updatedEvent } : event
    )
    saveEvents(newEvents)
  }

  const deleteEvent = (id) => {
    const newEvents = events.filter(event => event.id !== id)
    saveEvents(newEvents)
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  }
}
