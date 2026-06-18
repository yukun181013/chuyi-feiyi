/**
 * 路由解析 - 从 location.hash 解析出当前路由
 *
 * 注意：页面渲染由 src/App.jsx 内部的 render*() 函数负责，这里只做
 * “hash → 路由名”的解析，不再维护懒加载页面组件（那套实现已废弃删除）。
 */

export function parseRoute(hash) {
  const rawHash = hash || '#/home'
  const cleanHash = rawHash.replace(/^#/, '') || '/home'
  const [path] = cleanHash.split('?')

  // 产品详情页
  const productMatch = path.match(/^\/mall\/products\/(\d+)$/)
  if (productMatch) {
    return { name: 'product', id: Number(productMatch[1]) || 1 }
  }

  // 其他路由
  const routeMap = {
    '/mall': 'mall',
    '/course': 'course',
    '/works': 'works',
    '/inheritors': 'inheritors',
    '/activities': 'activities',
    '/qa': 'qa',
    '/announcements': 'announcements',
    '/login': 'login',
    '/profile': 'profile',
    '/heritage': 'heritage',
    '/game': 'game',
    '/home': 'home'
  }

  return { name: routeMap[path] || 'home' }
}

export default parseRoute
