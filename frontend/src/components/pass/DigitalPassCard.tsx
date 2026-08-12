import { Download, Share2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { toPng } from 'html-to-image'
import { EVENT_META } from '../../constants/event'
import { Button } from '../ui/Button'

type DigitalPassCardProps = {
  guestName: string
  token: string
}

export function DigitalPassCard({ guestName, token }: DigitalPassCardProps) {
  const [qrSrc, setQrSrc] = useState('')
  const [status, setStatus] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)
  const verifyUrl = useMemo(() => `${window.location.origin}/verify/${token}`, [token])

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 240,
      color: { dark: '#0B0B0D', light: '#FFFFFF' },
    }).then(setQrSrc)
  }, [verifyUrl])

  async function handleDownload() {
    if (!cardRef.current) return
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `DUBWF-PASS-${guestName.replace(/\s+/g, '-').toUpperCase()}.png`
    link.click()
  }

  async function handleShare() {
    const shareUrl = `${window.location.origin}/pass/${token}`
    if (navigator.share) {
      await navigator.share({
        title: 'DUBWF Anniversary Pass',
        text: 'My digital event pass',
        url: shareUrl,
      })
      return
    }

    await navigator.clipboard.writeText(shareUrl)
    setStatus('LINK COPIED')
    window.setTimeout(() => setStatus(''), 2000)
  }

  return (
    <div className="space-y-4">
      <div ref={cardRef} className="mx-auto w-full max-w-md border border-gold/40 bg-black p-6">
        <img src="/assets/logo.png" alt="DUBWF logo" className="mx-auto h-12 w-auto object-contain" />
        <p className="mt-4 text-center text-xs tracking-[0.24em] text-muted uppercase">DUBWF</p>
        <h3 className="text-center font-display text-4xl text-gold">{EVENT_META.title}</h3>
        <p className="mt-1 text-center text-xs tracking-[0.2em] text-rose uppercase">GUEST</p>
        <p className="mt-3 text-center text-xl text-ivory">{guestName}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 border-y border-white/15 py-4 text-center text-xs text-muted">
          <div>{EVENT_META.passDate}</div>
          <div>{EVENT_META.passTime}</div>
          <div>HOTEL CAMELLIA</div>
        </div>
        <div className="mt-5 rounded bg-white p-3">
          {qrSrc ? <img src={qrSrc} alt="Pass verification QR code" className="mx-auto h-40 w-40" /> : null}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={handleDownload}>
          <Download size={16} />
          <span className="ml-2">Download Pass</span>
        </Button>
        <Button onClick={handleShare} variant="secondary">
          <Share2 size={16} />
          <span className="ml-2">Share Pass</span>
        </Button>
      </div>
      {status ? <p className="text-center text-xs tracking-[0.16em] text-gold uppercase">{status}</p> : null}
    </div>
  )
}
