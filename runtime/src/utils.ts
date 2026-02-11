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

export function toArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val]
}

export function clearObject(obj: object): void {
  Object.keys(obj).forEach((k) => {
    delete obj[k as keyof typeof obj]
  })
}

export function warn(...args: any[]): void {
  console.warn('[Compose Kit]', ...args)
}
