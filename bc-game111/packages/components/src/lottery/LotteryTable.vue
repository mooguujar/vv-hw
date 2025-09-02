<script setup lang="ts" name="LotteryTable">
import type { LotteryColumns } from '@tg/types'
import type { VNode } from 'vue'
import LotteryEmpty from './LotteryEmpty.vue'

export interface RenderProps<T extends any[] = any[]> {
  fn: (...args: any[]) => VNode
  args: any[]
}
interface Props {
  columns: LotteryColumns[]
  sourceData: Array<Record<string, any>>
  rowId?: string
  noLeftRightBorder?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  noLeftRightBorder: true,
})
function Render(props: RenderProps) {
  return props.fn(...props.args)
}
</script>

<template>
  <div class="base-table">
    <table :class="{ 'no-left-right-border': noLeftRightBorder }">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.dataIndex"
            :style="col.titleStyle"
          >
            <template v-if="col.renderTitle">
              <Render :fn="col.renderTitle" :args="[col]" />
            </template>
            <template v-else>
              {{ col.title }}
            </template>
          </th>
        </tr>
      </thead>
      <tbody v-if="sourceData && sourceData.length > 0">
        <tr v-for="(row, rowIndex) in sourceData" :key="rowId ? row[rowId] : rowIndex">
          <td
            v-for="col in columns"
            :key="col.dataIndex"
            :style="[col.colStyle, { textAlign: col.colAlign || 'center' }]"
          >
            <template v-if="col.renderCol">
              <Render :fn="col.renderCol" :args="[row, col.dataIndex]" />
            </template>
            <template v-else>
              {{ row[col.dataIndex] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <template v-if="!sourceData || sourceData.length < 1">
      <div class="bg-[#fff] rounded-b-[8rem]">
        <LotteryEmpty />
      </div>
    </template>
  </div>
</template>

<style>
:root {
  --lot-thead-bg-color: #f23038;
  --lot-th-pd: 0 0;
  --lot-th-height: 40rem;
  --lot-td-pd: 0 0;
  --lot-td-height: 40rem;
  --lot-th-border: none;
  --lot-td-border: 1rem solid #e1e1e1;
  --lot-tg-font-weight: 700;
  --lot-tr-top-bottom-border-color: 1rem solid #e1e1e1;
  --lot-td-font-size: 13rem;
  --lot-td-font-weight: 500;
}
</style>

<style scoped lang="scss">
.base-table {
  width: 100%;
  overflow-x: auto;

  table {
    border-collapse: collapse;
    width: 100%;
    thead {
      background-color: var(--lot-thead-bg-color);
      tr {
        background-color: var(--lot-thead-bg-color);
      }
      th {
        padding: var(--lot-th-pd);
        border: var(--lot-th-border);
        color: #fff;
        font-size: 13rem;
        font-weight: var(--lot-tg-font-weight);
        height: var(--lot-th-height);
      }
    }
    tbody {
      td {
        padding: var(--lot-td-pd);
        color: #0d2245;
        font-size: var(--lot-td-font-size);
        font-weight: var(--lot-td-font-weight);
        height: var(--lot-td-height);
      }
      tr {
        background: #fff;
      }
    }
    &:not(.no-left-right-border) {
      tbody {
        td {
          border: var(--lot-td-border);
        }
      }
    }
    &.no-left-right-border {
      tbody {
        tr {
          border-top: var(--lot-tr-top-bottom-border-color);
          border-bottom: var(--lot-tr-top-bottom-border-color);
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>
