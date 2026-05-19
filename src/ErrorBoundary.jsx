import { Component } from 'react'

/**
 * 错误边界组件 - 捕获子组件渲染错误，防止整个应用崩溃
 * 提供优雅的错误提示和恢复机制
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  // 捕获错误并更新状态
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  // 记录错误详情
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    
    // 生产环境可以发送错误日志到服务器
    if (import.meta.env.PROD) {
      console.error('应用错误已捕获:', error, errorInfo)
      // 这里可以接入 Sentry、阿里云日志等服务
    }
  }

  // 重试恢复
  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
    // 可选：刷新页面以确保状态 clean
    // window.location.reload()
  }

  // 返回首页
  handleGoHome = () => {
    window.location.hash = '#/home'
    this.handleRetry()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'linear-gradient(135deg, #fdf5ee 0%, #f8ede3 100%)',
            fontFamily: "'Ma Shan Zheng', 'STKaiti', 'KaiTi', cursive"
          }}
        >
          <div 
            style={{
              maxWidth: '520px',
              width: '100%',
              textAlign: 'center',
              background: '#fff',
              borderRadius: '16px',
              padding: '48px 36px',
              boxShadow: '0 20px 60px rgba(192, 57, 43, 0.15)',
              border: '1px solid rgba(192, 57, 43, 0.1)'
            }}
          >
            {/* 错误图标 */}
            <div 
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C0392B 0%, #922B21 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              ⚠️
            </div>

            <h1 
              style={{
                fontSize: '28px',
                color: '#2c1810',
                marginBottom: '16px',
                fontWeight: '600'
              }}
            >
              页面出现了一些问题
            </h1>

            <p 
              style={{
                fontSize: '16px',
                color: '#7a5a50',
                lineHeight: '1.8',
                marginBottom: '32px'
              }}
            >
              抱歉，非遗文化的传承之路遇到了一点小阻碍。
              <br />
              我们的工匠正在紧急修复中...
            </p>

            {/* 错误详情（开发模式显示） */}
            {import.meta.env.DEV && this.state.error && (
              <div 
                style={{
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '28px',
                  textAlign: 'left',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#c0392b',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}
              >
                <strong>错误信息:</strong>
                <pre style={{ margin: '8px 0', whiteSpace: 'pre-wrap' }}>
                  {this.state.error?.toString()}
                </pre>
                {this.state.errorInfo && (
                  <>
                    <strong>组件栈:</strong>
                    <pre style={{ margin: '8px 0', whiteSpace: 'pre-wrap' }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #C0392B 0%, #922B21 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(192, 57, 43, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(192, 57, 43, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(192, 57, 43, 0.3)'
                }}
              >
                重新尝试
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  color: '#C0392B',
                  background: 'transparent',
                  border: '2px solid #C0392B',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#C0392B'
                  e.target.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.color = '#C0392B'
                }}
              >
                返回首页
              </button>
            </div>

            {/* 装饰元素 */}
            <div 
              style={{
                marginTop: '36px',
                paddingTop: '24px',
                borderTop: '1px dashed rgba(192, 57, 43, 0.2)',
                fontSize: '12px',
                color: '#999'
              }}
            >
              梆鼓咚非遗文化传承平台 · 守护千年匠心
            </div>
          </div>

          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.05); opacity: 0.9; }
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
