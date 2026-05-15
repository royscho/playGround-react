import { setupServer } from 'msw/node'
import { authHandlers } from './handlers/auth'
import { usersHandlers } from './handlers/users'
import { analyticsHandlers } from './handlers/analytics'
import { settingsHandlers } from './handlers/settings'

export const server = setupServer(
  ...authHandlers,
  ...usersHandlers,
  ...analyticsHandlers,
  ...settingsHandlers
)
