export interface NavItem {
  to: string
  label: string
  shortLabel?: string
  icon: string
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
  { to: '/css-examples', label: 'CSS Examples', icon: '🎨' },
  { to: '/react-demos', label: 'React Demos', shortLabel: 'Demos', icon: '⚛️' },
  { to: '/chat', label: 'Chat Demo', icon: '💬' },
  { to: '/performance', label: 'Performance', icon: '⚡' },
  { to: '/accessibility', label: 'Accessibility', icon: '♿' },
]

const PRIMARY_ROUTES = ['/dashboard', '/analytics', '/react-demos', '/settings']
const MORE_ROUTES = ['/users', '/css-examples', '/chat', '/performance', '/accessibility']

export const primaryNavItems: NavItem[] = PRIMARY_ROUTES.map(
  (to) => navItems.find((item) => item.to === to)!
)

export const moreNavItems: NavItem[] = MORE_ROUTES.map(
  (to) => navItems.find((item) => item.to === to)!
)
