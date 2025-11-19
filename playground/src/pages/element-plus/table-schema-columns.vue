<script setup lang="ts">
import type { ElTableColumnSchema } from '@/element-plus'
import { ref } from 'vue'
import { ElTableSchemaColumns, ElUsePagination } from '@/element-plus'
import { SectionLayout, SectionMain, usePagination } from '@/index'
import { sleep } from '../../utils'

interface BasicDataItem {
  id: number
  name: string
  email: string
  age: number
  status: 'active' | 'inactive' | 'pending'
}

const basicData = ref<BasicDataItem[]>([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    age: 28,
    status: 'active',
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    age: 32,
    status: 'inactive',
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    age: 25,
    status: 'pending',
  },
])

const basicColumns: ElTableColumnSchema<BasicDataItem>[] = [
  {
    prop: 'id',
    label: 'ID',
    width: 80,
    align: 'center',
  },
  {
    prop: 'name',
    label: '姓名',
    width: 120,
  },
  {
    prop: 'email',
    label: '邮箱',
    minWidth: 200,
  },
  {
    prop: 'age',
    label: '年龄',
    width: 100,
    align: 'center',
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
  },
]

interface PaginationDataItem {
  id: number
  username: string
  email: string
  role: string
  department: string
  joinDate: string
  status: 'active' | 'inactive' | 'pending'
}

const paginationData = ref<PaginationDataItem[]>([])
const paginationLoading = ref(false)
const totalItems = ref(156)

const pagination = usePagination({
  total: () => totalItems.value,
  pageSize: 10,
  onChange: async ({ page, pageSize }) => {
    await loadPaginationData(page, pageSize)
  },
})

async function loadPaginationData(page: number, pageSize: number) {
  paginationLoading.value = true
  try {
    await sleep(500)
    const start = (page - 1) * pageSize
    const roles = ['管理员', '编辑', '用户'] as const
    const departments = ['技术部', '产品部', '运营部', '市场部'] as const
    const statuses = ['active', 'inactive', 'pending'] as const

    paginationData.value = Array.from(
      { length: Math.min(pageSize, totalItems.value - start) },
      (_, i) => {
        const roleIndex = Math.floor(Math.random() * 3) as 0 | 1 | 2
        const deptIndex = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3
        const statusIndex = Math.floor(Math.random() * 3) as 0 | 1 | 2
        return {
          id: start + i + 1,
          username: `user${start + i + 1}`,
          email: `user${start + i + 1}@example.com`,
          role: roles[roleIndex],
          department: departments[deptIndex],
          joinDate: new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString(),
          status: statuses[statusIndex],
        }
      },
    )
  }
  finally {
    paginationLoading.value = false
  }
}

// 初始加载
loadPaginationData(1, 10)

const paginationColumns: ElTableColumnSchema<PaginationDataItem>[] = [
  {
    prop: 'id',
    label: 'ID',
    width: 80,
    align: 'center',
  },
  {
    prop: 'username',
    label: '用户名',
    width: 120,
  },
  {
    prop: 'email',
    label: '邮箱',
    minWidth: 180,
  },
  {
    prop: 'role',
    label: '角色',
    width: 100,
    align: 'center',
    slots: {
      default: ({ row }) => row.role,
    },
  },
  {
    prop: 'department',
    label: '部门',
    width: 120,
    align: 'center',
  },
  {
    prop: 'joinDate',
    label: '加入日期',
    width: 120,
    align: 'center',
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    slots: {
      default: ({ row }) => getStatusText(row.status),
    },
  },
]

// 获取状态文本
function getStatusText(status: string) {
  const map: Record<string, string> = {
    active: '活跃',
    inactive: '停用',
    pending: '待审核',
  }
  return map[status] || status
}
</script>

<template>
  <SectionLayout height="100%">
    <!-- 示例区域 -->
    <SectionMain card>
      <ElSpace
        direction="vertical"
        style="width: 100%"
        :size="24"
        fill
      >
        <ElTable
          :data="basicData"
          border
          stripe
          style="width: 100%"
        >
          <ElTableSchemaColumns :columns="basicColumns" />
        </ElTable>

        <ElTable
          v-loading="paginationLoading"
          :data="paginationData"
          border
          stripe
          style="width: 100%"
        >
          <ElTableSchemaColumns :columns="paginationColumns" />
        </ElTable>
        <div style="display: flex; justify-content: flex-end">
          <ElUsePagination
            :pagination="pagination"
            background
            layout="prev, pager, next, jumper, sizes, total"
            :page-sizes="[10, 20, 30, 50]"
          />
        </div>
      </ElSpace>
    </SectionMain>
  </SectionLayout>
</template>
