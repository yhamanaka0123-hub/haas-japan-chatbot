const CATEGORIES = [
  { key: '授業', label: '📚 授業', desc: 'コース・カリキュラム' },
  { key: 'クラブ', label: '🤝 クラブ', desc: '課外活動・サークル' },
  { key: 'キャリア', label: '💼 キャリア', desc: '就活・卒業後の進路' },
] as const

interface Props {
  active: string
  onChange: (cat: string) => void
}

export default function CategoryButtons({ active, onChange }: Props) {
  return (
    <div className="category-bar">
      <span className="category-label">カテゴリーで絞り込む：</span>
      <div className="category-buttons">
        {CATEGORIES.map(({ key, label, desc }) => (
          <button
            key={key}
            className={`cat-btn ${active === key ? 'cat-btn--active' : ''}`}
            onClick={() => onChange(active === key ? '' : key)}
            title={desc}
          >
            {label}
          </button>
        ))}
        {active && (
          <button className="cat-btn cat-btn--clear" onClick={() => onChange('')}>
            ✕ 解除
          </button>
        )}
      </div>
    </div>
  )
}
