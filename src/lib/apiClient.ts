const API_BASE = import.meta.env.VITE_API_URL || ''

interface RequestOptions extends RequestInit {
  auth?: boolean
}

const getAuthToken = () => localStorage.getItem('authToken')

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (options.auth) {
    const token = getAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody.message || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json() as Promise<T>
}

export interface TypingSessionPayload {
  wpm: number
  accuracy: number
  language: string
  font: string
  durationSec: number
  mode: string
}

export interface TypingSession {
  id: string
  userId: string
  wpm: number
  accuracy: number
  language: string
  font: string
  durationSec: number
  mode: string
  createdAt: string
}

export interface TypingSummaryStats {
  avgWpm: number
  avgAccuracy: number
  totalSessions: number
  bestWpm: number
  totalPracticeMinutes: number
}

export interface TypingSummaryResponse {
  recent: TypingSession[]
  stats: TypingSummaryStats
}

export interface TypingHeatmapPoint {
  date: string
  count: number
}

export const createTypingSession = (payload: TypingSessionPayload) =>
  apiRequest<TypingSession>('/api/typing/session', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: true
  })

export const getTypingSummary = (days = 30) =>
  apiRequest<TypingSummaryResponse>(`/api/typing/summary?days=${days}`, {
    auth: true
  })

export const getTypingHeatmap = async (days = 30) => {
  const response = await apiRequest<{ data: TypingHeatmapPoint[] }>(
    `/api/typing/heatmap?days=${days}`,
    { auth: true }
  )
  return response.data
}
