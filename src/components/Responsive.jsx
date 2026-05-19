import { useEffect, useRef } from 'react'
import { useViewport, useMobileMenu, useScrollDirection } from '../hooks/useResponsive.js'

/**
 * 移动端优化导航栏
 * 自动隐藏/显示，移动端菜单支持
 */
export function MobileHeader({ children }) {
  const { isMobile, isTablet } = useViewport()
  const { scrollDirection, isAtTop } = useScrollDirection()
  const headerRef = useRef(null)

  // 滚动时隐藏/显示导航栏
  useEffect(() => {
    if (!headerRef.current) return

    if (!isAtTop && scrollDirection === 'down') {
      headerRef.current.style.transform = 'translateY(-100%)'
    } else {
      headerRef.current.style.transform = 'translateY(0)'
    }
  }, [scrollDirection, isAtTop])

  return (
    <header
      ref={headerRef}
      className={`mobile-header ${isAtTop ? 'header-transparent' : 'header-solid'}`}
      style={{
        transition: 'transform 0.3s ease, background 0.3s ease',
        willChange: 'transform'
      }}
    >
      {children}
    </header>
  )
}

/**
 * 汉堡菜单按钮
 */
export function HamburgerButton({ isOpen, onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`hamburger-btn ${isOpen ? 'open' : ''} ${className}`}
      onClick={onClick}
      aria-label={isOpen ? '关闭菜单' : '打开菜单'}
      aria-expanded={isOpen}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  )
}

/**
 * 移动端侧边菜单
 */
export function MobileMenu({ isOpen, onClose, children }) {
  const menuRef = useRef(null)

  // 焦点陷阱
  useEffect(() => {
    if (!isOpen || !menuRef.current) return

    const focusableElements = menuRef.current.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    firstElement?.focus()

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    const handleKeyDown = (e) => {
      handleTabKey(e)
      if (e.key === 'Escape') {
        onClose()
      }
    }

    menuRef.current.addEventListener('keydown', handleKeyDown)
    return () => menuRef.current?.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {/* 遮罩层 */}
      <div
        className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 菜单 */}
      <nav
        ref={menuRef}
        className={`mobile-nav ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="移动端导航"
      >
        <div className="mobile-nav-header">
          <button
            type="button"
            className="mobile-nav-close"
            onClick={onClose}
            aria-label="关闭菜单"
          >
            ✕
          </button>
        </div>

        <div className="mobile-nav-content">
          {children}
        </div>
      </nav>
    </>
  )
}

/**
 * 响应式容器
 */
export function ResponsiveContainer({
  children,
  narrow = false,
  className = ''
}) {
  return (
    <div className={`container ${narrow ? 'container-narrow' : ''} ${className}`}>
      {children}
    </div>
  )
}

/**
 * 响应式网格
 */
export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = ''
}) {
  const gapClass = `gap-${gap}`

  return (
    <div
      className={`grid ${gapClass} sm:grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop} ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * 响应式图片
 */
export function ResponsiveImage({
  src,
  alt,
  srcSet,
  sizes = '100vw',
  className = '',
  lazy = true,
  placeholder
}) {
  return (
    <picture className={`img-responsive ${className}`}>
      {srcSet?.map((source, index) => (
        <source
          key={index}
          media={source.media}
          srcSet={source.srcSet}
        />
      ))}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={lazy ? 'lazy' : 'eager'}
        className="img-responsive"
        style={{ backgroundColor: placeholder || 'transparent' }}
      />
    </picture>
  )
}

/**
 * 触摸友好的按钮
 */
export function TouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const sizeClass = `touch-btn-${size}`
  const variantClass = `touch-btn-${variant}`

  return (
    <button
      type="button"
      className={`touch-btn ${sizeClass} ${variantClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * 底部固定操作栏 (移动端)
 */
export function MobileActionBar({ children, className = '' }) {
  return (
    <div className={`mobile-action-bar safe-bottom ${className}`}>
      {children}
    </div>
  )
}

/**
 * 响应式折叠面板
 */
export function ResponsiveCollapse({
  title,
  children,
  defaultExpanded = false,
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children])

  return (
    <div className={`collapse-panel ${className}`}>
      <button
        type="button"
        className="collapse-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="collapse-title">{title}</span>
        <span
          className="collapse-icon"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      <div
        className="collapse-content"
        style={{
          maxHeight: isExpanded ? contentHeight : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease'
        }}
      >
        <div ref={contentRef} className="collapse-inner">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * 响应式模态框
 */
export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) {
  const modalRef = useRef(null)
  const { isMobile } = useViewport()

  // 移动端全屏模态框
  const modalClass = isMobile ? 'modal-mobile-fullscreen' : `modal-${size}`

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-wrapper">
      <div className="modal-overlay" onClick={onClose} />
      <div
        ref={modalRef}
        className={`modal-content ${modalClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * 滑块轮播 (移动端优化)
 */
export function MobileCarousel({
  children,
  autoPlay = false,
  interval = 5000,
  showDots = true,
  showArrows = false
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const containerRef = useRef(null)

  const minSwipeDistance = 50

  const goTo = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % children.length)
  }, [children.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + children.length) % children.length)
  }, [children.length])

  // 自动播放
  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(goNext, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, goNext])

  // 触摸滑动
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goNext()
    } else if (isRightSwipe) {
      goPrev()
    }
  }

  return (
    <div className="mobile-carousel">
      <div
        ref={containerRef}
        className="carousel-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display: 'flex',
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.3s ease'
        }}
      >
        {children.map((child, index) => (
          <div key={index} className="carousel-slide" style={{ flexShrink: 0, width: '100%' }}>
            {child}
          </div>
        ))}
      </div>

      {showDots && (
        <div className="carousel-dots">
          {children.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 响应式文字
 * 根据容器宽度调整字体大小
 */
export function ResponsiveText({
  children,
  as: Component = 'p',
  size = 'base',
  className = ''
}) {
  const sizeClass = `text-${size}`

  return (
    <Component className={`${sizeClass} ${className}`}>
      {children}
    </Component>
  )
}

/**
 * 安全的 SSR 组件包装器
 */
export function ClientOnly({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? children : fallback
}

import { useState } from 'react'

export default MobileHeader
