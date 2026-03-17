import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/profiles', label: '学生プロフィール' },
  { to: '/curriculum', label: '授業・カリキュラム' },
  { to: '/career', label: 'キャリア・就活' },
  { to: '/clubs', label: 'クラブ・イベント' },
  { to: '/blog', label: 'ブログ・居住ライフ' },
  { to: '/coffee', label: 'コーヒーチャット' },
]

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav className={`site-nav${scrolled ? ' site-nav--scrolled' : ''}`}>
        <Link to="/" className="site-nav__logo text-gold">Haas Japan</Link>
        <ul className="site-nav__links">
          {LINKS.map(l => (
            <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
          ))}
        </ul>
        <button className="site-nav__hamburger" onClick={() => setMobileOpen(true)} aria-label="メニュー">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`site-nav__mobile${mobileOpen ? ' open' : ''}`}>
        <button className="site-nav__mobile-close" onClick={() => setMobileOpen(false)}>✕</button>
        <Link to="/" onClick={() => setMobileOpen(false)} className="text-gold" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.35em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--navy)' }}>Haas Japan</Link>
        {LINKS.map(l => (
          <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link>
        ))}
      </div>
    </>
  )
}
