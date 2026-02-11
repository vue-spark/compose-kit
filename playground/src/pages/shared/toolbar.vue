<script setup lang="ts">
import { reactive } from 'vue'
import { SectionLayout, SectionMain, Toolbar } from '@/shared'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  date: '',
})

// 状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '进行中', value: 'active' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
]
</script>

<template>
  <SectionLayout height="100%">
    <!-- 示例区域 -->
    <SectionMain card>
      <div style="padding: 16px">
        <ElSpace
          direction="vertical"
          style="width: 100%"
          :size="24"
          fill
        >
          <!-- 基础示例 -->
          <div>
            <ElText
              tag="b"
              size="large"
            >
              1. 基础用法
            </ElText>
            <ElDivider style="margin: 12px 0" />
            <div style="padding: 16px; background: #f5f7fa; border-radius: 4px">
              <Toolbar title="页面标题">
                <template #default>
                  <ElButton size="small">
                    新增
                  </ElButton>
                  <ElButton size="small">
                    编辑
                  </ElButton>
                  <ElButton size="small">
                    删除
                  </ElButton>
                </template>
                <template #extra>
                  <ElButton size="small">
                    刷新
                  </ElButton>
                  <ElButton size="small">
                    设置
                  </ElButton>
                </template>
              </Toolbar>
            </div>
          </div>

          <!-- 搜索工具栏示例 -->
          <div>
            <ElText
              tag="b"
              size="large"
            >
              2. 搜索工具栏
            </ElText>
            <ElDivider style="margin: 12px 0" />
            <div style="padding: 16px; background: #f5f7fa; border-radius: 4px">
              <Toolbar title="数据列表">
                <ElInput
                  v-model="searchForm.keyword"
                  placeholder="请输入关键词"
                  style="width: 200px"
                  size="small"
                  clearable
                />

                <ElSelect
                  v-model="searchForm.status"
                  placeholder="状态"
                  style="width: 120px"
                  size="small"
                  clearable
                >
                  <ElOption
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>

                <ElDatePicker
                  v-model="searchForm.date"
                  type="date"
                  placeholder="选择日期"
                  style="width: 160px"
                  size="small"
                />

                <ElButton
                  type="primary"
                  size="small"
                >
                  搜索
                </ElButton>

                <ElButton size="small">
                  重置
                </ElButton>

                <template #extra>
                  <ElButton
                    type="primary"
                    size="small"
                  >
                    新增
                  </ElButton>
                  <ElButton size="small">
                    导出
                  </ElButton>
                </template>
              </Toolbar>
            </div>
          </div>
        </ElSpace>
      </div>
    </SectionMain>
  </SectionLayout>
</template>
