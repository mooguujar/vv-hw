<template>
  <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }">
    <template #form-yearSelect="{ model, field }">
      <Select v-model:value="model[field]" :value="yearType" @change="handelChangeYear">
        <selectOption v-for="year in years" :v-key="year.value" :value="year.value">{{
          year.name
        }}</selectOption>
      </Select>
    </template>
    <template #form-stateSelect>
      <!-- 站点账单状态下拉框 1=待核对(财务) 2=待核对(总财务) 3=待支付 4=完成 -->
      <Select v-model:value="stateType" style="min-width: 150px; margin-right: 8px">
        <SelectOption :value="0"> {{ t('common.All') }} </SelectOption>
        <SelectOption :value="1"> {{ t('table.system.verified_finance') }} </SelectOption>
        <SelectOption :value="2"> {{ t('table.system.verified_general_finance') }} </SelectOption>
        <SelectOption :value="3"> {{ t('table.system.site_bill_to_be_paid1') }} </SelectOption>
        <SelectOption :value="4"> {{ t('table.system.completed') }} </SelectOption>
      </Select>
    </template>
    <template #action="{ column, record }">
      <span v-if="!record.state">-</span>
      <TableAction
        v-if="record.state === 3"
        :actions="[
          {
            label: t('common.payment'),
            onClick: showConfirm.bind(null, record),
          },
          {
            label: t('business.common_detail'),
            onClick: safeguard.bind(null, record),
          },
        ]"
      />
      <TableAction
        v-if="record.state === 1 || record.state === 2 || record.state === 4"
        :actions="[
          {
            label: t('business.common_detail'),
            onClick: safeguard.bind(null, record),
          },
        ]"
      />
    </template>
  </BasicTable>
  <AppAddCurrencyModal @register="registerRateModal" />
  <SiteBillDetailModal @register="registerSiteBillDetailModal" @success="success" />
</template>
<script lang="ts" setup>
  import { nextTick, ref, PropType, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns, searchForm } from './index.data';
  import { Select, SelectOption, message } from 'ant-design-vue';
  import { openConfirm } from '/@/utils/confirm';
  import { useI18n } from '@/hooks/web/useI18n';
  import { setFullYearParmas, toTimezone } from '@/utils/dateUtil';
  import { getSiteBill, getSiteBillDetail, setSitWithdraw } from '@/api/sys';
  import { useModal } from '@/components/Modal';
  import AppAddCurrencyModal from '@/components/Application/src/AppAddCurrencyModal.vue';
  import SiteBillDetailModal from './components/SiteBillDetailModal.vue';
  import { getfinanceBalance } from '@/api/finance';
  import { useUserStore } from '@/store/modules/user';
  import dayjs from 'dayjs';
  import { isControlValueSet } from '/@/utils/domUtils';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
    year: number | null;
  }
  const model = ref<FormModel>({});
  const { t } = useI18n();
  // const yearType = ref(new Date().getFullYear() as number);
  const yearType = ref(2023 as number);
  const years = ref([]);
  const stateType = ref(0 as number);
  const fromSearch = ref('' as string);
  const [registerRateModal, { openModal: openBalanceModal }] = useModal();
  const [registerSiteBillDetailModal, { openModal: openSiteBillDetailModal }] = useModal();
  const balanceInfor = ref({});
  const balanceBoolean = ref(false);
  const balanceList = ref<any>([
    {
      value: 'BTC',
      label: '',
      symbol: '₿',
      disabled: true,
    },
    {
      value: 'ETH',
      label: '',
      symbol: 'Ξ',
      disabled: true,
    },
    {
      value: 'USDT',
      label: '',
      symbol: '₮',
      disabled: true,
    },
  ]);
  const userStore = useUserStore();
  const info = userStore.getUserInfo;
  const selectValues = ref('BTC');

  const [registerTable, { reload, getForm, getColumns, getRawDataSource }] = useTable({
    api: getSiteBill,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      schemas: searchForm,
      // showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    actionColumn: {
      width: 120,
      title: t('business.common_operate'),
      dataIndex: 'action',
      slots: { customRender: 'action' },
      ifShow: !isControlValueSet(),
    },
    beforeFetch: (params) => {
      setFullYearParmas(params, params.year);
      params['state'] = stateType.value;
      delete params.year;
      return params;
    },
  });
  function handelChangeYear(value) {
    model.value.year = value;
  }
  function yearOption() {
    let thisYear = new Date().getFullYear();
    for (var i = thisYear; i > thisYear - 4; i--) {
      years.value.push({ value: i, name: i });
    }
  }
  yearOption();
  async function getBalance() {
    const res = await getfinanceBalance({ site_code: info['prefix'] || 'dev' });
    balanceInfor.value = res;
    updateBalance(res);
  }
  function updateBalance(res) {
    balanceBoolean.value = res['display_site_merchant'];
    balanceList.value.forEach((el) => {
      if (res.hasOwnProperty(el.value)) {
        el.label = res[el.value];
      }
    });
    selectValues.value = balanceList.value.find((element) => element.value === res.currency_name);
  }
  getBalance();
  function recharge() {
    openBalanceModal(true, balanceInfor.value);
  }
  function showConfirm(record: any) {
    openConfirm(t('common.warning'), t('common.confirmToPay'), async () => {
      const res = await setSitWithdraw({
        id: record.id,
      });
      if (res) {
        message.success(res);
      }
    });
  }
  async function safeguard(record: Recordable): void {
    const date = toTimezone(record.time); // '2024-02-21'
    const startTime = dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'); // 转换为 '2024-02-21 00:00:00'
    const endTime = dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'); // 转换为 '2024-02-21 23:59:59'
    const params = {
      id: record.id, //记录id
      start_time: startTime, //开始时间
      end_time: endTime, //结束时间
    };
    //const data = await getSiteBillDetail(params);
    openSiteBillDetailModal(true, { record });
  }
</script>
<style lang="less" scoped>
  .vben-basic-table-form-container {
    padding: 0 !important;
  }

  /**
  .vben-basic-table-form-container .ant-form {
    padding:0 0 10px 0!important;
  } **/
</style>
