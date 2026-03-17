import { useChunks } from '../context/ChunksContext'
import type { Chunk } from '../types'

function deduplicateByUrl(chunks: Chunk[]): Chunk[] {
  const seen = new Set<string>()
  return chunks.filter(c => {
    if (seen.has(c.url)) return false
    seen.add(c.url)
    return true
  })
}

export default function Blog() {
  const { chunks } = useChunks()

  // Blog posts: exclude the basic profile/index pages, deduplicate by URL
  const blogChunks = deduplicateByUrl(
    chunks.filter(c =>
      c.url.includes('/20') || // year-based blog URLs
      c.title.includes('Trek') ||
      c.title.includes('Term') ||
      c.title.includes('MBA') ||
      c.title.includes('授業') ||
      c.title.includes('生活') ||
      c.title.includes('就活') ||
      c.title.includes('ブログ')
    )
  ).slice(0, 20)

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="label-micro page-hero__tag">Blog</span>
            <div className="page-hero__line" />
            <h1 className="heading-display page-hero__title">ブログ・<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>居住ライフ</em></h1>
            <p className="page-hero__sub">Berkeley生活、授業体験記、就活体験談——在校生のリアルな声。</p>
          </div>
        </div>
      </section>

      <section className="site-section site-section--warm">
        <div className="section-grid">
          <div className="section-label">
            <span className="label-micro">01 / Latest</span>
            <div className="section-label__line" />
          </div>
          <div className="section-body">
            <p>在校生が執筆するブログ記事では、授業・就活・生活など、さまざまなテーマを取り上げています。</p>
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
            {blogChunks.map((chunk, i) => (
              <a key={chunk.id} href={chunk.url} target="_blank" rel="noopener noreferrer" className="article-row">
                <span className="article-row__tag">{chunk.category}</span>
                <div className="article-row__body">
                  <h3 className="article-row__title">{chunk.title}</h3>
                  <p className="article-row__excerpt">{chunk.content.slice(0, 140).trim()}…</p>
                </div>
                <span className="article-row__meta">No.{String(i + 1).padStart(2, '0')}</span>
              </a>
            ))}
            {blogChunks.length === 0 && (
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
