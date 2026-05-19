/**
 * 首页组件 - 梆鼓咚非遗门户首页
 */
import { useCallback, useMemo, useRef } from 'react'
import { ScrollReveal } from '../components/PageTransition'
import { LazyImage, CardSkeleton } from '../components/Skeleton'
import { heroSlides, IMG, heritageWorks, inheritorsData, activitiesData } from './data'
import { playDrum, playZhuban } from './audio'

// 新闻数据
const newsData = [
  {
    id: 'n1',
    img: IMG.newsDangui,
    source: '中国新闻网',
    date: '2015年',
    title: '梆鼓咚荣获福建省第三届曲艺大赛一等奖',
    desc: '中新网报道，莆田梆鼓咚代表队在福建省曲艺大赛中脱颖而出，斩获一等奖，引发广泛关注。',
  },
  {
    id: 'n2',
    img: IMG.newsMazu,
    source: '湄洲日报',
    date: '2017年',
    title: '梆鼓咚代表福建参加全国曲艺展演',
    desc: '湄洲日报报道，梆鼓咚作为福建代表曲种赴京参加全国曲艺展演，展示莆仙文化独特魅力。',
  },
  {
    id: 'n3',
    img: IMG.pavilionArt,
    source: '文创设计',
    date: '近年',
    title: '梆鼓咚数字插画「小小梆鼓讲大事」',
    desc: '以非遗传承为主题的数字文创插画，将梆鼓咚形象融入现代美学，让传统文化走进年轻群体。',
  },
]

// 生成头像URL
function avatarUrl(name) {
  const colors = ['9f3b2f', '8B4513', '6B3A2A', 'A0522D', '7B2D26', '5C3317', '804020', '6A3028']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const bg = colors[Math.abs(hash) % colors.length]
  const fontSize = name.length <= 2 ? 40 : name.length === 3 ? 32 : 26
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="%23${bg}"/><text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="white" font-size="${fontSize}" font-family="'Ma Shan Zheng','STKaiti','KaiTi',sans-serif">${name}</text></svg>`
  return `data:image/svg+xml,${svg}`
}

function HomePage({
  heroSlide = 0,
  setHeroSlide,
  resetHeroTimer,
  handleInheritorClick,
}) {
  // 优化：记忆化数据过滤
  const displayedWorks = useMemo(() => heritageWorks.slice(0, 4), [])
  const displayedInheritors = useMemo(() => inheritorsData.slice(0, 4), [])
  const displayedActivities = useMemo(() => activitiesData.slice(0, 4), [])
  const displayedNews = useMemo(() => newsData.slice(0, 3), [])

  // 事件处理器
  const handlePlayDrum = useCallback((e) => {
    e.stopPropagation()
    playDrum()
    e.currentTarget.classList.remove('hero-instr-hit')
    void e.currentTarget.offsetWidth
    e.currentTarget.classList.add('hero-instr-hit')
  }, [])

  const handlePlayZhuban = useCallback((e) => {
    e.stopPropagation()
    playZhuban()
    e.currentTarget.classList.remove('hero-instr-hit')
    void e.currentTarget.offsetWidth
    e.currentTarget.classList.add('hero-instr-hit')
  }, [])

  const handleDotClick = useCallback((index) => {
    setHeroSlide(index)
    resetHeroTimer()
  }, [setHeroSlide, resetHeroTimer])

  return (
    <>
      {/* Hero */}
      <section className="hero-carousel">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === heroSlide ? 'hero-slide-active' : ''}`}>
            <img src={slide.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
        <div className="hero-carousel-overlay" aria-hidden="true" />
        <div className="hero-cloud-bottom" aria-hidden="true" />

        {/* 乐器实物图片 */}
        <div className="hero-instruments">
          <div className="hero-instr hero-instr-photo hero-instr-photo-left" title="板鼓" onClick={handlePlayDrum}>
            <img src={IMG.bangguInstruments} alt="梆鼓咚乐器 — 板鼓与竹板" loading="lazy" />
            <span className="hero-instr-label">点击试听 · 板鼓</span>
          </div>
          <div className="hero-instr hero-instr-photo hero-instr-photo-right" title="竹板" onClick={handlePlayZhuban}>
            <img src={IMG.bangguDrawing} alt="梆鼓咚民俗演奏线描" loading="lazy" />
            <span className="hero-instr-label">点击试听 · 竹板</span>
          </div>
        </div>

        <div className="hero-inner">
          <h1 className="hero-title">梆鼓咚 · 莆田非遗</h1>
          <p className="hero-subtitle">{heroSlides[heroSlide]?.subtitle}</p>
          <div className="hero-actions">
            <a href="#/heritage" className="btn-primary-hero">探索非遗</a>
            <a href="#/course" className="btn-outline-hero">学习课程</a>
          </div>
          <div className="hero-dots" aria-label="幻灯片导航">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`hero-dot ${i === heroSlide ? 'hero-dot-active' : ''}`}
                aria-label={`第${i + 1}张`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 名言 */}
      <div className="xi-quote-banner reveal-scale">
        <div className="xi-quote-inner">
          <div className="xi-quote-icon">"</div>
          <blockquote className="xi-quote-text">
            要扎实做好非物质文化遗产的系统性保护，更好满足人民日益增长的精神文化需求，推进文化自信自强。
          </blockquote>
          <div className="xi-quote-author">——习近平总书记</div>
        </div>
      </div>

      {/* 精选作品 */}
      <div className="section-heading reveal-heading">
        <div className="section-title-bracket">【 精选作品 】</div>
        <p className="section-subtitle-text">探索福建莆田梆鼓咚非物质文化遗产的魅力</p>
      </div>
      <div className="section-wrapper" style={{ paddingTop: 0 }}>
        <div className="section-topbar">
          <span />
          <a href="#/works" className="section-more-link">查看更多 →</a>
        </div>
        <div className="works-grid">
          {displayedWorks.map((work) => (
            <a key={work.id} href="#/works" className="work-card reveal-up">
              <div className="work-card-img">
                <LazyImage src={work.image} alt={work.title} />
                <span className="work-badge">{work.badge}</span>
              </div>
              <div className="work-card-body">
                <div className="work-card-title">{work.title}</div>
                <div className="work-card-meta">
                  <span>⚑ {work.author}</span>
                  <span>◎ {work.location}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 传承人风采 */}
      <div className="section-heading reveal-heading">
        <div className="section-title-bracket">【 传承人风采 】</div>
        <p className="section-subtitle-text">传承匠心，守护文化根脉</p>
      </div>
      <div className="section-wrapper" style={{ paddingTop: 0 }}>
        <div className="section-topbar">
          <span />
          <a href="#/inheritors" className="section-more-link">查看更多 →</a>
        </div>
        <div className="inheritors-grid">
          {displayedInheritors.map((person) => (
            <div key={person.id} className="inheritor-card reveal-up">
              <img src={avatarUrl(person.name)} alt={person.name} className="inheritor-avatar" loading="lazy" />
              <div className="inheritor-name">
                <span
                  className="inheritor-name-btn"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleInheritorClick?.(person.name)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInheritorClick?.(person.name) } }}
                >{person.name}</span>
              </div>
              <div className="inheritor-title">{person.title}</div>
              <div className="inheritor-location">◎ {person.location}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 媒体报道 */}
      <div className="section-heading reveal-heading">
        <div className="section-title-bracket">【 媒体报道 】</div>
        <p className="section-subtitle-text">权威媒体关注，梆鼓咚走向全国舞台</p>
      </div>
      <div className="section-wrapper" style={{ paddingTop: 0 }}>
        <div className="activities-grid">
          {displayedNews.map((n) => (
            <div key={n.id} className="news-card reveal-left">
              <div className="activity-img">
                <LazyImage src={n.img} alt={n.title} />
                <span className="activity-status status-open">{n.source}</span>
              </div>
              <div className="activity-body">
                <span className="activity-type-tag">{n.date}</span>
                <div className="activity-title">{n.title}</div>
                <div className="activity-meta" style={{ fontSize: 13, color: '#888', marginTop: 6 }}>{n.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 活动中心 */}
      <div className="section-heading reveal-heading">
        <div className="section-title-bracket">【 近期活动 】</div>
        <p className="section-subtitle-text">探索梆鼓咚非遗文化活动与展演</p>
      </div>
      <div className="section-wrapper" style={{ paddingTop: 0 }}>
        <div className="section-topbar">
          <span />
          <a href="#/activities" className="section-more-link">查看更多 →</a>
        </div>
        <div className="activities-grid">
          {displayedActivities.map((act) => (
            <div key={act.id} className="activity-card reveal-up">
              <div className="activity-img">
                <LazyImage src={act.image} alt={act.title} />
                <span className={`activity-status ${act.status === '进行中' ? 'status-active' : 'status-open'}`}>
                  {act.status}
                </span>
              </div>
              <div className="activity-body">
                <span className="activity-type-tag">{act.type}</span>
                <div className="activity-title">{act.title}</div>
                <div className="activity-meta">
                  <span>◎ {act.location}</span>
                  <span>⊙ {act.date}</span>
                </div>
              </div>
              <a href="#/activities" className="activity-btn">立即报名</a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default HomePage
