import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../store/authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
    localStorage.clear()
  })

  it('starts unauthenticated', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('setAuth sets user and token', () => {
    const user = { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' as const }
    useAuthStore.getState().setAuth(user, 'token-123')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user).toEqual(user)
    expect(useAuthStore.getState().token).toBe('token-123')
  })

  it('logout clears state', () => {
    useAuthStore
      .getState()
      .setAuth({ id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' }, 'token')
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().token).toBeNull()
  })
})
