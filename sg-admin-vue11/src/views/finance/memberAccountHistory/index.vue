<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable">
      <template #form-startDate="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './memberAccountHistory.data';
  import { PageWrapper } from '/@/components/Page';
  import { MemberAccountRecordParams } from '/@/api/model/financeModel';
  import { filterEmptyParams } from '/@/utils/helper/paramsHelper';
  import { DatePicker } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';


  interface FormModel {
    sts: Date | null;
    ets: Date | null;
  }

  export default defineComponent({
    name: 'MemberAccountHistory',
    components: { BasicTable, TableAction, PageWrapper, [DatePicker.name]: DatePicker },
    setup() {
      const { t } = useI18n();
      const [registerTable] = useTable({
        title: t('common.translate.word70'),
        api: () => {},
        columns,
        formConfig: {
          showResetButton: false,
          labelWidth: 120,
          schemas: searchFormSchema,
          actionColOptions: {
            class: 't-form-col',
            xxl: 11,
            xl: 11,
            lg: 11,
          },
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        showTableSetting: true,
        beforeFetch: (tableParams: MemberAccountRecordParams) => {
          tableParams.sts = tableParams.sts ? setStartformatDate(tableParams.sts) : '';
          tableParams.ets = tableParams.ets ? setEndformatDate(tableParams.ets) : '';
          return filterEmptyParams(tableParams);
        },
      });

      const model = ref<FormModel>({
        sts: dayjs().startOf('day').toDate(),
        ets: dayjs().endOf('day').toDate(),
      });

      const disabledStartDate = (date) => {
        if (!model.value.ets || !date) return false;
        return date.valueOf() > model.value.ets.valueOf();
      };

      const disabledEndDate = (date) => {
        if (!model.value.sts || !date) return false;
        return date.valueOf() < model.value.sts.valueOf();
      };

      const onStartDateChange = (value) => {
        model.value.sts = value;
      };

      const onEndDateChange = (value) => {
        model.value.ets = value;
      };

      return {
        registerTable,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
        t
      };
    },
  });
</script>
