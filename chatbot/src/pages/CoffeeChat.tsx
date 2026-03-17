export default function CoffeeChat() {
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSedsXH4bG78H74ca4FBcEMej9QriA9JIwSOfakIWLz3Xhptdg/viewform'

  return (
    <>
      <section className="page-hero" style={{ minHeight: '45vh' }}>
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="label-micro page-hero__tag">Connect</span>
            <div className="page-hero__line" />
            <h1 className="heading-display page-hero__title">コーヒーチャット<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>申込み</em></h1>
            <p className="page-hero__sub">在校生と直接話せる機会です。受験相談から留学生活まで、お気軽にどうぞ。</p>
          </div>
        </div>
      </section>

      <section className="coffee-page">
        <div className="coffee-page__inner">
          <div className="coffee-page__left">
            <span className="label-micro" style={{ marginBottom: '1rem', display: 'block' }}>How it works</span>
            <h2 className="heading-section" style={{ marginBottom: 'var(--space-md)' }}>
              在校生と<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>つながる</em>
            </h2>
            <div className="coffee-steps">
              {[
                { num: '01', title: 'フォーム送信', desc: '下記フォームにご希望の内容（受験相談・就活・生活など）をご記入ください。' },
                { num: '02', title: 'マッチング', desc: '在校生がご要望に合わせてご連絡いたします。通常1週間以内にご返信します。' },
                { num: '03', title: 'チャット', desc: 'オンラインまたはキャンパス訪問時に、1対1でお話しましょう。' },
              ].map(s => (
                <div key={s.num} className="coffee-step">
                  <span className="coffee-step__num">{s.num}</span>
                  <div className="coffee-step__text">
                    <p className="coffee-step__title">{s.title}</p>
                    <p className="coffee-step__desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="coffee-page__right">
            <div style={{ borderTop: 'var(--border-fine)', paddingTop: 'var(--space-md)' }}>
              <span className="label-micro" style={{ marginBottom: '1rem', display: 'block' }}>注意事項</span>
              <ul style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: 1.8, paddingLeft: '1rem' }}>
                <li>5月上旬〜8月中旬はサマーインターン期間のため返信が遅れる場合があります</li>
                <li>キャンパスビジット希望の方は事前にご連絡ください</li>
                <li>日本語・英語どちらでも対応可能です</li>
                <li>公式イベント情報は<a href="https://haas.berkeley.edu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)' }}>Haas公式サイト</a>をご確認ください</li>
              </ul>
            </div>
            <div>
              <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className="coffee-cta">
                申込みフォームへ →
              </a>
              <p style={{ marginTop: '1rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                または <a href="mailto:haas.japan@gmail.com" style={{ color: 'var(--navy)' }}>haas.japan@gmail.com</a> までご連絡ください
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
