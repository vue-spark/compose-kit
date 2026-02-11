// 参考 element-plus 实现
import type { App, InjectionKey, MaybeRefOrGetter, Ref } from 'vue'
import {
  computed,
  getCurrentInstance,
  inject,
  provide,
  ref,
  toValue,
} from 'vue'
import { warn } from './utils'

export interface GlobalConfig {
  SectionLayout?: {
    /**
     * 内置卡片样式类名，方便统一设置卡片样式
     */
    cardClass?: any
  }
}

export const globalConfigContextKey: InjectionKey<Ref<GlobalConfig>> = Symbol(
  'Compose Kit Global Config',
)

const initialConfig = {}
const globalConfig = ref<GlobalConfig>(initialConfig)

export function useGlobalConfig<
  K extends keyof GlobalConfig,
  D extends GlobalConfig[K],
>(key: K, defaultValue?: D): Ref<Exclude<GlobalConfig[K], undefined> | D>
export function useGlobalConfig(): Ref<GlobalConfig>
export function useGlobalConfig(
  key?: keyof GlobalConfig,
  defaultValue = undefined,
): Ref<any> {
  const config = getCurrentInstance()
    ? inject(globalConfigContextKey, globalConfig)
    : globalConfig
  if (key) {
    return computed(() => config.value[key] ?? defaultValue)
  }
  else {
    return config
  }
}

export function provideGlobalConfig(
  config: MaybeRefOrGetter<GlobalConfig>,
  app?: App,
  global = false,
): Ref<GlobalConfig> | undefined {
  const inSetup = !!getCurrentInstance()
  const oldConfig = inSetup ? useGlobalConfig() : undefined

  const provideFn = app?.provide ?? (inSetup ? provide : undefined)
  if (!provideFn) {
    warn('provideGlobalConfig() can only be used inside setup().')
    return
  }

  const context = computed(() => {
    const cfg = toValue(config)
    if (!oldConfig?.value || oldConfig.value === initialConfig) {
      return cfg
    }
    return mergeConfig(oldConfig.value, cfg)
  })

  provideFn(globalConfigContextKey, context)

  if (global || globalConfig.value === initialConfig) {
    globalConfig.value = context.value
  }

  return context
}

function mergeConfig(a: GlobalConfig, b: GlobalConfig): GlobalConfig {
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])]
  const obj: Record<string, any> = {}
  for (const key of keys) {
    obj[key] =
      b[key as keyof typeof b] !== undefined
        ? b[key as keyof typeof b]
        : a[key as keyof typeof a]
  }
  return obj
}
