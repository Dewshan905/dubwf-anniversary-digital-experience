import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center border px-5 py-3 text-sm font-semibold tracking-[0.16em] uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        variant === 'primary' && 'border-gold bg-gold text-black hover:bg-softGold',
        variant === 'secondary' && 'border-rose text-rose hover:bg-rose hover:text-white',
        variant === 'ghost' && 'border-white/30 text-ivory hover:bg-white/10',
        className,
      )}
      {...props}
    />
  )
}
