import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../../../shared/components/Input'
import { Button } from '../../../shared/components/Button'
import { useLogin } from '../hooks/useAuth'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(data => login(data))} className="space-y-4">
      <Input
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      <Button type="submit" loading={isPending} className="w-full">
        Sign in
      </Button>
      <p className="text-center text-xs text-gray-500">
        Demo: admin@example.com / password
      </p>
    </form>
  )
}
