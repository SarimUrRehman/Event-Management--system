import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [productsServices, setProductsServices] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [contactInfo, setContactInfo] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Basic validation
      if (!name || !email || !password || !role) {
        setError('Please fill in all required fields')
        return
      }

      // Role-specific validation
      if (role === 'exhibitor' && (!companyName || !productsServices || !contactInfo || !logoFile)) {
        setError('Please fill in all exhibitor details')
        return
      }

      if (role === 'admin' && !adminCode) {
        setError('Admin code is required')
        return
      }

      let logoBase64 = ''
      if (role === 'exhibitor' && logoFile) {
        logoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(logoFile)
        })
      }

      const userData = {
        name,
        email,
        password,
        role,
        ...(role === 'exhibitor' && {
          companyName,
          productsServices,
          logo: logoBase64,
          contactInfo,
        }),
        ...(role === 'admin' && {
          adminCode
        })
      }

      await register(userData)
      
      // Redirect based on role
      switch (role) {
        case 'admin':
          navigate('/admin-dashboard')
          break
        case 'exhibitor':
          navigate('/exhibitor-dashboard')
          break
        case 'attendee':
          navigate('/events')
          break
        default:
          navigate('/profile')
      }
    } catch (err) {
      setError(err.message || 'Failed to create an account')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded">{error}</div>
          )}

          <Input label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <div>
            <label className="block font-medium mb-1">Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
              required
            >
              <option value="">Select Role</option>
              <option value="attendee">Attendee</option>
              <option value="exhibitor">Exhibitor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === 'admin' && (
            <Input 
              label="Admin Code" 
              type="password" 
              value={adminCode} 
              onChange={(e) => setAdminCode(e.target.value)} 
              required 
              placeholder="Enter admin registration code"
            />
          )}

          {role === 'exhibitor' && (
            <>
              <Input label="Company Name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              <Input label="Products / Services" type="text" value={productsServices} onChange={(e) => setProductsServices(e.target.value)} required />
              <Input label="Contact Info" type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required />
              <div>
                <label className="block font-medium mb-1">Upload Logo</label>
                <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} required />
              </div>
            </>
          )}

          <Button type="submit" className="w-full">Create Account</Button>
        </form>
      </div>
    </div>
  )
}
