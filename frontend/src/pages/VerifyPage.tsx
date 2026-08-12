import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../services/api'

type VerifyResponse = {
  status: string
  guestName: string
  eventDate: string
  venue: string
}

export function VerifyPage() {
  const { token = '' } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payload, setPayload] = useState<VerifyResponse | null>(null)

  useEffect(() => {
    apiFetch<VerifyResponse>(`/api/verify/${token}`)
      .then((response) => {
        if (!response.data) throw new Error('This event pass could not be verified.')
        setPayload(response.data)
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : 'This event pass could not be verified.')
      })
      .finally(() => setLoading(false))
  }, [token])

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-ivory">
      <section className="w-full max-w-md border border-white/15 bg-softBlack/70 p-6 text-center">
        <img src="/assets/logo.png" alt="DUBWF logo" className="mx-auto h-12 w-auto" />
        <h1 className="mt-4 font-display text-4xl">1ST ANNIVERSARY</h1>
        {loading ? <p className="mt-6 text-muted">Verifying pass...</p> : null}
        {error ? <p className="mt-6 text-rose">{error}</p> : null}
        {payload ? (
          <div className="mt-6 space-y-2">
            <p className="text-xs tracking-[0.2em] text-gold uppercase">PASS VERIFIED</p>
            <p className="text-xl">{payload.guestName}</p>
            <p className="text-sm text-muted">Event: {payload.eventDate}</p>
            <p className="text-sm text-muted">Venue: {payload.venue}</p>
          </div>
        ) : null}
        <Link to="/" className="mt-8 inline-block text-xs tracking-[0.16em] text-gold uppercase">
          Back Home
        </Link>
      </section>
    </main>
  )
}
