import { useState, useEffect, useRef } from 'react'

/**
 * 页面过渡动画组件 - 路由切换时的平滑过渡
 * 支持淡入淡出、滑动、缩放等动画效果
 */
export function PageTransition({
  children,
  pageKey,
  duration = 400,
  effect = 'fade' // fade | slide | scale | slideUp
}) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentChildren, setCurrentChildren] = useState(children)
  const prevKeyRef = useRef(pageKey)
  const isFirstRender = useRef(true)

  const easeOut = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: `opacity ${duration}ms ${easeOut}` },
      exit: { opacity: 0, transition: `opacity ${duration * 0.5}ms ${easeOut}` }
    },
    slide: {
      initial: { opacity: 0, transform: 'translateX(20px)' },
      animate: { opacity: 1, transform: 'translateX(0)', transition: `all ${duration}ms ${easeOut}` },
      exit: { opacity: 0, transform: 'translateX(-10px)', transition: `all ${duration * 0.5}ms ${easeOut}` }
    },
    slideUp: {
      initial: { opacity: 0, transform: 'translateY(20px)' },
      animate: { opacity: 1, transform: 'translateY(0)', transition: `all ${duration}ms ${easeOut}` },
      exit: { opacity: 0, transform: 'translateY(-10px)', transition: `all ${duration * 0.5}ms ${easeOut}` }
    },
    scale: {
      initial: { opacity: 0, transform: 'scale(0.98)' },
      animate: { opacity: 1, transform: 'scale(1)', transition: `all ${duration}ms ${easeOut}` },
      exit: { opacity: 0, transform: 'scale(1.01)', transition: `all ${duration * 0.5}ms ${easeOut}` }
    }
  }

  const currentAnim = animations[effect] || animations.fade

  useEffect(() => {
    // 首次渲染，直接显示
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // 页面切换
    if (pageKey !== prevKeyRef.current) {
      // 先淡出
      setIsVisible(false)
      
      // 等待淡出完成，然后切换内容并淡入
      const timer = setTimeout(() => {
        setCurrentChildren(children)
        prevKeyRef.current = pageKey
        setIsVisible(true)
      }, duration * 0.5)

      return () => clearTimeout(timer)
    } else {
      // 同一页面内容更新，直接更新
      setCurrentChildren(children)
    }
  }, [pageKey, children, duration])

  const style = isVisible 
    ? { ...currentAnim.animate }
    : { ...currentAnim.exit }

  return (
    <div style={style}>
      {currentChildren}
    </div>
  )
}

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
    const element = ref.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
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

/**
 * 交错动画容器 - 子元素依次显示
 */
export function StaggerContainer({
  children,
  staggerDelay = 100,
  baseDelay = 0,
  direction = 'up'
}) {
  return (
    <>
      {Array.isArray(children) ? children.map((child, index) => (
        <ScrollReveal
          key={index}
          direction={direction}
          delay={baseDelay + (index * staggerDelay)}
        >
          {child}
        </ScrollReveal>
      )) : (
        <ScrollReveal direction={direction} delay={baseDelay}>
          {children}
        </ScrollReveal>
      )}
    </>
  )
}

/**
 * 装饰性浮动动画
 */
export function FloatAnimation({ children, duration = 3 }) {
  return (
    <div
      style={{
        animation: `float ${duration}s ease-in-out infinite`
      }}
    >
      {children}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

/**
 * 脉冲动画 - 用于强调元素
 */
export function PulseAnimation({ children, scale = 1.05, duration = 2 }) {
  return (
    <div
      style={{
        animation: `pulseScale ${duration}s ease-in-out infinite`
      }}
    >
      {children}
      <style>{`
        @keyframes pulseScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(${scale}); }
        }
      `}</style>
    </div>
  )
}

/**
 * 光晕效果装饰
 */
export function GlowEffect({ children, color = '#C0392B', intensity = 0.5 }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-10px',
          background: `radial-gradient(circle, ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          animation: 'glowPulse 3s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
      {children}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

// 导出默认
export default PageTransition
