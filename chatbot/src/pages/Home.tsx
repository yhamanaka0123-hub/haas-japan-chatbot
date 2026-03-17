import { Link } from 'react-router-dom'

export default function Home() {

  return (
    <>
      {/* Hero */}
      <section className="page-hero page-hero--home">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="label-micro page-hero__tag">UC Berkeley · Haas School of Business</span>
            <div className="page-hero__line" />
            <h1 className="heading-display page-hero__title">
              Haas Japan<br />
              <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300 }}>コミュニティ</em>
            </h1>
            <p className="page-hero__sub">
              MBA留学を志す方、Haasに興味をお持ちの方へ。<br />
              在校生が運営する日本語情報サイト。
            </p>
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/coffee" className="coffee-cta" style={{ marginTop: 0 }}>コーヒーチャット申込み</Link>
              <Link to="/profiles" className="coffee-cta coffee-cta--outline" style={{ marginTop: 0 }}>学生プロフィール →</Link>
            </div>
          </div>

          <div className="page-hero__meta-bar">
            {[
              { label: 'プログラム', value: 'Full-time MBA' },
              { label: '期間', value: '2年間' },
              { label: 'キャンパス', value: 'Berkeley, CA' },
              { label: 'ランキング', value: 'US Top 10' },
            ].map(m => (
              <div key={m.label} className="meta-item">
                <span className="label-micro meta-item__label">{m.label}</span>
                <span className="meta-item__value">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="site-section site-section--warm">
        <div className="section-grid">
          <div className="section-label">
            <span className="label-micro">01 / About</span>
            <div className="section-label__line" />
          </div>
          <div className="section-body">
            <p>このサイトは、UC Berkeley Haas MBAの日本人在校生有志によって運営されています。</p>
            <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>授業・カリキュラム、キャリア・就活、クラブ活動、留学生活など、受験生・在校生に役立つ情報を発信しています。公式情報については<a href="https://haas.berkeley.edu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)' }}>Haas公式サイト</a>をご覧ください。</p>
          </div>
        </div>
      </section>

      {/* Page links */}
      <section className="site-section">
        <div className="section-grid">
          <div className="section-label">
            <span className="label-micro">02 / Explore</span>
            <div className="section-label__line" />
          </div>
          <div className="article-list" style={{ gridColumn: '3 / 12' }}>
            {[
              { to: '/profiles', tag: 'Community', title: '学生プロフィール', sub: 'Class of 2020–2027の在校生・卒業生プロフィール。' },
              { to: '/curriculum', tag: '授業', title: '授業・カリキュラム', sub: 'コア科目から選択科目まで、Haasの学びを紹介。' },
              { to: '/career', tag: 'Career', title: 'キャリア・就活', sub: 'テック、コンサル、投資など多彩なキャリアパス。' },
              { to: '/clubs', tag: 'Campus Life', title: 'クラブ・イベント', sub: 'Japan Trekなど、コミュニティの活動を紹介。' },
              { to: '/blog', tag: 'Blog', title: 'ブログ・居住ライフ', sub: 'Berkeley生活、日常、体験記など。' },
            ].map(item => (
              <Link key={item.to} to={item.to} className="article-row">
                <span className="article-row__tag">{item.tag}</span>
                <div className="article-row__body">
                  <h3 className="article-row__title">{item.title}</h3>
                  <p className="article-row__excerpt">{item.sub}</p>
                </div>
                <span className="article-row__meta">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
