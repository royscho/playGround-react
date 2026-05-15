export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
  type: 'info' | 'warning' | 'error' | 'success'
}

export interface AnalyticsData {
  date: string
  revenue: number
  users: number
  sessions: number
}

export interface KpiMetric {
  label: string
  value: number
  change: number
  unit?: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor'
}
