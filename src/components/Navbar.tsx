import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND_LOGO_SRC, WHATSAPP_URL } from '../constants'

const LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Trabalhos', href: '#trabalhos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Clientes', href: '#clientes', desktopOnly: true },
  { label: 'Instagram', href: '#instagram', desktopOnly: true },
  { label: 'Contato', href: '#contato', desktopOnly: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#inicio')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-2 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:px-3 md:pt-6">
      <div
        className={`inline-flex max-w-[calc(100vw-1rem)] items-center overflow-hidden rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'shadow-md shadow-black/10' : ''
        }`}
      >
        <a
          href="#inicio"
          onClick={() => setActive('#inicio')}
          aria-label="Rockstar Studio, início"
          className="flex h-9 w-9 shrink-0 rounded-full bg-[linear-gradient(90deg,#9D4EDD,#7B2FF7)] p-[2px] transition-transform duration-300 hover:scale-110 hover:bg-[linear-gradient(90deg,#7B2FF7,#9D4EDD)]"
        >
          <img
            src={BRAND_LOGO_SRC}
            alt=""
            className="h-full w-full rounded-full bg-bg object-cover"
          />
        </a>

        <span className="mx-1 hidden h-5 w-px shrink-0 bg-stroke md:block" />

        <nav className="flex min-w-0 shrink items-center">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActive(link.href)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm ${
                active === link.href
                  ? 'bg-stroke/50 text-text-primary'
                  : 'text-muted hover:bg-stroke/50 hover:text-text-primary'
              } ${link.desktopOnly ? 'hidden md:inline-flex' : ''}`}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/loja"
            className="rounded-full px-3 py-1.5 text-xs text-muted transition-colors duration-200 hover:bg-stroke/50 hover:text-text-primary sm:px-4 sm:py-2 sm:text-sm"
          >
            Loja
          </Link>
        </nav>

        <span className="mx-1 hidden h-5 w-px shrink-0 bg-stroke md:block" />

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative ml-1 hidden shrink-0 md:block"
        >
          <span className="animate-gradient-shift absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs text-text-primary backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
            Diga oi
            <span aria-hidden>↗</span>
          </span>
        </a>
      </div>
    </header>
  )
}
