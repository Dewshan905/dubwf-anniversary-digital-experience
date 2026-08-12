import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DigitalPassCard } from '../components/pass/DigitalPassCard'
import { apiFetch } from '../services/api'

type PassResponse = {
  token: string
  guestName: string
}

export function PassPage() {
  const { token = '' } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payload, setPayload] = useState<PassResponse | null>(null)

  useEffect(() => {
    apiFetch<PassResponse>(`/api/pass/${token}`)
      .then((response) => {
        if (!response.data) throw new Error('Pass not found')
        setPayload(response.data)
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : 'Pass not found')
      })
      .finally(() => setLoading(false))
  }, [token])

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-ivory">
      <div className="mx-auto max-w-3xl">
        <Link className="text-xs tracking-[0.16em] text-gold uppercase" to="/">
          Back Home
        </Link>
        <h1 className="mt-4 mb-8 font-display text-5xl">Digital Event Pass</h1>
        {loading ? <p>Loading pass...</p> : null}
        {error ? <p className="text-rose">{error}</p> : null}
        {payload ? <DigitalPassCard guestName={payload.guestName} token={payload.token} /> : null}
      </div>
    </main>
  )
}
