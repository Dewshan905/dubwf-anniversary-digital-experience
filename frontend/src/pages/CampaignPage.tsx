import { Link } from 'react-router-dom'
import { CampaignCard } from '../components/campaign/CampaignCard'

const campaigns = [
  { label: '10 DAYS TO GO', filename: 'DUBWF-10-DAYS-TO-GO.png' },
  { label: '7 DAYS TO GO', filename: 'DUBWF-7-DAYS-TO-GO.png' },
  { label: '3 DAYS TO GO', filename: 'DUBWF-3-DAYS-TO-GO.png' },
  { label: 'TOMORROW', filename: 'DUBWF-TOMORROW.png' },
  { label: 'TONIGHT', filename: 'DUBWF-TONIGHT.png' },
]

export function CampaignPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-ivory">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-5xl">Countdown Campaign</h1>
          <Link className="text-xs tracking-[0.16em] text-gold uppercase" to="/">
            Back Home
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((item) => (
            <CampaignCard key={item.label} label={item.label} filename={item.filename} />
          ))}
        </div>
      </div>
    </main>
  )
}
