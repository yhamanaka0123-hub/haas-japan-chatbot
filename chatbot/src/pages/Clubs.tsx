import { useChunks } from '../context/ChunksContext'

export default function Clubs() {
  const { chunks } = useChunks()
  const items = chunks
    .filter(c => c.category === 'クラブ' && !c.title.includes('Part 2') && !c.title.includes('Part 3'))
    .slice(0, 12)

  // Fallback: if no クラブ chunks, show all その他
  const displayItems = items.length > 0 ? items : chunks
    .filter(c => c.category === 'その他' && !c.title.includes('Part 2'))
    .slice(0, 12)

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="label-micro page-hero__tag">Campus Life</span>
            <div className="page-hero__line" />
            <h1 className="heading-display page-hero__title">クラブ・<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>イベント</em></h1>
            <p className="page-hero__sub">Japan Trekをはじめ、Haas Japanコミュニティの多彩な活動。</p>
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
            <p>HaasにはJapan Trekをはじめ、多くの日本人コミュニティ主催のイベントがあります。</p>
            <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>学内クラブ活動、テックサミット、AI Summit、Berkeley Blockchain Nexusなど、興味に応じた多様なイベントが毎週開催されます。</p>
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
            {displayItems.map((chunk, i) => (
              <a key={chunk.id} href={chunk.url} target="_blank" rel="noopener noreferrer" className="article-row">
                <span className="article-row__tag">{chunk.category} {String(i + 1).padStart(2, '0')}</span>
                <div className="article-row__body">
                  <h3 className="article-row__title">{chunk.title}</h3>
                  <p className="article-row__excerpt">{chunk.content.slice(0, 120).trim()}…</p>
                </div>
                <span className="article-row__meta">↗</span>
              </a>
            ))}
            {displayItems.length === 0 && (
              <div style={{ padding: 'var(--space-md) 0', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-light)' }}>
                データを読み込み中です...
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
