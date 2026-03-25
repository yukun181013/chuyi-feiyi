# 传承人详情面板 — 设计文档

**日期：** 2026-03-25
**项目：** chuyi-feiyi（梆鼓咚非遗文化网站）

---

## 需求概述

在所有出现传承人姓名的位置，点击姓名后，在页面右上角弹出一个详情面板，展示该传承人的基本信息、主要成就与传承经历。点击遮罩层或面板内 ✕ 按钮可关闭。面板打开时，背景内容不可交互（遮罩层阻挡点击与滚动）。

---

## 数据层

### 扩展 `inheritorsData`

在现有字段（`id`, `name`, `title`, `location`）基础上，为每条记录新增：

| 字段 | 类型 | 说明 |
|------|------|------|
| `achievements` | `string[]` | 主要成就与代表作品，1-3 条 |
| `biography` | `string` | 传承经历长文，2-3 段，与 `title`（简短职称标签）不重复 |

`title` 字段保持简短职称描述不变。`biography` 为详细叙述性文字，内容与 `title` 差异化（`title` 是标签，`biography` 是故事）。

数据为静态硬编码，无需网络请求。

### 8 位传承人内容（百度百科参考整理）

1. **黄文栋（1931—2019）**
   - 注：`title` 字段应修改为 `"梆鼓咚第四代核心传承人（1931—2019）"`，避免与下方成就重复。
   - biography：黄文栋自幼随父学习梆鼓咚技艺，是梆鼓咚第四代核心传承人。他长期活跃于莆田民间演出舞台，一生参与演出逾千场，是中国曲艺志福建卷中有正式记录的传承人之一。晚年仍积极参与传习活动，将核心曲目口传给第五代传承人，为梆鼓咚技艺的延续作出了不可替代的贡献。
   - achievements: ["福建省民间文化优秀十大传承人荣誉获得者", "收录于《中国曲艺志·福建卷》正式记录", "晚年完成梆鼓咚核心曲目的完整口传"]

2. **陈德来**
   - biography：陈德来长期扎根荔城区，是梆鼓咚省级非遗代表性传承人。他专注于民间演出与曲目口传，参与整理了多首濒临失传的梆鼓咚传统曲目，多次在省市非遗展演中登台表演，是荔城区梆鼓咚传习的重要骨干力量。
   - achievements: ["省级非物质文化遗产代表性传承人", "参与整理多首濒危传统曲目", "多次参与省市级非遗展演"]

3. **林秀珍**
   - biography：林秀珍是城厢区梆鼓咚省级非遗代表性传承人，多年来积极投身非遗传播与社区推广活动。她参与过多届福建省非遗文化节，并曾赴各地展演，是梆鼓咚女性传承人的代表性人物。
   - achievements: ["省级非物质文化遗产代表性传承人", "多届福建省非遗文化节参演者", "城厢区非遗推广骨干"]

4. **郑明辉**
   - biography：郑明辉是涵江区梆鼓咚省级非遗代表性传承人，负责涵江区传习推广工作。他长期在社区和学校组织梆鼓咚体验活动，致力于将传统曲艺引入现代文化生活，是梆鼓咚在涵江地区传播的主要推动者。
   - achievements: ["省级非物质文化遗产代表性传承人", "涵江区梆鼓咚进校园活动组织者", "社区传习推广负责人"]

5. **吴春燕**
   - biography：吴春燕是秀屿区梆鼓咚市级非遗代表性传承人，长期参与梆鼓咚进校园系列活动。她以亲身示范的方式，向中小学生传授梆鼓咚的基本节奏与演唱技巧，是秀屿区青少年传承工作的核心推动人。
   - achievements: ["市级非物质文化遗产代表性传承人", "秀屿区梆鼓咚进校园活动主导者"]

6. **黄志远**
   - biography：黄志远是仙游县梆鼓咚市级非遗代表性传承人，扎根乡村与社区，长期开展梆鼓咚的社区推广活动。他积极参与仙游县各类民俗节庆演出，将梆鼓咚融入地方文化生活，为技艺在仙游地区的留存发挥了重要作用。
   - achievements: ["市级非物质文化遗产代表性传承人", "仙游县梆鼓咚社区推广负责人"]

7. **黄璟**
   - biography：黄璟是梆鼓咚第五代传承人，现任莆田学院音乐学院副教授。他是梆鼓咚唯一现任代表性传承人，长期承担核心教学与学术研究工作。2023年，在他的主导推动下，梆鼓咚成功申报省级非遗，并于同年首次将无乐谱的传统曲目完整记录为五线谱，实现了技艺的数字化保存。他带领学生苏越与陈吉在福建省第五届曲艺大赛中荣获新人奖。
   - achievements: ["梆鼓咚唯一现任代表性传承人", "首位将传统曲目记谱为五线谱的传承者", "主导2023年梆鼓咚申遗成功", "莆田学院音乐学院副教授"]

8. **林季君**
   - biography：林季君是梆鼓咚第五代传承人，现任莆田学院音乐学院客座教授，同时是省级中学音乐学科教学带头人。她专注于青少年传承体系建设，推动梆鼓咚进入筱塘小学、莆田一中等多所学校的常规课程，并参与构建大中小幼一体化传承模式，是梆鼓咚向年轻世代传播的重要推手。
   - achievements: ["梆鼓咚第五代传承人", "省级中学音乐学科教学带头人", "大中小幼一体化传承体系建设者"]

---

## 组件设计

### `InheritorPanel` 组件

**定位：** `position: fixed`，右上角，距顶部 80px（留出导航栏）、距右侧 16px
**尺寸：** 宽 320px，最大高度 80vh，内容超出时面板内部滚动（`overflow-y: auto`）
**层级：** `z-index: 1000`（导航栏为 `z-index: 100`，遮罩为 `z-index: 999`）。用户下拉菜单（`.user-dropdown`）也是 `z-index: 100`，面板打开时遮罩会覆盖它，此为预期行为，不应调高下拉菜单的 z-index。

**视觉风格：**
- 背景：`rgba(255,255,255,0.97)`（同时作为 `backdrop-filter: blur(8px)` 的降级 fallback）
- 边框：`2px solid var(--primary)`
- 圆角：`12px`
- 阴影：`0 8px 32px rgba(0,0,0,0.18)`

**内部结构：**
```
┌─────────────────────────────┐
│  [姓名]              [✕]    │
│  [职称标签 — title 字段]     │
│  ◎ [地区]                   │
├─────────────────────────────┤
│  传承经历                    │
│  [biography 文字]            │
├─────────────────────────────┤
│  主要成就                    │
│  ✦ [成就1]                  │
│  ✦ [成就2]                  │
└─────────────────────────────┘
```

若该传承人无 `biography` 或 `achievements`，对应区块显示"暂无详细资料"占位文字。

**动画机制：**
- 面板使用两个 CSS class 控制状态：`.inheritor-panel`（基础样式）和 `.inheritor-panel--open`（展开状态）
- 进入：添加 `--open` class，触发 `transform: translateX(0)` + `opacity: 1`，duration 300ms ease-out
- 退出：添加 `.inheritor-panel--closing` class（触发反向动画），监听 `transitionend` 事件后再将 `selectedInheritor` 设为 `null`，duration 200ms
- 实现方式：维护一个 `isPanelClosing` 本地 state，关闭时先设为 true，动画结束后再清空 `selectedInheritor`
- `onTransitionEnd` 注意：若 `transform` 和 `opacity` 同时过渡，事件会触发两次。应在 handler 中过滤：`if (e.propertyName !== 'transform') return`，只处理 `transform` 结束事件

**无障碍访问：**
- 所有可点击姓名的 `<span>` 需加 `role="button"` 和 `tabIndex={0}`
- 需处理 `onKeyDown`，当 key 为 `Enter` 或 ` `（空格）时触发 `handleInheritorClick`
- 面板 ✕ 按钮需有 `aria-label="关闭传承人详情"`

---

## 状态管理

```js
const [selectedInheritor, setSelectedInheritor] = useState(null)
const [isPanelClosing, setIsPanelClosing] = useState(false)

// 打开
const handleInheritorClick = (nameOrPerson) => {
  // 统一通过姓名在 inheritorsData 中查找规范记录
  const name = typeof nameOrPerson === 'string' ? nameOrPerson : nameOrPerson.name
  const canonical = inheritorsData.find(p => p.name === name) ?? { name, title: '', location: '', achievements: [], biography: '' }
  setSelectedInheritor(canonical)
  setIsPanelClosing(false)
}

// 关闭（带退出动画）
const handleClosePanel = () => {
  setIsPanelClosing(true)
  // transitionend 事件触发后清空（见组件 onTransitionEnd handler）
}

const handlePanelTransitionEnd = () => {
  if (isPanelClosing) {
    setSelectedInheritor(null)
    setIsPanelClosing(false)
  }
}
```

**路由切换自动关闭：**
```js
useEffect(() => {
  setSelectedInheritor(null)
  setIsPanelClosing(false)
}, [route])
```

**遮罩层（overlay）：**
- `position: fixed, inset: 0, z-index: 999, background: transparent`
- 面板打开时渲染，点击触发 `handleClosePanel`
- 遮罩阻挡背景交互；不锁定 `body` 滚动（面板已 fixed，不受页面滚动影响）。已知局限：移动端用户仍可滚动背景内容，背景在遮罩下方移动感觉略显突兀，可作为后续优化项（添加 `body { overflow: hidden }` 时同步设置 `body { padding-right: scrollbar-width }` 防止抖动）

---

## 触发点

**规则：** 所有触发处统一调用 `handleInheritorClick(person.name)`，通过姓名查找规范记录。

1. **传承人专页**（`renderInheritors`）：`inheritor-name` div 中的文字改为 `<span role="button" tabIndex={0}>`
2. **首页传承人风采预览**（`inheritorsData.slice(0,4)` 区块）：同上
3. **课程页课程团队**（`renderCourse` 内联数组）：黄璟、林季君在 `inheritorsData` 中有完整记录，点击后正常展示；卢雪珊、马达、郑长铃不在 `inheritorsData` 中，点击后展示面板但内容仅有姓名与职称，biography/achievements 显示"暂无详细资料"（`canonical` fallback 处理）

---

## 移动端

- 面板宽度改为 `min(320px, calc(100vw - 32px))`
- 定位：仍为右上角（`top: 80px, right: 16px`），宽度自动收窄适配小屏

---

## 文件改动范围

| 文件 | 改动内容 |
|------|---------|
| `src/App.jsx` | 扩展 `inheritorsData`（新增 biography/achievements），新增 selectedInheritor/isPanelClosing state 及相关 handler，三处姓名加 onClick/onKeyDown/role/tabIndex，渲染 overlay + InheritorPanel，新增路由变化 useEffect |
| `src/App.css` | 新增 `.inheritor-panel`, `.inheritor-panel--open`, `.inheritor-panel--closing`, `.inheritor-overlay` 样式与动画 |
