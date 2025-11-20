<script lang="ts" setup>
import type { SectionLayoutProps } from './interface'
import { computed } from 'vue'
import { createBEM } from '../../../_internal/bem'
import { useSetupConfig } from '../../setup-config'

defineOptions({
  name: 'SectionLayout',
})

const props = defineProps<SectionLayoutProps>()

const config = useSetupConfig().SectionLayout
const bem = createBEM('section-layout')
const direction = computed(() => props.direction || 'vertical')
</script>

<template>
  <div
    :class="[
      bem.b(),
      card && [config?.cardClass, bem.m('card')],
      `${bem.m(direction)}`,
    ]"
  >
    <slot />
  </div>
</template>

<style src="./index.css"></style>
