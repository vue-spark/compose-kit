import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { isFunction } from '@vue-spark/compose-kit-runtime/utils'
import { computed, shallowReactive, toValue } from 'vue'

export interface UseSelectionOptions<T = any, K = any> {
  /**
   * 是否为单选模式，开启后每次选择前会清空之前的选择
   */
  singleSelect?: MaybeRefOrGetter<boolean>
  /**
   * 获取数据的 key
   */
  toKey: (data: T) => K
  /**
   * 是否可选
   * @default
   * ```ts
   * () => true
   * ```
   */
  selectable?: (data: T) => boolean
}

export interface UseSelectionReturn<T = any, K = any> {
  /**
   * 选中的数据列表
   */
  selection: ComputedRef<T[]>
  /**
   * 选中的数据 key 列表
   */
  selectedKeys: ComputedRef<K[]>
  /**
   * 是否为单选模式
   */
  isSingleSelect: ComputedRef<boolean>
  /**
   * 获取数据的 key
   */
  toKey: UseSelectionOptions<T, K>['toKey']
  /**
   * 是否选中某条数据
   */
  isSelected: (data: T) => boolean
  /**
   * 是否可选某条数据
   */
  isSelectable: (data: T) => boolean
  /**
   * 切换选中项
   * @param data 数据
   * @param selected 是否选中
   * @param ignoreSelectable 是否忽略 selectable 选项，默认为 false
   */
  toggleSelection: (
    data: T,
    selected?: boolean,
    ignoreSelectable?: boolean,
  ) => void
  /**
   * 批量切换选中项
   * @param data 数据列表
   * @param selected 是否选中
   * @param ignoreSelectable 是否忽略 selectable 选项
   */
  batchToggleSelection: (
    data: T[],
    selected?: boolean,
    ignoreSelectable?: boolean | ((data: T) => boolean | undefined),
  ) => void
  /**
   * 清空选中项
   */
  clearSelection: () => void
}

export function useSelection<T, K = any>({
  singleSelect = false,
  toKey,
  selectable = () => true,
}: UseSelectionOptions<T, K>): UseSelectionReturn<T, K> {
  const selection = shallowReactive(new Map<any, T>())

  const returned: UseSelectionReturn<T> = {
    selection: computed(() => Array.from(selection.values())),
    selectedKeys: computed(() => Array.from(selection.keys())),
    isSingleSelect: computed(() => toValue(singleSelect)),
    toKey,
    isSelected(data) {
      return selection.has(toKey(data))
    },
    isSelectable(data) {
      return selectable(data)
    },
    toggleSelection(
      data,
      selected = !returned.isSelected(data),
      ignoreSelectable,
    ) {
      if (!ignoreSelectable && !selectable(data)) {
        return
      }

      if (toValue(singleSelect)) {
        returned.clearSelection()
      }

      if (selected) {
        selection.set(toKey(data), data)
      }
      else {
        selection.delete(toKey(data))
      }
    },
    batchToggleSelection(data, selected, ignoreSelectable) {
      const ignoreSelectableFn = isFunction(ignoreSelectable)
        ? ignoreSelectable
        : () => ignoreSelectable

      data.forEach((item) => {
        returned.toggleSelection(item, selected, ignoreSelectableFn(item))
      })
    },
    clearSelection() {
      selection.clear()
    },
  }

  return returned
}
