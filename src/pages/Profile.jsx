/**
 * 个人中心页面
 */
import { useCallback, useState, useRef } from 'react'

// 生成头像URL
function avatarUrl(name) {
  const colors = ['9f3b2f', '8B4513', '6B3A2A', 'A0522D', '7B2D26', '5C3317', '804020', '6A3028']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const bg = colors[Math.abs(hash) % colors.length]
  const fontSize = name.length <= 2 ? 40 : name.length === 3 ? 32 : 26
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="%23${bg}"/><text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="white" font-size="${fontSize}" font-family="'Ma Shan Zheng','STKaiti','KaiTi',sans-serif">${name}</text></svg>`
  return `data:image/svg+xml,${svg}`
}

// SVG 图标组件
const EyeIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {open ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    )}
  </svg>
)

// PasswordInput 组件
function PasswordInput({ id, value, onChange, placeholder, autoComplete, name, disabled = false, readOnly = false }) {
  const [show, setShow] = useState(false)
  const inputRef = useRef(null)

  const handleToggle = () => {
    setShow(v => !v)
    // 保持焦点在输入框
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <div className="password-wrapper">
      <input
        ref={inputRef}
        id={id}
        name={name || id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={id ? `${id}-hint` : undefined}
      />
      <button
        type="button"
        className="pw-toggle"
        onClick={handleToggle}
        disabled={disabled}
        aria-label={show ? '隐藏密码' : '显示密码'}
        aria-pressed={show}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  )
}

function ProfilePage({
  user,
  profileTab,
  setProfileTab,
  profileForm,
  setProfileForm,
  pwdForm,
  setPwdForm,
  pwdErrors,
  setPwdErrors,
  handleProfileSave,
  handlePasswordChange,
  handleLogout,
  setToast,
  avatarPreview,
  setAvatarPreview
}) {
  const [avatarLoading, setAvatarLoading] = useState(false)

  // 处理头像上传
  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setToast?.('请选择图片文件')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast?.('图片不能超过 2MB')
      return
    }

    setAvatarLoading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result)
      setAvatarLoading(false)
    }
    reader.onerror = () => {
      setToast?.('图片读取失败，请重试')
      setAvatarLoading(false)
    }
    reader.readAsDataURL(file)
  }, [setToast, setAvatarPreview])

  const resetAvatar = useCallback(() => {
    setAvatarPreview(user?.avatar || null)
  }, [user, setAvatarPreview])

  // 处理个人设置表单
  const handleNicknameChange = useCallback((e) => {
    setProfileForm(prev => ({ ...prev, nickname: e.target.value }))
  }, [setProfileForm])

  const handleBioChange = useCallback((e) => {
    setProfileForm(prev => ({ ...prev, bio: e.target.value }))
  }, [setProfileForm])

  // 处理密码表单
  const handleCurrentPwdChange = useCallback((e) => {
    setPwdForm(prev => ({ ...prev, current: e.target.value }))
  }, [setPwdForm])

  const handleNewPwdChange = useCallback((e) => {
    setPwdForm(prev => ({ ...prev, next: e.target.value }))
  }, [setPwdForm])

  const handleConfirmPwdChange = useCallback((e) => {
    setPwdForm(prev => ({ ...prev, confirm: e.target.value }))
  }, [setPwdForm])

  if (!user) {
    return (
      <div className="profile-page-wrap">
        <div className="empty-state">
          <p>请先登录</p>
          <a href="#/login" className="btn-primary-hero">去登录</a>
        </div>
      </div>
    )
  }

  const navItems = ['个人设置', '修改密码', '我的订单']

  return (
    <div className="profile-page-wrap">
      <aside className="profile-sidebar">
        <div className="profile-avatar">
          <div className="profile-avatar-wrap">
            <img src={avatarPreview || avatarUrl(user.nickname)} alt="用户头像" width="96" height="96" />
          </div>
          <strong>{user.nickname}</strong>
          <span className="profile-email">{user.email}</span>
        </div>

        <nav aria-label="个人中心导航">
          {navItems.map(item => (
            <button
              key={item}
              type="button"
              className={profileTab === item ? 'profile-active' : ''}
              onClick={() => setProfileTab(item)}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            退出登录
          </button>
        </nav>

        {/* 学习档案 */}
        <div className="profile-heritage-card">
          <div className="profile-heritage-card-title">
            <span className="profile-heritage-icon">◈</span> 我的非遗档案
          </div>
          <div className="profile-stats-grid">
            <div className="profile-stat-item">
              <span className="profile-stat-num">3</span>
              <span className="profile-stat-label">在学课程</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-num">12</span>
              <span className="profile-stat-label">收藏作品</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-num">2</span>
              <span className="profile-stat-label">参与活动</span>
            </div>
          </div>
          <div className="profile-heritage-badge">
            <span>梆鼓咚学习者</span>
          </div>
        </div>

        {/* 每日非遗知识 */}
        <div className="profile-trivia-card">
          <div className="profile-trivia-header">
            <span className="profile-heritage-icon">☯</span> 非遗小知识
          </div>
          <p className="profile-trivia-text">
            梆鼓咚的板鼓由长约 25 厘米的竹筒蒙皮制成，演奏时斜背右肩；竹板两片夹于左腋，可击出<em>响鼓、边鼓、点鼓、闷鼓</em>四种音色，是莆田兴化方言区独有的曲艺形式。
          </p>
          <span className="profile-trivia-source">— 源自福建省非遗名录</span>
        </div>
      </aside>

      <section className="profile-content">
        <h1>{profileTab}</h1>

        {profileTab === '个人设置' && (
          <form className="profile-form" onSubmit={handleProfileSave}>
            <div className="profile-fields">
              <div className="auth-field">
                <label htmlFor="pf-nickname">昵称</label>
                <input
                  id="pf-nickname"
                  type="text"
                  value={profileForm.nickname}
                  onChange={handleNicknameChange}
                  maxLength={20}
                  placeholder="请输入昵称"
                />
                <small className="field-hint">{profileForm.nickname?.length || 0}/20</small>
              </div>
              <div className="auth-field">
                <label htmlFor="pf-bio">个性签名</label>
                <textarea
                  id="pf-bio"
                  value={profileForm.bio}
                  onChange={handleBioChange}
                  rows="4"
                  maxLength={100}
                  placeholder="介绍一下自己..."
                />
                <small className="field-hint">{profileForm.bio?.length || 0}/100</small>
              </div>
              <button className="save-button" type="submit">保存</button>
            </div>
            <div className="profile-upload">
              <div className={`profile-upload-avatar-wrap${avatarLoading ? ' loading' : ''}`}>
                {avatarLoading ? (
                  <div className="avatar-loading">
                    <svg className="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                    </svg>
                  </div>
                ) : (
                  <img src={avatarPreview || avatarUrl(user.nickname)} alt="头像预览" width="96" height="96" />
                )}
                <label className="profile-upload-overlay" htmlFor="avatar-upload" title="点击更换头像">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>更换头像</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                  disabled={avatarLoading}
                />
              </div>
              <span className="profile-upload-tip">支持 JPG / PNG / WebP，最大 2MB</span>
              {avatarPreview && avatarPreview !== user.avatar && !avatarLoading && (
                <button type="button" className="profile-upload-reset" onClick={resetAvatar}>重置</button>
              )}
            </div>
          </form>
        )}

        {profileTab === '修改密码' && (
          <form className="profile-pwd-form" onSubmit={handlePasswordChange}>
            <div className="auth-field">
              <label htmlFor="pwd-current">当前密码</label>
              <PasswordInput
                id="pwd-current"
                autoComplete="current-password"
                placeholder="输入当前密码"
                value={pwdForm.current}
                onChange={handleCurrentPwdChange}
              />
              {pwdErrors.current && <p className="field-error" role="alert">{pwdErrors.current}</p>}
            </div>
            <div className="auth-field">
              <label htmlFor="pwd-next">新密码</label>
              <PasswordInput
                id="pwd-next"
                autoComplete="new-password"
                placeholder="至少 6 个字符"
                value={pwdForm.next}
                onChange={handleNewPwdChange}
              />
              {pwdErrors.next && <p className="field-error" role="alert">{pwdErrors.next}</p>}
            </div>
            <div className="auth-field">
              <label htmlFor="pwd-confirm">确认新密码</label>
              <PasswordInput
                id="pwd-confirm"
                autoComplete="new-password"
                placeholder="再次输入新密码"
                value={pwdForm.confirm}
                onChange={handleConfirmPwdChange}
              />
              {pwdErrors.confirm && <p className="field-error" role="alert">{pwdErrors.confirm}</p>}
            </div>
            <button className="save-button" type="submit">更新密码</button>
          </form>
        )}

        {profileTab === '我的订单' && (
          <div className="orders-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              <line x1="12" y1="12" x2="12" y2="16"/>
              <line x1="10" y1="14" x2="14" y2="14"/>
            </svg>
            <p>暂无订单记录</p>
            <a href="#/mall">去逛逛</a>
          </div>
        )}
      </section>
    </div>
  )
}

export default ProfilePage
