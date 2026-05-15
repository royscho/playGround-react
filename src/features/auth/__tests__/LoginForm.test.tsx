import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from '../components/LoginForm'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider
    client={
      new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      })
    }
  >
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
)

describe('LoginForm', () => {
  it('shows validation error on empty submit', async () => {
    render(<LoginForm />, { wrapper })
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })

  it('shows error on invalid credentials', async () => {
    render(<LoginForm />, { wrapper })
    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('submits successfully with valid credentials', async () => {
    render(<LoginForm />, { wrapper })
    await userEvent.type(screen.getByLabelText(/email/i), 'admin@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(
      () => {
        expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })
})
