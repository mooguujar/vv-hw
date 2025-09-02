<template>
  <BasicModal
    :title="title"
    v-bind="$attrs"
    :centered="true"
    width="1000px"
    :destroyOnClose="true"
    :showCancelBtn="false"
    :okText="t('common.sure')"
  >
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <div class="w-full">
          <cdButtonCurrency
            :showwhitebg="false"
            :btn-list="currentList"
            @change-button-currency="changeClick"
            v-model="currency_id"
          />
        </div>
      </template>
      <template #summary>
        <TableSummary v-if="sum">
          <template v-if="smallSum">
            <TableSummaryRow>
              <TableSummaryCell align="center" :index="0"
                >{{ $t('business.common_paid5') }}
              </TableSummaryCell>
              <TableSummaryCell align="center" :index="1">-</TableSummaryCell>
              <TableSummaryCell
                align="center"
                :class="smallSum.settlement_fee > 0 ? 'text-red-600' : ''"
                :index="8"
                >{{ smallSum.settlement_fee }}
              </TableSummaryCell>
              <TableSummaryCell
                align="center"
                v-if="info.state != 4 && isHasAuth('30306')"
                :index="9"
                >-
              </TableSummaryCell>
              <TableSummaryCell align="center" :index="10">-</TableSummaryCell>
            </TableSummaryRow>
          </template>
          <template v-if="routeName == 'thirdPartyHandoverReport'">
            <TableSummaryRow>
              <TableSummaryCell align="center" :index="0"
                >{{ $t('business.common_paid5') }}
              </TableSummaryCell>
              <TableSummaryCell align="center" :index="1">-</TableSummaryCell>
              <TableSummaryCell align="center" :index="8">{{ sum.gift_fee }}</TableSummaryCell>
              <TableSummaryCell
                v-if="(info.state != 2) & auths(['30407', '30408'])"
                align="center"
                :index="10"
                >-
              </TableSummaryCell>
            </TableSummaryRow>
          </template>
        </TableSummary>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { ref } from 'vue';
  import { TableSummary, TableSummaryRow, TableSummaryCell } from 'ant-design-vue';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { columns } from './BettingDetails.data';

  const { t } = useI18n();
  const info = ref({} as any);
  const title = ref('' as string);
  const routeName = ref('' as any);
  const currentList: any = ref([{ name: t('table.member.member_currency'), value: '', lable: 'ALL' }]);
  const sum = ref();
  const smallSum = ref();
  const currency_id = ref('' as any);

  const [registerTable, { reload, setColumns, setProps }] = useTable({
    bordered: true,
    columns: columns,
    showIndexColumn: false,
    showTableSetting: false,
    useSearchForm: false,
    pagination: true,
    beforeFetch: (params) => {
      params['id'] = info.value.id;
      params['currency_id'] = currency_id.value;
    },
  });
  const changeClick = (value) => {
    currency_id.value = value;
    reload();
  };

  const openEditModeFun = (record, type) => {
    title.value = t('common.cp10', '111');
  };
  openEditModeFun();
</script>
<style lang="less"></style>
