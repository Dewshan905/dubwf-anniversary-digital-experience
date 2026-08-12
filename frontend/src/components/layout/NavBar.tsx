import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { EVENT_META } from '../../constants/event'
import { Button } from '../ui/Button'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Celebration', href: '#celebration' },
  { label: 'Details', href: '#details' },
  { label: 'Venue', href: '#venue' },
  { label: 'RSVP', href: '#rsvp' },
]

export function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <a href="#home" className="text-xs tracking-[0.2em] text-ivory uppercase">
          DUBWF <span className="text-gold">{EVENT_META.title}</span>
        </a>
        <button
          aria-label="Toggle navigation"
          className="text-ivory md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((item) => (
            <a key={item.href} href={item.href} className="text-xs tracking-[0.16em] text-muted uppercase hover:text-ivory">
              {item.label}
            </a>
          ))}
          <a href="#rsvp">
            <Button className="py-2" variant="secondary">
              RSVP
            </Button>
          </a>
        </div>
      </div>
      {open ? (
        <div className="space-y-4 border-t border-white/10 bg-black px-4 py-4 md:hidden">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block text-xs tracking-[0.16em] text-muted uppercase hover:text-ivory"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </nav>
  )
}
