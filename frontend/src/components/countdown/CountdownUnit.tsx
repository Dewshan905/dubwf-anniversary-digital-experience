type CountdownUnitProps = {
  value: number
  label: string
}

export function CountdownUnit({ value, label }: CountdownUnitProps) {
  return (
    <div className="w-full border border-white/15 bg-softBlack/70 px-4 py-5 text-center">
      <p className="font-display text-4xl text-gold md:text-5xl">{String(value).padStart(2, '0')}</p>
      <p className="mt-2 text-xs tracking-[0.22em] text-muted uppercase">{label}</p>
    </div>
  )
}
