# 传承人详情面板 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 点击任意传承人姓名，在页面右上角弹出详情面板，展示该传承人的传承经历与主要成就，点击遮罩或 ✕ 关闭。

**Architecture:** 纯静态数据扩展 + React state 管理面板开关 + CSS transition 动画。所有改动集中在 `src/App.jsx` 和 `src/App.css` 两个文件，无需新增文件或依赖。

**Tech Stack:** React 19, Vite 8, 纯 CSS（无 UI 库）。CSS 变量 `--primary: #C0392B` 定义于 `src/index.css`。

---

## 文件改动范围

| 文件 | 改动 |
|------|------|
| `src/App.jsx` | 扩展 `inheritorsData`（88-97行），新增 state + handlers，三处姓名加交互，渲染 overlay + panel |
| `src/App.css` | 末尾追加面板/遮罩/动画样式 |

---

## Task 1: 扩展 `inheritorsData` 数据

**Files:**
- Modify: `src/App.jsx:88-97`

- [ ] **Step 1: 替换 `inheritorsData` 为含 `biography` 和 `achievements` 的完整版本**

在 `src/App.jsx` 中，将第 88-97 行的 `inheritorsData` 完整替换为：

```js
const inheritorsData = [
  {
    id: 1,
    name: '黄文栋',
    title: '梆鼓咚第四代核心传承人（1931—2019）',
    location: '福建莆田',
    biography: '黄文栋自幼随父学习梆鼓咚技艺，是梆鼓咚第四代核心传承人。他长期活跃于莆田民间演出舞台，一生参与演出逾千场，是中国曲艺志福建卷中有正式记录的传承人之一。晚年仍积极参与传习活动，将核心曲目口传给第五代传承人，为梆鼓咚技艺的延续作出了不可替代的贡献。',
    achievements: ['福建省民间文化优秀十大传承人荣誉获得者', '收录于《中国曲艺志·福建卷》正式记录', '晚年完成梆鼓咚核心曲目的完整口传'],
  },
  {
    id: 2,
    name: '陈德来',
    title: '梆鼓咚省级非物质文化遗产代表性传承人',
    location: '福建莆田荔城区',
    biography: '陈德来长期扎根荔城区，是梆鼓咚省级非遗代表性传承人。他专注于民间演出与曲目口传，参与整理了多首濒临失传的梆鼓咚传统曲目，多次在省市非遗展演中登台表演，是荔城区梆鼓咚传习的重要骨干力量。',
    achievements: ['省级非物质文化遗产代表性传承人', '参与整理多首濒危传统曲目', '多次参与省市级非遗展演'],
  },
  {
    id: 3,
    name: '林秀珍',
    title: '梆鼓咚省级非物质文化遗产代表性传承人',
    location: '福建莆田城厢区',
    biography: '林秀珍是城厢区梆鼓咚省级非遗代表性传承人，多年来积极投身非遗传播与社区推广活动。她参与过多届福建省非遗文化节，并曾赴各地展演，是梆鼓咚女性传承人的代表性人物。',
    achievements: ['省级非物质文化遗产代表性传承人', '多届福建省非遗文化节参演者', '城厢区非遗推广骨干'],
  },
  {
    id: 4,
    name: '郑明辉',
    title: '梆鼓咚省级非物质文化遗产代表性传承人',
    location: '福建莆田涵江区',
    biography: '郑明辉是涵江区梆鼓咚省级非遗代表性传承人，负责涵江区传习推广工作。他长期在社区和学校组织梆鼓咚体验活动，致力于将传统曲艺引入现代文化生活，是梆鼓咚在涵江地区传播的主要推动者。',
    achievements: ['省级非物质文化遗产代表性传承人', '涵江区梆鼓咚进校园活动组织者', '社区传习推广负责人'],
  },
  {
    id: 5,
    name: '吴春燕',
    title: '梆鼓咚市级非物质文化遗产代表性传承人',
    location: '福建莆田秀屿区',
    biography: '吴春燕是秀屿区梆鼓咚市级非遗代表性传承人，长期参与梆鼓咚进校园系列活动。她以亲身示范的方式，向中小学生传授梆鼓咚的基本节奏与演唱技巧，是秀屿区青少年传承工作的核心推动人。',
    achievements: ['市级非物质文化遗产代表性传承人', '秀屿区梆鼓咚进校园活动主导者'],
  },
  {
    id: 6,
    name: '黄志远',
    title: '梆鼓咚市级非物质文化遗产代表性传承人',
    location: '福建莆田仙游县',
    biography: '黄志远是仙游县梆鼓咚市级非遗代表性传承人，扎根乡村与社区，长期开展梆鼓咚的社区推广活动。他积极参与仙游县各类民俗节庆演出，将梆鼓咚融入地方文化生活，为技艺在仙游地区的留存发挥了重要作用。',
    achievements: ['市级非物质文化遗产代表性传承人', '仙游县梆鼓咚社区推广负责人'],
  },
  {
    id: 7,
    name: '黄璟',
    title: '梆鼓咚第五代传承人，唯一代表性传承人，莆田学院音乐学院副教授，首位将传统曲目记谱为五线谱的传承者',
    location: '福建莆田',
    biography: '黄璟是梆鼓咚第五代传承人，现任莆田学院音乐学院副教授。他是梆鼓咚唯一现任代表性传承人，长期承担核心教学与学术研究工作。2023年，在他的主导推动下，梆鼓咚成功申报省级非遗，并于同年首次将无乐谱的传统曲目完整记录为五线谱，实现了技艺的数字化保存。他带领学生苏越与陈吉在福建省第五届曲艺大赛中荣获新人奖。',
    achievements: ['梆鼓咚唯一现任代表性传承人', '首位将传统曲目记谱为五线谱的传承者', '主导2023年梆鼓咚申遗成功', '莆田学院音乐学院副教授'],
  },
  {
    id: 8,
    name: '林季君',
    title: '梆鼓咚第五代传承人，莆田学院音乐学院客座教授，省级中学音乐学科教学带头人，专注青少年传承传播',
    location: '福建莆田',
    biography: '林季君是梆鼓咚第五代传承人，现任莆田学院音乐学院客座教授，同时是省级中学音乐学科教学带头人。她专注于青少年传承体系建设，推动梆鼓咚进入筱塘小学、莆田一中等多所学校的常规课程，并参与构建大中小幼一体化传承模式，是梆鼓咚向年轻世代传播的重要推手。',
    achievements: ['梆鼓咚第五代传承人', '省级中学音乐学科教学带头人', '大中小幼一体化传承体系建设者'],
  },
]
```

- [ ] **Step 2: 在浏览器验证数据未破坏页面**

运行 `npm run dev`，打开 `http://localhost:5173`，进入"传承人"页面，确认 8 张卡片正常显示，没有报错。

- [ ] **Step 3: Commit**

```bash
cd /Users/yukun/Documents/chuyi-feiyi
git add src/App.jsx
git commit -m "feat: extend inheritorsData with biography and achievements"
```

---

## Task 2: 添加面板和遮罩的 CSS 样式

**Files:**
- Modify: `src/App.css`（末尾追加）

- [ ] **Step 1: 在 `src/App.css` 末尾追加以下样式**

```css
/* ── Inheritor Detail Panel ───────────────────────────────────────────────── */
.inheritor-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: transparent;
  cursor: default;
}

.inheritor-panel {
  position: fixed;
  top: 80px;
  right: 16px;
  width: min(320px, calc(100vw - 32px));
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(8px);
  border: 2px solid var(--primary);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 20px;
  transform: translateX(120%);
  opacity: 0;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.inheritor-panel--open {
  transform: translateX(0);
  opacity: 1;
}

.inheritor-panel--closing {
  transform: translateX(120%);
  opacity: 0;
  transition: transform 0.2s ease-in, opacity 0.2s ease-in;
}

.inheritor-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.inheritor-panel-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.3;
}

.inheritor-panel-close {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 18px;
  color: #888;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  line-height: 1;
  transition: color 0.15s, background 0.15s;
}

.inheritor-panel-close:hover {
  color: var(--primary);
  background: rgba(192, 57, 43, 0.08);
}

.inheritor-panel-title {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
  line-height: 1.5;
}

.inheritor-panel-location {
  font-size: 12px;
  color: #888;
  margin-bottom: 14px;
}

.inheritor-panel-divider {
  border: none;
  border-top: 1px solid rgba(192, 57, 43, 0.15);
  margin: 12px 0;
}

.inheritor-panel-section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 8px;
}

.inheritor-panel-bio {
  font-size: 13px;
  color: #444;
  line-height: 1.8;
}

.inheritor-panel-achievements {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.inheritor-panel-achievements li {
  font-size: 13px;
  color: #444;
  display: flex;
  gap: 6px;
  line-height: 1.5;
}

.inheritor-panel-achievements li::before {
  content: '✦';
  color: var(--primary);
  flex-shrink: 0;
  font-size: 10px;
  margin-top: 3px;
}

.inheritor-panel-empty {
  font-size: 13px;
  color: #aaa;
  font-style: italic;
}

/* 传承人姓名可点击样式 */
.inheritor-name-btn {
  cursor: pointer;
  border-bottom: 1px dashed var(--primary);
  transition: color 0.15s;
  display: inline;
}

.inheritor-name-btn:hover {
  color: var(--primary);
}
```

- [ ] **Step 2: 验证样式文件无语法错误**

运行 `npm run dev`，确认终端无 CSS 报错，页面正常加载。

- [ ] **Step 3: Commit**

```bash
git add src/App.css
git commit -m "feat: add inheritor panel CSS styles and animations"
```

---

## Task 3: 添加 state、handlers 和路由关闭 effect

**Files:**
- Modify: `src/App.jsx`（App 函数内部，约第 173-202 行的 state 区域）

- [ ] **Step 1: 在 App 函数的 state 声明区末尾追加三个 state**

找到 App 函数中的 state 声明区（约第 188 行 `const [toast, setToast] = useState('')` 处），在其后追加：

```js
  // ── Inheritor panel state ──
  const [selectedInheritor, setSelectedInheritor] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isPanelClosing, setIsPanelClosing] = useState(false)
```

注：`isPanelOpen` 与 `selectedInheritor` 分开管理，是为了实现入场动画：元素先挂载（无 `--open` class），再通过 `requestAnimationFrame` 在下一帧添加 `--open`，使浏览器能正确执行 CSS transition。若同时挂载+添加类，动画会直接跳到终态（snap in）。

- [ ] **Step 2: 在 state 声明区之后（约第 202 行附近）追加 handlers 和 effect**

找到 state 声明结束的位置（`const [regErrors, setRegErrors] = useState({})` 之后），追加：

```js
  // ── Inheritor panel handlers ──
  const handleInheritorClick = (name) => {
    const canonical = inheritorsData.find(p => p.name === name) ?? {
      name, title: '', location: '', biography: '', achievements: [],
    }
    setSelectedInheritor(canonical)
    setIsPanelClosing(false)
    setIsPanelOpen(false)
    // 下一帧再添加 --open，让浏览器先渲染初始状态，CSS transition 才能触发
    requestAnimationFrame(() => setIsPanelOpen(true))
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setIsPanelClosing(true)
  }

  const handlePanelTransitionEnd = (e) => {
    if (e.propertyName !== 'transform') return
    if (isPanelClosing) {
      setSelectedInheritor(null)
      setIsPanelClosing(false)
    }
  }

  useEffect(() => {
    setSelectedInheritor(null)
    setIsPanelOpen(false)
    setIsPanelClosing(false)
  }, [route])
```

- [ ] **Step 3: 验证应用无报错**

运行 `npm run dev`，打开浏览器，确认控制台无 JavaScript 错误。

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add inheritor panel state and handlers"
```

---

## Task 4: 渲染 overlay 和 InheritorPanel

**Files:**
- Modify: `src/App.jsx`（App 函数的 return 语句，约第 1434-1442 行）

- [ ] **Step 1: 在 App 函数的 return 中追加 overlay 和 panel**

找到当前的 return 语句：
```jsx
  return (
    <div className="portal-shell">
      <ClickEffect />
      {toast ? <div className="toast-banner" role="status" aria-live="polite">{toast}</div> : null}
      {renderHeader()}
      <main className="portal-main">{renderPage()}</main>
      {renderFooter()}
    </div>
  )
```

替换为：
```jsx
  return (
    <div className="portal-shell">
      <ClickEffect />
      {toast ? <div className="toast-banner" role="status" aria-live="polite">{toast}</div> : null}
      {renderHeader()}
      <main className="portal-main">{renderPage()}</main>
      {renderFooter()}
      {selectedInheritor && (
        <div className="inheritor-overlay" onClick={handleClosePanel} />
      )}
      {selectedInheritor && (
        <div
          className={`inheritor-panel${isPanelOpen && !isPanelClosing ? ' inheritor-panel--open' : ''}${isPanelClosing ? ' inheritor-panel--closing' : ''}`}
          onTransitionEnd={handlePanelTransitionEnd}
        >
          <div className="inheritor-panel-header">
            <div className="inheritor-panel-name">{selectedInheritor.name}</div>
            <button
              className="inheritor-panel-close"
              onClick={handleClosePanel}
              aria-label="关闭传承人详情"
              type="button"
            >✕</button>
          </div>
          {selectedInheritor.title && (
            <div className="inheritor-panel-title">{selectedInheritor.title}</div>
          )}
          {selectedInheritor.location && (
            <div className="inheritor-panel-location">◎ {selectedInheritor.location}</div>
          )}
          <hr className="inheritor-panel-divider" />
          <div className="inheritor-panel-section-title">传承经历</div>
          {selectedInheritor.biography
            ? <p className="inheritor-panel-bio">{selectedInheritor.biography}</p>
            : <p className="inheritor-panel-empty">暂无详细资料</p>
          }
          <hr className="inheritor-panel-divider" />
          <div className="inheritor-panel-section-title">主要成就</div>
          {selectedInheritor.achievements && selectedInheritor.achievements.length > 0
            ? (
              <ul className="inheritor-panel-achievements">
                {selectedInheritor.achievements.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            )
            : <p className="inheritor-panel-empty">暂无详细资料</p>
          }
        </div>
      )}
    </div>
  )
```

- [ ] **Step 2: 验证面板能渲染（临时测试）**

在浏览器控制台执行以下代码（React DevTools 中也可），或在代码中临时将 `useState(null)` 改为 `useState(inheritorsData[0])`，确认面板出现在右上角，样式正常，然后改回 `null`。

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: render inheritor detail panel and overlay"
```

---

## Task 5: 三处触发点 — 姓名变为可点击

**Files:**
- Modify: `src/App.jsx`（三处 `inheritor-name` div）

### 5a: 传承人专页（`renderInheritors`，约第 722-730 行）

- [ ] **Step 1: 更新传承人专页的卡片渲染**

找到 `renderInheritors` 中的卡片：
```jsx
              <div key={person.id} className="inheritor-card">
                <img src={avatarUrl(person.name)} alt={person.name} className="inheritor-avatar" />
                <div className="inheritor-name">{person.name}</div>
                <div className="inheritor-title">{person.title}</div>
                <div className="inheritor-location">◎ {person.location}</div>
              </div>
```

替换为：
```jsx
              <div key={person.id} className="inheritor-card">
                <img src={avatarUrl(person.name)} alt={person.name} className="inheritor-avatar" />
                <div className="inheritor-name">
                  <span
                    className="inheritor-name-btn"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleInheritorClick(person.name)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInheritorClick(person.name) } }}
                  >{person.name}</span>
                </div>
                <div className="inheritor-title">{person.title}</div>
                <div className="inheritor-location">◎ {person.location}</div>
              </div>
```

### 5b: 首页传承人风采预览（约第 558-569 行）

- [ ] **Step 2: 更新首页预览区的卡片渲染**

找到首页的传承人预览卡片：
```jsx
              <div key={person.id} className="inheritor-card">
                <img
                  src={avatarUrl(person.name)}
                  alt={person.name}
                  className="inheritor-avatar"
                />
                <div className="inheritor-name">{person.name}</div>
                <div className="inheritor-title">{person.title}</div>
                <div className="inheritor-location">◎ {person.location}</div>
              </div>
```

替换为：
```jsx
              <div key={person.id} className="inheritor-card">
                <img
                  src={avatarUrl(person.name)}
                  alt={person.name}
                  className="inheritor-avatar"
                />
                <div className="inheritor-name">
                  <span
                    className="inheritor-name-btn"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleInheritorClick(person.name)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInheritorClick(person.name) } }}
                  >{person.name}</span>
                </div>
                <div className="inheritor-title">{person.title}</div>
                <div className="inheritor-location">◎ {person.location}</div>
              </div>
```

### 5c: 课程页课程团队（约第 836-841 行）

- [ ] **Step 3: 更新课程团队的卡片渲染**

找到课程团队卡片：
```jsx
              <div key={m.name} className="inheritor-card">
                <img src={avatarUrl(m.name)} alt={m.name} className="inheritor-avatar" />
                <div className="inheritor-name">{m.name}</div>
                <div className="inheritor-location" style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>{m.role}</div>
                <div className="inheritor-title">{m.title}</div>
              </div>
```

替换为：
```jsx
              <div key={m.name} className="inheritor-card">
                <img src={avatarUrl(m.name)} alt={m.name} className="inheritor-avatar" />
                <div className="inheritor-name">
                  <span
                    className="inheritor-name-btn"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleInheritorClick(m.name)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInheritorClick(m.name) } }}
                  >{m.name}</span>
                </div>
                <div className="inheritor-location" style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>{m.role}</div>
                <div className="inheritor-title">{m.title}</div>
              </div>
```

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: make inheritor names clickable in all 3 locations"
```

---

## Task 6: 手动验收测试

- [ ] **Step 1: 传承人专页测试**

  1. 进入 `http://localhost:5173/#/inheritors`
  2. 点击"黄璟"名字 → 右上角面板滑入，显示完整 biography 和 achievements ✓
  3. 点击"黄文栋"名字 → 面板内容切换 ✓
  4. 点击遮罩（面板外任意区域）→ 面板滑出消失 ✓
  5. 再次点击任意名字 → 面板重新打开 ✓
  6. 点击面板内 ✕ 按钮 → 面板关闭 ✓

- [ ] **Step 2: 首页预览区测试**

  1. 进入首页 `http://localhost:5173`，滚动到"传承人风采"区块
  2. 点击任意传承人姓名 → 右上角面板弹出 ✓

- [ ] **Step 3: 课程页团队测试**

  1. 进入 `http://localhost:5173/#/course`，滚动到"课程团队"区块
  2. 点击"黄璟" → 面板显示完整信息 ✓
  3. 点击"卢雪珊" → 面板显示姓名，biography 和 achievements 显示"暂无详细资料" ✓

- [ ] **Step 4: 路由切换测试**

  1. 打开面板（点击任意传承人名字）
  2. 点击顶部导航切换到其他页面 → 面板立即消失（无动画，直接关闭）✓

- [ ] **Step 5: 键盘无障碍测试**

  1. 用 Tab 键聚焦到传承人姓名
  2. 按 Enter 或空格 → 面板打开 ✓

- [ ] **Step 6: Final commit**

```bash
git add -p  # 确认无遗漏改动
git commit -m "feat: inheritor detail panel — complete implementation"
```
