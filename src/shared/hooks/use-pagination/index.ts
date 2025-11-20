import type {
  UseOffsetPaginationOptions,
  UseOffsetPaginationReturn,
} from '@vueuse/core'
import type { SetRequired } from 'type-fest'
import type { ComputedRef } from 'vue'
import { useOffsetPagination } from '@vueuse/core'
import { computed, toValue, watch } from 'vue'

export interface UsePaginationOptions
  extends SetRequired<UseOffsetPaginationOptions, 'total'> {
  /**
   * 页码或每页数量变化时的回调
   */
  onChange?: (data: { page: number, pageSize: number }) => void
}

export interface UsePaginationReturn extends UseOffsetPaginationReturn {
  /**
   * `options.total`
   */
  total: ComputedRef<number>
  /**
   * 跳转到指定页码
   */
  jumpTo: (page: number) => void
}

/**
 * 基于 `useOffsetPagination` 的扩展版
 */
export function usePagination(
  options: UsePaginationOptions,
): UsePaginationReturn {
  const returned = useOffsetPagination(options) as UsePaginationReturn
  returned.total = computed(() => toValue(options.total))
  returned.jumpTo = (page) => {
    returned.currentPage.value = page
  }

  watch([returned.currentPage, returned.currentPageSize], () => {
    options.onChange?.({
      page: returned.currentPage.value,
      pageSize: returned.currentPageSize.value,
    })
  })

  return returned
}
