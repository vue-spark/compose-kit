<script lang="ts" setup>
import type { SectionLayoutProps } from './interface'
import { createBEM, useGlobalConfig } from '@vue-spark/compose-kit-runtime'
import { computed } from 'vue'

defineOptions({
  name: 'SectionLayout',
})

const props = defineProps<SectionLayoutProps>()

const config = useGlobalConfig('SectionLayout')
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
