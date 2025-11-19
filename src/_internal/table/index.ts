import type { VNodeArrayChildren, VNodeChild } from 'vue'

export interface DefaultRow {
  [K: PropertyKey]: any
}

export type TableColumnSchemaSlots<RawSlots> = {
  [K in keyof RawSlots]?: RawSlots[K]
} & {
  [K: string]: (data: any) => VNodeChild
}

export type FalsyTableColumnSchema = false | null | undefined

export type FunctionalTableColumnSchema = () => Exclude<
  VNodeChild,
  VNodeArrayChildren
>
