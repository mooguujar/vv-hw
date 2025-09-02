<template>
  <div v-if="tableType === 1">
    <Tooltip overlayClassName="tooltip_class" autoAdjustOverflow v-if="tip?.[colType]">
      <template #title>
        <table class="no-outer-border border-collapse tracking-wider text-center">
          <thead>
            <tr class="">
              <template v-for="(item, index) in tip?.[colType]" :key="index">
                <th
                  v-if="item.currency_id && index === 0"
                  class="px-5 py-0.5 !border-t-none !border-l-none"
                  scope="col"
                  >{{ t('business.common_currency') }}</th
                >
              </template>
              <th
                v-if="
                  (colType === 'online' && moneyNum === 'online_deposit_amount') ||
                  (colType === 'wallet' && moneyNum === 'wallet_deposit_amount')
                "
                class="px-5 py-0.5 !border-t-none !border-l-none"
                scope="col"
                >{{ t('table.finance.finance_Deposit_method') }}</th
              >
              <th class="px-5 py-0.5 !border-t-none" scope="col">{{ t('table.finance.money') }}</th>
              <th class="px-5 py-0.5 !border-t-none !border-r-none" scope="col">{{
                t('table.report.report_num')
              }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="" v-for="item in tip?.[colType]" :key="item.currency_id">
              <td class="px-4 py-1 leading-tight !border-l-none !border-b-none text-left"
                ><cdIconCurrency
                  class="w-14px mb-.5 mr-4px"
                  :icon="item?.currency_name"
                  :id="item?.currency_id"
                />{{ item?.currency_name }}</td
              >

              <td
                v-if="
                  (colType === 'online' && moneyNum === 'online_deposit_amount') ||
                  (colType === 'wallet' && moneyNum === 'wallet_deposit_amount')
                "
                class="px-4 py-1 leading-tight !border-b-none !border-l-none"
                >{{ item?.method_name }}</td
              >
              <td class="px-4 py-1 leading-tight !border-b-none">{{ item?.amount }}</td>
              <td class="px-4 py-1 leading-tight !border-r-none !border-b-none">{{
                item?.count
              }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <div>
        {{
          t('table.common.amount_frequency', [
            record?.[moneyNum] ?? '-',
            record?.[peopleNum] ?? '-',
          ])
        }}
      </div>
    </Tooltip>
    <div v-else>
      {{
        t('table.common.amount_frequency', [record?.[moneyNum] ?? '-', record?.[peopleNum] ?? '-'])
      }}
    </div>
  </div>
  <div v-if="tableType === 2">
    <Tooltip overlayClassName="tooltip_class" autoAdjustOverflow v-if="tip?.[colType]">
      <template #title>
        <table class="no-outer-border border-collapse tracking-wider text-center">
          <thead>
            <tr class="">
              <th class="px-5 py-0.5 !border-t-none !border-l-none" scope="col">{{
                t('business.common_currency')
              }}</th>
              <th class="px-5 py-0.5 !border-t-none !border-r-none" scope="col">{{
                t('table.system.performance')
              }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="" v-for="item in tip?.[colType]" :key="item.currency_id">
              <td class="px-4 py-1 !border-b-none !border-l-none leading-tight"
                ><cdIconCurrency class="w-14px mb-.5 mx-2px" :icon="item?.currency_name" />{{
                  item?.currency_name
                }}</td
              >
              <td class="px-4 py-1 leading-tight !border-b-none !border-r-none">{{
                item?.amount
              }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <div>
        {{ record?.[moneyNum] ?? '-' }}
      </div>
    </Tooltip>
    <div v-else>
      {{ record?.[moneyNum] ?? '-' }}
    </div>
  </div>
  <div v-if="tableType === 3">
    <Tooltip
      overlayClassName="tooltip_class"
      autoAdjustOverflow
      v-if="record?.[titleItem]?.['tip'] && record?.[titleItem]?.['tip'].length > 0"
    >
      <template #title>
        <table class="no-outer-border border-collapse tracking-wider text-center">
          <thead>
            <tr class="">
              <th class="px-5 py-0.5 !border-t-none !border-l-none" scope="col">{{
                t('business.common_currency')
              }}</th>
              <th class="px-5 py-0.5 !border-t-none" scope="col">{{ t('table.finance.money') }}</th>
              <th class="px-5 py-0.5 !border-t-none !border-r-none" scope="col">{{
                t('table.report.report_num')
              }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="" v-for="item of record?.[titleItem]?.['tip']" :key="item.currency_id">
              <td class="px-4 py-1 leading-tight !border-b-none !border-l-none"
                ><cdIconCurrency class="w-14px mb-.5 mr-4px" :icon="item?.currency_name" />{{
                  item?.currency_name
                }}</td
              >
              <td class="px-4 py-1 !border-b-none leading-tight">{{ item?.amount }}</td>
              <td class="px-4 py-1 !border-b-none !border-r-none leading-tight">{{
                item?.count
              }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <div>
        {{
          t('table.common.amount_frequency', [
            record?.[titleItem]?.[moneyNum] ?? '0.00',
            record?.[titleItem]?.[peopleNum] ?? '0',
          ])
        }}
      </div>
    </Tooltip>
    <div v-else>
      {{
        t('table.common.amount_frequency', [
          record?.[titleItem]?.[moneyNum] ?? '0.00',
          record?.[titleItem]?.[peopleNum] ?? '0',
        ])
      }}
    </div>
  </div>
</template>
<script setup lang="ts">
  import { toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Tooltip } from 'ant-design-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  interface Props {
    record: Object;
    column: any;
    tableType: number;
    colType: string;
    moneyNum: string;
    peopleNum?: string;
    titleItem?: string | number;
  }
  const props = defineProps<Props>();
  const { t } = useI18n();
  const { tip } = toRefs(props.record);
</script>
<style lang="scss" scoped>
  .no-outer-border {
    border: none;
    font-size: 12px;
  }

  /* 保持单元格的边框 */
  .no-outer-border th,
  .no-outer-border td {
    border: 1px solid white;
    font-weight: 500;
    line-height: normal;
  }

  /* 也去掉表格头行和表格体行的外边框 */
  .no-outer-border thead tr,
  .no-outer-border tbody tr {
    border: none;
  }
</style>
<style>
  .tooltip_class {
    max-width: none !important;
  }
</style>
