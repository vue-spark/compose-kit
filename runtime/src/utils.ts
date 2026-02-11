export function isFunction(val: unknown): val is (...args: any[]) => any {
  return typeof val === 'function'
}

export function objectPick<O extends object, T extends keyof O>(
  obj: O,
  keys: T[],
  omitUndefined = false,
): Pick<O, T> {
  return keys.reduce((o, k) => {
    if (k in obj) {
      if (!omitUndefined || obj[k] !== undefined) {
        o[k] = obj[k]
      }
    }
    return o
  }, {} as any)
}
