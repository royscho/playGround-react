import { http, HttpResponse, delay } from 'msw'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(400)
    const { email, password } = await request.json() as { email: string; password: string }
    if (email === 'admin@example.com' && password === 'password') {
      return HttpResponse.json({
        data: { id: '1', name: 'Admin User', email, role: 'admin' },
        token: 'mock-jwt-token',
      })
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),
  http.post('/api/auth/logout', () => HttpResponse.json({ message: 'Logged out' })),
]
