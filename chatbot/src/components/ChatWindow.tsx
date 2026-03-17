import { useEffect, useRef } from 'react'
import type { Message } from '../types'
import MessageBubble from './MessageBubble'

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'こんにちは！UC Berkeley Haas MBAについて何でも聞いてください。授業・クラブ・キャリアなど、在校生・卒業生のリアルな情報をお伝えします。',
  sources: [],
}

interface Props {
  messages: Message[]
  loading: boolean
}

export default function ChatWindow({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const all = [WELCOME, ...messages]

  return (
    <main className="chat-window" role="log" aria-live="polite">
      {all.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      {loading && messages.at(-1)?.role !== 'assistant' && (
        <div className="msg msg--assistant">
          <div className="msg-avatar" aria-hidden="true">🐻</div>
          <div className="msg-bubble msg-bubble--assistant">
            <span className="typing-dots"><span /><span /><span /></span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </main>
  )
}
