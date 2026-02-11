import type { ComputedRef, MaybeRefOrGetter, Reactive } from 'vue'
import {
  clearObject,
  toArray,
  warn,
} from '@vue-spark/compose-kit-runtime/utils'
import {
  computed,
  isRef,
  isShallow,
  reactive,
  shallowReactive,
  toRaw,
  toValue,
  triggerRef,
} from 'vue'

export interface ListDefaultRow {
  [K: PropertyKey]: any
}

export interface StopEditOptions {
  /**
   * 是否先将数据重置为快照状态
   * @default false
   */
  reset?: boolean
  /**
   * 是否移除通过 `addNew` 新增的数据
   * @default false
   */
  removeAdded?: boolean
}

export interface AddNewOptions {
  /**
   * 新数据的插入位置
   * - `'start'` — 在列表开头插入（默认）
   * - `'end'` — 在列表末尾插入
   * - `number` — 在指定索引位置插入（小于 0 视为 0，大于列表长度视为末尾）
   * @default 'start'
   */
  position?: 'start' | 'end' | number
}

export interface UseEditableListOptions<
  T extends ListDefaultRow = ListDefaultRow,
  K = any,
> {
  /**
   * 数据列表
   */
  list: MaybeRefOrGetter<T[]>
  /**
   * 获取数据的唯一标识
   */
  toKey: (data: T) => K
  /**
   * 新增数据的工厂函数，用于生成默认值。
   * `addNew` 传入数据时与 `factory()` 合并（传入值优先），未传入时直接使用 `factory()` 的返回值。
   * @default
   * ```ts
   * () => ({})
   * ```
   */
  factory?: () => Partial<T>
  /**
   * 自定义克隆函数，用于创建数据快照。
   * 注意：通过 `addNew` 新增的数据可能是 `Partial<T>`，克隆函数应能处理不完整数据。
   * @default
   * ```ts
   * (data) => structuredClone(toRaw(data))
   * ```
   */
  clone?: (data: T) => T
}

export interface UseEditableListReturn<
  T extends ListDefaultRow = ListDefaultRow,
  K = any,
> {
  /**
   * 获取数据的唯一标识
   */
  toKey: UseEditableListOptions<T, K>['toKey']
  /**
   * 是否有编辑中的数据
   */
  hasEditing: ComputedRef<boolean>
  /**
   * 当前正在编辑的数据列表
   */
  editingList: ComputedRef<Reactive<T>[]>
  /**
   * 当前正在编辑的数据 key 列表
   */
  editingKeys: ComputedRef<K[]>
  /**
   * 新增的数据 key 列表
   */
  addedKeys: ComputedRef<K[]>
  /**
   * 判断数据是否处于编辑状态
   */
  isEditing: (data: T) => boolean
  /**
   * 判断数据是否为新增数据
   */
  isAdded: (data: T) => boolean
  /**
   * 获取编辑中的响应式数据，不在编辑状态时返回 `undefined`
   */
  getEditing: (data: T) => Reactive<T> | undefined
  /**
   * 获取数据编辑前的快照，不在编辑状态时返回 `undefined`
   */
  getSnapshot: (data: T) => T | undefined
  /**
   * 开始编辑数据并保存快照
   */
  startEdit: (data: T | T[]) => void
  /**
   * 停止编辑数据，默认保留当前修改
   */
  stopEdit: (data: T | T[], options?: StopEditOptions) => void
  /**
   * 停止所有编辑，默认保留当前修改
   */
  stopEditAll: (options?: StopEditOptions) => void
  /**
   * 新增数据并自动进入编辑状态。
   * 每条数据会与 `factory()` 的返回值合并（传入值优先），未传入时直接使用 `factory()` 的返回值。
   */
  addNew: (data?: Partial<T> | Partial<T>[], options?: AddNewOptions) => void
  /**
   * 将数据重置为快照状态
   */
  reset: (data: T | T[]) => void
  /**
   * 重置所有编辑中的数据为快照状态
   */
  resetAll: () => void
  /**
   * 移除通过 `addNew` 新增的数据并清理编辑状态，非新增数据调用时忽略
   */
  removeAdded: (data: T | T[]) => void
  /**
   * 移除所有新增数据并清理编辑状态
   */
  removeAddedAll: () => void
}

/**
 * 管理通用列表的可编辑数据状态
 */
export function useEditableList<
  T extends ListDefaultRow = ListDefaultRow,
  K = any,
>({
  list,
  toKey,
  factory = () => ({}),
  clone = (data) => structuredClone(toRaw(data)),
}: UseEditableListOptions<T, K>): UseEditableListReturn<T, K> {
  const editing = shallowReactive(new Map<K, Reactive<T>>())
  const snapshots = shallowReactive(new Map<K, T>())
  const added = shallowReactive(new Set<K>())

  function restoreSnapshot(key: K): void {
    const item = editing.get(key)
    const snapshot = snapshots.get(key)
    if (item && snapshot) {
      clearObject(item)
      Object.assign(item, clone(snapshot))
    }
  }

  function triggerListUpdate(): void {
    if (isRef(list) && isShallow(list)) {
      triggerRef(list)
    }
  }

  function withListUpdate(fn: () => void): void {
    const listVal = toValue(list)
    const prevLength = listVal.length
    fn()
    listVal.length !== prevLength && triggerListUpdate()
  }

  function removeFromList(key: K): void {
    const listVal = toValue(list)
    const index = listVal.findIndex((d) => toKey(d) === key)
    if (index !== -1) {
      listVal.splice(index, 1)
    }
  }

  function clearEditState(key: K): void {
    editing.delete(key)
    snapshots.delete(key)
    added.delete(key)
  }

  function resolveInsertIndex(
    listVal: T[],
    position: AddNewOptions['position'] = 'start',
  ): number {
    switch (position) {
      case 'start': {
        return 0
      }

      case 'end': {
        return listVal.length
      }

      default: {
        return Math.max(0, Math.min(position, listVal.length))
      }
    }
  }

  function enterEditState(key: K, item: T): void {
    snapshots.set(key, clone(item))
    editing.set(key, reactive(item))
  }

  function doStopEdit(key: K, options: StopEditOptions): void {
    if (options.removeAdded && added.has(key)) {
      removeFromList(key)
    }
    else if (options.reset) {
      restoreSnapshot(key)
    }
    clearEditState(key)
  }

  const returned: UseEditableListReturn<T, K> = {
    toKey,
    hasEditing: computed(() => editing.size > 0),
    editingList: computed(() => Array.from(editing.values())),
    editingKeys: computed(() => Array.from(editing.keys())),
    addedKeys: computed(() => Array.from(added)),

    isEditing(data) {
      return editing.has(toKey(data))
    },

    isAdded(data) {
      return added.has(toKey(data))
    },

    getEditing(data) {
      return editing.get(toKey(data))
    },

    getSnapshot(data) {
      return snapshots.get(toKey(data))
    },

    startEdit(data) {
      toArray(data).forEach((item) => {
        const key = toKey(item)
        if (!editing.has(key)) {
          enterEditState(key, item)
        }
      })
    },

    stopEdit(data, options = {}) {
      withListUpdate(() => {
        toArray(data).forEach((item) => {
          const key = toKey(item)
          if (editing.has(key)) {
            doStopEdit(key, options)
          }
        })
      })
    },

    stopEditAll(options = {}) {
      withListUpdate(() => {
        Array.from(editing.keys()).forEach((key) => {
          doStopEdit(key, options)
        })
      })
    },

    addNew(data, options = {}) {
      const items: T[] =
        data != null
          ? toArray(data).map((item) => ({ ...factory(), ...item }) as T)
          : [factory() as T]

      withListUpdate(() => {
        const listVal = toValue(list)
        let insertIndex = resolveInsertIndex(listVal, options.position)

        items.forEach((item) => {
          const key = toKey(item)
          if (key == null) {
            warn(
              'useEditableList: toKey() returned null or undefined for addNew data. Ensure the data contains a valid key property or provide a factory that generates one. This item will be skipped.',
            )
            return
          }
          if (editing.has(key)) {
            warn(
              'useEditableList: addNew data has a duplicate key that is already being edited. This item will be skipped.',
            )
            return
          }
          listVal.splice(insertIndex++, 0, item)
          added.add(key)
          enterEditState(key, item)
        })
      })
    },

    reset(data) {
      toArray(data).forEach((item) => {
        const key = toKey(item)
        restoreSnapshot(key)
      })
    },

    resetAll() {
      Array.from(editing.keys()).forEach((key) => {
        restoreSnapshot(key)
      })
    },

    removeAdded(data) {
      withListUpdate(() => {
        toArray(data).forEach((item) => {
          const key = toKey(item)
          if (added.has(key)) {
            removeFromList(key)
            clearEditState(key)
          }
        })
      })
    },

    removeAddedAll() {
      withListUpdate(() => {
        Array.from(added).forEach((key) => {
          removeFromList(key)
          clearEditState(key)
        })
      })
    },
  }

  return returned
}
