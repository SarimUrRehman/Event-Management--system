import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, isAdmin, isExhibitor, isAttendee } = useAuth()
  const currentPath = window.location.pathname

  if (!user) {
    return <Navigate to="/login" />
  }

  // Admin routes
  if (currentPath.startsWith('/admin') && !isAdmin()) {
    return <Navigate to="/" />
  }

  // Exhibitor routes
  if ((currentPath.startsWith('/exhibitor') || currentPath === '/create') && !isExhibitor()) {
    return <Navigate to="/" />
  }

  // Attendee routes
  if (currentPath === '/dashboard' && !isAttendee()) {
    return <Navigate to="/" />
  }

  return children
}
