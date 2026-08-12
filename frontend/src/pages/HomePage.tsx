import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Clock3, MapPin, Share2 } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { NavBar } from '../components/layout/NavBar'
import { Footer } from '../components/layout/Footer'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button } from '../components/ui/Button'
import { CountdownUnit } from '../components/countdown/CountdownUnit'
import { EVENT_META } from '../constants/event'
import { useCountdown } from '../hooks/useCountdown'
import { apiFetch } from '../services/api'
import { DigitalPassCard } from '../components/pass/DigitalPassCard'

type RsvpResult = {
  guest: { fullName: string; attendanceStatus: 'CONFIRMED' | 'DECLINED' }
  pass: { token: string; passUrl: string } | null
}

export function HomePage() {
  const reduceMotion = useReducedMotion()
  const countdown = useCountdown()
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [attendanceStatus, setAttendanceStatus] = useState<'CONFIRMED' | 'DECLINED'>('CONFIRMED')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [result, setResult] = useState<RsvpResult | null>(null)

  const passToken = useMemo(() => result?.pass?.token ?? null, [result])

  async function onShare() {
    if (navigator.share) {
      await navigator.share({
        title: 'DUBWF 1st Anniversary',
        text: "You're Invited",
        url: window.location.href,
      })
      return
    }
    await navigator.clipboard.writeText(window.location.href)
    setSuccess('LINK COPIED')
    window.setTimeout(() => setSuccess(''), 2000)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const response = await apiFetch<RsvpResult>('/api/rsvp', {
        method: 'POST',
        body: JSON.stringify({ fullName, phoneNumber, email, attendanceStatus }),
      })
      if (!response.data) {
        throw new Error("We couldn't complete your RSVP. Please try again.")
      }
      setResult(response.data)
      setSuccess(response.data.pass ? "You're on the guest list." : 'Thank you for your RSVP response.')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Connection issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reveal = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7 },
  }

  return (
    <div className="bg-black text-ivory">
      <NavBar />

      <main className="overflow-hidden">
        <section id="home" className="relative min-h-screen border-b border-white/10 px-4 pt-24 pb-16">
          <img src="/assets/group-photo.png" alt="DUBWF members" className="absolute inset-0 h-full w-full object-cover object-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black" />
          <motion.div className="relative mx-auto max-w-6xl" {...reveal}>
            <p className="text-xs tracking-[0.28em] text-muted uppercase">{EVENT_META.organization}</p>
            <h1 className="mt-4 max-w-3xl font-display text-6xl text-ivory md:text-8xl">{EVENT_META.title}</h1>
            <p className="mt-5 max-w-xl text-base text-muted md:text-lg">{EVENT_META.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm tracking-[0.14em] text-gold uppercase">
              <span>{EVENT_META.shortDate}</span>
              <span>{EVENT_META.timeDisplay}</span>
              <span>{EVENT_META.venue}</span>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#rsvp">
                <Button>RSVP / Join the Celebration</Button>
              </a>
              <a href="#details">
                <Button variant="secondary">View Event Details</Button>
              </a>
            </div>
          </motion.div>
        </section>

        <motion.section id="celebration" className="mx-auto grid max-w-6xl gap-8 border-b border-white/10 px-4 py-16 md:grid-cols-2" {...reveal}>
          <img src="/assets/group-photo.png" alt="Celebration group" className="h-full min-h-80 w-full object-cover object-center" loading="lazy" />
          <div className="self-center">
            <SectionHeading eyebrow="Anniversary Story" title="ONE YEAR. ONE COMMUNITY. COUNTLESS CONNECTIONS." />
            <p className="text-muted">
              We celebrate the first anniversary of the Dankotuwa United Women&apos;s Business Forum with gratitude for every connection, collaboration, and shared achievement.
            </p>
          </div>
        </motion.section>

        <motion.section className="mx-auto max-w-6xl border-b border-white/10 px-4 py-16 text-center" {...reveal}>
          <SectionHeading eyebrow="Countdown" title={countdown.headline} subtitle="Event time is calculated in Asia/Colombo." />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <CountdownUnit value={countdown.days} label="Days" />
            <CountdownUnit value={countdown.hours} label="Hours" />
            <CountdownUnit value={countdown.minutes} label="Minutes" />
            <CountdownUnit value={countdown.seconds} label="Seconds" />
          </div>
          <div className="mt-8">
            <Link to="/campaign" className="text-xs tracking-[0.2em] text-gold uppercase hover:text-softGold">
              View Countdown Campaign Cards
            </Link>
          </div>
        </motion.section>

        <motion.section id="details" className="mx-auto max-w-6xl border-b border-white/10 px-4 py-16" {...reveal}>
          <SectionHeading eyebrow="Event Details" title="The Essentials" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-white/10 bg-softBlack/60 p-6">
              <p className="text-xs tracking-[0.18em] text-muted uppercase">Date</p>
              <p className="mt-2 text-xl">{EVENT_META.dateDisplay}</p>
            </div>
            <div className="border border-white/10 bg-softBlack/60 p-6">
              <p className="text-xs tracking-[0.18em] text-muted uppercase">Time</p>
              <p className="mt-2 text-xl">{EVENT_META.timeDisplay}</p>
            </div>
            <div className="border border-white/10 bg-softBlack/60 p-6">
              <p className="text-xs tracking-[0.18em] text-muted uppercase">Venue</p>
              <p className="mt-2 text-xl">Hotel Camellia</p>
            </div>
            <div className="border border-white/10 bg-softBlack/60 p-6">
              <p className="text-xs tracking-[0.18em] text-muted uppercase">Location</p>
              <p className="mt-2 text-xl">{EVENT_META.locationShort}</p>
            </div>
          </div>
        </motion.section>

        <motion.section id="venue" className="mx-auto max-w-6xl border-b border-white/10 px-4 py-16" {...reveal}>
          <SectionHeading eyebrow="The Venue" title="HOTEL CAMELLIA" subtitle={EVENT_META.locationShort} />
          <div className="grid gap-6 md:grid-cols-2">
            <img src="/assets/hotel.png" alt="Hotel Camellia" className="h-full w-full object-cover" loading="lazy" />
            <div className="space-y-6 border border-white/10 bg-softBlack/60 p-6">
              <img src="/assets/logo.png" alt="DUBWF logo" className="h-16 w-auto object-contain" />
              <p className="text-muted">{EVENT_META.location}</p>
              <div className="flex flex-wrap gap-3">
                <a href={EVENT_META.mapUrl} target="_blank" rel="noreferrer noopener">
                  <Button variant="secondary">
                    <MapPin size={16} />
                    <span className="ml-2">Map</span>
                  </Button>
                </a>
                <a href={EVENT_META.directionsUrl} target="_blank" rel="noreferrer noopener">
                  <Button>
                    <Clock3 size={16} />
                    <span className="ml-2">Directions</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="rsvp" className="mx-auto max-w-4xl border-b border-white/10 px-4 py-16" {...reveal}>
          <SectionHeading eyebrow="Digital Pass / RSVP" title="You&apos;re Invited." />
          <form onSubmit={handleSubmit} className="space-y-4 border border-white/10 bg-softBlack/60 p-6">
            <label className="block space-y-2">
              <span className="text-sm text-muted">Full Name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full border border-white/20 bg-black px-4 py-3 text-ivory"
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted">Phone Number</span>
              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="w-full border border-white/20 bg-black px-4 py-3 text-ivory"
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted">Email Address (optional)</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-white/20 bg-black px-4 py-3 text-ivory"
              />
            </label>
            <fieldset className="space-y-2">
              <legend className="text-sm text-muted">Attendance Status</legend>
              <label className="mr-6 inline-flex items-center gap-2">
                <input
                  type="radio"
                  checked={attendanceStatus === 'CONFIRMED'}
                  onChange={() => setAttendanceStatus('CONFIRMED')}
                />
                YES - I&apos;LL BE THERE
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  checked={attendanceStatus === 'DECLINED'}
                  onChange={() => setAttendanceStatus('DECLINED')}
                />
                SORRY, I CAN&apos;T ATTEND
              </label>
            </fieldset>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'RSVP'}
            </Button>
            {success ? <p className="text-sm text-gold" role="status" aria-live="polite">{success}</p> : null}
            {error ? <p className="text-sm text-rose" role="alert">{error}</p> : null}
          </form>
          {result?.pass && passToken ? (
            <div className="mt-8">
              <DigitalPassCard guestName={result.guest.fullName} token={passToken} />
            </div>
          ) : null}
        </motion.section>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="font-display text-5xl">JOIN THE CELEBRATION</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">A celebration of women, connection, and achievement.</p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="#rsvp">
              <Button>RSVP</Button>
            </a>
            <Button variant="ghost" onClick={onShare}>
              <Share2 size={16} />
              <span className="ml-2">Share</span>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
