import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { API_BASE_URL } from '../services/api'

type GuestRow = {
  id: string
  fullName: string
  phoneNumber: string
  email: string | null
  attendanceStatus: 'CONFIRMED' | 'DECLINED'
  pass: { token: string } | null
}

type Stats = { total: number; confirmed: number; declined: number }

async function adminFetch<T>(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    ...init,
  })
  const json = (await response.json()) as { data?: T; message?: string }
  if (!response.ok || !json.data) {
    throw new Error(json.message || 'Request failed')
  }
  return json.data
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('dubwf_admin_token') || ''
  const [stats, setStats] = useState<Stats | null>(null)
  const [guests, setGuests] = useState<GuestRow[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'DECLINED'>('ALL')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    Promise.all([adminFetch<Stats>('/api/admin/stats', token), adminFetch<GuestRow[]>('/api/admin/guests', token)])
      .then(([statsResponse, guestsResponse]) => {
        setStats(statsResponse)
        setGuests(guestsResponse)
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : 'Failed to load dashboard')
      })
  }, [token])

  const filtered = useMemo(
    () =>
      guests.filter((guest) => {
        const matchesStatus = statusFilter === 'ALL' || guest.attendanceStatus === statusFilter
        const query = search.trim().toLowerCase()
        const matchesSearch =
          !query ||
          guest.fullName.toLowerCase().includes(query) ||
          guest.phoneNumber.toLowerCase().includes(query) ||
          (guest.email || '').toLowerCase().includes(query)
        return matchesStatus && matchesSearch
      }),
    [guests, search, statusFilter],
  )

  async function deleteGuest(id: string) {
    if (!token) return
    await adminFetch<{ deleted: boolean }>(`/api/admin/guests/${id}`, token, { method: 'DELETE' })
    setGuests((prev) => prev.filter((guest) => guest.id !== id))
  }

  async function toggleStatus(guest: GuestRow) {
    if (!token) return
    const attendanceStatus = guest.attendanceStatus === 'CONFIRMED' ? 'DECLINED' : 'CONFIRMED'
    const updated = await adminFetch<GuestRow>(`/api/admin/guests/${guest.id}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ attendanceStatus }),
    })
    setGuests((prev) => prev.map((row) => (row.id === guest.id ? updated : row)))
  }

  function logout() {
    localStorage.removeItem('dubwf_admin_token')
    navigate('/admin/login')
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-8 text-neutral-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-5xl">Organizer Dashboard</h1>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
        {error ? <p className="text-rose-700">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-neutral-300 bg-white p-4">Total RSVPs: {stats?.total ?? 0}</div>
          <div className="border border-neutral-300 bg-white p-4">Confirmed: {stats?.confirmed ?? 0}</div>
          <div className="border border-neutral-300 bg-white p-4">Declined: {stats?.declined ?? 0}</div>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="border border-neutral-300 bg-white px-4 py-2"
            placeholder="Search guests"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="border border-neutral-300 bg-white px-3 py-2"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'ALL' | 'CONFIRMED' | 'DECLINED')}
          >
            <option value="ALL">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DECLINED">Declined</option>
          </select>
        </div>
        <div className="overflow-x-auto border border-neutral-300 bg-white">
          <table className="w-full min-w-[800px]">
            <thead className="bg-neutral-100 text-left">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Pass Token</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-center text-sm text-neutral-500" colSpan={6}>
                    No guests found.
                  </td>
                </tr>
              ) : (
                filtered.map((guest) => (
                  <tr key={guest.id} className="border-t border-neutral-200">
                    <td className="px-3 py-2">{guest.fullName}</td>
                    <td className="px-3 py-2">{guest.phoneNumber}</td>
                    <td className="px-3 py-2">{guest.email || '-'}</td>
                    <td className="px-3 py-2">{guest.attendanceStatus}</td>
                    <td className="px-3 py-2 text-xs">{guest.pass?.token || '-'}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        {guest.pass ? (
                          <a href={`/pass/${guest.pass.token}`} className="text-xs text-blue-700 underline" target="_blank" rel="noreferrer">
                            View Pass
                          </a>
                        ) : null}
                        <button className="text-xs text-amber-700 underline" onClick={() => toggleStatus(guest)}>
                          Toggle Status
                        </button>
                        <button className="text-xs text-red-700 underline" onClick={() => deleteGuest(guest.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
