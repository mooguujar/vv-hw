<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-typeid>
        <DateButtonGroup
          :isSelect="'days'"
          :compareRangeTime="unixRang"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
          style="margin-right: 8px"
        />
      </template>
      <template #form-currency="{ model, field }">
        <Select
          v-model:value="model[field]"
          :options="getCurrencyList"
          :placeholder="$t('common.chooseText')"
        />
      </template>
      <template #currency="{ record }">
        <div class="!flex justify-center">
          <cdBlockCurrency :currencyName="currentyOptions[record.currency_out]" />
          <div class="!m-x-3"><Icon class="-m-1" icon="icon-park:double-right" /></div>
          <cdBlockCurrency :currencyName="currentyOptions[record.currency_in]" />
        </div>
      </template>
      <template #changeBeforeAmount="{ record }">
        <div class="!flex justify-center">
          <cdBlockCurrency :currencyName="currentyOptions[record.currency_out]" />：
          {{ record.before_out }}</div
        >
        <Divider class="!my-8px" />
        <div class="!flex justify-center">
          <cdBlockCurrency :currencyName="currentyOptions[record.currency_in]" />：{{
            record.before_in
          }}
        </div>
        <!-- {{ record }} -->
      </template>
      <template #changeAmount="{ record }">
        <div class="!flex justify-center">
          <cdBlockCurrency :currencyName="currentyOptions[record.currency_out]" />
          ： <span>{{ record.amount_out }}</span>
        </div>
        <Divider class="!my-8px" />
        <div class="!flex justify-center">
          <cdBlockCurrency :currencyName="currentyOptions[record.currency_in]" />
          ： <span>{{ record.amount_in }}</span>
        </div>
      </template>
      <template #changeAfterAmount="{ record }">
        <div class="!flex justify-center">
          <cdBlockCurrency :currencyName="currentyOptions[record.currency_out]" />
          ： <span>{{ record.after_out }}</span>
        </div>
        <Divider class="!my-8px" />
        <div class="!flex justify-center">
          <cdBlockCurrency :currencyName="currentyOptions[record.currency_in]" />
          ： <span>{{ record.after_in }}</span>
        </div>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas, dateGroupButtonList } from './ExchangeLog.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Divider, Select } from 'ant-design-vue';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { ref, nextTick, onMounted } from 'vue';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { Icon } from '/@/components/Icon';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { getPaymentTransferList } from '/@/api/member/index';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight430 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight430).value);
  const unixRang = ref<Array<number>>([]);
  const getCurrencyList = ref([]);
  const [registerTable, { getForm, getRawDataSource, reload }] = useTable({
    api: getPaymentTransferList,
    showIndexColumn: false,
    beforeFetch: (param) => {
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
    },
    formConfig: {
      schemas,
      showAdvancedButton: false,
      showResetButton: false,
      actionColOptions: {
        class: 'button-box t-form-label-com',
        // xxl: 12,
        // xl: 12,
        // lg: 12,
      },
      submitButtonOptions: {
        text: t('common.queryText'),
      },
      resetButtonOptions: {
        text: t('business.common_export'),
      },
    },
    afterFetch: () => {
      const getCurrency = getRawDataSource();
      const list = getCurrency.n.map((item) => {
        return {
          label: currentyOptions[item],
          value: item,
        };
      });
      getCurrencyList.value = [{ label: t('business.common_all'), value: '' }, ...list];
    },
    useSearchForm: true,
    bordered: true,
    columns,
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  function reSetButtonBox() {
    if (document.getElementsByClassName('button-box').length > 0) {
      for (var i = 0; i < document.getElementsByClassName('button-box').length; i++) {
        document.getElementsByClassName('button-box').item(i).classList.remove('ant-col-4');
      }
    }
  }
  onMounted(() => {
    reSetButtonBox();
  });
</script>
