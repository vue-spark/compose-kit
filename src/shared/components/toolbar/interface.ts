import type { StyleValue, VNodeChild } from 'vue'

export interface ToolbarProps {
  titleStyle?: StyleValue
  titleClass?: any

  contentStyle?: StyleValue
  contentClass?: any

  extraStyle?: StyleValue
  extraClass?: any

  /**
   * 标题，优先级低于 title 插槽
   */
  title?: string
}

export interface ToolbarSlots {
  title: () => VNodeChild
  default: () => VNodeChild
  extra: () => VNodeChild
}
