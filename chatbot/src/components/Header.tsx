export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="15" stroke="#FDB515" strokeWidth="2" />
            <text x="16" y="21" textAnchor="middle" fill="#FDB515" fontSize="14" fontWeight="bold" fontFamily="Georgia, serif">H</text>
          </svg>
          <div>
            <h1 className="header-title">Haas Japan チャットボット</h1>
            <p className="header-subtitle">UC Berkeley Haas MBA 日本人コミュニティ</p>
          </div>
        </div>
      </div>
    </header>
  )
}
