/**
 * 活动中心页面
 */
import { useMemo, useCallback } from 'react'
import { LazyImage } from '../components/Skeleton'
import { IMG, activitiesData } from './data'

function ActivitiesPage({ 
  activitiesSearch = '', 
  setActivitiesSearch,
  activitiesFilter = '全部',
  setActivitiesFilter 
}) {
  // 状态选项
  const statusOptions = ['全部', '报名中', '进行中', '已结束']

  // 优化：记忆化过滤后的活动列表
  const filtered = useMemo(() => {
    return activitiesData.filter((act) => {
      const kw = activitiesSearch.trim().toLowerCase()
      const matchSearch = !kw || 
        act.title.toLowerCase().includes(kw) || 
        act.location.toLowerCase().includes(kw)
      const matchFilter = activitiesFilter === '全部' || act.status === activitiesFilter
      return matchSearch && matchFilter
    })
  }, [activitiesSearch, activitiesFilter])

  // 优化：记忆化事件处理器
  const handleSearchChange = useCallback((e) => {
    setActivitiesSearch(e.target.value)
  }, [setActivitiesSearch])

  const handleFilterChange = useCallback((e) => {
    setActivitiesFilter(e.target.value)
  }, [setActivitiesFilter])

  return (
    <>
      <div className="page-hero" style={{ '--hero-bg': `url(${IMG.stagePerf})` }}>
        <div className="page-hero-title">
          <span className="page-hero-dash">一</span>
          活动中心
          <span className="page-hero-dash">一</span>
        </div>
        <p className="page-hero-subtitle">探索梆鼓咚非遗文化活动与传习展演</p>
        <div className="page-hero-badge">活<br/>动</div>
      </div>
      
      <div className="page-toolbar">
        <div className="search-input-wrapper">
          <input 
            type="search" 
            placeholder="搜索活动..." 
            value={activitiesSearch} 
            onChange={handleSearchChange}
            aria-label="搜索活动"
          />
          <button className="search-btn" type="button">搜索</button>
        </div>
        <select 
          className="filter-select" 
          value={activitiesFilter} 
          onChange={handleFilterChange}
          aria-label="按状态筛选"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      
      <div className="section-wrapper" style={{ paddingTop: 24 }}>
        <div className="activities-grid">
          {filtered.map((act) => (
            <div key={act.id} className="activity-card">
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
        
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>暂无符合条件的活动</p>
          </div>
        )}
      </div>
    </>
  )
}

export default ActivitiesPage
