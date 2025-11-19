<script setup lang="ts">
import { ref } from 'vue'
import { SectionLayout, SectionMain, usePagination } from '@/index'
import { sleep } from '../../utils'

// 基础示例
const basicPagination = usePagination({
  total: 100,
  pageSize: 10,
})

// 模拟数据加载
interface DataItem {
  id: number
  name: string
  email: string
  status: string
}

const tableData = ref<DataItem[]>([])
const loading = ref(false)
const totalItems = ref(156)

const tablePagination = usePagination({
  total: () => totalItems.value,
  pageSize: 10,
  onChange: async ({ page, pageSize }) => {
    await loadTableData(page, pageSize)
  },
})

async function loadTableData(page: number, pageSize: number) {
  loading.value = true
  try {
    await sleep(500)
    const start = (page - 1) * pageSize
    const statuses = ['active', 'inactive', 'pending']
    tableData.value = Array.from({ length: pageSize }, (_, i) => {
      const randomIndex = Math.floor(Math.random() * 3)
      return {
        id: start + i + 1,
        name: `用户 ${start + i + 1}`,
        email: `user${start + i + 1}@example.com`,
        status: statuses[randomIndex]!,
      }
    })
  }
  finally {
    loading.value = false
  }
}

// 初始加载
loadTableData(1, 10)
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
              <ElSpace
                direction="vertical"
                style="width: 100%"
                fill
              >
                <ElText>
                  <code>usePagination</code> 是基于
                  <code>useOffsetPagination</code> 的增强版本，
                  提供了更便捷的分页功能。
                </ElText>

                <ElSpace>
                  <ElButton
                    :disabled="basicPagination.isFirstPage.value"
                    @click="basicPagination.prev()"
                  >
                    上一页
                  </ElButton>
                  <ElText>
                    第 {{ basicPagination.currentPage.value }} /
                    {{ basicPagination.pageCount.value }} 页
                  </ElText>
                  <ElButton
                    :disabled="basicPagination.isLastPage.value"
                    @click="basicPagination.next()"
                  >
                    下一页
                  </ElButton>
                </ElSpace>
              </ElSpace>
            </div>
          </div>

          <!-- 实际应用示例 -->
          <div>
            <ElText
              tag="b"
              size="large"
            >
              2. 实际应用 - 表格分页
            </ElText>
            <ElDivider style="margin: 12px 0" />
            <div style="padding: 16px; background: #f5f7fa; border-radius: 4px">
              <ElSpace
                direction="vertical"
                style="width: 100%"
                fill
              >
                <ElText> 结合表格组件使用，实现数据分页加载。 </ElText>

                <ElTable
                  v-loading="loading"
                  :data="tableData"
                  border
                  style="width: 100%"
                >
                  <ElTableColumn
                    prop="id"
                    label="ID"
                    width="80"
                  />
                  <ElTableColumn
                    prop="name"
                    label="姓名"
                  />
                  <ElTableColumn
                    prop="email"
                    label="邮箱"
                  />
                  <ElTableColumn
                    prop="status"
                    label="状态"
                    width="100"
                  >
                    <template #default="{ row }">
                      <ElTag
                        :type="
                          row.status === 'active'
                            ? 'success'
                            : row.status === 'inactive'
                              ? 'danger'
                              : 'warning'
                        "
                      >
                        {{
                          row.status === 'active'
                            ? '活跃'
                            : row.status === 'inactive'
                              ? '停用'
                              : '待审核'
                        }}
                      </ElTag>
                    </template>
                  </ElTableColumn>
                </ElTable>

                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <ElText type="info">
                    共 {{ totalItems }} 条数据
                  </ElText>
                  <ElSpace>
                    <ElButton
                      size="small"
                      :disabled="tablePagination.isFirstPage.value"
                      @click="tablePagination.prev()"
                    >
                      上一页
                    </ElButton>
                    <ElText>
                      {{ tablePagination.currentPage.value }} /
                      {{ tablePagination.pageCount.value }}
                    </ElText>
                    <ElButton
                      size="small"
                      :disabled="tablePagination.isLastPage.value"
                      @click="tablePagination.next()"
                    >
                      下一页
                    </ElButton>
                    <ElSelect
                      v-model="tablePagination.currentPageSize.value"
                      size="small"
                      style="width: 100px"
                    >
                      <ElOption
                        :value="10"
                        label="10 条/页"
                      />
                      <ElOption
                        :value="20"
                        label="20 条/页"
                      />
                      <ElOption
                        :value="50"
                        label="50 条/页"
                      />
                    </ElSelect>
                  </ElSpace>
                </div>
              </ElSpace>
            </div>
          </div>
        </ElSpace>
      </div>
    </SectionMain>
  </SectionLayout>
</template>
