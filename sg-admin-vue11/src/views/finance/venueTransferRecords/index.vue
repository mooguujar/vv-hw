<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-startTime="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endTime="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { DatePicker } from 'ant-design-vue';

  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './venueTransferRecords.data';
  import { getCommissionList, exportCommissionList } from '/@/api/report';
  import { useExportFile, prehandleSearchByParams } from '/@/utils/helper/paramsHelper';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface FormModel {
    sts: Date | null;
    ets: Date | null;
  }
  export default defineComponent({
    name: 'VenueTransferRecords',
    components: { BasicTable, [DatePicker.name]: DatePicker },
    setup() {
      const { t } = useI18n();
      const { exportFile } = useExportFile();
      const [registerTable, { getForm }] = useTable({
        api: getCommissionList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          resetButtonOptions: {
            text: t('business.common_export'),
          },
          actionColOptions: {
            class: 't-form-col',
            xxl: 12,
            xl: 12,
            lg: 12,
          },
          resetFunc: handleExportTableList,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        beforeFetch: (param) => {
          // param.agentName = memberId.value
          param.sidx = sidx.value;
          param.order = sortOrder.value;
          return prehandleSearchByParams(param);
        },
        sortFn: (sortInfo) => {
          const { field, order } = sortInfo;
          sidx.value = field;
          sortOrder.value = order;
        },
      });

      // const memberId = ref('')
      const sidx = ref('');
      const sortOrder = ref('');

      async function handleExportTableList(): Promise<void> {
        try {
          const { validate } = getForm();
          const values = await validate();
          await exportFile(
            exportCommissionList,
            values,
            t('routes.finance.venue_transfer_records'),
          );
        } catch (e) {
          console.error(e);
        }
        // 避免汇出后自动查询
        return Promise.reject();
      }

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
        t,
      };
    },
  });
</script>
