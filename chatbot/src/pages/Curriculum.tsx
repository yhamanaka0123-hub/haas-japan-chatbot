import { useChunks } from '../context/ChunksContext'

export default function Curriculum() {
  const { chunks } = useChunks()
  const items = chunks
    .filter(c => c.category === '授業' && !c.title.includes('Part 2') && !c.title.includes('Part 3') && !c.title.includes('Part 4') && !c.title.includes('Part 5'))
    .slice(0, 12)

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="label-micro page-hero__tag">Academics</span>
            <div className="page-hero__line" />
            <h1 className="heading-display page-hero__title">授業・<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>カリキュラム</em></h1>
            <p className="page-hero__sub">コア科目51単位。起業、テクノロジー、ファイナンス——Haasならではの学びの場。</p>
          </div>
          <div className="page-hero__meta-bar">
            {[
              { label: '必修単位', value: '20単位' },
              { label: '選択単位', value: '31単位以上' },
              { label: '卒業要件', value: '51単位' },
              { label: '形式', value: 'Bid制選択' },
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
            <p>HaasのMBAを卒業するには最低51単位が必要です。そのうち20単位がコア科目（必修）で、残りの31単位が選択科目となっています。</p>
            <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>ミクロ経済学、会計、マーケティング、リーダーシップなど、ビジネスの土台となる知識を幅広く学びます。詳しい知識のある分野はWaiver（単位免除）を使うことも可能です。</p>
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
                <span className="article-row__tag">授業 {String(i + 1).padStart(2, '0')}</span>
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
