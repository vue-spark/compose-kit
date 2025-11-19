import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoImport from 'unplugin-auto-import/rolldown'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueComponents from 'unplugin-vue-components/rolldown'
import vueRouter from 'unplugin-vue-router/rolldown'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './playground',
  plugins: [
    vue(),
    vueJsx(),
    vueRouter({
      routesFolder: 'playground/src/pages',
      dts: 'playground/types/typed-router.d.ts',
    }),
    autoImport({
      dts: 'playground/types/auto-imports.d.ts',
      imports: ['vue', 'vue-router'],
    }),
    vueComponents({
      dts: 'playground/types/components.d.ts',
      dirs: [],
      resolvers: [ElementPlusResolver({ importStyle: false })],
    }),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
})
