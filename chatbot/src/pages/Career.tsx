import { useChunks } from '../context/ChunksContext'

export default function Career() {
  const { chunks } = useChunks()
  const items = chunks
    .filter(c => c.category === 'キャリア' && !c.title.includes('Part 2') && !c.title.includes('Part 3') && !c.title.includes('Part 4'))
    .slice(0, 12)

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="label-micro page-hero__tag">Career</span>
            <div className="page-hero__line" />
            <h1 className="heading-display page-hero__title">キャリア・<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>就活</em></h1>
            <p className="page-hero__sub">シリコンバレーを拠点に、テック・コンサル・投資など多彩なキャリアを築く。</p>
          </div>
          <div className="page-hero__meta-bar">
            {[
              { label: '主要業界', value: 'Tech / Consulting' },
              { label: '就活開始', value: '1年目秋〜' },
              { label: 'ネットワーク', value: 'Bay Area中心' },
              { label: 'インターン', value: '学期中も可' },
            ].map(m => (
              <div key={m.label} className="meta-item">
                <span className="label-micro">{m.label}</span>
                <span className="meta-item__value">{m.value}</span>
              </div>
            ))}
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
            <p>HaasはシリコンバレーとBay Areaに隣接し、テック企業へのアクセスが非常に優れています。</p>
            <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>インターナショナル生の多くが現地就職を目指します。テック以外にもコンサルティング、投資銀行、スタートアップなど多彩な選択肢があります。</p>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="section-grid">
          <div className="section-label">
            <span className="label-micro">02 / Articles</span>
            <div className="section-label__line" />
          </div>
          <div className="article-list">
            {items.map((chunk, i) => (
              <a key={chunk.id} href={chunk.url} target="_blank" rel="noopener noreferrer" className="article-row">
                <span className="article-row__tag">キャリア {String(i + 1).padStart(2, '0')}</span>
                <div className="article-row__body">
                  <h3 className="article-row__title">{chunk.title}</h3>
                  <p className="article-row__excerpt">{chunk.content.slice(0, 120).trim()}…</p>
                </div>
                <span className="article-row__meta">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
