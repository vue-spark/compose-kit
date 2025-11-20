import type { PaginationPropsPublic } from 'element-plus'
import type { Writable } from 'type-fest'
import type { FunctionalComponent } from 'vue'
import type {
  ElUsePaginationEmits,
  ElUsePaginationProps,
  ElUsePaginationSlots,
} from './interface'
import { ElPagination } from 'element-plus'
import { h, mergeProps } from 'vue'
import { objectPick } from '../../../_internal/utils'
import { useGlobalConfig } from '../../../global-config'
import { defaultPropKeys } from './default-prop-keys'

export type * from './interface'

export const ElUsePagination: FunctionalComponent<
  ElUsePaginationProps,
  ElUsePaginationEmits,
  ElUsePaginationSlots
> = ({ pagination }, { attrs, slots }) => {
  const config = useGlobalConfig('ElementPlus').value?.ElUsePagination
  const { currentPage, currentPageSize, pageCount, total } = pagination

  const finalProps: PaginationPropsPublic = mergeProps(
    objectPick(
      config?.defaultProps || {},
      defaultPropKeys as Writable<typeof defaultPropKeys>,
    ),

    // 需要与 attrs 内的事件名保持一致
    {
      'onUpdate:currentPage': (v: number) => {
        currentPage.value = v
      },
      'onUpdate:pageSize': (v: number) => {
        currentPageSize.value = v
      },
    },

    attrs,

    {
      currentPage: currentPage.value,
      pageSize: currentPageSize.value,
      pageCount: pageCount.value,
      total: total.value,
    },
  )

  return h(ElPagination, finalProps, slots)
}

ElUsePagination.props = {
  pagination: {
    type: Object,
    required: true,
  },
}
