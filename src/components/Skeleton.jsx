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
 * 卡片骨架屏 - 适用于非遗卡片、商品卡片等
 */
export function CardSkeleton({ count = 4 }) {
  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '24px',
        padding: '24px'
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div 
          key={i}
          style={{
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <Skeleton variant="image" height="180px" style={{ borderRadius: 0 }} />
          <div style={{ padding: '16px' }}>
            <Skeleton variant="text" width="80%" style={{ marginBottom: '8px' }} />
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
      ))}
    </div>
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

/**
 * 加载占位符 - 页面初始加载时显示
 */
export function PageLoader({ text = '正在加载...' }) {
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fdf5ee',
        zIndex: 9999,
        fontFamily: "'Ma Shan Zheng', 'STKaiti', 'KaiTi', cursive"
      }}
    >
      {/* 传统风格加载动画 */}
      <div 
        style={{
          position: 'relative',
          width: '80px',
          height: '80px'
        }}
      >
        {/* 外圈 */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid #f0e6dc',
            borderTopColor: '#C0392B',
            borderRadius: '50%',
            animation: 'loaderSpin 1s linear infinite'
          }}
        />
        {/* 内圈 */}
        <div 
          style={{
            position: 'absolute',
            inset: '12px',
            border: '2px solid #f0e6dc',
            borderBottomColor: '#C8A415',
            borderRadius: '50%',
            animation: 'loaderSpinReverse 0.8s linear infinite'
          }}
        />
        {/* 中心装饰 */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}
        >
          鼓
        </div>
      </div>

      <p style={{ marginTop: '24px', color: '#7a5a50', fontSize: '16px' }}>
        {text}
      </p>

      <style>{`
        @keyframes loaderSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes loaderSpinReverse {
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}

/**
 * 通用加载按钮 - 带加载状态的按钮
 */
export function LoadingButton({ 
  children, 
  loading = false, 
  disabled,
  spinner,
  ...props 
}) {
  return (
    <button 
      disabled={disabled || loading}
      style={{ 
        position: 'relative',
        cursor: loading ? 'wait' : disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
      {...props}
    >
      {loading && (
        <span 
          style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            marginRight: '8px',
            border: '2px solid transparent',
            borderTopColor: 'currentColor',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            verticalAlign: 'middle'
          }}
        />
      )}
      <span style={{ opacity: loading ? 0.7 : 1 }}>{children}</span>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}

export default LazyImage
