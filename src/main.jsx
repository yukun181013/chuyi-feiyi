import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// 清除 Vite 错误覆盖层（只移除明确的 overlay 元素，避免误删验证码/支付弹窗/扩展等合法 UI）
function removeOverlayElements() {
  const selectors = [
    'vite-error-overlay',
    '[vite-error-overlay]',
    '.vite-error-overlay',
    '.vite-overlay',
    '#vite-error-overlay',
  ]
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => el.remove())
  })
}
removeOverlayElements()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
