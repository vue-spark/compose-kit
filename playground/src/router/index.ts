import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.path === '/' && routes.length > 0) {
    // 这里需要下钻到第一个页面
    let to = routes.at(0)
    while (to && to.children?.length) {
      to = to.children.at(0)
    }
    return to
  }
})

export default router
