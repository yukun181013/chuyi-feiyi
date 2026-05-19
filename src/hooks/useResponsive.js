import { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * 响应式设计 Hook
 * 检测视口大小、设备类型和方向
 */

export function useViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    isWide: window.innerWidth >= 1280,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  })

  useEffect(() => {
    let rafId = null
    let lastUpdate = 0
    const throttleMs = 100 // 节流时间

    const updateViewport = () => {
      const now = Date.now()
      if (now - lastUpdate < throttleMs) return
      
      lastUpdate = now
      const width = window.innerWidth
      const height = window.innerHeight

      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isWide: width >= 1280,
        orientation: width > height ? 'landscape' : 'portrait'
      })
    }

    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateViewport)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', updateViewport)

    // 初始更新
    updateViewport()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', updateViewport)
    }
  }, [])

  return viewport
}

/**
 * 设备能力检测
 */
export function useDeviceCapabilities() {
  return useMemo(() => ({
    // 触摸设备
    isTouch: typeof window !== 'undefined' && 
      ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    
    // 指针精度
    isCoarsePointer: typeof window !== 'undefined' && 
      window.matchMedia('(pointer: coarse)').matches,
    
    // 是否支持悬停
    canHover: typeof window !== 'undefined' && 
      window.matchMedia('(hover: hover)').matches,
    
    // 减少动画偏好
    prefersReducedMotion: typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    
    // 高对比度偏好
    prefersHighContrast: typeof window !== 'undefined' && 
      window.matchMedia('(prefers-contrast: high)').matches,
    
    // 暗色模式偏好
    prefersDarkMode: typeof window !== 'undefined' && 
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    
    // 是否在线
    isOnline: typeof navigator !== 'undefined' && navigator.onLine,
    
    // 网络类型
    connectionType: typeof navigator !== 'undefined' && 
      navigator.connection ? navigator.connection.effectiveType : '4g'
  }), [])
}

/**
 * 移动端菜单状态管理
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const open = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
    
    setTimeout(() => setIsAnimating(false), 300)
  }, [isAnimating])

  const close = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsOpen(false)
    document.body.style.overflow = ''
    
    setTimeout(() => setIsAnimating(false), 300)
  }, [isAnimating])

  const toggle = useCallback(() => {
    isOpen ? close() : open()
  }, [isOpen, open, close])

  // ESC 关闭
  useEffect(() => {
    if (!isOpen) return
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') close()
    }
    
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, close])

  // 清理
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return {
    isOpen,
    isAnimating,
    open,
    close,
    toggle
  }
}

/**
 * 滚动方向检测（用于隐藏/显示导航栏）
 */
export function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState('up')
  const [isAtTop, setIsAtTop] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const lastScrollY = useRef(0)

  useEffect(() => {
    let rafId = null
    let ticking = false

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsAtTop(currentScrollY < threshold)

      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
        ticking = false
        return
      }

      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up')
      lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return { scrollDirection, isAtTop, scrollY }
}

/**
 * 元素是否在视口内
 */
export function useInView(options = {}) {
  const { threshold = 0, rootMargin = '0px', triggerOnce = true } = options
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || (triggerOnce && hasTriggered)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            setHasTriggered(true)
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { ref: elementRef, isInView }
}

/**
 * 虚拟列表 Hook (用于长列表优化)
 */
export function useVirtualList(itemCount, itemHeight, overscan = 5) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  const { virtualItems, totalHeight, startIndex, endIndex } = useMemo(() => {
    const totalHeight = itemCount * itemHeight
    const containerHeight = containerRef.current?.clientHeight || 0
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2
    const endIndex = Math.min(itemCount - 1, startIndex + visibleCount)
    
    const virtualItems = []
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        style: {
          position: 'absolute',
          top: i * itemHeight,
          height: itemHeight,
          left: 0,
          right: 0
        }
      })
    }

    return { virtualItems, totalHeight, startIndex, endIndex }
  }, [itemCount, itemHeight, scrollTop, overscan])

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  return {
    containerRef,
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll
  }
}

/**
 * 图片懒加载 Hook
 */
export function useLazyImage(src, placeholder = '') {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 开始加载图片
            const image = new Image()
            image.src = src
            image.onload = () => {
              setImageSrc(src)
              setIsLoaded(true)
            }
            image.onerror = () => {
              setError(new Error('Failed to load image'))
            }
            observerRef.current?.unobserve(img)
          }
        })
      },
      { rootMargin: '50px' }
    )

    observerRef.current.observe(img)

    return () => observerRef.current?.disconnect()
  }, [src])

  return { ref: imgRef, src: imageSrc, isLoaded, error }
}

/**
 * 屏幕方向锁定 (用于游戏或视频)
 */
export function useOrientationLock() {
  const [isLocked, setIsLocked] = useState(false)

  const lock = useCallback(async (orientation = 'landscape') => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock(orientation)
        setIsLocked(true)
      }
    } catch (err) {
      console.warn('Unable to lock orientation:', err)
    }
  }, [])

  const unlock = useCallback(async () => {
    try {
      if (screen.orientation && screen.orientation.unlock) {
        await screen.orientation.unlock()
        setIsLocked(false)
      }
    } catch (err) {
      console.warn('Unable to unlock orientation:', err)
    }
  }, [])

  return { isLocked, lock, unlock }
}

export default useViewport
