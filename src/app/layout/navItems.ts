export interface NavItem {
  to: string
  label: string
  icon: string
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
  { to: '/css-examples', label: 'CSS Examples', icon: '🎨' },
  { to: '/react-demos', label: 'React Demos', icon: '⚛️' },
  { to: '/chat', label: 'Chat Demo', icon: '💬' },
  { to: '/performance', label: 'Performance', icon: '⚡' },
  { to: '/accessibility', label: 'Accessibility', icon: '♿' },
]

export const primaryNavItems: NavItem[] = [
  navItems[0], // Dashboard
  navItems[2], // Analytics
  navItems[5], // React Demos
  navItems[3], // Settings
]

export const moreNavItems: NavItem[] = [
  navItems[1], // Users
  navItems[4], // CSS Examples
  navItems[6], // Chat Demo
  navItems[7], // Performance
  navItems[8], // Accessibility
]
