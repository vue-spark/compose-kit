import type { PaginationPropsPublic } from 'element-plus'
import type { Simplify } from 'type-fest'
import type { defaultPropKeys as UsePaginationDefaultPropKeys } from './components/use-pagination/default-prop-keys'

declare module '../global-config' {
  interface GlobalConfig {
    ElementPlus?: {
      ElUsePagination?: {
        /**
         * 默认属性
         */
        defaultProps?: Simplify<
          Pick<
            PaginationPropsPublic,
            (typeof UsePaginationDefaultPropKeys)[number]
          >
        >
      }
    }
  }
}
