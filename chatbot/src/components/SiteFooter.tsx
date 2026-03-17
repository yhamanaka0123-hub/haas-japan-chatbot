import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <span className="site-footer__brand-name">Haas Japan</span>
        <p className="site-footer__tagline">
          UC Berkeley Haas MBAの日本人コミュニティ。<br />
          在校生有志によって運営されています。
        </p>
      </div>

      <nav className="site-footer__links">
        <span className="site-footer__links-label">Pages</span>
        <Link to="/profiles">学生プロフィール</Link>
        <Link to="/curriculum">授業・カリキュラム</Link>
        <Link to="/career">キャリア・就活</Link>
        <Link to="/clubs">クラブ・イベント</Link>
        <Link to="/blog">ブログ・居住ライフ</Link>
        <Link to="/coffee">コーヒーチャット申込み</Link>
      </nav>

      <div className="site-footer__bottom">
        <span className="site-footer__copy">© Haas Japan Community · haasjapan.wordpress.com</span>
        <span className="site-footer__copy" style={{ color: 'rgba(255,255,255,0.25)' }}>UC Berkeley Haas School of Business</span>
      </div>
    </footer>
  )
}
