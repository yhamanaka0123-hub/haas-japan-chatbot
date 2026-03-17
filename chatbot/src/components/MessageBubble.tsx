import type { Message } from '../types'

const COFFEE_CHAT_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSedsXH4bG78H74ca4FBcEMej9QriA9JIwSOfakIWLz3Xhptdg/viewform'

function isNoInfo(text: string): boolean {
  return text.includes('見つかりませんでした') || text.includes('情報はサイトで')
}

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const { role, content, sources, streaming } = message

  if (role === 'user') {
    return (
      <div className="msg msg--user">
        <div className="msg-bubble msg-bubble--user">{content}</div>
      </div>
    )
  }

  const showCoffeeChat = !streaming && isNoInfo(content)

  return (
    <div className="msg msg--assistant">
      <div className="msg-avatar" aria-hidden="true">🐻</div>
      <div className="msg-body">
        <div className="msg-bubble msg-bubble--assistant">
          {content || <span className="typing-dots"><span /><span /><span /></span>}
          {streaming && content && <span className="cursor" />}
        </div>

        {/* Source links */}
        {!streaming && sources && sources.length > 0 && (
          <div className="msg-sources">
            <span className="sources-label">📄 参照ページ：</span>
            <ul className="sources-list">
              {sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title || decodeURIComponent(s.url.split('/').pop() ?? s.url)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Coffee chat — last resort when no info found */}
        {showCoffeeChat && (
          <div className="msg-coffee">
            <p>もっと詳しく知りたい場合は、在校生に直接聞いてみましょう👇</p>
            <a
              href={COFFEE_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="coffee-link"
            >
              ☕ コーヒーチャットを申し込む
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
