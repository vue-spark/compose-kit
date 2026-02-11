<script setup lang="ts">
import type { ElTableColumnSchema } from '@/element-plus'
import { ElTableColumn, ElTag } from 'element-plus'
import { h, ref } from 'vue'
import { ElTableSchemaColumns } from '@/element-plus'
import { SectionLayout, SectionMain } from '@/shared'

interface UserRow {
  id: number
  name: string
  email: string
  age: number
  status: 'active' | 'inactive' | 'pending'
  department: string
  createdAt: string
}

const users = ref<UserRow[]>([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    age: 28,
    status: 'active',
    department: '技术部',
    createdAt: '2024-03-01',
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    age: 32,
    status: 'inactive',
    department: '产品部',
    createdAt: '2024-02-18',
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    age: 25,
    status: 'pending',
    department: '运营部',
    createdAt: '2024-04-10',
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    age: 30,
    status: 'active',
    department: '技术部',
    createdAt: '2024-01-05',
  },
  {
    id: 5,
    name: '孙七',
    email: 'sunqi@example.com',
    age: 27,
    status: 'active',
    department: '市场部',
    createdAt: '2024-03-20',
  },
])

// 1. 基础用法：用对象数组描述列
const basicColumns: ElTableColumnSchema<UserRow>[] = [
  {
    type: 'index',
    label: '#',
    width: 60,
    align: 'center',
  },
  {
    prop: 'name',
    label: '姓名',
    minWidth: 120,
  },
  {
    prop: 'email',
    label: '邮箱',
    minWidth: 200,
  },
  {
    prop: 'age',
    label: '年龄',
    width: 80,
    align: 'center',
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
  },
]

// 2. 列分组（children）+ 自定义插槽
const groupColumns: ElTableColumnSchema<UserRow>[] = [
  {
    type: 'index',
    label: '#',
    width: 60,
    align: 'center',
  },
  {
    label: '用户信息',
    children: [
      {
        prop: 'name',
        label: '姓名',
        minWidth: 120,
      },
      {
        prop: 'email',
        label: '邮箱',
        minWidth: 200,
      },
    ],
  },
  {
    label: '其它信息',
    children: [
      {
        prop: 'age',
        label: '年龄',
        width: 80,
        align: 'center',
      },
      {
        prop: 'status',
        label: '状态',
        width: 120,
        align: 'center',
        slots: {
          default: ({ row }) => getStatusTag(row.status),
        },
      },
    ],
  },
]

// 3. 自定义 slots + 函数式列定义
const slotColumns: ElTableColumnSchema<UserRow>[] = [
  {
    prop: 'name',
    label: '姓名（带部门）',
    minWidth: 200,
    slots: {
      default: ({ row }) => `${row.name}（${row.department}）`,
    },
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    minWidth: 160,
  },
  {
    prop: 'status',
    label: '状态标签',
    width: 140,
    align: 'center',
    slots: {
      default: ({ row }) => getStatusTag(row.status),
    },
  },
]

const functionalColumns: ElTableColumnSchema<UserRow>[] = [
  () =>
    h(ElTableColumn, {
      type: 'index',
      label: '序号',
      width: 60,
      align: 'center',
    }),
  () =>
    h(ElTableColumn, {
      prop: 'name',
      label: '姓名',
      minWidth: 120,
    }),
  () =>
    h(
      ElTableColumn,
      {
        label: '操作（函数式列）',
        width: 200,
        align: 'center',
      },
      {
        default: () => [
          h(
            'span',
            {
              style:
                'color: var(--el-color-primary); cursor: pointer; margin-right: 8px',
            },
            '查看',
          ),
          h(
            'span',
            { style: 'color: var(--el-color-danger); cursor: pointer' },
            '删除',
          ),
        ],
      },
    ),
]

function getStatusTag(status: UserRow['status']) {
  const map: Record<
    UserRow['status'],
    { text: string, type: 'success' | 'info' | 'warning' }
  > = {
    active: { text: '在职', type: 'success' },
    inactive: { text: '离职', type: 'info' },
    pending: { text: '待入职', type: 'warning' },
  }

  const { text, type } = map[status]

  return h(ElTag, { type, size: 'small' }, () => text)
}
</script>

<template>
  <SectionLayout height="100%">
    <SectionMain card>
      <div style="padding: 16px">
        <ElSpace
          direction="vertical"
          :size="24"
          fill
          style="width: 100%"
        >
          <!-- 1. 基础用法 -->
          <div>
            <ElText
              tag="b"
              size="large"
            >
              1. 基础用法：用对象数组描述列
            </ElText>
            <ElDivider style="margin: 12px 0" />
            <div style="padding: 16px; background: #f5f7fa; border-radius: 4px">
              <ElTable
                :data="users"
                border
                stripe
                style="width: 100%"
              >
                <ElTableSchemaColumns :columns="basicColumns" />
              </ElTable>
            </div>
          </div>

          <!-- 2. 分组列（children）+ 插槽 -->
          <div>
            <ElText
              tag="b"
              size="large"
            >
              2. 列分组（children）+ 自定义插槽
            </ElText>
            <ElDivider style="margin: 12px 0" />
            <div style="padding: 16px; background: #f5f7fa; border-radius: 4px">
              <ElTable
                :data="users"
                border
                stripe
                style="width: 100%"
              >
                <ElTableSchemaColumns :columns="groupColumns" />
              </ElTable>
            </div>
          </div>

          <!-- 3. 自定义 slots + 函数式列 -->
          <div>
            <ElText
              tag="b"
              size="large"
            >
              3. 自定义 slots + 函数式列
            </ElText>
            <ElDivider style="margin: 12px 0" />
            <div style="padding: 16px; background: #f5f7fa; border-radius: 4px">
              <ElSpace
                direction="vertical"
                :size="16"
                fill
                style="width: 100%"
              >
                <ElTable
                  :data="users"
                  border
                  stripe
                  style="width: 100%"
                >
                  <ElTableSchemaColumns :columns="slotColumns" />
                </ElTable>

                <ElTable
                  :data="users"
                  border
                  stripe
                  style="width: 100%"
                >
                  <ElTableSchemaColumns :columns="functionalColumns" />
                </ElTable>
              </ElSpace>
            </div>
          </div>
        </ElSpace>
      </div>
    </SectionMain>
  </SectionLayout>
</template>
