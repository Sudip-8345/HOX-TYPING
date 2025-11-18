import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiRequest } from '@/lib/apiClient'

interface User {
  id: string
  name: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const saveSession = (token: string, userData: User) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const token = localStorage.getItem('authToken')
    if (!token) {
      setIsLoading(false)
      return
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await apiRequest<{ user: User }>('/api/auth/me', { auth: true })
        localStorage.setItem('user', JSON.stringify(response.user))
        setUser(response.user)
      } catch (error) {
        console.error('Failed to validate session', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiRequest<{ user: User; token: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }
    )

    saveSession(response.token, response.user)
  }

  const signup = async (name: string, email: string, password: string) => {
    const response = await apiRequest<{ user: User; token: string }>(
      '/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      }
    )

    saveSession(response.token, response.user)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
