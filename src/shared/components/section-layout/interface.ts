import type { Arrayable } from 'type-fest'

export interface ElementSize {
  width: number
  height: number
}

export type SectionLayoutDirection = 'vertical' | 'horizontal'

/**
 * SectionLayout 组件的属性
 */
export interface SectionLayoutProps {
  /**
   * 布局方向
   * @default 'vertical'
   */
  direction?: SectionLayoutDirection

  /**
   * 是否为卡片样式
   */
  card?: boolean
}

/**
 * SectionItem 组件的属性
 */
export interface SectionItemProps {
  /**
   * 是否为卡片样式
   */
  card?: boolean
}

/**
 * SectionMain 组件的属性
 */
export interface SectionMainProps {
  /**
   * 是否为卡片样式
   */
  card?: boolean

  /**
   * 尺寸变化回调
   */
  onResize?: Arrayable<(data: ElementSize) => void>
}
