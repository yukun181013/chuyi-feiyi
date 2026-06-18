import { useState, useEffect, useRef } from 'react'

/**
 * 滚动显示动画组件 - 元素进入视口时的显示动画
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.1
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    // 已经动画过就不再创建观察器，避免动画完成后留下一个永不断开的 observer
    if (hasAnimated) return
    const element = ref.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setHasAnimated(true)
          observerRef.current?.unobserve(element)
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    )

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [hasAnimated, threshold])

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(40px)'
      case 'down': return 'translateY(-40px)'
      case 'left': return 'translateX(40px)'
      case 'right': return 'translateX(-40px)'
      case 'scale': return 'scale(0.9)'
      default: return 'translateY(40px)'
    }
  }

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0) scale(1)' : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms,
                 transform ${duration}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
    willChange: 'opacity, transform'
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

export default ScrollReveal
