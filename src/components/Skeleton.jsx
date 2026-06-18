import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 骨架屏组件 - 内容加载时的占位效果
 * 支持卡片、文本、图片等多种形态
 */
export function Skeleton({
  variant = 'card',  // card | text | image | circle | custom
  width,
  height,
  count = 1,
  className = '',
  style = {}
}) {
  const baseStyle = {
    background: 'linear-gradient(90deg, #f0e6dc 25%, #e8ddd2 50%, #f0e6dc 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeletonShine 1.5s ease-in-out infinite',
    borderRadius: variant === 'circle' ? '50%' : '8px'
  }

  // 预设尺寸
  const variantSizes = {
    card: { width: width || '100%', height: height || '200px' },
    text: { width: width || '100%', height: height || '16px' },
    image: { width: width || '100%', height: height || '160px' },
    circle: { width: width || '60px', height: height || '60px' },
    custom: { width: width || '100%', height: height || '20px' }
  }

  const size = variantSizes[variant] || variantSizes.custom

  const skeletonItems = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`skeleton-item ${className}`}
      style={{
        ...baseStyle,
        width: size.width,
        height: size.height,
        marginBottom: count > 1 && i < count - 1 ? '12px' : 0,
        ...style
      }}
    />
  ))

  return (
    <>
      {skeletonItems}
      <style>{`
        @keyframes skeletonShine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  )
}

/**
 * 懒加载图片组件 - 支持渐进式加载和错误处理
 */
export function LazyImage({
  src,
  alt,
  className = '',
  style = {},
  placeholder,
  onLoad,
  onError,
  blur = true,
  ...props
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef(null)

  // 使用 Intersection Observer 检测元素是否进入视口
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // 提前 50px 开始加载
        threshold: 0
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = useCallback((e) => {
    setLoaded(true)
    onLoad?.(e)
  }, [onLoad])

  const handleError = useCallback((e) => {
    setError(true)
    onError?.(e)
  }, [onError])

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: '#f0e6dc',
    ...style
  }

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'scale(1)' : blur ? 'scale(1.05)' : 'scale(1)',
    filter: loaded ? 'blur(0)' : blur ? 'blur(10px)' : 'blur(0)',
    transition: 'opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease',
    ...style
  }

  const placeholderStyle = {
    position: 'absolute',
    inset: 0,
    opacity: loaded ? 0 : 1,
    transition: 'opacity 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const errorFallback = (
    <div
      style={{
        ...placeholderStyle,
        background: '#f8e8e8',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      <span style={{ fontSize: '32px' }}>🖼️</span>
      <span style={{ fontSize: '12px', color: '#999' }}>图片加载失败</span>
    </div>
  )

  return (
    <div ref={imgRef} className={`lazy-image-container ${className}`} style={containerStyle}>
      {/* 占位骨架 */}
      {!loaded && !error && (
        placeholder || <Skeleton variant="image" style={placeholderStyle} />
      )}

      {/* 错误状态 */}
      {error && errorFallback}

      {/* 实际图片 */}
      {inView && (
        <img
          src={src}
          alt={alt}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  )
}

export default LazyImage
