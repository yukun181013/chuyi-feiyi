/**
 * 性能缓存系统 (Performance Cache System)
 * 提供数据缓存、请求缓存和计算缓存
 */

// ============================================================================
// LRU Cache 实现
// ============================================================================

export class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize
    this.cache = new Map()
    this.accessOrder = []
  }

  get(key) {
    if (!this.cache.has(key)) return undefined

    // 更新访问顺序
    this._updateAccessOrder(key)
    return this.cache.get(key)
  }

  set(key, value, ttl = null) {
    // 如果缓存满了，删除最久未使用的
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldestKey = this.accessOrder.shift()
      this.cache.delete(oldestKey)
    }

    const item = {
      value,
      expires: ttl ? Date.now() + ttl : null
    }

    this.cache.set(key, item)
    this._updateAccessOrder(key)
  }

  has(key) {
    if (!this.cache.has(key)) return false

    const item = this.cache.get(key)
    if (item.expires && Date.now() > item.expires) {
      this.delete(key)
      return false
    }

    return true
  }

  delete(key) {
    this.cache.delete(key)
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }

  clear() {
    this.cache.clear()
    this.accessOrder = []
  }

  size() {
    return this.cache.size
  }

  _updateAccessOrder(key) {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
    this.accessOrder.push(key)
  }

  // 清理过期项
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (item.expires && now > item.expires) {
        this.delete(key)
      }
    }
  }
}

// ============================================================================
// Request Cache - 请求结果缓存
// ============================================================================

export class RequestCache {
  constructor(options = {}) {
    this.cache = new LRUCache(options.maxSize || 50)
    this.pendingRequests = new Map()
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000 // 5分钟
  }

  async fetch(key, fetcher, options = {}) {
    const { ttl = this.defaultTTL, forceRefresh = false } = options

    // 如果有正在进行的请求，返回该 Promise
    if (this.pendingRequests.has(key) && !forceRefresh) {
      return this.pendingRequests.get(key)
    }

    // 检查缓存
    if (!forceRefresh && this.cache.has(key)) {
      const cached = this.cache.get(key)
      if (!cached.expires || Date.now() < cached.expires) {
        return cached.value
      }
    }

    // 执行请求
    const promise = fetcher().then(
      (data) => {
        this.cache.set(key, { value: data, expires: Date.now() + ttl }, ttl)
        this.pendingRequests.delete(key)
        return data
      },
      (error) => {
        this.pendingRequests.delete(key)
        throw error
      }
    )

    this.pendingRequests.set(key, promise)
    return promise
  }

  invalidate(key) {
    this.cache.delete(key)
    this.pendingRequests.delete(key)
  }

  invalidatePattern(pattern) {
    const regex = new RegExp(pattern)
    for (const key of this.cache.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  clear() {
    this.cache.clear()
    this.pendingRequests.clear()
  }
}

// ============================================================================
// Memo Cache - 函数计算结果缓存
// ============================================================================

export function memoize(fn, options = {}) {
  const cache = new LRUCache(options.maxSize || 100)
  const keyGenerator = options.keyGenerator || ((...args) => JSON.stringify(args))

  const memoizedFn = function(...args) {
    const key = keyGenerator(...args)

    if (cache.has(key)) {
      return cache.get(key).value
    }

    const result = fn.apply(this, args)
    cache.set(key, { value: result }, options.ttl)
    return result
  }

  memoizedFn.cache = cache
  memoizedFn.clear = () => cache.clear()

  return memoizedFn
}

// ============================================================================
// 异步函数记忆化
// ============================================================================

export function memoizeAsync(fn, options = {}) {
  const cache = new LRUCache(options.maxSize || 50)
  const keyGenerator = options.keyGenerator || ((...args) => JSON.stringify(args))

  const memoizedFn = async function(...args) {
    const key = keyGenerator(...args)

    if (cache.has(key)) {
      return cache.get(key).value
    }

    const result = await fn.apply(this, args)
    cache.set(key, { value: result }, options.ttl)
    return result
  }

  memoizedFn.cache = cache
  memoizedFn.clear = () => cache.clear()

  return memoizedFn
}

// ============================================================================
// Session Storage Cache
// ============================================================================

export class SessionCache {
  constructor(prefix = 'app_cache_') {
    this.prefix = prefix
  }

  _getKey(key) {
    return this.prefix + key
  }

  get(key) {
    try {
      const item = sessionStorage.getItem(this._getKey(key))
      if (!item) return null

      const { value, expires } = JSON.parse(item)
      if (expires && Date.now() > expires) {
        this.delete(key)
        return null
      }

      return value
    } catch (e) {
      return null
    }
  }

  set(key, value, ttl = null) {
    try {
      const item = {
        value,
        expires: ttl ? Date.now() + ttl : null
      }
      sessionStorage.setItem(this._getKey(key), JSON.stringify(item))
    } catch (e) {
      // sessionStorage 满了，清理旧的
      this._cleanup()
      try {
        sessionStorage.setItem(this._getKey(key), JSON.stringify({
          value,
          expires: ttl ? Date.now() + ttl : null
        }))
      } catch (e2) {
        console.warn('SessionStorage is full')
      }
    }
  }

  delete(key) {
    sessionStorage.removeItem(this._getKey(key))
  }

  clear() {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith(this.prefix)) {
        sessionStorage.removeItem(key)
      }
    }
  }

  _cleanup() {
    const now = Date.now()
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(sessionStorage.getItem(key))
          if (item.expires && now > item.expires) {
            sessionStorage.removeItem(key)
          }
        } catch (e) {
          sessionStorage.removeItem(key)
        }
      }
    }
  }
}

// ============================================================================
// IndexedDB Cache (大数据缓存)
// ============================================================================

export class IndexedDBCache {
  constructor(dbName = 'AppCache', version = 1) {
    this.dbName = dbName
    this.version = version
    this.db = null
  }

  async init() {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains('cache')) {
          const store = db.createObjectStore('cache', { keyPath: 'key' })
          store.createIndex('expires', 'expires', { unique: false })
        }
      }
    })
  }

  async get(key) {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result
        if (!result) {
          resolve(null)
          return
        }

        if (result.expires && Date.now() > result.expires) {
          this.delete(key)
          resolve(null)
          return
        }

        resolve(result.value)
      }

      request.onerror = () => reject(request.error)
    })
  }

  async set(key, value, ttl = null) {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')

      const item = {
        key,
        value,
        expires: ttl ? Date.now() + ttl : null,
        created: Date.now()
      }

      const request = store.put(item)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async delete(key) {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clear() {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async cleanup() {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const index = store.index('expires')
      const now = Date.now()

      const range = IDBKeyRange.upperBound(now)
      const request = index.openCursor(range)

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          store.delete(cursor.primaryKey)
          cursor.continue()
        } else {
          resolve()
        }
      }

      request.onerror = () => reject(request.error)
    })
  }
}

// ============================================================================
// 创建单例实例
// ============================================================================

export const globalCache = new LRUCache(200)
export const requestCache = new RequestCache({ maxSize: 100, defaultTTL: 5 * 60 * 1000 })
export const sessionCache = new SessionCache()

// ============================================================================
// 缓存装饰器
// ============================================================================

export function withCache(fn, options = {}) {
  const cache = new LRUCache(options.maxSize || 50)

  return function cachedFn(...args) {
    const key = options.keyGenerator?.(...args) || JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key).value
    }

    const result = fn(...args)
    cache.set(key, { value: result }, options.ttl)
    return result
  }
}

export default {
  LRUCache,
  RequestCache,
  SessionCache,
  IndexedDBCache,
  memoize,
  memoizeAsync,
  globalCache,
  requestCache,
  sessionCache,
  withCache
}
