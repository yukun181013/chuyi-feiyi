/**
 * 在线课程页面
 */
import { useMemo, useCallback } from 'react'
import { LazyImage, LoadingButton } from '../components/Skeleton'
import { IMG, coursesData, inheritorsData } from './data'

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

// 课程团队成员数据
const courseTeamMembers = [
  { name: '黄璟', role: '主讲教师', title: '梆鼓咚唯一代表性传承人，莆田学院音乐学院副教授，承担梆鼓咚核心教学与曲谱记录' },
  { name: '卢雪珊', role: '教学辅助', title: '莆田学院音乐学院副教授，梆鼓咚曲本作者，承担课堂教学设计辅助' },
  { name: '马达', role: '顶层设计', title: '中国音乐教育家，莆田学院音乐学院特聘教授，承担课程顶层设计辅导' },
  { name: '林季君', role: '青少年传承', title: '梆鼓咚第五代传承人，莆田学院音乐学院客座教授，省级中学音乐学科教学带头人' },
  { name: '郑长铃', role: '非遗理论', title: '国际非遗专家，莆田学院音乐学院特聘教授，承担非遗保护理论辅导' },
]

function CoursePage({ 
  courseSearch = '', 
  setCourseSearch,
  courseFilter = '全部分类',
  setCourseFilter,
  handleInheritorClick,
  isLoading = false
}) {
  // 级别选项
  const levelOptions = ['全部分类', '初级', '中级', '高级']

  // 优化：记忆化过滤后的课程列表
  const filtered = useMemo(() => {
    return coursesData.filter((c) => {
      const kw = courseSearch.trim().toLowerCase()
      const matchSearch = !kw || c.title.toLowerCase().includes(kw)
      const matchFilter = courseFilter === '全部分类' || c.level === courseFilter
      return matchSearch && matchFilter
    })
  }, [courseSearch, courseFilter])

  // 优化：记忆化事件处理器
  const handleSearchChange = useCallback((e) => {
    setCourseSearch(e.target.value)
  }, [setCourseSearch])

  const handleFilterChange = useCallback((e) => {
    setCourseFilter(e.target.value)
  }, [setCourseFilter])

  const handleKeyDown = useCallback((e, name) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleInheritorClick?.(name)
    }
  }, [handleInheritorClick])

  return (
    <>
      <div className="page-hero" style={{ '--hero-bg': `url(${IMG.course1})` }}>
        <div className="page-hero-title">
          <span className="page-hero-dash">一</span>
          在线课程
          <span className="page-hero-dash">一</span>
        </div>
        <p className="page-hero-subtitle">学习非遗文化，传承匠心技艺</p>
        <div className="page-hero-badge">课<br/>程</div>
      </div>
      
      <div className="page-toolbar">
        <div className="search-input-wrapper">
          <input 
            type="search" 
            placeholder="搜索课程..." 
            value={courseSearch} 
            onChange={handleSearchChange}
            aria-label="搜索课程"
          />
          <button className="search-btn" type="button">搜索</button>
        </div>
        <select 
          className="filter-select" 
          value={courseFilter} 
          onChange={handleFilterChange}
          aria-label="按级别筛选"
        >
          {levelOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      
      <div className="section-wrapper" style={{ paddingTop: 24 }}>
        <div className="course-grid">
          {filtered.map((c) => {
            const levels = { '初级': 1, '中级': 2, '高级': 3 }
            const lvl = levels[c.level] || 1
            return (
              <div key={c.id} className="course-card">
                <div className="course-card-img">
                  <LazyImage src={c.image} alt={c.title} />
                </div>
                <div className="course-card-body">
                  <div className="course-card-title">{c.title}</div>
                  <div className="course-meta-row">
                    <span>共 {c.lessons} 节课</span>
                    <span className="course-level">
                      {[1,2,3].map((d) => (
                        <span key={d} className={`level-dot ${d <= lvl ? 'active' : ''}`} />
                      ))}
                      {c.level}
                    </span>
                  </div>
                  <button className="course-start-btn" type="button">
                    <LoadingButton loading={isLoading}>开始学习</LoadingButton>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>暂无符合条件的课程</p>
          </div>
        )}
      </div>
      
      <div className="section-wrapper">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 24 }}>课程团队</h2>
        <div className="inheritors-grid">
          {courseTeamMembers.map((m) => (
            <div key={m.name} className="inheritor-card">
              <img 
                src={avatarUrl(m.name)} 
                alt={m.name} 
                className="inheritor-avatar" 
                loading="lazy"
              />
              <div className="inheritor-name">
                <span
                  className="inheritor-name-btn"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleInheritorClick?.(m.name)}
                  onKeyDown={(e) => handleKeyDown(e, m.name)}
                >
                  {m.name}
                </span>
              </div>
              <div className="inheritor-location" style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>
                {m.role}
              </div>
              <div className="inheritor-title">{m.title}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default CoursePage
