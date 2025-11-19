import type { Arrayable } from 'type-fest'

export type BemModifiers = Record<string, boolean | undefined | null>

export interface BEM {
  namespace: string

  b: (
    modifiers?: BemModifiers | Arrayable<string>,
    customClass?: Arrayable<string>,
  ) => any[]
  e: (
    element: string,
    modifiers?: BemModifiers | Arrayable<string>,
    customClass?: Arrayable<string>,
  ) => any[]
  m: (modifier: string) => string
  em: (element: string, modifier: string) => string
  is: (state: string) => string
}

const baseNamespace = 'v'

/**
 * 创建 BEM 工具函数集合
 * @param block 块名
 */
export function createBEM(block: string): BEM {
  const namespace = `${baseNamespace}-${block}`

  return {
    namespace,

    b(modifiers, customClass) {
      const classes: any[] = [namespace]

      if (
        modifiers &&
        typeof modifiers === 'object' &&
        !Array.isArray(modifiers)
      ) {
        // 处理修饰符
        Object.entries(modifiers).forEach(([key, value]) => {
          if (value) {
            classes.push(`${namespace}--${key}`)
          }
        })

        // 处理自定义类名
        if (customClass) {
          classes.push(customClass)
        }
      }
      else if (modifiers) {
        // 直接传入自定义类名
        classes.push(modifiers)
      }

      return classes
    },

    e(element, modifiers, customClass) {
      const elementClass = `${namespace}__${element}`
      const classes: any[] = [elementClass]

      if (
        modifiers &&
        typeof modifiers === 'object' &&
        !Array.isArray(modifiers)
      ) {
        // 处理修饰符
        Object.entries(modifiers).forEach(([key, value]) => {
          if (value) {
            classes.push(`${elementClass}--${key}`)
          }
        })

        // 处理自定义类名
        if (customClass) {
          classes.push(customClass)
        }
      }
      else if (modifiers) {
        // 直接传入自定义类名
        classes.push(modifiers)
      }

      return classes
    },

    m(modifier) {
      return `${namespace}--${modifier}`
    },

    em(element, modifier) {
      return `${namespace}__${element}--${modifier}`
    },

    is(state) {
      return `is-${state}`
    },
  }
}
