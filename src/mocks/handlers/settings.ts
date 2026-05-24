import { http, HttpResponse, delay } from 'msw'

const defaultProfile = {
  name: 'Admin User',
  email: 'admin@example.com',
  bio: '',
}

export const settingsHandlers = [
  http.get('/api/settings', async () => {
    await delay(300)
    return HttpResponse.json(defaultProfile)
  }),

  http.put('/api/settings', async ({ request }) => {
    await delay(600)
    const body = await request.json()
    return HttpResponse.json({ data: body, message: 'Updated successfully' })
  }),
]
