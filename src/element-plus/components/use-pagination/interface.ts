import type {
  ElPagination,
  PaginationEmits,
  PaginationProps,
} from 'element-plus'
import type { ExtractPublicPropTypes } from 'vue'
import type { ComponentSlots } from 'vue-component-type-helpers'
import type { UsePaginationReturn } from '../../../shared/hooks/use-pagination'

export interface ElUsePaginationProps
  extends Omit<
    ExtractPublicPropTypes<PaginationProps>,
    'currentPage' | 'pageSize' | 'pageCount' | 'total'
  > {
  /**
   * 通过 `usePagination` 创建的控制器
   */
  pagination: UsePaginationReturn
}

export interface ElUsePaginationEmits extends PaginationEmits {}

export interface ElUsePaginationSlots
  extends ComponentSlots<typeof ElPagination> {}
