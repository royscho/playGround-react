import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  Palette,
  Code2,
  MessageSquare,
  Zap,
  Accessibility,
  Film,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  shortLabel?: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/css-examples', label: 'CSS Examples', icon: Palette },
  { to: '/react-demos', label: 'React Demos', shortLabel: 'Demos', icon: Code2 },
  { to: '/chat', label: 'Chat Demo', icon: MessageSquare },
  { to: '/performance', label: 'Performance', icon: Zap },
  { to: '/accessibility', label: 'Accessibility', icon: Accessibility },
  { to: '/media-elements', label: 'Media Elements', icon: Film },
]

const PRIMARY_ROUTES = ['/dashboard', '/analytics', '/react-demos', '/settings']
const MORE_ROUTES = ['/users', '/css-examples', '/chat', '/performance', '/accessibility', '/media-elements']

export const primaryNavItems: NavItem[] = PRIMARY_ROUTES.map(
  (to) => navItems.find((item) => item.to === to)!
)

export const moreNavItems: NavItem[] = MORE_ROUTES.map(
  (to) => navItems.find((item) => item.to === to)!
)
