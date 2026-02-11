<script setup lang="ts">
import type { ToolbarProps, ToolbarSlots } from './interface'
import { createBEM } from '@vue-spark/compose-kit-runtime'

defineOptions({
  name: 'Toolbar',
})

defineProps<ToolbarProps>()

defineSlots<ToolbarSlots>()

const bem = createBEM('toolbar')
</script>

<template>
  <div :class="[bem.b()]">
    <div :class="[bem.e('left')]">
      <div
        :style="titleStyle"
        :class="[bem.e('title'), titleClass]"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>

      <div :class="[bem.e('divider')]" />

      <div
        :class="[bem.e('content'), contentClass]"
        :style="contentStyle"
      >
        <slot />
      </div>
    </div>

    <div
      :class="[bem.e('extra'), extraClass]"
      :style="extraStyle"
    >
      <slot name="extra" />
    </div>
  </div>
</template>

<style src="./index.css"></style>
