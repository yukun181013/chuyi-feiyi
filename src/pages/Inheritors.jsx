/**
 * 非遗传承人页面
 */
import { useMemo, useCallback } from 'react'
import { IMG, inheritorsData } from './data'

// 生成头像URL - 复用函数
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

function InheritorsPage({ 
  inheritorsSearch = '', 
  setInheritorsSearch,
  inheritorsFilter = '全部',
  setInheritorsFilter,
  handleInheritorClick
}) {
  // 优化：记忆化所有地区选项
  const locations = useMemo(() => {
    return ['全部', ...new Set(inheritorsData.map((p) => p.location))]
  }, [])

  // 优化：记忆化过滤后的传承人列表
  const filtered = useMemo(() => {
    return inheritorsData.filter((person) => {
      const kw = inheritorsSearch.trim().toLowerCase()
      const matchSearch = !kw || 
        person.name.toLowerCase().includes(kw) || 
        person.title.toLowerCase().includes(kw)
      const matchFilter = inheritorsFilter === '全部' || person.location === inheritorsFilter
      return matchSearch && matchFilter
    })
  }, [inheritorsSearch, inheritorsFilter])

  // 优化：记忆化事件处理器
  const handleSearchChange = useCallback((e) => {
    setInheritorsSearch(e.target.value)
  }, [setInheritorsSearch])

  const handleFilterChange = useCallback((e) => {
    setInheritorsFilter(e.target.value)
  }, [setInheritorsFilter])

  const handleKeyDown = useCallback((e, name) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleInheritorClick?.(name)
    }
  }, [handleInheritorClick])

  return (
    <>
      <div className="page-hero" style={{ '--hero-bg': `url(${IMG.hero1})` }}>
        <div className="page-hero-title">
          <span className="page-hero-dash">一</span>
          非遗传承人
          <span className="page-hero-dash">一</span>
        </div>
        <p className="page-hero-subtitle">传承匠心，守护文化根脉</p>
        <div className="page-hero-badge">传<br/>承</div>
      </div>
      
      <div className="page-toolbar">
        <div className="search-input-wrapper">
          <input 
            type="search" 
            placeholder="搜索传承人姓名..." 
            value={inheritorsSearch} 
            onChange={handleSearchChange}
            aria-label="搜索传承人"
          />
          <button className="search-btn" type="button">搜索</button>
        </div>
        <select 
          className="filter-select" 
          value={inheritorsFilter} 
          onChange={handleFilterChange}
          aria-label="按地区筛选"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      
      <div className="section-wrapper" style={{ paddingTop: 24 }}>
        <div className="inheritors-grid">
          {filtered.map((person) => (
            <div key={person.id} className="inheritor-card">
              <img 
                src={avatarUrl(person.name)} 
                alt={person.name} 
                className="inheritor-avatar" 
                loading="lazy"
              />
              <div className="inheritor-name">
                <span
                  className="inheritor-name-btn"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleInheritorClick?.(person.name)}
                  onKeyDown={(e) => handleKeyDown(e, person.name)}
                >
                  {person.name}
                </span>
              </div>
              <div className="inheritor-title">{person.title}</div>
              <div className="inheritor-location">◎ {person.location}</div>
            </div>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>暂无符合条件的传承人</p>
          </div>
        )}
      </div>
    </>
  )
}

export default InheritorsPage
