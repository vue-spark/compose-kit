import type { ElTableColumn, TableColumnCtx } from 'element-plus'
import type { VNodeChild } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type {
  DefaultRow,
  FalsyTableColumnSchema,
  FunctionalTableColumnSchema,
  TableColumnSchemaSlots,
} from '../../../_internal/table'

/**
 * `ElTableColumn` 的插槽类型
 */
export interface ElTableColumnSlots<T extends DefaultRow = any> {
  'default'?: (data: {
    row: T
    column: TableColumnCtx<T>
    $index: number
  }) => VNodeChild

  'header'?: (data: { column: TableColumnCtx<T>, $index: number }) => VNodeChild

  'filter-icon'?: (data: { filterOpened: boolean }) => VNodeChild

  'expand'?: (data: { expanded: boolean }) => VNodeChild
}

export type ObjectElTableColumnSchema<T extends DefaultRow = any> =
  ComponentProps<typeof ElTableColumn> & {
    /**
     * 正常情况下应该是通过 `ComponentSlots<typeof ElTableColumn>` 提取出来，
     * 但是 `ElTableColumn` 类型定义存在缺失，这里根据官网进行补充并优化。
     */
    slots?: TableColumnSchemaSlots<ElTableColumnSlots<T>>

    /**
     * 子列定义
     */
    children?: ElTableColumnSchema<T>[]
  }

export type ElTableColumnSchema<T extends DefaultRow = any> =
  | FalsyTableColumnSchema |
  ObjectElTableColumnSchema<T> |
  FunctionalTableColumnSchema

export interface ElTableSchemaColumnsProps<T extends DefaultRow = any> {
  /**
   * 列定义，同 `ElTableColumn` 的属性，额外支持 `children` 用于定义子列，
   * 列的 `slots` 同 `ElTableColumn` 的 `slots`
   */
  columns: ElTableColumnSchema<T>[]
}
