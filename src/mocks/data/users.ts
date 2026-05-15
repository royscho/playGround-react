import type { User } from '../../shared/types/common'

export const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name:
    ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eve Davis'][i % 5] +
    (i > 4 ? ` ${i}` : ''),
  email: `user${i + 1}@example.com`,
  role: (['admin', 'editor', 'viewer'] as const)[i % 3],
  status: i % 7 === 0 ? 'inactive' : 'active',
  createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
}))
