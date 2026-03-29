# 滚动揭示与悬停交互设计文档

**日期：** 2026-03-25
**项目：** 梆鼓咚非遗文化平台 (chuyi-feiyi)
**范围：** 首页及全站互动增强

---

## 目标

通过滚动揭示动画和悬停增强效果，提升用户浏览体验，增强网站的探索引导感，风格古典沉稳，契合非遗文化气质。

---

## 方案：IntersectionObserver 滚动揭示 + CSS 悬停增强

### 核心原则

- 零新依赖，全部基于原生浏览器 API
- 每个元素只触发一次动画（通过 `unobserve` 实现）
- 动画时长控制在 0.7s–1.0s，过渡函数使用 `ease-out`
- 与现有 CSS 变量体系（`--primary`、`--font-display` 等）完全兼容

---

## 第一部分：useScrollReveal Hook

**位置：** `src/App.jsx` 顶部，函数组件外部定义

```js
function useScrollReveal(selector, routeName, options = {}) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, ...options })
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector, routeName])
}
```

**说明：**
- `routeName` 参数来自 `route`（`getRouteFromHash()` 返回的字符串），路由切换时 effect 重新执行，重新绑定新渲染的 DOM 元素。
- `document.querySelectorAll` 不作用域限制，因为当前 SPA 每次只渲染一个路由，不会出现跨路由选择器匹配问题。

**调用方式（在 App 组件内）：**

```js
useScrollReveal('.section-heading', route)
useScrollReveal('.reveal-up', route)
useScrollReveal('.reveal-left', route)
useScrollReveal('.reveal-scale', route)
```

---

## 第二部分：动画规则与 CSS 实现

### 动画规则表

| 元素 | 添加的类名 | 时长 | nth-child 延迟 |
|---|---|---|---|
| `.section-heading` | `reveal-heading` | 0.9s | 无 |
| 精选作品 `.work-card` | `reveal-up` | 0.8s | 递增 0.1s（1~4） |
| 传承人 `.inheritor-card` | `reveal-up` | 0.8s | 递增 0.1s（1~4） |
| 近期活动 `.activity-card` | `reveal-up` | 0.8s | 递增 0.1s（1~3） |
| 媒体报道 `.news-card`（新类名） | `reveal-left` | 0.7s | 递增 0.08s（1~3） |
| `.xi-quote-banner` | `reveal-scale` | 1.0s | 无 |

**注：** `.section-heading` 使用独立的 `reveal-heading` 类（而非 `reveal-up`），以便单独设置其 `translateY(20px)` 和 0.9s 时长，避免与通用 `reveal-up` 规则冲突。

### CSS 实现（完整规则）

```css
/* ── Scroll Reveal ──────────────────────────────────────────────────────────── */

/* 标题揭示 */
.reveal-heading {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s ease-out, transform 0.9s ease-out;
}
.reveal-heading.revealed {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.9s ease-out, transform 0.9s ease-out;
}

/* 卡片上移揭示 */
.reveal-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.reveal-up.revealed {
  opacity: 1;
  transform: translateY(0);
  /* 揭示后恢复为快速 hover 过渡，避免与现有卡片 hover 规则冲突 */
  transition: opacity 0.3s ease-out, transform 0.3s ease-out, box-shadow 0.2s ease-out;
}

/* 媒体报道左滑揭示 */
.reveal-left {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.reveal-left.revealed {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out, box-shadow 0.2s ease-out;
}

/* 名言横幅缩放揭示 */
.reveal-scale {
  opacity: 0;
  transform: scale(0.97);
  transition: opacity 1.0s ease-out, transform 1.0s ease-out;
}
.reveal-scale.revealed {
  opacity: 1;
  transform: scale(1);
  transition: opacity 1.0s ease-out, transform 1.0s ease-out;
}

/* nth-child 错落延迟（transition-delay） */
.reveal-up:nth-child(2) { transition-delay: 0.10s; }
.reveal-up:nth-child(3) { transition-delay: 0.20s; }
.reveal-up:nth-child(4) { transition-delay: 0.30s; }

.reveal-left:nth-child(2) { transition-delay: 0.08s; }
.reveal-left:nth-child(3) { transition-delay: 0.16s; }

/* prefers-reduced-motion：直接显示，跳过所有动画 */
@media (prefers-reduced-motion: reduce) {
  .reveal-heading,
  .reveal-up,
  .reveal-left,
  .reveal-scale {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    transition-delay: 0s !important;
  }
}
```

---

## 第三部分：悬停增强（桌面端）

### 作品卡片 `.work-card`

需在现有 `.work-card` 规则中补充 `position: relative`（当前缺失）。

悬停时添加底部渐变遮罩：

```css
.work-card::after {
  content: '';              /* 必须，否则伪元素不渲染 */
  pointer-events: none;     /* 必须，否则遮罩拦截点击事件 */
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 50%, rgba(122, 14, 14, 0.45));
  opacity: 0;
  transition: opacity 0.35s ease-out;
}
.work-card:hover::after {
  opacity: 1;
}
.work-card:hover .work-card-img img {
  transform: scale(1.04);
}
```

### 传承人卡片 `.inheritor-card`

```css
.inheritor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(192, 57, 43, 0.18);
}
.inheritor-card:hover .inheritor-avatar {
  box-shadow: 0 0 0 3px #C8A415;
}
```

### 活动卡片 `.activity-card`（近期活动）

左侧装饰条使用 `box-shadow: inset` 方案，避免 `overflow: hidden` 裁剪问题：

```css
.activity-card:hover {
  box-shadow: inset 3px 0 0 #C0392B, 0 6px 20px rgba(0,0,0,0.12);
}
.activity-card:hover .activity-btn {
  opacity: 1;
  transform: translateY(-2px);
}
```

---

## 第四部分：JSX 变更说明

| 元素 | 需要的改动 |
|---|---|
| 所有 `<div className="section-heading">` | 追加 `reveal-heading` 类 |
| 精选作品、传承人、活动卡片 | 追加 `reveal-up` 类 |
| 媒体报道卡片 | 将 `activity-card` 改为 `news-card`，追加 `reveal-left` 类 |
| `<div className="xi-quote-banner">` | 追加 `reveal-scale` 类 |

---

## 第五部分：实现文件变更

| 文件 | 变更内容 |
|---|---|
| `src/App.jsx` | ① 添加 `useScrollReveal` hook；② 在 App 组件内调用四次 hook；③ 给目标元素追加对应类名；④ 媒体报道卡片改用 `news-card` 类名 |
| `src/App.css` | ① 新增 `/* ── Scroll Reveal ──*/` 区块（含完整 CSS）；② `.work-card` 追加 `position: relative`；③ 悬停增强规则追加在现有卡片规则之后 |

---

## 非目标（本次不做）

- 移动端手势滑动动画
- 页面切换转场动画
- 复杂关键帧（卷轴展开、毛笔描绘）
- Framer Motion 或其他动画库
