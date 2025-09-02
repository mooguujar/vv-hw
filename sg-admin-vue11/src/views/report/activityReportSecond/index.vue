<template>
  <PageWrapper :contentStyle="{ margin: 0 }" class="LayoutTable">
    <BasicTable @register="registerTable" bordered>
      <template #form-backButton>
        <!-- <Button type="primary" @click="backLastPage">{{ t('common.back') }}</Button> -->
        <BasicButton type="primary" @click="backLastPage" :iconSize="20" preIcon="RectBack:svg">
          {{ t('common.back') }}
        </BasicButton>
      </template>
      <template #form-currencySlot="{ model, field }">
        <ApiSelect
          :options="currentList"
          v-model:value="model[field]"
          style="width: 100px"
          :showIcon="true"
        />
      </template>
      <template #summary>
        <TableSummary fixed v-if="summaryList">
          <TableSummaryRow>
            <TableSummaryCell class="text-center !text-sm" :index="0">{{
              $t('business.common_total')
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="1">-</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="2">-</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="3">
              <div class="flex justify-center items-center">
                <cdIconCurrency
                  class="w-[18px] mr-3px"
                  :icon="summaryList?.[0]?.currency_name"
                /><span>{{ summaryList?.[0]?.currency_name }}</span>
              </div>
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="4">-</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="5">{{
              summaryList?.[0]?.amount
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="6">-</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="7">-</TableSummaryCell>
          </TableSummaryRow>
        </TableSummary>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { Button, TableSummary, TableSummaryRow, TableSummaryCell } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  // import { Button } from '/@/components/Button';
  import { PageWrapper } from '/@/components/Page';
  import { searchForm, columns } from './index.data';
  import { useRouter } from 'vue-router';

  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';

  import { fetchReportActivityDetail } from '/@/api/select';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getTransactionTypeList } from '/@/api/member';
  import eventBus from '/@/utils/eventBus';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import BasicButton from '/@/components/Button/src/BasicButton.vue';

  const { t } = useI18n();
  const router = useRouter();
  const { currencyTreeList } = useTreeListStore();

  //定义当前选中的框

  // const { FinanceRates, FinancegetCurrency, getCurrencyMap, currencyId } = getRate();
  const FORM_SIZE = useFormSetting().getFormSize;
  const currentList = ref([] as any);
  const summaryList = ref([]);

  const [registerTable, { reload, getForm }] = useTable({
    api: async (data) => {
      const res = await fetchReportActivityDetail(data);
      const list = res.d;
      summaryList.value = res.c;
      if (res.n) {
        currentList.value = [
          { name: t('business.common_all'), value: '', label: t('business.common_all') },
          ...currencyTreeList.filter((item) => res.n.includes(item.id)),
        ];
      } else {
        currentList.value = [];
      }
      return res; //改成可以获取页数
    },
    columns: columns,
    formConfig: {
      labelWidth: 70,
      size: FORM_SIZE,
      schemas: searchForm,
      actionColOptions: {
        class: 'inquireButtonBox t-form-label-com',
      },
      submitButtonOptions: {
        text: t('common.queryText'), //查询
      },

      showActionButtonGroup: true,
      showResetButton: false,
    },
    beforeFetch: (param) => {
      const { time, currency_id, cash_type } = history.state;
      if (currency_id) {
        param['currency_id'] = currency_id;
      }
      if (cash_type) {
        param['cash_type'] = String(cash_type);
      }
      delete param.backButton;
      param['time'] = [time * 1000, time * 1000];
      processingParams(param);
    },
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    showTableSetting: false,
  });

  function processingParams(param) {
    setDateParmaTime(param);
    setDateParmas(param);
    return param;
  }

  function backLastPage() {
    router.push({
      name: 'ActivityReport',
      query: null,
      // state: {
      //   searchTime: historySearchTime.value,
      //   searchCurrency: historyCurrency.value,
      // },
    });
  }

  async function fetchCashtypeList() {
    const list = await getTransactionTypeList();
    const optionList = [{ name: t('business.common_all'), id: '' }, ...list['008003']];
    eventBus.emit('emitCashTypeListOption', optionList);
  }
  onMounted(async () => {
    // 0是种类 1是币种
    const isShow = [];
    const { isAll, currency_id } = history.state;

    // 0不展示，1展示
    const { setFieldsValue } = getForm();
    if (isAll) {
      isShow[0] = 1;
      await setFieldsValue({ backButton: isShow });
    } else {
      isShow[0] = 0;
      await setFieldsValue({ backButton: isShow });
    }

    if (!currency_id) {
      isShow[1] = 1;
      await setFieldsValue({ backButton: isShow, currency_id: '' });
    } else {
      isShow[1] = 0;
      await setFieldsValue({ backButton: isShow });
    }
    fetchCashtypeList();
  });
</script>
<style scoped lang="scss"></style>
