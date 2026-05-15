import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { ProtectedRoute } from '../features/auth'
import { Skeleton } from '../shared/components/Skeleton'
import { ErrorBoundary } from '../shared/components/ErrorBoundary'

const LoginPage = lazy(() => import('../features/auth/components/LoginPage'))
const DashboardPage = lazy(() => import('../features/analytics/components/AnalyticsPage'))
const UsersPage = lazy(() => import('../features/users/components/UsersPage'))
const AnalyticsPage = lazy(() => import('../features/analytics/components/AnalyticsPage'))
const SettingsPage = lazy(() => import('../features/settings/components/SettingsPage'))

const PageLoader = () => <Skeleton lines={4} className="h-8" />

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <DashboardPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/users"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <UsersPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/analytics"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <AnalyticsPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/settings"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <SettingsPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
