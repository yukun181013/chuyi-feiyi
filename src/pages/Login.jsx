/**
 * 登录/注册页面
 */
import { useCallback, useMemo, useState } from 'react'
import { IMG } from './data'

// 验证码生成函数
function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// PasswordInput 组件
function PasswordInput({ id, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className="password-wrapper">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="pw-toggle"
        onClick={() => setShow(v => !v)}
        aria-label={show ? '隐藏密码' : '显示密码'}
      >
        {show ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  )
}

function LoginPage({
  loginMode = 'login',
  setLoginMode,
  loginForm,
  setLoginForm,
  regForm,
  setRegForm,
  captchaCode,
  setCaptchaCode,
  loginErrors,
  setLoginErrors,
  regErrors,
  setRegErrors,
  handleLogin,
  handleRegister
}) {
  const isLogin = loginMode === 'login'

  // 记忆化处理函数
  const refreshCaptcha = useCallback(() => {
    const newCode = generateCaptcha()
    setCaptchaCode(newCode)
    if (isLogin) {
      setLoginForm(prev => ({ ...prev, captcha: '' }))
    } else {
      setRegForm(prev => ({ ...prev, captcha: '' }))
    }
  }, [isLogin, setCaptchaCode, setLoginForm, setRegForm])

  const switchToLogin = useCallback(() => {
    setLoginMode('login')
    setLoginErrors({})
    setRegErrors({})
    refreshCaptcha()
  }, [setLoginMode, setLoginErrors, setRegErrors, refreshCaptcha])

  const switchToRegister = useCallback(() => {
    setLoginMode('register')
    setLoginErrors({})
    setRegErrors({})
    refreshCaptcha()
  }, [setLoginMode, setLoginErrors, setRegErrors, refreshCaptcha])

  const fieldError = useCallback((errors, key) => {
    return errors[key] ? <p className="field-error" role="alert">{errors[key]}</p> : null
  }, [])

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-panel-left" aria-hidden="true">
        <img className="auth-panel-bg" src={IMG.hero1} alt="" />
        <div className="auth-panel-overlay" />
        <div className="auth-panel-artwork">
          <div className="auth-panel-icon">鼓</div>
          <div className="auth-panel-big">梆鼓咚<br/>非遗传承</div>
          <div className="auth-panel-small">传承千年文化 · 守护匠心技艺</div>
          <div className="auth-panel-tags">
            <span className="auth-panel-tag">福建省莆田市</span>
            <span className="auth-panel-tag">国家级非遗</span>
            <span className="auth-panel-tag">传统鼓乐</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-panel-right">
        <section className="auth-card" aria-label={isLogin ? '用户登录' : '用户注册'}>
          <div className="auth-brand">
            <span className="auth-logo-badge">梆鼓咚非遗</span>
            <h2>{isLogin ? '欢迎回来' : '创建账号'}</h2>
            <p>{isLogin ? '登录后享有完整功能体验' : '注册成为非遗文化传播者'}</p>
          </div>

          <div className="auth-switch" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={isLogin ? 'auth-active' : ''}
              onClick={switchToLogin}
            >登录</button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={!isLogin ? 'auth-active' : ''}
              onClick={switchToRegister}
            >注册</button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} noValidate>
              {loginErrors.general && <p className="auth-general-error" role="alert">{loginErrors.general}</p>}
              <div className="auth-field">
                <label htmlFor="login-username">账号</label>
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  placeholder="输入用户名"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(f => ({ ...f, username: e.target.value }))}
                  aria-describedby={loginErrors.username ? 'login-username-err' : undefined}
                />
                {loginErrors.username && <p id="login-username-err" className="field-error" role="alert">{loginErrors.username}</p>}
              </div>
              <div className="auth-field">
                <label htmlFor="login-password">密码</label>
                <PasswordInput
                  id="login-password"
                  autoComplete="current-password"
                  placeholder="输入密码"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                />
                {fieldError(loginErrors, 'password')}
              </div>
              <div className="auth-field">
                <label htmlFor="login-captcha">验证码</label>
                <div className="captcha-row">
                  <input
                    id="login-captcha"
                    type="text"
                    placeholder="输入验证码"
                    value={loginForm.captcha}
                    onChange={(e) => setLoginForm(f => ({ ...f, captcha: e.target.value }))}
                  />
                  <span className="captcha-code" aria-label={`验证码：${captchaCode}`}>{captchaCode}</span>
                  <button type="button" className="captcha-refresh" onClick={refreshCaptcha} aria-label="刷新验证码">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                  </button>
                </div>
                {fieldError(loginErrors, 'captcha')}
              </div>
              <button className="submit-button auth-submit" type="submit">登录</button>
              <p className="auth-hint">演示账号：adlix / 12345678</p>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate>
              <div className="auth-field">
                <label htmlFor="reg-username">用户名</label>
                <input
                  id="reg-username"
                  type="text"
                  autoComplete="username"
                  placeholder="至少 3 个字符"
                  value={regForm.username}
                  onChange={(e) => setRegForm(f => ({ ...f, username: e.target.value }))}
                />
                {fieldError(regErrors, 'username')}
              </div>
              <div className="auth-field">
                <label htmlFor="reg-email">邮箱</label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@mail.com"
                  value={regForm.email}
                  onChange={(e) => setRegForm(f => ({ ...f, email: e.target.value }))}
                />
                {fieldError(regErrors, 'email')}
              </div>
              <div className="auth-field">
                <label htmlFor="reg-password">密码</label>
                <PasswordInput
                  id="reg-password"
                  autoComplete="new-password"
                  placeholder="至少 6 个字符"
                  value={regForm.password}
                  onChange={(e) => setRegForm(f => ({ ...f, password: e.target.value }))}
                />
                {fieldError(regErrors, 'password')}
              </div>
              <div className="auth-field">
                <label htmlFor="reg-confirm">确认密码</label>
                <PasswordInput
                  id="reg-confirm"
                  autoComplete="new-password"
                  placeholder="再次输入密码"
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm(f => ({ ...f, confirmPassword: e.target.value }))}
                />
                {fieldError(regErrors, 'confirmPassword')}
              </div>
              <div className="auth-field">
                <label htmlFor="reg-captcha">验证码</label>
                <div className="captcha-row">
                  <input
                    id="reg-captcha"
                    type="text"
                    placeholder="输入验证码"
                    value={regForm.captcha}
                    onChange={(e) => setRegForm(f => ({ ...f, captcha: e.target.value }))}
                  />
                  <span className="captcha-code" aria-label={`验证码：${captchaCode}`}>{captchaCode}</span>
                  <button type="button" className="captcha-refresh" onClick={refreshCaptcha} aria-label="刷新验证码">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                  </button>
                </div>
                {fieldError(regErrors, 'captcha')}
              </div>
              <button className="submit-button auth-submit" type="submit">立即注册</button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}

export default LoginPage
