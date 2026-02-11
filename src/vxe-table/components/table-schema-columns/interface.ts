import type {
  TableColumnSchemaSlots,
  TableDefaultRow,
  TableFalsyColumnSchema,
  TableFunctionalColumnSchema,
} from '@vue-spark/compose-kit-runtime/table'
import type {
  VxeColgroupProps,
  VxeColgroupSlots,
  VxeColumnProps,
  VxeColumnSlots,
} from 'vxe-table'

export type ObjectVxeTableColgroupSchema<T extends TableDefaultRow = any> =
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

export type ObjectVxeTableColumnSchema<T extends TableDefaultRow = any> =
  VxeColumnProps<T> & {
    /**
     * 列插槽
     */
    slots?: TableColumnSchemaSlots<VxeColumnSlots<T>>
  }

export type VxeTableColumnSchema<T extends TableDefaultRow = any> =
  | TableFalsyColumnSchema |
  ObjectVxeTableColgroupSchema<T> |
  ObjectVxeTableColumnSchema<T> |
  TableFunctionalColumnSchema

export interface VxeTableSchemaColumnsProps<T extends TableDefaultRow = any> {
  /**
   * 列定义，同 `VxeColumn` 的属性，额外支持 `children` 用于定义子列，
   * 列的 `slots` 同 `VxeColumn` 的 `slots`
   */
  columns: VxeTableColumnSchema<T>[]
}
