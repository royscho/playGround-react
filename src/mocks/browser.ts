import { setupWorker } from 'msw/browser'
import { authHandlers } from './handlers/auth'
import { usersHandlers } from './handlers/users'
import { analyticsHandlers } from './handlers/analytics'
import { settingsHandlers } from './handlers/settings'

export const worker = setupWorker(
  ...authHandlers,
  ...usersHandlers,
  ...analyticsHandlers,
  ...settingsHandlers
)
