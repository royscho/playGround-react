import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../../../shared/components/Input'
import { Button } from '../../../shared/components/Button'
import type { ProfileData } from '../hooks/useSettings'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  bio: z.string().max(200, 'Bio must be under 200 characters'),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  defaultValues?: ProfileData
  onSubmit: (data: ProfileData) => void
  isPending?: boolean
  isError?: boolean
}

export function ProfileForm({ defaultValues, onSubmit, isPending, isError }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues ?? { name: '', email: '', bio: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        id="name"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        id="email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          {...register('bio')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        {errors.bio && <span className="text-xs text-red-500">{errors.bio.message}</span>}
      </div>

      {isError && (
        <p className="text-sm text-red-500">Failed to save. Please try again.</p>
      )}

      <Button type="submit" loading={isPending} disabled={!isDirty || isPending}>
        {isDirty ? 'Save changes' : 'No changes'}
      </Button>
    </form>
  )
}
