import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type GlowButtonProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'cta' | 'whatsapp'
  external?: boolean
  className?: string
}

export default function GlowButton({
  href,
  children,
  variant = 'outline',
  external,
  className = '',
}: GlowButtonProps) {
  const inner = {
    solid:
      'border-2 border-transparent bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary',
    outline:
      'border-2 border-stroke bg-bg text-text-primary group-hover:border-transparent',
    // Vermelho sangue: reservado ao CTA de agendamento
    cta: 'border-2 border-transparent bg-blood font-medium text-white shadow-[0_0_24px_rgba(196,30,58,0.3)] transition-shadow group-hover:bg-[#d92645] group-hover:shadow-[0_0_44px_rgba(196,30,58,0.55)]',
    whatsapp:
      'border-2 border-transparent bg-[#25D366] font-medium text-black shadow-[0_0_24px_rgba(37,211,102,0.28)] transition-shadow group-hover:bg-[#1fbd5a] group-hover:shadow-[0_0_44px_rgba(37,211,102,0.5)]',
  }[variant]

  const wrapperClassName = `group relative inline-flex transition-transform duration-300 hover:scale-105 ${className}`
  const content = (
    <>
      {variant !== 'cta' && variant !== 'whatsapp' && (
        <span className="animate-gradient-shift absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <span
        className={`relative flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm transition-colors duration-300 ${inner}`}
      >
        {children}
      </span>
    </>
  )

  if (!external && href.startsWith('/')) {
    return (
      <Link to={href} className={wrapperClassName}>
        {content}
      </Link>
    )
  }

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={wrapperClassName}
    >
      {content}
    </a>
  )
}
