/**
 * 安全的本地存储工具
 * 提供带错误处理的 localStorage 操作
 * 注意：密码等敏感信息不应存储在 localStorage 中
 */

const STORAGE_KEYS = {
  USERS: 'chuyi_users',
  AUTH_USER: 'chuyi_auth_user',
  CART: 'chuyi_cart',
  PREFERENCES: 'chuyi_prefs'
}

/**
 * 安全地获取 localStorage 数据
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {*} 解析后的数据或默认值
 */
export function safeGetItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    return JSON.parse(item)
  } catch (error) {
    console.warn(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

/**
 * 安全地设置 localStorage 数据
 * @param {string} key - 存储键
 * @param {*} value - 要存储的数据
 * @returns {boolean} 是否成功
 */
export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Error writing ${key} to localStorage:`, error)
    // 处理存储配额 exceeded
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded')
    }
    return false
  }
}

/**
 * 安全地移除 localStorage 数据
 * @param {string} key - 存储键
 */
export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing ${key} from localStorage:`, error)
  }
}

/**
 * 获取存储使用情况
 * @returns {Object} 使用情况统计
 */
export function getStorageUsage() {
  try {
    let total = 0
    let items = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = localStorage[key].length * 2 // 每个字符 2 字节
        total += size
        items++
      }
    }
    return {
      used: (total / 1024 / 1024).toFixed(2) + 'MB',
      items,
      available: '5-10MB (browser dependent)'
    }
  } catch (error) {
    return { error: 'Cannot calculate storage usage' }
  }
}

// 导出存储键常量
export { STORAGE_KEYS }

// 默认导出
export default {
  get: safeGetItem,
  set: safeSetItem,
  remove: safeRemoveItem,
  usage: getStorageUsage,
  keys: STORAGE_KEYS
}
