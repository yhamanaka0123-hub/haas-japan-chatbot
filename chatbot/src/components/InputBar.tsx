import { useState, type KeyboardEvent } from 'react'

const SUGGESTIONS = [
  '授業はどんな内容ですか？',
  'どんなクラブ活動がありますか？',
  '卒業後のキャリアパスは？',
  'Japan Trekとは何ですか？',
]

interface Props {
  onSubmit: (question: string) => void
  disabled: boolean
}

export default function InputBar({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('')

  const submit = () => {
    const q = value.trim()
    if (!q || disabled) return
    onSubmit(q)
    setValue('')
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const useSuggestion = (s: string) => {
    if (disabled) return
    onSubmit(s)
  }

  return (
    <div className="input-area">
      <div className="suggestions">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="suggestion-chip"
            onClick={() => useSuggestion(s)}
            disabled={disabled}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="input-bar">
        <textarea
          className="input-text"
          rows={2}
          placeholder={disabled ? 'データ読み込み中...' : '質問を入力してください（Enterで送信）'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          disabled={disabled}
          aria-label="質問入力"
        />
        <button
          className="send-btn"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="送信"
        >
          送信
        </button>
      </div>
    </div>
  )
}
