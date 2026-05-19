import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// 清除左上角 Vite 错误覆盖层 / 浏览器扩展注入的标记
function removeOverlayElements() {
  const selectors = [
    'vite-error-overlay',
    '[vite-error-overlay]',
    '.vite-error-overlay',
    '.vite-overlay',
    '#vite-error-overlay',
    '.error-overlay',
  ]
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => el.remove())
  })
  // 兜底：移除 body 下左上角固定定位的可疑元素
  document.querySelectorAll('body > div').forEach((el) => {
    const style = el.getAttribute('style') || ''
    const isFixed = style.includes('position: fixed') || getComputedStyle(el).position === 'fixed'
    const isTopLeft =
      (style.includes('top: 0') || style.includes('top:0')) &&
      (style.includes('left: 0') || style.includes('left:0'))
    if (isFixed && isTopLeft && el.id !== 'root') {
      el.remove()
    }
  })
}
removeOverlayElements()
setInterval(removeOverlayElements, 2000)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
