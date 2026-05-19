/**
 * 性能监控配置 (Performance Configuration)
 * Web Vitals 监控、性能报告和优化配置
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

// ============================================================================
// Web Vitals 监控
// ============================================================================

export function setupWebVitalsReport(callback) {
  const reportOptions = {
    reportAllChanges: false
  }

  // 累积布局偏移
  onCLS((metric) => {
    callback('CLS', metric)
  }, reportOptions)

  // 交互到下一次绘制
  onINP((metric) => {
    callback('INP', metric)
  }, reportOptions)

  // 首次内容绘制
  onFCP((metric) => {
    callback('FCP', metric)
  }, reportOptions)

  // 最大内容绘制
  onLCP((metric) => {
    callback('LCP', metric)
  }, reportOptions)

  // 首字节时间
  onTTFB((metric) => {
    callback('TTFB', metric)
  }, reportOptions)
}

// 性能阈值
export const performanceThresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
}

// 获取性能评级
export function getPerformanceRating(metric, value) {
  const threshold = performanceThresholds[metric]
  if (!threshold) return 'unknown'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// ============================================================================
// 性能报告器
// ============================================================================

class PerformanceReporter {
  constructor(options = {}) {
    this.endpoint = options.endpoint || '/api/performance'
    this.sampleRate = options.sampleRate || 0.1
    this.batchSize = options.batchSize || 10
    this.batch = []
    this.flushInterval = options.flushInterval || 30000

    // 定期发送批处理数据
    setInterval(() => this.flush(), this.flushInterval)
  }

  report(metric, data) {
    // 采样 - 不是所有报告都发送
    if (Math.random() > this.sampleRate) return

    const report = {
      metric,
      value: data.value,
      rating: getPerformanceRating(metric, data.value),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent.slice(0, 100),
      // 导航信息
      navigationEntry: performance.getEntriesByType('navigation')[0]?.toJSON()
    }

    this.batch.push(report)

    if (this.batch.length >= this.batchSize) {
      this.flush()
    }
  }

  async flush() {
    if (this.batch.length === 0) return

    const data = [...this.batch]
    this.batch = []

    try {
      // 使用 sendBeacon 确保数据在页面卸载时也能发送
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(data)], {
          type: 'application/json'
        })
        navigator.sendBeacon(this.endpoint, blob)
      } else {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true
        })
      }
    } catch (e) {
      // 失败时将数据放回队列
      this.batch.unshift(...data)
    }
  }

  // 长任务监控
  observeLongTasks() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // 报告超过 50ms 的长任务
          if (entry.duration > 50) {
            this.report('LongTask', {
              value: entry.duration,
              startTime: entry.startTime
            })
          }
        }
      })

      observer.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      console.warn('Long Task observation not supported')
    }
  }

  // 资源加载监控
  observeResourceLoading() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // 报告慢资源加载
          if (entry.duration > 1000) {
            this.report('SlowResource', {
              value: entry.duration,
              name: entry.name,
              initiatorType: entry.initiatorType
            })
          }
        }
      })

      observer.observe({ entryTypes: ['resource'] })
    } catch (e) {
      console.warn('Resource observation not supported')
    }
  }
}

// ============================================================================
// 性能优化配置
// ============================================================================

export const performanceConfig = {
  // 图片懒加载配置
  imageLazyLoading: {
    enabled: true,
    rootMargin: '50px',
    threshold: 0.01,
    placeholderColor: '#f0e6dc'
  },

  // 动画配置
  animation: {
    // 减少动画偏好检测
    respectPrefersReducedMotion: true,
    // 最大同时进行的动画数
    maxConcurrentAnimations: 5,
    // 默认动画时长
    defaultDuration: 300
  },

  // 批量处理配置
  batching: {
    // DOM 更新批处理
    reactConcurrentFeatures: true,
    // 状态更新防抖
    stateUpdateDebounce: 16
  },

  // 缓存配置
  caching: {
    // 请求缓存时长 (ms)
    requestCacheTTL: 5 * 60 * 1000, // 5分钟
    // 计算结果缓存大小
    memoizationCacheSize: 100
  },

  // 代码分割配置
  codeSplitting: {
    // 路由级代码分割
    routeLevelSplitting: true,
    // 组件级代码分割
    componentLevelSplitting: true,
    // 预加载延迟
    preloadDelay: 100
  },

  // Service Worker 配置
  serviceWorker: {
    enabled: true,
    // 缓存策略
    cacheStrategy: 'stale-while-revalidate',
    // 预缓存资源
    precacheAssets: ['/index.html', '/app.js', '/app.css']
  },

  // 网络配置
  network: {
    // 请求超时
    requestTimeout: 10000,
    // 重试次数
    retryAttempts: 3,
    // 并发请求限制
    maxConcurrentRequests: 6
  }
}

// ============================================================================
// 性能标记和测量工具
// ============================================================================

export function markStart(label) {
  if (performance && performance.mark) {
    performance.mark(`${label}-start`)
  }
}

export function markEnd(label) {
  if (performance && performance.mark) {
    performance.mark(`${label}-end`)
    try {
      performance.measure(label, `${label}-start`, `${label}-end`)
      const entries = performance.getEntriesByName(label)
      if (entries.length > 0) {
        return entries[entries.length - 1].duration
      }
    } catch (e) {
      console.error('Performance measurement failed:', e)
    }
  }
  return null
}

// ============================================================================
// 初始化性能监控
// ============================================================================

export function initPerformanceMonitoring(options = {}) {
  const reporter = new PerformanceReporter(options)

  // 设置 Web Vitals 监控
  setupWebVitalsReport((metric, data) => {
    reporter.report(metric, data)

    // 开发环境控制台输出
    if (process.env.NODE_ENV === 'development') {
      const rating = getPerformanceRating(metric, data.value)
      const emoji = rating === 'good' ? '' : rating === 'needs-improvement' ? '' : ''
      console.log(`${emoji} [${metric}] ${data.value} (${rating})`)
    }
  })

  // 监控长任务
  reporter.observeLongTasks()

  // 监控资源加载
  reporter.observeResourceLoading()

  return reporter
}

// ============================================================================
// 性能优化辅助函数
// ============================================================================

// 延迟加载非关键资源
export function deferNonCriticalResources() {
  requestIdleCallback(() => {
    // 延迟加载非关键图片
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src
      img.removeAttribute('data-src')
    })

    // 延迟加载非关键脚本
    document.querySelectorAll('script[data-src]').forEach(script => {
      const newScript = document.createElement('script')
      newScript.src = script.dataset.src
      newScript.async = true
      script.parentNode.replaceChild(newScript, script)
    })
  })
}

// 预加载关键资源
export function preloadCriticalResources(resources) {
  resources.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'

    if (url.endsWith('.js')) {
      link.as = 'script'
    } else if (url.endsWith('.css')) {
      link.as = 'style'
    } else if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
      link.as = 'image'
    } else if (url.match(/\.(woff2?|ttf|otf)$/)) {
      link.as = 'font'
      link.crossOrigin = 'anonymous'
    }

    link.href = url
    document.head.appendChild(link)
  })
}

// 优化第三方脚本加载
export function loadThirdPartyScript(config) {
  return new Promise((resolve, reject) => {
    const { src, async = true, defer = false, attributes = {} } = config

    const script = document.createElement('script')
    script.src = src
    script.async = async
    script.defer = defer

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value)
    })

    script.onload = resolve
    script.onerror = reject

    document.head.appendChild(script)
  })
}

export default {
  setupWebVitalsReport,
  performanceThresholds,
  getPerformanceRating,
  PerformanceReporter,
  performanceConfig,
  markStart,
  markEnd,
  initPerformanceMonitoring,
  deferNonCriticalResources,
  preloadCriticalResources,
  loadThirdPartyScript
}
