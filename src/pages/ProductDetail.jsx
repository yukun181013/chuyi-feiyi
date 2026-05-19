/**
 * 商品详情页面
 */
import { useMemo, useCallback } from 'react'
import { LazyImage } from '../components/Skeleton'
import { products } from './data'

function ProductDetailPage({ 
  productId,
  addToCart
}) {
  // 优化：记忆化当前商品
  const currentProduct = useMemo(() => {
    return products.find((item) => item.id === Number(productId)) || products[0]
  }, [productId])

  // 优化：记忆化加入购物车处理器
  const handleAddToCart = useCallback(() => {
    addToCart?.(currentProduct.name)
  }, [addToCart, currentProduct.name])

  if (!currentProduct) {
    return (
      <div className="product-detail-page">
        <div className="empty-state">
          <p>商品不存在或已下架</p>
          <a href="#/mall" className="btn-primary-hero">返回商城</a>
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
        <div className="product-detail-copy">
          <h1>{currentProduct.name}</h1>
          <div className="price-row">
            <strong className="current-price">¥{currentProduct.price}</strong>
            {currentProduct.originalPrice && (
              <span className="original-price">¥{currentProduct.originalPrice}</span>
            )}
            {currentProduct.originalPrice && (
              <span className="discount-tag">
                {Math.round((1 - currentProduct.price / currentProduct.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
          
          <div className="product-tags">
            {currentProduct.tags?.map((tag) => (
              <span key={tag} className="product-tag">{tag}</span>
            ))}
          </div>
          
          <p className="product-desc">{currentProduct.desc}</p>
          
          <ul className="detail-meta">
            <li><span>库存：</span>{currentProduct.stock}</li>
            <li><span>销量：</span>{currentProduct.sales}</li>
            <li><span>分类：</span>{currentProduct.category}</li>
          </ul>
          
          <div className="product-detail-actions">
            <button 
              className="submit-button" 
              type="button" 
              onClick={handleAddToCart}
              aria-label={`将 ${currentProduct.name} 加入购物车`}
            >
              加入购物车
            </button>
            <a href="#/mall" className="btn-outline-hero">返回商城</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
