import type { TableDefaultRow } from '@vue-spark/compose-kit-runtime/table'
import type { VNodeChild } from 'vue'
import type { ElTableSchemaColumnsProps } from './interface'
import { isFunction } from '@vue-spark/compose-kit-runtime/utils'
import { ElTableColumn } from 'element-plus'
import { defineComponent, h, isVNode } from 'vue'

export type * from './interface'

export const ElTableSchemaColumns = /* @__PURE__ */ defineComponent(
  <T extends TableDefaultRow = any>(props: ElTableSchemaColumnsProps<T>) => {
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

        const { children, slots: finalSlots = {}, ...columnProps } = column

        vNodes.push(
          h(ElTableColumn, columnProps, {
            ...finalSlots,
            default:
              children && !finalSlots.default
                ? () => h(ElTableSchemaColumns<T>, { columns: children })
                : finalSlots.default,
          }),
        )
      }

      return vNodes
    }
  },

  {
    name: 'ElTableSchemaColumns',
    // 等待官方修复类型问题：https://github.com/vuejs/core/pull/13119
    props: ['columns'] as never,
  },
)
