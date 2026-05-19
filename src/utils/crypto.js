/**
 * 前端密码安全工具
 * 注意：前端加密只是第一道防线，真正的安全需要后端支持
 */

/**
 * 使用 SHA-256 对密码进行哈希
 * @param {string} password - 明文密码
 * @param {string} salt - 盐值
 * @returns {Promise<string>} 哈希后的密码
 */
export async function hashPassword(password, salt = '') {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch (error) {
    console.warn('Password hashing failed, falling back to base64:', error)
    // Fallback for environments without crypto.subtle
    return btoa(password + salt)
  }
}

/**
 * 生成随机盐值
 * @param {number} length - 盐值长度
 * @returns {string} 随机盐值
 */
export function generateSalt(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let salt = ''
  // 使用 crypto.getRandomValues 如果可用
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const values = new Uint32Array(length)
    crypto.getRandomValues(values)
    for (let i = 0; i < length; i++) {
      salt += chars[values[i] % chars.length]
    }
  } else {
    // Fallback
    for (let i = 0; i < length; i++) {
      salt += chars[Math.floor(Math.random() * chars.length)]
    }
  }
  return salt
}

/**
 * 验证密码
 * @param {string} inputPassword - 用户输入的密码
 * @param {string} storedHash - 存储的哈希值
 * @param {string} salt - 盐值
 * @returns {Promise<boolean>} 是否匹配
 */
export async function verifyPassword(inputPassword, storedHash, salt = '') {
  const inputHash = await hashPassword(inputPassword, salt)
  return inputHash === storedHash
}

/**
 * 密码强度检查
 * @param {string} password - 密码
 * @returns {Object} 强度评估结果
 */
export function checkPasswordStrength(password) {
  const result = {
    score: 0,
    isValid: false,
    feedback: []
  }

  if (!password || password.length < 6) {
    result.feedback.push('密码至少6个字符')
    return result
  }

  result.score += 1 // 长度及格

  if (password.length >= 10) result.score += 1
  if (/[a-z]/.test(password)) result.score += 1
  if (/[A-Z]/.test(password)) result.score += 1
  if (/[0-9]/.test(password)) result.score += 1
  if (/[^a-zA-Z0-9]/.test(password)) result.score += 1

  result.isValid = result.score >= 3

  if (result.score < 3) {
    result.feedback.push('建议包含大小写字母、数字和特殊字符')
  }

  return result
}

/**
 * 安全地存储用户（密码哈希化）
 * @param {Array} users - 用户列表
 * @returns {Promise<Array>} 处理后的用户列表（不含明文密码）
 */
export async function secureUserData(users) {
  const securedUsers = []
  for (const user of users) {
    const { password, ...userWithoutPassword } = user
    if (password) {
      const salt = generateSalt()
      const hash = await hashPassword(password, salt)
      securedUsers.push({
        ...userWithoutPassword,
        passwordHash: hash,
        salt,
        hasPassword: true
      })
    } else {
      securedUsers.push(userWithoutPassword)
    }
  }
  return securedUsers
}

export default {
  hashPassword,
  generateSalt,
  verifyPassword,
  checkPasswordStrength,
  secureUserData
}
