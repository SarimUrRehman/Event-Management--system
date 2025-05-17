import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    // Get profile data from localStorage
    const data = localStorage.getItem(`user_profile_${user?.id}`)
    if (data) {
      setProfileData(JSON.parse(data))
    }
  }, [user])

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Please log in to view your profile.
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl space-y-6">
      <div className="text-center">
        {profileData.role === 'exhibitor' ? (
          // Exhibitor Profile
          <>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src={profileData.logo}
                alt="Company Logo"
                className="w-40 h-40 rounded-full object-cover border-4 border-primary-500 shadow-md"
              />
            </div>

            {/* Company Info */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">{profileData.companyName}</h2>
              <p className="text-sm text-gray-500">Created by: <span className="font-medium">{profileData.name}</span></p>
              <p className="text-lg text-gray-700"><strong>Services:</strong> {profileData.productsServices}</p>
              <p className="text-gray-600"><strong>Contact:</strong> {profileData.contactInfo}</p>
            </div>
          </>
        ) : (
          // Regular User Profile
          <>
            {/* User Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 rounded-full bg-primary-600 text-white flex items-center justify-center text-6xl font-bold">
                {profileData.name[0].toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.email}</p>
              <p className="text-gray-500 capitalize">Role: {profileData.role}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
