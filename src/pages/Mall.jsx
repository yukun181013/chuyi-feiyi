/**
 * 手办商城页面
 */
import { useMemo, useCallback } from 'react'
import { LazyImage } from '../components/Skeleton'
import { IMG, products, mallTags } from './data'

function MallPage({ 
  searchText = '', 
  setSearchText,
  sortMode = 'default',
  setSortMode,
  activeTag = '全部',
  setActiveTag,
  showAllTags = false,
  setShowAllTags,
  addToCart
}) {
  // 优化：记忆化过滤和排序商品
  const filteredProducts = useMemo(() => {
    // 关键词过滤
    const byKeyword = products.filter((item) => {
      const keyword = searchText.trim().toLowerCase()
      if (!keyword) return true
      return item.name.toLowerCase().includes(keyword) || 
             item.desc.toLowerCase().includes(keyword) || 
             item.category.toLowerCase().includes(keyword)
    })
    
    // 标签过滤
    const byTag = activeTag === '全部' 
      ? byKeyword 
      : byKeyword.filter((item) => 
          item.tags.includes(activeTag) || item.category === activeTag
        )
    
    // 排序
    const sorted = [...byTag]
    if (sortMode === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sortMode === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sortMode === 'time') sorted.sort((a, b) => b.id - a.id)
    
    return sorted
  }, [searchText, activeTag, sortMode])

  // 优化：记忆化要显示的标签
  const tagsToShow = useMemo(() => {
    return showAllTags ? mallTags : mallTags.slice(0, 7)
  }, [showAllTags])

  // 优化：记忆化事件处理器
  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value)
  }, [setSearchText])

  const handleSortChange = useCallback((mode) => {
    setSortMode(mode)
  }, [setSortMode])

  const handleTagChange = useCallback((tag) => {
    setActiveTag(tag)
  }, [setActiveTag])

  const handleToggleTags = useCallback(() => {
    setShowAllTags((v) => !v)
  }, [setShowAllTags])

  return (
    <>
      <div className="page-hero" style={{ '--hero-bg': `url(${IMG.cultureHall})` }}>
        <div className="page-hero-title">
          <span className="page-hero-dash">一</span>
          手办商城
          <span className="page-hero-dash">一</span>
        </div>
        <p className="page-hero-subtitle">精选非遗文创好物，带回家的文化记忆</p>
        <div className="page-hero-badge">商<br/>城</div>
      </div>
      
      <div className="mall-page">
        <div className="mall-toolbar">
          <div className="mall-search-row">
            <div className="search-input-wrapper">
              <input 
                type="search" 
                value={searchText} 
                onChange={handleSearchChange}
                placeholder="搜索商品..." 
                aria-label="搜索商品"
              />
              <button className="search-btn" type="button">搜索</button>
            </div>
          </div>
          
          <div className="sort-row">
            <button 
              type="button" 
              className={sortMode === 'price-asc' ? 'sort-active' : ''} 
              onClick={() => handleSortChange('price-asc')}
            >
              价格从低到高
            </button>
            <button 
              type="button" 
              className={sortMode === 'price-desc' ? 'sort-active' : ''} 
              onClick={() => handleSortChange('price-desc')}
            >
              价格从高到低
            </button>
            <button 
              type="button" 
              className={sortMode === 'time' ? 'sort-active' : ''} 
              onClick={() => handleSortChange('time')}
            >
              按时间排序
            </button>
          </div>
          
          <div className="tag-bar">
            {tagsToShow.map((tag) => (
              <button 
                key={tag} 
                type="button" 
                className={activeTag === tag ? 'tag-active' : ''} 
                onClick={() => handleTagChange(tag)}
                aria-pressed={activeTag === tag}
              >
                {tag}
              </button>
            ))}
            <button type="button" className="tag-toggle" onClick={handleToggleTags}>
              {showAllTags ? '收起' : '更多'}
            </button>
          </div>
        </div>
        
        <div className="mall-grid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="product-card">
              <a href={`#/mall/products/${product.id}`} className="product-link">
                <LazyImage src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
              </a>
              <p>{product.desc}</p>
              <div className="product-card-footer">
                <strong>¥{product.price}</strong>
                <button 
                  type="button" 
                  className="add-cart-btn"
                  onClick={() => addToCart?.(product.name)}
                  aria-label={`将 ${product.name} 加入购物车`}
                >
                  加入购物车
                </button>
              </div>
            </article>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <p>暂无符合条件的商品</p>
          </div>
        )}
      </div>
    </>
  )
}

export default MallPage
