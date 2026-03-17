import { useState, useCallback } from 'react'
import type { Message } from '../types'
import { SearchIndex } from '../lib/search'
import { streamAnswer } from '../lib/claude'
import { useChunks } from '../context/ChunksContext'
import CategoryButtons from './CategoryButtons'
import ChatWindow from './ChatWindow'
import InputBar from './InputBar'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

function dedupSources(chunks: ReturnType<typeof useChunks>['chunks']) {
  const seen = new Set<string>()
  return chunks
    .filter(c => { if (seen.has(c.url)) return false; seen.add(c.url); return true })
    .map(c => ({ url: c.url, title: c.title.replace(/ \(Part \d+\)$/, '') }))
}

export default function ChatWidget() {
  const { chunks, ready } = useChunks()
  const [open, setOpen] = useState(false)
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const apiKey = API_KEY ?? ''

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
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`, role: 'assistant',
        content: '申し訳ありませんが、この質問に関する情報はサイトで見つかりませんでした。',
        sources: [], noInfo: true,
      }])
      setLoading(false)
      return
    }

    const topChunks = results.map(r => r.chunk)
    const sources = dedupSources(topChunks)

    if (!apiKey) {
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`, role: 'assistant',
        content: '⚠️ Gemini API キーが設定されていません。\n\n関連するページが見つかりました：',
        sources,
      }])
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
    <div className="chat-widget">
      {/* Panel */}
      <div className={`chat-widget__panel${open ? ' chat-widget__panel--open' : ''}`}>
        <div className="chat-widget__panel-header">
          <div className="chat-widget__panel-brand">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="15" stroke="#FDB515" strokeWidth="2" />
              <text x="16" y="21" textAnchor="middle" fill="#FDB515" fontSize="14" fontWeight="bold" fontFamily="Georgia, serif">H</text>
            </svg>
            <div>
              <span className="chat-widget__panel-title">Haas Japan AI</span>
              <span className="chat-widget__panel-sub">サイト情報をもとにお答えします</span>
            </div>
          </div>
          <button className="chat-widget__close" onClick={() => setOpen(false)} aria-label="閉じる">✕</button>
        </div>
        <CategoryButtons active={category} onChange={setCategory} />
        <ChatWindow messages={messages} loading={loading} />
        <InputBar onSubmit={handleSubmit} disabled={!ready || loading} />
      </div>

      {/* Trigger button */}
      <button
        className={`chat-widget__trigger${open ? ' chat-widget__trigger--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="チャットを開く"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  )
}
