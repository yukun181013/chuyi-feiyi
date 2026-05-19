/**
 * 内存管理工具 - 防止内存泄漏
 * 统一管理定时器、事件监听、请求等需要清理的资源
 */

// 资源管理器类
class ResourceManager {
  constructor() {
    this.timers = new Set()
    this.intervals = new Set()
    this.eventListeners = new Map()
    this.observers = new Set()
    this.abortControllers = new Set()
    this.callbacks = new Set()
  }

  // ========== 定时器管理 ==========
  setTimeout(callback, delay, ...args) {
    const id = window.setTimeout((...params) => {
      this.timers.delete(id)
      callback(...params)
    }, delay, ...args)
    this.timers.add(id)
    return id
  }

  clearTimeout(id) {
    window.clearTimeout(id)
    this.timers.delete(id)
  }

  setInterval(callback, delay, ...args) {
    const id = window.setInterval(callback, delay, ...args)
    this.intervals.add(id)
    return id
  }

  clearInterval(id) {
    window.clearInterval(id)
    this.intervals.delete(id)
  }

  // ========== 事件监听管理 ==========
  addEventListener(target, type, listener, options) {
    target.addEventListener(type, listener, options)
    const key = `${type}_${listener.toString().slice(0, 50)}`
    if (!this.eventListeners.has(target)) {
      this.eventListeners.set(target, new Map())
    }
    this.eventListeners.get(target).set(key, { type, listener, options })
  }

  removeEventListener(target, type, listener, options) {
    target.removeEventListener(type, listener, options)
    const key = `${type}_${listener.toString().slice(0, 50)}`
    const targetListeners = this.eventListeners.get(target)
    if (targetListeners) {
      targetListeners.delete(key)
      if (targetListeners.size === 0) {
        this.eventListeners.delete(target)
      }
    }
  }

  // ========== IntersectionObserver 管理 ==========
  createObserver(callback, options) {
    const observer = new IntersectionObserver(callback, options)
    this.observers.add(observer)
    return observer
  }

  disconnectObserver(observer) {
    if (observer) {
      observer.disconnect()
      this.observers.delete(observer)
    }
  }

  // ========== AbortController 管理 (用于 fetch 请求) ==========
  createAbortController() {
    const controller = new AbortController()
    this.abortControllers.add(controller)
    return controller
  }

  abortController(controller) {
    if (controller) {
      controller.abort()
      this.abortControllers.delete(controller)
    }
  }

  // ========== 回调引用管理 ==========
  registerCallback(callback) {
    this.callbacks.add(callback)
    return callback
  }

  unregisterCallback(callback) {
    this.callbacks.delete(callback)
  }

  // ========== 清理所有资源 ==========
  dispose() {
    // 清理所有定时器
    this.timers.forEach(id => window.clearTimeout(id))
    this.timers.clear()

    // 清理所有 Interval
    this.intervals.forEach(id => window.clearInterval(id))
    this.intervals.clear()

    // 清理所有事件监听
    this.eventListeners.forEach((listeners, target) => {
      listeners.forEach(({ type, listener, options }) => {
        target.removeEventListener(type, listener, options)
      })
    })
    this.eventListeners.clear()

    // 清理所有 Observer
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()

    // 中止所有请求
    this.abortControllers.forEach(controller => {
      try {
        controller.abort()
      } catch (e) {
        // 忽略已中止的控制器
      }
    })
    this.abortControllers.clear()

    // 清理回调引用
    this.callbacks.clear()
  }
}

// 创建全局资源管理器
export const globalResourceManager = new ResourceManager()

// React Hook: 使用资源管理器
export function useResourceManager() {
  const manager = new ResourceManager()
  
  // 组件卸载时自动清理
  return {
    manager,
    dispose: () => manager.dispose()
  }
}

// 防抖函数 (带资源管理)
export function useDebouncedCallback(callback, delay, deps = []) {
  const timeoutRef = { current: null }

  const debouncedFn = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args)
      timeoutRef.current = null
    }, delay)
  }

  // 立即执行
  const flush = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      callback()
      timeoutRef.current = null
    }
  }

  // 取消
  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  return { debouncedFn, flush, cancel, timeoutRef }
}

// 节流函数 (带资源管理)
export function useThrottledCallback(callback, limit) {
  let inThrottle = false
  let lastFunc = null
  let lastRan = 0

  const throttledFn = (...args) => {
    const now = Date.now()

    if (!lastRan) {
      callback(...args)
      lastRan = now
    } else {
      if (lastFunc) clearTimeout(lastFunc)
      
      if (now - lastRan >= limit) {
        callback(...args)
        lastRan = now
      } else {
        lastFunc = setTimeout(() => {
          callback(...args)
          lastRan = Date.now()
        }, limit - (now - lastRan))
      }
    }
  }

  const cancel = () => {
    if (lastFunc) {
      clearTimeout(lastFunc)
      lastFunc = null
    }
    inThrottle = false
  }

  return { throttledFn, cancel }
}

// RAF (RequestAnimationFrame) 管理
export function useRAFManager() {
  const rafIds = new Set()

  const requestAnimationFrame = (callback) => {
    const id = window.requestAnimationFrame((time) => {
      rafIds.delete(id)
      callback(time)
    })
    rafIds.add(id)
    return id
  }

  const cancelAnimationFrame = (id) => {
    window.cancelAnimationFrame(id)
    rafIds.delete(id)
  }

  const cancelAll = () => {
    rafIds.forEach(id => window.cancelAnimationFrame(id))
    rafIds.clear()
  }

  return { requestAnimationFrame, cancelAnimationFrame, cancelAll, rafIds }
}

// ResizeObserver 管理
export function useResizeObserverManager() {
  const observers = new Set()

  const createObserver = (callback) => {
    const observer = new ResizeObserver(callback)
    observers.add(observer)
    return observer
  }

  const disconnect = (observer) => {
    if (observer) {
      observer.disconnect()
      observers.delete(observer)
    }
  }

  const disconnectAll = () => {
    observers.forEach(observer => observer.disconnect())
    observers.clear()
  }

  return { createObserver, disconnect, disconnectAll }
}

// MutationObserver 管理
export function useMutationObserverManager() {
  const observers = new Set()

  const createObserver = (callback, options) => {
    const observer = new MutationObserver(callback)
    observers.add(observer)
    return observer
  }

  const disconnect = (observer) => {
    if (observer) {
      observer.disconnect()
      observers.delete(observer)
    }
  }

  const disconnectAll = () => {
    observers.forEach(observer => observer.disconnect())
    observers.clear()
  }

  return { createObserver, disconnect, disconnectAll }
}

export default ResourceManager
