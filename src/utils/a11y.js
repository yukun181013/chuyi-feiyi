/**
 * 可访问性工具 (Accessibility Utils)
 * 提供键盘导航、焦点管理、屏幕阅读器支持等功能
 */

// 焦点陷阱 - 用于模态框和对话框
export function trapFocus(element, options = {}) {
  const { onEscape, onClose } = options

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  function handleTabKey(e) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable?.focus()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable?.focus()
      }
    }
  }

  function handleKeyDown(e) {
    handleTabKey(e)
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault()
      onEscape()
    }
  }

  element.addEventListener('keydown', handleKeyDown)

  // 自动聚焦第一个元素
  firstFocusable?.focus()

  return {
    destroy() {
      element.removeEventListener('keydown', handleKeyDown)
    },
    focusFirst() {
      firstFocusable?.focus()
    }
  }
}

// 管理页面标题
export function setPageTitle(title, siteName = '梆鼓咚非遗文化门户') {
  document.title = title ? `${title} | ${siteName}` : siteName
}

// 宣布内容给屏幕阅读器
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// 跳转到主要内容链接
export function skipToContent(mainContentId = 'main-content') {
  const skipLink = document.createElement('a')
  skipLink.href = `#${mainContentId}`
  skipLink.className = 'skip-link'
  skipLink.textContent = '跳转到主要内容'

  document.body.insertBefore(skipLink, document.body.firstChild)

  // 点击后隐藏skip link
  skipLink.addEventListener('click', (e) => {
    const target = document.getElementById(mainContentId)
    if (target) {
      e.preventDefault()
      target.tabIndex = -1
      target.focus()
      target.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// 检查元素是否在视口内 (用于焦点管理)
export function isElementInViewport(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// 获取焦点元素
export function getFocusableElements(container = document) {
  return container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
}

// 保存和恢复焦点
export function createFocusManager() {
  let lastFocusedElement = null

  return {
    save() {
      lastFocusedElement = document.activeElement
    },
    restore() {
      if (lastFocusedElement && lastFocusedElement.focus) {
        lastFocusedElement.focus()
      }
    },
    clear() {
      lastFocusedElement = null
    }
  }
}

// 键盘快捷键管理
export function createKeyboardShortcuts() {
  const shortcuts = new Map()

  function handleKeyDown(e) {
    const key = `${e.ctrlKey || e.metaKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`

    if (shortcuts.has(key)) {
      e.preventDefault()
      shortcuts.get(key).call(null, e)
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  return {
    register(key, callback) {
      shortcuts.set(key, callback)
    },
    unregister(key) {
      shortcuts.delete(key)
    },
    destroy() {
      document.removeEventListener('keydown', handleKeyDown)
      shortcuts.clear()
    }
  }
}

// ARIA 属性帮助函数
export const aria = {
  // 展开/收起状态
  expanded(isExpanded) {
    return { 'aria-expanded': isExpanded }
  },

  // 选中状态
  selected(isSelected) {
    return { 'aria-selected': isSelected }
  },

  // 隐藏/显示状态
  hidden(isHidden) {
    return { 'aria-hidden': isHidden }
  },

  // 禁用状态
  disabled(isDisabled) {
    return { 'aria-disabled': isDisabled }
  },

  // 标签
  label(text) {
    return { 'aria-label': text }
  },

  // 由...描述
  describedBy(id) {
    return { 'aria-describedby': id }
  },

  // 由...标记
  labelledBy(id) {
    return { 'aria-labelledby': id }
  },

  // 当前页面
  current(value = 'page') {
    return { 'aria-current': value }
  },

  // 实时区域
  live(priority = 'polite') {
    return { 'aria-live': priority }
  },

  // 原子性
  atomic(isAtomic = true) {
    return { 'aria-atomic': isAtomic }
  },

  // 必要字段
  required(isRequired = true) {
    return { 'aria-required': isRequired }
  },

  // 无效状态
  invalid(isInvalid = true) {
    return { 'aria-invalid': isInvalid }
  },

  // 忙碌状态
  busy(isBusy = true) {
    return { 'aria-busy': isBusy }
  },

  // 模态
  modal(isModal = true) {
    return { 'aria-modal': isModal }
  },

  //  pressed 状态 (用于开关按钮)
  pressed(isPressed) {
    return { 'aria-pressed': isPressed }
  }
}

// 焦点可见性检测 - 只在键盘导航时显示焦点环
export function setupFocusVisible() {
  document.body.classList.add('js-focus-visible')

  document.addEventListener('mousedown', () => {
    document.body.classList.add('using-mouse')
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.remove('using-mouse')
    }
  })
}

// 颜色对比度检查 (WCAG 2.1)
export function getContrastRatio(foreground, background) {
  const luminance = (color) => {
    const rgb = color.match(/#?(\w{2})(\w{2})(\w{2})/)
    if (!rgb) return 1

    const [r, g, b] = rgb.slice(1).map(c => {
      const v = parseInt(c, 16) / 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const l1 = luminance(foreground) + 0.05
  const l2 = luminance(background) + 0.05

  return l1 > l2 ? l1 / l2 : l2 / l1
}

// 检查是否符合 WCAG AA 标准
export function meetsWCAGAA(ratio, isLargeText = false) {
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

// 检查是否符合 WCAG AAA 标准
export function meetsWCAGAAA(ratio, isLargeText = false) {
  return isLargeText ? ratio >= 4.5 : ratio >= 7
}

export default {
  trapFocus,
  setPageTitle,
  announceToScreenReader,
  skipToContent,
  isElementInViewport,
  getFocusableElements,
  createFocusManager,
  createKeyboardShortcuts,
  aria,
  setupFocusVisible,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA
}
