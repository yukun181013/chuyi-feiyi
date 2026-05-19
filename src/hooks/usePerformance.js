import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * 高性能 React Hooks - 性能优化工具库
 */

// ============================================================================
// Debounce & Throttle Hooks
// ============================================================================

/**
 * 防抖 Hook
 * @param callback 回调函数
 * @param delay 延迟时间 (ms)
 * @param deps 依赖数组
 */
export function useDebounce(callback, delay = 300, deps = []) {
  const timeoutRef = useRef(null)
  const callbackRef = useRef(callback)

  // 保持 callback 引用最新
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedFn = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }, [delay, ...deps])

  // 清理函数
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // 立即执行
  const flush = useCallback((...args) => {
    cancel()
    callbackRef.current(...args)
  }, [cancel])

  // 组件卸载时清理
  useEffect(() => cancel, [cancel])

  return { debouncedFn, cancel, flush }
}

/**
 * 节流 Hook
 * @param callback 回调函数
 * @param limit 限制时间 (ms)
 * @param deps 依赖数组
 */
export function useThrottle(callback, limit = 100, deps = []) {
  const lastRun = useRef(0)
  const pending = useRef(false)
  const pendingArgs = useRef(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const throttledFn = useCallback((...args) => {
    const now = Date.now()
    const remaining = limit - (now - lastRun.current)

    pendingArgs.current = args
    pending.current = true

    if (remaining <= 0) {
      // 立即执行
      lastRun.current = now
      pending.current = false
      callbackRef.current(...args)
    } else if (!pending.current) {
      // 设置延迟执行
      setTimeout(() => {
        if (pending.current) {
          lastRun.current = Date.now()
          pending.current = false
          callbackRef.current(...pendingArgs.current)
        }
      }, remaining)
    }
  }, [limit, ...deps])

  const cancel = useCallback(() => {
    pending.current = false
    pendingArgs.current = null
  }, [])

  return { throttledFn, cancel }
}

/**
 * RAF (RequestAnimationFrame) Throttle
 * 使用 requestAnimationFrame 进行节流，适用于滚动和动画
 */
export function useRAFThrottle(callback) {
  const rafId = useRef(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const throttledFn = useCallback((...args) => {
    if (rafId.current) return

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      callbackRef.current(...args)
    })
  }, [])

  const cancel = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }, [])

  useEffect(() => cancel, [cancel])

  return { throttledFn, cancel }
}

// ============================================================================
// Memoization Hooks
// ============================================================================

/**
 * 深度比较 useMemo
 * 使用深度比较而非引用比较
 */
export function useDeepMemo(factory, deps) {
  const ref = useRef({ deps, value: null })

  const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

  if (!isEqual(deps, ref.current.deps)) {
    ref.current = { deps, value: factory() }
  }

  return ref.current.value
}

/**
 * 创建记忆化选择器 Hook
 * 适用于 Redux/Context 选择器优化
 */
export function useMemoizedSelector(selector, deps = []) {
  const lastArgs = useRef(null)
  const lastResult = useRef(null)

  return useMemo(() => {
    const argsEqual = lastArgs.current &&
      deps.length === lastArgs.current.length &&
      deps.every((dep, i) => dep === lastArgs.current[i])

    if (argsEqual) {
      return lastResult.current
    }

    const result = selector(...deps)
    lastArgs.current = deps
    lastResult.current = result
    return result
  }, deps)
}

// ============================================================================
// Data Fetching & Caching Hooks
// ============================================================================

/**
 * 缓存 Hook - 缓存计算结果
 */
export function useCache(maxSize = 100) {
  const cache = useRef(new Map())

  const get = useCallback((key) => {
    return cache.current.get(key)
  }, [])

  const set = useCallback((key, value) => {
    if (cache.current.size >= maxSize) {
      // LRU: 删除最早的条目
      const firstKey = cache.current.keys().next().value
      cache.current.delete(firstKey)
    }
    cache.current.set(key, value)
  }, [maxSize])

  const has = useCallback((key) => {
    return cache.current.has(key)
  }, [])

  const clear = useCallback(() => {
    cache.current.clear()
  }, [])

  return { get, set, has, clear, cache }
}

/**
 * 记忆化异步函数 Hook
 */
export function useMemoizedAsync(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const cache = useRef(new Map())
  const fnRef = useRef(fn)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  const execute = useCallback(async (...args) => {
    const key = JSON.stringify(args)

    // 检查缓存
    if (cache.current.has(key)) {
      setData(cache.current.get(key))
      return cache.current.get(key)
    }

    setLoading(true)
    setError(null)

    try {
      const result = await fnRef.current(...args)
      cache.current.set(key, result)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, deps)

  return { data, loading, error, execute, cache }
}

// ============================================================================
// List Virtualization Hooks
// ============================================================================

/**
 * 虚拟列表 Hook - 高性能长列表
 */
export function useVirtualizedList(itemCount, itemHeight, containerHeight, overscan = 5) {
  const [scrollTop, setScrollTop] = useState(0)

  const virtualItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2
    const endIndex = Math.min(itemCount - 1, startIndex + visibleCount)

    const items = []
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
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

    return items
  }, [scrollTop, itemCount, itemHeight, containerHeight, overscan])

  const totalHeight = itemCount * itemHeight

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  return {
    virtualItems,
    totalHeight,
    handleScroll,
    scrollTop
  }
}

// ============================================================================
// Performance Measurement Hooks
// ============================================================================

/**
 * 性能测量 Hook
 */
export function usePerformanceMeasure(name) {
  const startTime = useRef(performance.now())

  useEffect(() => {
    const endTime = performance.now()
    const duration = endTime - startTime.current
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  }, [name])
}

/**
 * 渲染次数跟踪 Hook
 */
export function useRenderCount(name) {
  const count = useRef(0)
  count.current++

  useEffect(() => {
    console.log(`[Render] ${name} render count: ${count.current}`)
  })

  return count.current
}

/**
 * 为什么渲染 Hook
 */
export function useWhyDidYouUpdate(name, props) {
  const prevProps = useRef()

  useEffect(() => {
    if (prevProps.current) {
      const changedProps = Object.entries(props).reduce((acc, [key, value]) => {
        if (prevProps.current[key] !== value) {
          acc[key] = {
            from: prevProps.current[key],
            to: value
          }
        }
        return acc
      }, {})

      if (Object.keys(changedProps).length > 0) {
        console.log(`[WhyDidYouUpdate] ${name}:`, changedProps)
      }
    }
    prevProps.current = props
  })
}

// ============================================================================
// Intersection & Visibility Hooks
// ============================================================================

/**
 * 延迟加载 Hook
 */
export function useLazyLoad(options = {}) {
  const { threshold = 0, rootMargin = '50px', triggerOnce = true } = options
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || (triggerOnce && isVisible)) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observerRef.current?.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observerRef.current.observe(element)

    return () => observerRef.current?.disconnect()
  }, [threshold, rootMargin, triggerOnce, isVisible])

  return { ref: elementRef, isVisible }
}

/**
 * 页面可见性 Hook
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return isVisible
}

// ============================================================================
// Scroll Optimization Hooks
// ============================================================================

/**
 * 滚动位置 Hook (节流)
 */
export function useScrollPosition(throttleMs = 16) {
  const [scrollY, setScrollY] = useState(0)
  const lastUpdateTime = useRef(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const now = Date.now()
          if (now - lastUpdateTime.current >= throttleMs) {
            setScrollY(window.scrollY)
            lastUpdateTime.current = now
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [throttleMs])

  return scrollY
}

/**
 * 滚动方向 Hook
 */
export function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState('up')
  const lastScrollY = useRef(0)

  const { throttledFn } = useThrottle(() => {
    const currentScrollY = window.scrollY

    if (Math.abs(currentScrollY - lastScrollY.current) < threshold) return

    const newDirection = currentScrollY > lastScrollY.current ? 'down' : 'up'
    setDirection(newDirection)
    lastScrollY.current = currentScrollY
  }, 100)

  useEffect(() => {
    window.addEventListener('scroll', throttledFn, { passive: true })
    return () => window.removeEventListener('scroll', throttledFn)
  }, [throttledFn])

  return direction
}

// ============================================================================
// Network Hooks
// ============================================================================

/**
 * 网络状态 Hook
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionType, setConnectionType] = useState('4g')

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 获取网络类型
    if (navigator.connection) {
      setConnectionType(navigator.connection.effectiveType)
      navigator.connection.addEventListener('change', () => {
        setConnectionType(navigator.connection.effectiveType)
      })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, connectionType }
}

// ============================================================================
// Image Loading Hooks
// ============================================================================

/**
 * 图片懒加载 Hook
 */
export function useImageLoad(src) {
  const [status, setStatus] = useState('loading')
  const [imageSrc, setImageSrc] = useState(null)

  useEffect(() => {
    if (!src) {
      setStatus('error')
      return
    }

    const img = new Image()

    img.onload = () => {
      setImageSrc(src)
      setStatus('loaded')
    }

    img.onerror = () => {
      setStatus('error')
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { status, imageSrc }
}

// ============================================================================
// Form Optimization Hooks
// ============================================================================

/**
 * 表单防抖提交 Hook
 */
export function useDebouncedForm(onSubmit, delay = 500) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { debouncedFn, cancel } = useDebounce(async (values) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }, delay)

  return { submit: debouncedFn, isSubmitting, cancel }
}

// ============================================================================
// Worker Hooks
// ============================================================================

/**
 * Web Worker Hook
 */
export function useWorker(workerFactory) {
  const workerRef = useRef(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    workerRef.current = workerFactory()

    workerRef.current.onmessage = (e) => {
      setResult(e.data)
      setError(null)
    }

    workerRef.current.onerror = (err) => {
      setError(err)
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [workerFactory])

  const postMessage = useCallback((data) => {
    workerRef.current?.postMessage(data)
  }, [])

  return { result, error, postMessage }
}

export default useDebounce
