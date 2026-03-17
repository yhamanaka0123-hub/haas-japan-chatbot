import { useChunks } from '../context/ChunksContext'

const CLASS_YEARS = [
  { year: 'Class of 2027', count: '5人', detail: '現在1年生' },
  { year: 'Class of 2026', count: '8人', detail: '現在2年生' },
  { year: 'Class of 2025', count: '3人', detail: '卒業生' },
  { year: 'Class of 2024', count: '5人', detail: '卒業生' },
  { year: 'Class of 2023', count: '2人', detail: '卒業生' },
  { year: 'Class of 2022', count: '5人', detail: '卒業生' },
  { year: 'Class of 2021', count: '6人', detail: '卒業生' },
  { year: 'Class of 2020', count: '3人', detail: '卒業生' },
  { year: 'Class of 2019', count: '5人', detail: '卒業生' },
  { year: 'Class of 2018', count: '6人', detail: '卒業生' },
  { year: 'Class of 2017', count: '6人', detail: '卒業生' },
  { year: 'Class of 2016', count: '5人', detail: '卒業生' },
  { year: 'Class of 2015', count: '5人', detail: '卒業生' },
]

export default function Profiles() {
  const { chunks } = useChunks()
  const profileChunks = chunks.filter(c => c.url.includes('profile') || c.title.toLowerCase().includes('profile') || c.title.includes('プロフィール'))
  const profileContent = profileChunks[0]?.content ?? ''

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="label-micro page-hero__tag">Community</span>
            <div className="page-hero__line" />
            <h1 className="heading-display page-hero__title">学生<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>プロフィール</em></h1>
            <p className="page-hero__sub">在校生・卒業生の多彩なバックグラウンドを紹介します。</p>
          </div>
        </div>
      </section>

      <section className="site-section site-section--warm">
        <div className="section-grid">
          <div className="section-label">
            <span className="label-micro">01 / Overview</span>
            <div className="section-label__line" />
          </div>
          <div className="section-body">
            <p>Haas MBAには毎年、日本から多くの学生が在籍しています。コンサルティング、金融、テクノロジー、起業など、多様なバックグラウンドを持つ仲間が集まっています。</p>
            {profileContent && <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>{profileContent.slice(0, 200)}…</p>}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="section-grid">
          <div className="section-label">
            <span className="label-micro">02 / Class Years</span>
            <div className="section-label__line" />
          </div>
          <div style={{ gridColumn: '3 / -1' }}>
            <div className="profile-grid">
              {CLASS_YEARS.map(c => (
                <a key={c.year} href="https://haasjapan.wordpress.com/profile" target="_blank" rel="noopener noreferrer" className="profile-card" style={{ textDecoration: 'none' }}>
                  <span className="profile-card__class">{c.detail}</span>
                  <span className="profile-card__name">{c.year}</span>
                  <span className="profile-card__detail">日本人在校生 {c.count}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section site-section--warm">
        <div className="section-grid">
          <div className="section-label">
            <span className="label-micro">03 / Connect</span>
            <div className="section-label__line" />
          </div>
          <div className="section-body">
            <p>在校生・卒業生と直接話したい方は、コーヒーチャットをご利用ください。</p>
            <a href="/coffee" className="coffee-cta" style={{ marginTop: '1.5rem', display: 'inline-block' }}>コーヒーチャット申込み →</a>
          </div>
        </div>
      </section>
    </>
  )
}
