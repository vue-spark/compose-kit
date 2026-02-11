<script lang="ts" setup>
import type { SectionItemProps } from '../interface'
import { createBEM, useGlobalConfig } from '@vue-spark/compose-kit-runtime'

defineOptions({
  name: 'SectionItem',
})

defineProps<SectionItemProps>()

const config = useGlobalConfig('SectionLayout')
const bem = createBEM('section-item')
</script>

<template>
  <div :class="[bem.b(), card && [config?.cardClass, bem.m('card')]]">
    <slot />
  </div>
</template>
