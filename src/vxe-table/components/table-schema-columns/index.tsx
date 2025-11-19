import type { VNodeChild } from 'vue'
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
import { defineComponent, isVNode } from 'vue'
import { VxeColgroup, VxeColumn } from 'vxe-table'
import { isFunction } from '../../../_internal/utils'

export type ObjectVxeTableColgroupSchema<T extends DefaultRow> =
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

export type ObjectVxeTableColumnSchema<T extends DefaultRow> =
  VxeColumnProps<T> & {
    /**
     * 列插槽
     */
    slots?: TableColumnSchemaSlots<VxeColumnSlots<T>>
  }

export type VxeTableColumnSchema<T extends DefaultRow> =
  | FalsyTableColumnSchema |
  ObjectVxeTableColgroupSchema<T> |
  ObjectVxeTableColumnSchema<T> |
  FunctionalTableColumnSchema

export interface VxeTableSchemaColumnsProps<T extends DefaultRow> {
  /**
   * 列定义，同 `VxeColumn` 的属性，额外支持 `children` 用于定义子列，
   * 列的 `slots` 同 `VxeColumn` 的 `slots`
   */
  columns: VxeTableColumnSchema<T>[]
}

export const VxeTableSchemaColumns = defineComponent(
  <T extends DefaultRow>(props: VxeTableSchemaColumnsProps<T>) => {
    return () => {
      const vNodes: VNodeChild = []

      for (const column of props.columns) {
        if (!column) {
          continue
        }

        if (isFunction(column)) {
          const vNode = column()
          // 只有在返回 VNode 时才添加到列表中
          isVNode(vNode) && vNodes.push(vNode)
          continue
        }

        if ('children' in column) {
          const { children, slots: finalSlots = {}, ...colgroupProps } = column

          vNodes.push(
            <VxeColgroup {...colgroupProps}>
              {{
                ...finalSlots,
                default:
                  children && !finalSlots.default
                    ? () => <VxeTableSchemaColumns columns={children} />
                    : finalSlots.default,
              }}
            </VxeColgroup>,
          )
        }
        else {
          const { slots: finalSlots = {}, ...columnProps } = column

          vNodes.push(<VxeColumn {...columnProps}>{finalSlots}</VxeColumn>)
        }
      }

      return vNodes
    }
  },
  {
    // 等待官方修复类型问题：https://github.com/vuejs/core/pull/13119
    props: ['columns'] as never,
  },
)
