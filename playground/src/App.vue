<script setup lang="tsx">
import type { FunctionalComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { ElSubMenu } from 'element-plus'
import { camelize } from 'vue'
import { routes } from 'vue-router/auto-routes'

function getMenuTitle(str: string) {
  const title = camelize(str.replaceAll('/', ' ').trim())
  return (title[0]?.toUpperCase() || '') + title.slice(1)
}

const ReMenuItem: FunctionalComponent<{
  route: RouteRecordRaw
  parentPath: string
}> = ({ route: propRoute, parentPath }) => {
  const fullPath = `${parentPath}${parentPath ? '/' : ''}${propRoute.path}`
  if (propRoute.children?.length) {
    return (
      <ElSubMenu index={fullPath}>
        {{
          title: () => getMenuTitle(propRoute.path),
          default: () =>
            propRoute.children!.map((route) => (
              <ReMenuItem
                key={`${fullPath}/${route.path}`}
                route={route}
                parentPath={fullPath}
              />
            )),
        }}
      </ElSubMenu>
    )
  }
  return (
    <ElMenuItem index={fullPath}>{getMenuTitle(propRoute.path)}</ElMenuItem>
  )
}

ReMenuItem.props = {
  route: {
    type: Object,
    required: true,
  },
  parentPath: {
    type: String,
    required: true,
  },
}
</script>

<template>
  <ElContainer class="layout">
    <ElAside
      style="border-right: 1px solid var(--el-border-color)"
      width="200px"
    >
      <ElScrollbar max-height="100%">
        <ElMenu
          style="border-right: 0"
          :default-active="$route.name"
          router
        >
          <ReMenuItem
            v-for="route in routes"
            :key="route.path"
            :route="route"
            parent-path=""
          />
        </ElMenu>
      </ElScrollbar>
    </ElAside>

    <ElMain :style="{ backgroundColor: 'var(--el-bg-color-page)' }">
      <RouterView :key="$route.fullPath" />
    </ElMain>
  </ElContainer>
</template>

<style scoped>
.layout {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
