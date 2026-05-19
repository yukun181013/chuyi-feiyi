/**
 * 非遗作品页面
 */
import { useMemo, useCallback } from 'react'
import { LazyImage } from '../components/Skeleton'
import { IMG, heritageWorks, worksCategories } from './data'

function WorksPage({ 
  worksSearch = '', 
  setWorksSearch,
  worksCategory = '全部',
  setWorksCategory 
}) {
  // 优化：记忆化过滤后的作品列表
  const filtered = useMemo(() => {
    const keyword = worksSearch.trim().toLowerCase()
    return heritageWorks
      .filter((w) => worksCategory === '全部' || w.badge === worksCategory || w.category.includes(worksCategory))
      .filter((w) => !keyword || 
        w.title.toLowerCase().includes(keyword) || 
        w.author.toLowerCase().includes(keyword) || 
        w.location.toLowerCase().includes(keyword) || 
        w.category.toLowerCase().includes(keyword)
      )
  }, [worksSearch, worksCategory])

  // 优化：记忆化分类切换处理器
  const handleCategoryChange = useCallback((cat) => {
    setWorksCategory(cat)
  }, [setWorksCategory])

  // 优化：记忆化搜索处理器
  const handleSearchChange = useCallback((e) => {
    setWorksSearch(e.target.value)
  }, [setWorksSearch])

  return (
    <>
      <div className="page-hero" style={{ '--hero-bg': `url(${IMG.modDrama})` }}>
        <div className="page-hero-title">
          <span className="page-hero-dash">一</span>
          非遗作品
          <span className="page-hero-dash">一</span>
        </div>
        <p className="page-hero-subtitle">探索福建莆田梆鼓咚非物质文化遗产</p>
        <div className="page-hero-badge">作<br/>品</div>
      </div>
      
      <div className="page-toolbar">
        <div className="search-input-wrapper">
          <input 
            type="search" 
            placeholder="搜索作品名称、地区、分类..." 
            value={worksSearch} 
            onChange={handleSearchChange}
            aria-label="搜索作品"
          />
          <button className="search-btn" type="button">搜索</button>
        </div>
      </div>
      
      <div className="category-tabs">
        {worksCategories.map((cat) => (
          <button 
            key={cat} 
            type="button" 
            className={`cat-tab ${worksCategory === cat ? 'cat-tab-active' : ''}`} 
            onClick={() => handleCategoryChange(cat)}
            aria-pressed={worksCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="section-wrapper">
        <div className="works-grid">
          {filtered.map((work) => (
            <a key={work.id} href="#/works" className="work-card">
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
        
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>暂无符合条件的作品</p>
          </div>
        )}
      </div>
    </>
  )
}

export default WorksPage
