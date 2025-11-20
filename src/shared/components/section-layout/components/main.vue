<script lang="ts" setup>
import type { SectionMainProps } from '../interface'
import { createBEM } from '../../../../_internal/bem'
import { useSetupConfig } from '../../../setup-config'

defineOptions({
  name: 'SectionMain',
})

defineProps<SectionMainProps>()

const config = useSetupConfig().SectionLayout
const bem = createBEM('section-main')
</script>

<template>
  <div :class="[bem.b(), card && [config?.cardClass, bem.m('card')]]">
    <slot />
  </div>
</template>
