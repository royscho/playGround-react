import { http, HttpResponse, delay } from 'msw'

export const settingsHandlers = [
  http.put('/api/settings', async ({ request }) => {
    await delay(600)
    if (Math.random() < 0.1) {
      return HttpResponse.json({ message: 'Server error' }, { status: 500 })
    }
    const body = await request.json()
    return HttpResponse.json({ data: body, message: 'Updated successfully' })
  }),
]
