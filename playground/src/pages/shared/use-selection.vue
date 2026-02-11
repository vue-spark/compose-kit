<script setup lang="ts">
import { computed, ref } from 'vue'
import { SectionLayout, SectionMain, useSelection } from '@/shared'

interface User {
  id: number
  name: string
  role: string
  disabled?: boolean
}

const users = ref<User[]>([
  { id: 1, name: '张三', role: 'Admin' },
  { id: 2, name: '李四', role: 'Editor' },
  { id: 3, name: '王五', role: 'User', disabled: true },
  { id: 4, name: '赵六', role: 'User' },
  { id: 5, name: '孙七', role: 'Editor', disabled: true },
  { id: 6, name: '周八', role: 'Admin' },
])

const selection = useSelection<User, number>({
  toKey: (row) => row.id,
  selectable: (row) => !row.disabled,
})

const selectedNames = computed(() =>
  selection.selection.value.map((r) => r.name),
)
</script>

<template>
  <SectionLayout height="100%">
    <SectionMain card>
      <div style="padding: 16px">
        <ElSpace
          direction="vertical"
          fill
          style="width: 100%"
        >
          <ElText tag="b">
            1. 基础用法
          </ElText>

          <ElTable
            :data="users"
            border
            style="width: 100%"
          >
            <ElTableColumn
              label="选择"
              width="80"
              align="center"
            >
              <template #default="{ row }">
                <ElCheckbox
                  :model-value="selection.isSelected(row)"
                  :disabled="!selection.isSelectable(row)"
                  @change="(val) => selection.toggleSelection(row, !!val)"
                />
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="id"
              label="ID"
              width="80"
              align="center"
            />
            <ElTableColumn
              prop="name"
              label="姓名"
            />
            <ElTableColumn
              prop="role"
              label="角色"
              width="120"
              align="center"
            />
            <ElTableColumn
              label="可选"
              width="100"
              align="center"
            >
              <template #default="{ row }">
                <ElTag :type="row.disabled ? 'danger' : 'success'">
                  {{ row.disabled ? '不可选' : '可选' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>

          <ElAlert
            type="info"
            :closable="false"
          >
            <template #title>
              当前选择
            </template>
            <div>
              <div>
                选中键（ids）:
                {{ selection.selectedKeys.value.join(', ') || '无' }}
              </div>
              <div>选中项: {{ selectedNames.join(', ') || '无' }}</div>
            </div>
          </ElAlert>
        </ElSpace>
      </div>
    </SectionMain>
  </SectionLayout>
</template>
