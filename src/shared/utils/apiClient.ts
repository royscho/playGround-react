export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('auth-token')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    let data: unknown
    try {
      data = await res.json()
    } catch {
      data = null
    }
    const message = (data as { message?: string })?.message ?? res.statusText
    throw new ApiError(message, res.status, data)
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
}
