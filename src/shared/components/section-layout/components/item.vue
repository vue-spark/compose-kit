<script lang="ts" setup>
import type { SectionItemProps } from '../interface'
import { createBEM } from '../../../../_internal/bem'
import { useGlobalConfig } from '../../../../global-config'

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
