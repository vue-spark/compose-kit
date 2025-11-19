<script setup lang="ts">
import { ref } from 'vue'
import { ElUsePagination } from '@/element-plus'
import { SectionLayout, SectionMain, usePagination } from '@/index'
import { sleep } from '../../utils'

interface DataItem {
  id: number
  title: string
  author: string
  date: string
  status: 'published' | 'draft' | 'archived'
}

// 基础示例
const basicPagination = usePagination({
  total: 100,
  pageSize: 10,
})

// 表格分页示例
const tableData = ref<DataItem[]>([])
const loading = ref(false)
const totalItems = ref(256)

const tablePagination = usePagination({
  total: () => totalItems.value,
  pageSize: 15,
  onChange: async ({ page, pageSize }) => {
    await loadTableData(page, pageSize)
  },
})

async function loadTableData(page: number, pageSize: number) {
  loading.value = true
  try {
    await sleep(300)
    const start = (page - 1) * pageSize
    const statuses = ['published', 'draft', 'archived'] as const
    tableData.value = Array.from(
      { length: Math.min(pageSize, totalItems.value - start) },
      (_, i) => {
        const idx = Math.floor(Math.random() * 3) as 0 | 1 | 2
        return {
          id: start + i + 1,
          title: `文章标题 ${start + i + 1}`,
          author: `作者 ${Math.floor(Math.random() * 10) + 1}`,
          date: new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString(),
          status: statuses[idx]!,
        }
      },
    )
  }
  finally {
    loading.value = false
  }
}

// 初始加载
loadTableData(1, 15)

function getStatusText(status: string) {
  const map: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档',
  }
  return map[status] || status
}
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
            <ElUsePagination
              :pagination="basicPagination"
              background
              layout="prev, pager, next, jumper, sizes, total"
              :page-sizes="[10, 20, 30]"
            />
          </div>

          <!-- 表格分页示例 -->
          <div>
            <ElText
              tag="b"
              size="large"
            >
              2. 表格分页
            </ElText>
            <ElDivider style="margin: 12px 0" />
            <ElTable
              v-loading="loading"
              :data="tableData"
              border
              stripe
              style="width: 100%"
            >
              <ElTableColumn
                prop="id"
                label="ID"
                width="80"
                align="center"
              />
              <ElTableColumn
                prop="title"
                label="标题"
                min-width="200"
              />
              <ElTableColumn
                prop="author"
                label="作者"
                width="120"
              />
              <ElTableColumn
                prop="date"
                label="日期"
                width="120"
              />
              <ElTableColumn
                label="状态"
                width="100"
                align="center"
              >
                <template #default="{ row }">
                  {{ getStatusText(row.status) }}
                </template>
              </ElTableColumn>
            </ElTable>

            <div
              style="display: flex; justify-content: flex-end; margin-top: 12px"
            >
              <ElUsePagination
                :pagination="tablePagination"
                background
                layout="prev, pager, next, jumper, sizes, total"
                :page-sizes="[10, 15, 20, 30, 50]"
              />
            </div>
          </div>
        </ElSpace>
      </div>
    </SectionMain>
  </SectionLayout>
</template>
