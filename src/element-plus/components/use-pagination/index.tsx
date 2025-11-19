import type {
  PaginationEmits as ElPaginationEmits,
  PaginationPropsPublic,
} from 'element-plus'
import type { Writable } from 'type-fest'
import type { FunctionalComponent } from 'vue'
import type { ComponentSlots } from 'vue-component-type-helpers'
import type { UsePaginationReturn } from '../../../shared/uses/use-pagination'
import { ElPagination } from 'element-plus'
import { mergeProps } from 'vue'
import { objectPick } from '../../../_internal/utils'
import { useSetupConfig } from '../../../setup-config'
import { defaultPropKeys } from './default-prop-keys'

export interface ElUsePaginationProps
  extends Partial<
    Omit<
      PaginationPropsPublic,
      'currentPage' | 'pageSize' | 'pageCount' | 'total'
    >
  > {
  /**
   * 通过 `usePagination` 创建的控制器
   */
  pagination: UsePaginationReturn
}

export interface ElUsePaginationEmits extends ElPaginationEmits {}

export interface ElUsePaginationSlots
  extends ComponentSlots<typeof ElPagination> {}

export const ElUsePagination: FunctionalComponent<
  ElUsePaginationProps,
  ElUsePaginationEmits,
  ElUsePaginationSlots
> = ({ pagination, ...props }, { attrs, slots }) => {
  const config = useSetupConfig().ElementPlus?.ElUsePagination
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
    props,

    {
      currentPage: currentPage.value,
      pageSize: currentPageSize.value,
      pageCount: pageCount.value,
      total: total.value,
    },
  )

  return <ElPagination {...finalProps}>{slots}</ElPagination>
}

ElUsePagination.props = {
  pagination: {
    type: Object,
    required: true,
  },
}
