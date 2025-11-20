import type { VNodeChild } from 'vue'
import type { DefaultRow } from '../../../_internal/table'
import type { VxeTableSchemaColumnsProps } from './interface'
import { defineComponent, h, isVNode } from 'vue'
import { VxeColgroup, VxeColumn } from 'vxe-table'
import { isFunction } from '../../../_internal/utils'

export type * from './interface'

export const VxeTableSchemaColumns = /* @__PURE__ */ defineComponent(
  <T extends DefaultRow = any>(props: VxeTableSchemaColumnsProps<T>) => {
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
            h(VxeColgroup, colgroupProps, {
              ...finalSlots,
              default:
                children && !finalSlots.default
                  ? () => h(VxeTableSchemaColumns<T>, { columns: children })
                  : finalSlots.default,
            }),
          )
        }
        else {
          const { slots: finalSlots = {}, ...columnProps } = column

          vNodes.push(h(VxeColumn, columnProps, finalSlots))
        }
      }

      return vNodes
    }
  },
  {
    name: 'VxeTableSchemaColumns',
    // 等待官方修复类型问题：https://github.com/vuejs/core/pull/13119
    props: ['columns'] as never,
  },
)
