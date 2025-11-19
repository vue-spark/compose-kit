<script setup lang="ts">
import { SectionLayout, SectionMain } from '@/index'
</script>

<template>
  <SectionLayout>
    <!-- 主内容区域 -->
    <SectionMain card>
      <div style="padding: 16px">
        <ElText tag="b">
          SectionLayout 组件
        </ElText>
        <ElText>
          是一个灵活的布局组件，通过组合 SectionItem 和 SectionMain
          子组件实现自由布局。
        </ElText>

        <ElDivider />

        <div>
          <ElText tag="b">
            主要特性：
          </ElText>
          <ul style="margin: 8px 0; padding-left: 20px">
            <li>支持纵向和横向两种布局模式</li>
            <li>通过子组件自由组合布局结构</li>
            <li>SectionItem：固定尺寸的次要分区</li>
            <li>SectionMain：自动填充的主要分区</li>
            <li>支持嵌套 SectionLayout 作为主分区</li>
            <li>支持卡片样式包装</li>
          </ul>
        </div>

        <ElDivider />
      </div>
    </SectionMain>
  </SectionLayout>
</template>
