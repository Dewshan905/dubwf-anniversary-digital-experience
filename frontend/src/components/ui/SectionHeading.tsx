type SectionHeadingProps = {
  eyebrow: string
  title: string
  subtitle?: string
}

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <header className="mb-8 text-center md:mb-12">
      <p className="text-xs tracking-[0.28em] text-muted uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl text-ivory md:text-5xl">{title}</h2>
      {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-sm text-muted md:text-base">{subtitle}</p> : null}
    </header>
  )
}
