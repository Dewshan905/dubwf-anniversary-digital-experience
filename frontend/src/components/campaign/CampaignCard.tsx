import { Download } from 'lucide-react'
import { useRef } from 'react'
import { toPng } from 'html-to-image'
import { EVENT_META } from '../../constants/event'
import { Button } from '../ui/Button'

type CampaignCardProps = {
  label: string
  filename: string
}

export function CampaignCard({ label, filename }: CampaignCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  async function downloadCard() {
    if (!cardRef.current) return
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    link.click()
  }

  return (
    <div className="space-y-4 border border-white/15 bg-softBlack/60 p-4">
      <div ref={cardRef} className="border border-gold/50 bg-black p-6 text-center">
        <img src="/assets/logo.png" alt="DUBWF logo" className="mx-auto h-10 w-auto object-contain" />
        <p className="mt-5 text-xs tracking-[0.22em] text-muted uppercase">DUBWF · 1ST ANNIVERSARY</p>
        <h3 className="mt-2 font-display text-4xl text-gold">{label}</h3>
        <p className="mt-3 text-sm tracking-[0.1em] text-rose uppercase">{EVENT_META.shortDate}</p>
        <img
          src="/assets/group-photo.png"
          alt="DUBWF community"
          className="mt-5 h-48 w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      <Button className="w-full" onClick={downloadCard}>
        <Download size={16} />
        <span className="ml-2">Download</span>
      </Button>
    </div>
  )
}
