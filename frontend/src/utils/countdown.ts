import { EVENT_END_WALL_MS, EVENT_START_WALL_MS, EVENT_TIMEZONE } from '../constants/event'

const DAY_MS = 24 * 60 * 60 * 1000

type CountdownState =
  | 'countdown'
  | 'ten-days'
  | 'seven-days'
  | 'three-days'
  | 'tomorrow'
  | 'tonight'
  | 'live'
  | 'complete'

export type CountdownSnapshot = {
  state: CountdownState
  days: number
  hours: number
  minutes: number
  seconds: number
  headline: string
}

function getTimeParts(now: Date) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: EVENT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(now)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  }
}

function getWallMs(now: Date) {
  const p = getTimeParts(now)
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
}

function formatRemaining(ms: number) {
  const safe = Math.max(0, ms)
  const days = Math.floor(safe / DAY_MS)
  const hours = Math.floor((safe % DAY_MS) / (60 * 60 * 1000))
  const minutes = Math.floor((safe % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((safe % (60 * 1000)) / 1000)
  return { days, hours, minutes, seconds }
}

export function getCountdownSnapshot(date = new Date()): CountdownSnapshot {
  const wallNow = getWallMs(date)

  if (wallNow >= EVENT_END_WALL_MS) {
    return {
      state: 'complete',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      headline: 'THANK YOU FOR CELEBRATING WITH US',
    }
  }

  if (wallNow >= EVENT_START_WALL_MS) {
    return {
      state: 'live',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      headline: 'THE CELEBRATION IS HERE',
    }
  }

  const remainingMs = EVENT_START_WALL_MS - wallNow
  const remaining = formatRemaining(remainingMs)
  const daysToGo = Math.floor(remainingMs / DAY_MS)
  const nowParts = getTimeParts(date)
  const isEventDate = nowParts.year === 2026 && nowParts.month === 8 && nowParts.day === 22

  if (isEventDate) {
    return { ...remaining, state: 'tonight', headline: 'TONIGHT' }
  }
  if (daysToGo === 10) {
    return { ...remaining, state: 'ten-days', headline: '10 DAYS TO GO' }
  }
  if (daysToGo === 7) {
    return { ...remaining, state: 'seven-days', headline: '7 DAYS TO GO' }
  }
  if (daysToGo === 3) {
    return { ...remaining, state: 'three-days', headline: '3 DAYS TO GO' }
  }
  if (daysToGo === 1) {
    return { ...remaining, state: 'tomorrow', headline: 'TOMORROW' }
  }

  return { ...remaining, state: 'countdown', headline: 'THE COUNTDOWN BEGINS' }
}
