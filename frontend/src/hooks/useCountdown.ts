import { useEffect, useState } from 'react'
import { getCountdownSnapshot } from '../utils/countdown'
import type { CountdownSnapshot } from '../utils/countdown'

export function useCountdown() {
  const [snapshot, setSnapshot] = useState<CountdownSnapshot>(() => getCountdownSnapshot())

  useEffect(() => {
    const id = window.setInterval(() => {
      setSnapshot(getCountdownSnapshot())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return snapshot
}
