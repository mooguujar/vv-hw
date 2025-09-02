<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content', y: scrollHeight }">
      <template #form-startDate="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :placeholder="t('business.common_time_please')"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :placeholder="t('business.common_time_please')"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { DatePicker, Select } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getDepositList } from '/@/api/sys';
  import { columns, schemas } from './index.data';
  import { setDateParmas, setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  export default defineComponent({
    name: '',
    components: {
      BasicTable,
      PageWrapper,
      [DatePicker.name]: DatePicker,
      [Select.name]: Select,
    },
    setup() {
      const { t } = useI18n();
      const scrollHeight = Number(useScrollerHeight(440).value);
      const [registerTable, { reload }] = useTable({
        api: getDepositList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas,
          actionColOptions: {
            class: 'inquireButtonBox t-form-label-com',
          },
          customClassForm: true,
          submitButtonOptions: {
            text: t('common.queryText'), //查询
          },
          resetButtonOptions: {
            text: t('common.export'), //导出
          },
          showResetButton: false,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        showTableSetting: false,

        beforeFetch: (params) => {
          setDateParmas(params);
          if (params?.time?.length > 0) {
            params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
            params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
          }
          return params;
        },
      });

      const model = ref<FormModel>({
        start_time: dayjs().subtract(2, 'day').startOf('day').toDate(),
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
            date.valueOf() < model.value.start_time.valueOf() ||
            date.valueOf() > dayjs().endOf('day')
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
      return {
        reload,
        registerTable,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
        t,
        scrollHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-picker) {
    width: 100%;
  }

  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  .resize-item-box {
    display: inline-block;
    position: relative;
    width: auto;
  }

  .resize-item {
    display: flex;
  }
</style>
