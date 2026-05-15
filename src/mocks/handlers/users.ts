import { http, HttpResponse, delay } from 'msw'
import { mockUsers } from '../data/users'

export const usersHandlers = [
  http.get('/api/users', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const search = url.searchParams.get('search') ?? ''

    const filtered = search
      ? mockUsers.filter(
          (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search)
        )
      : mockUsers

    const start = (page - 1) * pageSize
    return HttpResponse.json({
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    })
  }),
]
