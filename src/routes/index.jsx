/**
 * 路由配置 - Code Splitting 优化
 */

import { lazy } from 'react'

// 主应用组件（非懒加载，因为经常访问）
export const HomePage = lazy(() => import('../pages/Home'))
export const WorksPage = lazy(() => import('../pages/Works'))
export const InheritorsPage = lazy(() => import('../pages/Inheritors'))
export const ActivitiesPage = lazy(() => import('../pages/Activities'))
export const CoursePage = lazy(() => import('../pages/Course'))
export const MallPage = lazy(() => import('../pages/Mall'))
export const ProductPage = lazy(() => import('../pages/Product'))
export const QAPage = lazy(() => import('../pages/QA'))
export const AnnouncementsPage = lazy(() => import('../pages/Announcements'))
export const LoginPage = lazy(() => import('../pages/Login'))
export const ProfilePage = lazy(() => import('../pages/Profile'))
export const HeritagePage = lazy(() => import('../pages/Heritage'))
export const GamePage = lazy(() => import('../pages/Game'))

// 路由配置
export const routes = {
  home: { path: '/home', component: HomePage },
  works: { path: '/works', component: WorksPage },
  inheritors: { path: '/inheritors', component: InheritorsPage },
  activities: { path: '/activities', component: ActivitiesPage },
  course: { path: '/course', component: CoursePage },
  mall: { path: '/mall', component: MallPage },
  product: { path: '/mall/products/:id', component: ProductPage },
  qa: { path: '/qa', component: QAPage },
  announcements: { path: '/announcements', component: AnnouncementsPage },
  login: { path: '/login', component: LoginPage },
  profile: { path: '/profile', component: ProfilePage },
  heritage: { path: '/heritage', component: HeritagePage },
  game: { path: '/game', component: GamePage }
}

// 路由路径映射（用于解析当前路由）
export function parseRoute(hash) {
  const rawHash = hash || '#/home'
  const cleanHash = rawHash.replace(/^#/, '') || '/home'
  const [path, queryString] = cleanHash.split('?')

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

export default routes
