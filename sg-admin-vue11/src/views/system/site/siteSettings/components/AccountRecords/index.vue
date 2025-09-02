<template>
  <div>
    <BasicTable
      @register="registerTable"
      class="!p-0"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-businessTypeModal="{ model, field }">
        <a-input
          v-if="businessTypesPicked.length"
          value=""
          readonly
          class="cursor"
          :placeholder="`${t('search.finance.finance_commission_chosen')}${
            businessTypesPicked.length
          }${t('search.finance.finance_commission_chosen_lenth')}`"
          @click="handleTypeModal(model)"
        />
        <a-input
          v-else
          readonly
          class="cursor"
          v-model:value="model[field]"
          :placeholder="t('search.finance.finance_commission_choose_text')"
          @click="handleTypeModal(model)"
        />
      </template>
      <template #form-startDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
    </BasicTable>
    <BusinessTypeModal
      @register="typesModal"
      @comfirm-business-types-picked="comfirmBusinessTypesPicked"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { columns, schemas } from './index.data';
  import { DatePicker } from 'ant-design-vue';
  import { useModal } from '@/components/Modal';
  import { setDateParmas, setEndformatDate, setStartformatDate } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks/web/useI18n';
  import BusinessTypeModal from './BusinessTypeModal.vue';
  import { getTransactionList } from '/@/api/sys';
  import dayjs from 'dayjs';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(440).value);
  const businessTypesPicked = ref<string[]>([]);
  const fromSearch = ref('' as string);
  const currentType = ref('content' as string);

  const [typesModal, { openModal }] = useModal();

  const [registerTable, { reload, getForm }] = useTable({
    api: getTransactionList,
    columns: columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    beforeFetch: (params) => {
      setDateParmas(params);
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }

      params[currentType.value] = fromSearch.value;
      return params;
    },
  });

  const comfirmBusinessTypesPicked = (list: any) => {
    businessTypesPicked.value = list;
    const { setFieldsValue } = getForm();
    setFieldsValue({ cash_type: list.join(',') });
  };

  const handleTypeModal = (modal): void => {
    const { type } = modal;
    openModal(true, { type });
  };
  const model = ref<FormModel>({
    start_time: dayjs().startOf('day').toDate(),
    end_time: dayjs().endOf('day').toDate(),
  });

  const disabledStartDate = (date) => {
    if (model.value.end_time) {
      return date.valueOf() > model.value.end_time.valueOf();
    } else {
      return date.valueOf() > dayjs().endOf('day');
    }
  };

  const disabledEndDate = (date) => {
    if (model.value.start_time) {
      return (
        date.valueOf() < model.value.start_time.valueOf() || date.valueOf() > dayjs().endOf('day')
      );
    } else {
      return date.valueOf() > dayjs().endOf('day');
    }
  };

  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = value;
  };
</script>
