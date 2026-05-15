import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient, ApiError } from '../apiClient'

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sends GET request and returns data', async () => {
    const data = await apiClient.get<{ data: object[] }>('/api/users?page=1&pageSize=10')
    expect(data).toBeDefined()
  })

  it('throws ApiError on 401', async () => {
    await expect(
      apiClient.post('/api/auth/login', { email: 'bad@x.com', password: 'wrong' })
    ).rejects.toThrow(ApiError)
  })

  it('includes Authorization header when token in localStorage', async () => {
    localStorage.setItem('auth-token', '"mock-token"')
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    await apiClient.get('/api/users?page=1&pageSize=1').catch(() => {})
    const call = fetchSpy.mock.calls[0]
    const headers = call[1]?.headers as Record<string, string>
    expect(headers['Authorization']).toBe('Bearer mock-token')
    fetchSpy.mockRestore()
  })
})
