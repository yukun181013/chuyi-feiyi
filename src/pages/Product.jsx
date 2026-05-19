/**
 * 商品详情页面
 */
import { useMemo, useCallback } from 'react'
import { LazyImage } from '../components/Skeleton'
import { products, IMG } from './data'

function ProductPage({
  route,
  addToCart
}) {
  // 获取当前产品
  const currentProduct = useMemo(() => {
    if (route?.name !== 'product') return null
    return products.find(item => item.id === route.id) || products[0]
  }, [route])

  // 加载状态
  const isLoading = false

  // 处理加入购物车
  const handleAddToCart = useCallback(() => {
    if (currentProduct && addToCart) {
      addToCart(currentProduct.name)
    }
  }, [currentProduct, addToCart])

  if (!currentProduct) {
    return (
      <div className="product-detail-page">
        <div className="empty-state">
          <p>商品未找到</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        <div className="product-detail-image">
          <LazyImage src={currentProduct.image} alt={currentProduct.name} />
        </div>
        <div className="product-detail-info">
          <h1>{currentProduct.name}</h1>
          <div className="product-detail-category">{currentProduct.category}</div>

          <div className="price-row">
            <strong className="current-price">¥{currentProduct.price}</strong>
            <span className="original-price">¥{currentProduct.originalPrice}</span>
          </div>

          <p className="product-detail-desc">{currentProduct.desc}</p>

          <div className="product-detail-tags">
            {currentProduct.tags.map(tag => (
              <span key={tag} className="product-tag">{tag}</span>
            ))}
          </div>

          <ul className="detail-meta">
            <li><span>库存：</span>{currentProduct.stock}</li>
            <li><span>销量：</span>{currentProduct.sales}</li>
            <li><span>分类：</span>{currentProduct.category}</li>
          </ul>

          <button
            className="submit-button"
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '加入购物车'}
          </button>

          <a href="#/mall" className="back-to-mall">← 返回商城</a>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
