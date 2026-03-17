import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { Message } from '../types'
import { SearchIndex } from '../lib/search'
import { streamAnswer } from '../lib/claude'
import { useChunks } from '../context/ChunksContext'
import CategoryButtons from '../components/CategoryButtons'
import ChatWindow from '../components/ChatWindow'
import InputBar from '../components/InputBar'
import Header from '../components/Header'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

function dedupSources(chunks: ReturnType<typeof useChunks>['chunks']) {
  const seen = new Set<string>()
  return chunks
    .filter(c => { if (seen.has(c.url)) return false; seen.add(c.url); return true })
    .map(c => ({ url: c.url, title: c.title.replace(/ \(Part \d+\)$/, '') }))
}

export default function Home() {
  const { chunks, ready } = useChunks()
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const apiKey = API_KEY ?? ''

  // Build index once chunks are ready
  if (ready && chunks.length > 0 && !searchIndex) {
    setSearchIndex(new SearchIndex(chunks))
  }

  const handleSubmit = useCallback(async (question: string) => {
    if (!searchIndex || loading) return
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: question }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    const results = searchIndex.search(question, 5, category || undefined)
    if (results.length === 0) {
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: '申し訳ありませんが、この質問に関する情報はサイトで見つかりませんでした。', sources: [], noInfo: true }])
      setLoading(false)
      return
    }

    const topChunks = results.map(r => r.chunk)
    const sources = dedupSources(topChunks)

    if (!apiKey) {
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: '⚠️ Gemini API キーが設定されていません。\n\n関連するページが見つかりました：', sources }])
      setLoading(false)
      return
    }

    const context = topChunks.map(c => `【${c.title}】\n${c.content}`).join('\n\n---\n\n')
    const assistantId = `a-${Date.now()}`
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', sources, streaming: true }])

    await streamAnswer(question, context, apiKey,
      chunk => setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
      () => { setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)); setLoading(false) },
      err => { setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: `エラーが発生しました: ${err}`, streaming: false } : m)); setLoading(false) }
    )
  }, [searchIndex, loading, category, apiKey])

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

      {/* Chatbot */}
      <section className="chatbot-section" id="chatbot">
        <div className="chatbot-section__header">
          <div className="chatbot-section__label section-label">
            <span className="label-micro">02 / AI Assistant</span>
            <div className="section-label__line" />
          </div>
          <div className="chatbot-section__intro">
            <p>サイトの情報をもとに、Haas Japanチャットボットが日本語でお答えします。</p>
          </div>
        </div>
        <div className="chatbot-wrapper">
          <div className="app">
            <Header />
            <CategoryButtons active={category} onChange={setCategory} />
            <ChatWindow messages={messages} loading={loading} />
            <InputBar onSubmit={handleSubmit} disabled={!ready || loading} />
          </div>
        </div>
      </section>

      {/* Page links */}
      <section className="site-section">
        <div className="section-grid">
          <div className="section-label">
            <span className="label-micro">03 / Explore</span>
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
