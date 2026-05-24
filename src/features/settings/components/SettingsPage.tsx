import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { ProfileForm } from './ProfileForm'
import { Skeleton } from '../../../shared/components/Skeleton'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const { profile, isLoading, updateProfile, isPending, isError } = useSettings({
    onSuccess: () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  return (
    <div className="p-6">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Profile</h2>

          {saved && (
            <div className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              Profile saved successfully
            </div>
          )}

          {isLoading ? (
            <Skeleton lines={4} className="h-8" />
          ) : (
            <ProfileForm
              defaultValues={profile}
              onSubmit={updateProfile}
              isPending={isPending}
              isError={isError}
            />
          )}
        </div>
      </div>
    </div>
  )
}
