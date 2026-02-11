<script setup lang="ts">
import { shallowReactive } from 'vue'
import { SectionLayout, SectionMain, useEditableList } from '@/shared'

interface User {
  id: number
  name: string
  role: string
}

let nextId = 100

const users = shallowReactive<User[]>([
  { id: 1, name: '张三', role: 'Admin' },
  { id: 2, name: '李四', role: 'Editor' },
  { id: 3, name: '王五', role: 'User' },
  { id: 4, name: '赵六', role: 'User' },
  { id: 5, name: '孙七', role: 'Editor' },
])

const editableList = useEditableList({
  list: users,
  toKey: (row) => row.id.toString(),
  factory: () => ({ id: nextId++, name: '', role: '' }),
})
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
          <ElSpace>
            <ElButton
              type="primary"
              @click="editableList.addNew()"
            >
              新增
            </ElButton>
            <ElButton @click="editableList.stopEditAll()">
              停止所有编辑
            </ElButton>
            <ElButton @click="editableList.resetAll()">
              重置所有
            </ElButton>
          </ElSpace>

          <ElTable
            :data="users"
            border
            style="width: 100%"
            :row-key="editableList.toKey"
          >
            <ElTableColumn
              prop="id"
              label="ID"
              width="80"
              align="center"
            />
            <ElTableColumn
              label="状态"
              width="100"
              align="center"
            >
              <template #default="{ row }">
                <ElTag :type="editableList.isEditing(row) ? 'warning' : 'info'">
                  {{ editableList.isEditing(row) ? '编辑中' : '未编辑' }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="姓名"
              min-width="120"
            >
              <template #default="{ row }">
                <ElInput
                  v-if="editableList.isEditing(row)"
                  v-model="editableList.getEditing(row)!.name"
                />
                <span v-else>{{ row.name }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="角色"
              min-width="120"
            >
              <template #default="{ row }">
                <ElInput
                  v-if="editableList.isEditing(row)"
                  v-model="editableList.getEditing(row)!.role"
                />
                <span v-else>{{ row.role }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="操作"
              width="240"
              align="center"
            >
              <template #default="{ row }">
                <ElSpace>
                  <ElButton
                    v-if="!editableList.isEditing(row)"
                    size="small"
                    @click="editableList.startEdit(row)"
                  >
                    编辑
                  </ElButton>
                  <ElButton
                    v-else
                    size="small"
                    @click="editableList.stopEdit(row)"
                  >
                    停止编辑
                  </ElButton>
                  <ElButton
                    v-if="editableList.isEditing(row)"
                    size="small"
                    @click="editableList.reset(row)"
                  >
                    重置
                  </ElButton>
                  <ElButton
                    v-if="editableList.isAdded(row)"
                    size="small"
                    type="danger"
                    @click="editableList.removeAdded(row)"
                  >
                    删除
                  </ElButton>
                </ElSpace>
              </template>
            </ElTableColumn>
          </ElTable>

          <ElAlert
            type="info"
            :closable="false"
          >
            <template #title>
              编辑状态信息
            </template>
            <div>
              <div>
                编辑中数据数量: {{ editableList.editingList.value.length }}
              </div>
              <div>
                新增数据 key:
                {{ editableList.addedKeys.value.join(', ') || '无' }}
              </div>
            </div>
          </ElAlert>
        </ElSpace>
      </div>
    </SectionMain>
  </SectionLayout>
</template>
