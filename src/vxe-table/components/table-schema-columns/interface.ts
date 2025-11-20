import type {
  VxeColgroupProps,
  VxeColgroupSlots,
  VxeColumnProps,
  VxeColumnSlots,
} from 'vxe-table'
import type {
  DefaultRow,
  FalsyTableColumnSchema,
  FunctionalTableColumnSchema,
  TableColumnSchemaSlots,
} from '../../../_internal/table'

export type ObjectVxeTableColgroupSchema<T extends DefaultRow = any> =
  VxeColgroupProps & {
    /**
     * 列分组插槽
     */
    slots?: TableColumnSchemaSlots<VxeColgroupSlots<T>>

    /**
     * 子列定义
     */
    children?: VxeTableColumnSchema<T>[]
  }

export type ObjectVxeTableColumnSchema<T extends DefaultRow = any> =
  VxeColumnProps<T> & {
    /**
     * 列插槽
     */
    slots?: TableColumnSchemaSlots<VxeColumnSlots<T>>
  }

export type VxeTableColumnSchema<T extends DefaultRow = any> =
  | FalsyTableColumnSchema |
  ObjectVxeTableColgroupSchema<T> |
  ObjectVxeTableColumnSchema<T> |
  FunctionalTableColumnSchema

export interface VxeTableSchemaColumnsProps<T extends DefaultRow = any> {
  /**
   * 列定义，同 `VxeColumn` 的属性，额外支持 `children` 用于定义子列，
   * 列的 `slots` 同 `VxeColumn` 的 `slots`
   */
  columns: VxeTableColumnSchema<T>[]
}
