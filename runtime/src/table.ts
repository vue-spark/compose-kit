import type { VNodeArrayChildren, VNodeChild } from 'vue'

export interface TableDefaultRow {
  [K: PropertyKey]: any
}

export type TableColumnSchemaSlots<RawSlots> = {
  [K in keyof RawSlots]?: RawSlots[K]
} & {
  [K: string]: (data: any) => VNodeChild
}

export type TableFalsyColumnSchema = false | null | undefined

export type TableFunctionalColumnSchema = () => Exclude<
  VNodeChild,
  VNodeArrayChildren
>
