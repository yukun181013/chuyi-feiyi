import { useEffect, useRef, useId } from 'react'
import { announceToScreenReader, trapFocus, aria } from '../utils/a11y.js'

/**
 * 可访问按钮组件
 * 确保所有按钮都有适当的 ARIA 属性和键盘支持
 */
export function AccessibleButton({
  children,
  onClick,
  onKeyDown,
  disabled = false,
  loading = false,
  pressed,
  expanded,
  hasPopup,
  controls,
  describedBy,
  labelledBy,
  ...props
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled && !loading) {
        onClick?.(e)
      }
    }
    onKeyDown?.(e)
  }

  const ariaProps = {
    ...props,
    ...aria.disabled(disabled || loading),
    ...(pressed !== undefined && aria.pressed(pressed)),
    ...(expanded !== undefined && aria.expanded(expanded)),
    ...(hasPopup && { 'aria-haspopup': hasPopup }),
    ...(controls && { 'aria-controls': controls }),
    ...(describedBy && aria.describedBy(describedBy)),
    ...(labelledBy && aria.labelledBy(labelledBy)),
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      {...ariaProps}
    >
      {loading && (
        <span className="sr-only">正在加载...</span>
      )}
      <span aria-hidden={loading}>
        {children}
      </span>
    </button>
  )
}

/**
 * 可访问模态框组件
 * 管理焦点陷阱和 aria 属性
 */
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
}) {
  const modalRef = useRef(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    // 陷阱焦点
    const trap = trapFocus(modalRef.current, {
      onEscape: onClose
    })

    // 阻止背景滚动
    const originalOverflow = document.body.style.overflow
    const originalPadding = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`

    // 宣布模态框打开
    announceToScreenReader(`${title} 模态框已打开`, 'polite')

    return () => {
      trap.destroy()
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPadding
    }
  }, [isOpen, onClose, title])

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="modal-overlay"
        onClick={onClose}
        role="presentation"
      />

      {/* 模态框 */}
      <div
        ref={modalRef}
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        {...aria.label(title)}
      >
        <div className="modal-header">
          <h2 id={titleId} className="modal-title">
            {title}
          </h2>
          {showCloseButton && (
            <AccessibleButton
              onClick={onClose}
              aria-label="关闭模态框"
              className="modal-close-btn"
            >
              ✕
            </AccessibleButton>
          )}
        </div>

        {description && (
          <p id={descId} className="modal-description">
            {description}
          </p>
        )}

        <div className="modal-content">
          {children}
        </div>
      </div>
    </>
  )
}

/**
 * 可访问开关组件
 */
export function AccessibleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) {
  const id = useId()
  const switchId = `${id}-switch`
  const labelId = `${id}-label`
  const descId = description ? `${id}-desc` : undefined

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled) {
        onChange(!checked)
      }
    }
  }

  return (
    <div className="accessible-switch">
      <span id={labelId} className="switch-label">
        {label}
      </span>

      {description && (
        <span id={descId} className="switch-description">
          {description}
        </span>
      )}

      <span
        id={switchId}
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descId}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={`switch-control ${checked ? 'switch-on' : 'switch-off'} ${disabled ? 'switch-disabled' : ''}`}
      >
        <span className="switch-thumb" aria-hidden="true" />
      </span>

      <span className="sr-only" aria-live="polite">
        {checked ? '已开启' : '已关闭'}
      </span>
    </div>
  )
}

/**
 * 实时区域 - 用于向屏幕阅读器宣布动态内容
 */
export function LiveRegion({
  message,
  priority = 'polite',
  assertive = false,
}) {
  const regionId = useId()

  useEffect(() => {
    if (message) {
      announceToScreenReader(message, assertive ? 'assertive' : priority)
    }
  }, [message, priority, assertive])

  return (
    <div
      id={regionId}
      role="status"
      aria-live={assertive ? 'assertive' : priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

/**
 * 面包屑导航组件
 */
export function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null

  return (
    <nav aria-label="面包屑导航">
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="breadcrumb-item">
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
              {!isLast && (
                <span aria-hidden="true" className="breadcrumb-separator">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * 进度条组件
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  description,
  showPercentage = true,
}) {
  const percentage = Math.round((value / max) * 100)
  const barId = useId()
  const labelId = `${barId}-label`
  const descId = description ? `${barId}-desc` : undefined

  return (
    <div className="progress-wrapper">
      {(label || showPercentage) && (
        <div className="progress-header">
          {label && (
            <span id={labelId} className="progress-label">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="progress-percentage">
              {percentage}%
            </span>
          )}
        </div>
      )}

      {description && (
        <span id={descId} className="progress-description">
          {description}
        </span>
      )}

      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={descId}
        {...aria.label(label || '进度')}
      >
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/**
 * 加载状态组件
 */
export function AccessibleLoading({
  message = '正在加载...',
  description,
  size = 'medium',
}) {
  const sizeClass = `loading-${size}`

  return (
    <div className={`accessible-loading ${sizeClass}`} role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true">
        <div className="spinner-ring" />
      </div>
      <div className="loading-text">
        <p className="loading-message">{message}</p>
        {description && (
          <p className="loading-description">{description}</p>
        )}
      </div>
    </div>
  )
}

/**
 * 错误提示组件
 */
export function AccessibleError({
  title,
  message,
  onRetry,
  onDismiss,
}) {
  const errorId = useId()

  return (
    <div
      className="accessible-error"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="error-icon" aria-hidden="true">
        ⚠️
      </div>

      <div className="error-content">
        {title && (
          <h3 id={`${errorId}-title`} className="error-title">
            {title}
          </h3>
        )}

        <p id={`${errorId}-message`} className="error-message">
          {message}
        </p>
      </div>

      <div className="error-actions">
        {onRetry && (
          <AccessibleButton onClick={onRetry}>
            重试
          </AccessibleButton>
        )}
        {onDismiss && (
          <AccessibleButton onClick={onDismiss}>
            关闭
          </AccessibleButton>
        )}
      </div>
    </div>
  )
}

export default AccessibleButton
