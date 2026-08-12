import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { apiFetch } from '../services/api'

type LoginResponse = {
  token: string
  admin: { id: string; email: string }
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      if (!response.data) throw new Error('Login failed')
      localStorage.setItem('dubwf_admin_token', response.data.token)
      navigate('/admin/dashboard')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-ivory">
      <form className="w-full max-w-sm space-y-4 border border-white/15 bg-softBlack/70 p-6" onSubmit={onSubmit}>
        <h1 className="font-display text-4xl">Admin Login</h1>
        <input
          className="w-full border border-white/20 bg-black px-4 py-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="w-full border border-white/20 bg-black px-4 py-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
        {error ? <p className="text-sm text-rose">{error}</p> : null}
      </form>
    </main>
  )
}
