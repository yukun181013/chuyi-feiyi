/**
 * 小游戏页面
 */
import { IMG } from './data'

function GamePage() {
  return (
    <>
      <div className="page-hero" style={{ '--hero-bg': `url(${IMG.modDrama})` }}>
        <div className="page-hero-title">
          <span className="page-hero-dash">一</span>
          小游戏
          <span className="page-hero-dash">一</span>
        </div>
        <p className="page-hero-subtitle">梆鼓咚音乐节奏游戏，感受非遗韵律之美</p>
        <div className="page-hero-badge">游<br/>戏</div>
      </div>
      
      <div className="section-wrapper" style={{ padding: '48px 24px' }}>
        <div className="game-intro-card">
          <div className="game-intro-icon" role="img" aria-label="鼓">🥁</div>
          <h2 className="game-intro-title">梆鼓咚·音乐节奏游戏</h2>
          <p className="game-intro-desc">
            本游戏以福建莆田非物质文化遗产「梆鼓咚」为主题，融合传统鼓乐节奏与现代音乐游戏玩法，让你在游玩中感受非遗文化的魅力。
          </p>
          <div className="game-tags">
            <span className="game-tag">节奏音乐</span>
            <span className="game-tag">非遗主题</span>
            <span className="game-tag">益智休闲</span>
          </div>
        </div>
        
        <div className="game-frame-wrapper">
          <iframe
            src="/game/index.html"
            title="梆鼓咚音乐节奏游戏"
            width="960"
            height="600"
            style={{ border: 'none', display: 'block', margin: '0 auto', maxWidth: '100%' }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </>
  )
}

export default GamePage
