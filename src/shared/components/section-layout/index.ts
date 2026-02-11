export { default as SectionItem } from './components/item.vue'
export { default as SectionMain } from './components/main.vue'
export { default as SectionLayout } from './index.vue'

export type * from './interface'

declare module '@vue-spark/compose-kit-runtime' {
  interface GlobalConfig {
    SectionLayout?: {
      /**
       * 内置卡片样式类名，方便统一设置卡片样式
       */
      cardClass?: any
    }
  }
}
