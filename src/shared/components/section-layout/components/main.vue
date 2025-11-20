<script lang="ts" setup>
import type { SectionMainProps } from '../interface'
import { createBEM } from '../../../../_internal/bem'
import { useGlobalConfig } from '../../../../global-config'

defineOptions({
  name: 'SectionMain',
})

defineProps<SectionMainProps>()

const config = useGlobalConfig('SectionLayout')
const bem = createBEM('section-main')
</script>

<template>
  <div :class="[bem.b(), card && [config?.cardClass, bem.m('card')]]">
    <slot />
  </div>
</template>
