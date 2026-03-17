import { useState, useEffect, useCallback } from 'react'
import type { Chunk, Message, Source } from './types'
import { SearchIndex } from './lib/search'
import { streamAnswer } from './lib/claude'
import Header from './components/Header'
import CategoryButtons from './components/CategoryButtons'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import './App.css'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

/** Deduplicate sources by URL, preserving order */
function dedupSources(chunks: Chunk[]): Source[] {
  const seen = new Set<string>()
  const sources: Source[] = []
  for (const c of chunks) {
    if (!seen.has(c.url)) {
      seen.add(c.url)
      sources.push({ url: c.url, title: c.title.replace(/ \(Part \d+\)$/, '') })
    }
  }
  return sources
}

export default function App() {
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [index, setIndex] = useState<SearchIndex | null>(null)
  const [indexReady, setIndexReady] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [apiKey] = useState(API_KEY ?? '')

  // Load chunks.json and build search index
  useEffect(() => {
    const base = import.meta.env.BASE_URL ?? '/'
    fetch(`${base}data/chunks.json`)
      .then((r) => r.json())
      .then((data: Chunk[]) => {
        setChunks(data)
        setIndex(new SearchIndex(data))
        setIndexReady(true)
      })
      .catch((e) => console.error('Failed to load chunks.json:', e))
  }, [])

  const handleSubmit = useCallback(
    async (question: string) => {
      if (!index || loading) return

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: question,
      }
      setMessages((prev) => [...prev, userMsg])
      setLoading(true)

      // --- Retrieval ---
      const results = index.search(question, 5, category || undefined)

      // No results at all → show fallback
      if (results.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: '申し訳ありませんが、この質問に関する情報はサイトで見つかりませんでした。',
            sources: [],
            noInfo: true,
          },
        ])
        setLoading(false)
        return
      }

      const topChunks = results.map((r) => r.chunk)
      const sources = dedupSources(topChunks)

      // --- If no API key, show search snippet only ---
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content:
              '⚠️ Gemini API キーが設定されていません。\n\n関連するページが見つかりました：',
            sources,
          },
        ])
        setLoading(false)
        return
      }

      // --- Generation via Claude ---
      const context = topChunks
        .map((c) => `【${c.title}】\n${c.content}`)
        .join('\n\n---\n\n')

      const assistantId = `a-${Date.now()}`
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          sources,
          streaming: true,
        },
      ])

      await streamAnswer(
        question,
        context,
        apiKey,
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          )
        },
        () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, streaming: false } : m
            )
          )
          setLoading(false)
        },
        (err) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: `エラーが発生しました: ${err}`, streaming: false }
                : m
            )
          )
          setLoading(false)
        }
      )
    },
    [index, loading, category, apiKey]
  )

  return (
    <div className="app">
      <Header />
      <CategoryButtons active={category} onChange={setCategory} />
      <ChatWindow messages={messages} loading={loading} />
      <InputBar onSubmit={handleSubmit} disabled={!indexReady || loading} />
    </div>
  )
}
