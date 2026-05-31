import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { ProtectedRoute } from '../features/auth'
import { Skeleton } from '../shared/components/Skeleton'
import { ErrorBoundary } from '../shared/components/ErrorBoundary'

const LoginPage = lazy(() => import('../features/auth/components/LoginPage'))
const DashboardPage = lazy(() => import('../features/dashboard/components/DashboardPage'))
const UsersPage = lazy(() => import('../features/users/components/UsersPage'))
const AnalyticsPage = lazy(() => import('../features/analytics/components/AnalyticsPage'))
const SettingsPage = lazy(() => import('../features/settings/components/SettingsPage'))
const CssExamplesPage = lazy(() => import('../features/css-examples/components/CssExamplesPage'))
const ReactDemosPage = lazy(() => import('../features/react-demos/components/ReactDemosPage'))
const ChatPage = lazy(() => import('../features/chat/components/ChatPage'))
const PerformancePage = lazy(() => import('../features/performance/components/PerformancePage'))
const AccessibilityPage = lazy(() => import('../features/accessibility/components/AccessibilityPage'))
const MediaElementsPage = lazy(() => import('../features/media-elements/components/MediaElementsPage'))

const PageLoader = () => <Skeleton lines={4} className="h-8" />

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
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
            <Route
              path="/css-examples"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <CssExamplesPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/react-demos"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <ReactDemosPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/chat"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <ChatPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/performance"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <PerformancePage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/accessibility"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <AccessibilityPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/media-elements"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <MediaElementsPage />
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
