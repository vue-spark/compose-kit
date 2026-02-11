<script lang="ts" setup>
import type { SectionMainProps } from '../interface'
import { createBEM, useGlobalConfig } from '@vue-spark/compose-kit-runtime'

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
