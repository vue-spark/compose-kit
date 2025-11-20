import type {
  ElPagination,
  PaginationEmits,
  PaginationPropsPublic,
} from 'element-plus'
import type { ComponentSlots } from 'vue-component-type-helpers'
import type { UsePaginationReturn } from '../../../shared/hooks/use-pagination'

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

export interface ElUsePaginationEmits extends PaginationEmits {}

export interface ElUsePaginationSlots
  extends ComponentSlots<typeof ElPagination> {}
