<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-grupButton>
        <DateButtonGroup
          :isSelect="isSelect"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
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
          common_end_time
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup name="RetainReportNocash">
  import { ref, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { exportReportRetain, getreportRetainList } from '/@/api/report';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { DatePicker } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { isHasAuth } from '@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(390).value);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });

  const { exportFile } = useExportFile();

  const isSelect = ref('week' as string);
  const [registerTable, { reload, getForm, getColumns }] = useTable({
    api: getreportRetainList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      actionColOptions: {
        class: 't-form-col t-form-label-com inquireButtonBox',
        // xxl: 12,
        // xl: 12,
        // lg: 12,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
      showAdvancedButton: false, //是否收起
      showResetButton: isHasAuth('50801'), //导出按钮隐藏
      resetFunc: handleExportTableList,
    },
    beforeFetch: (param) => {
      setDateParmaTime(param);
      setDateParmas(param);
      return param;
    },
    immediate: false,
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      model.value.start_time = value[0];
      model.value.end_time = value[1];
      // await getForm().setFieldsValue({ start_time: value[0] });
      // await getForm().setFieldsValue({ end_time: value[1] });
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  const disabledStartDate = (current) => {
    return current && current.startOf('day') > dayjs().startOf('day');
  };
  const disabledEndDate = (date) => {
    return (
      date.valueOf() > dayjs().endOf('days').valueOf() ||
      date.valueOf() <= dayjs(model.value.start_time).valueOf()
    );
  };
  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = dayjs(value).endOf('days');
  };

  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const param = await validate();
      setDateParmaTime(param);
      setDateParmas(param);
      await exportFile(exportReportRetain, param, t('routes.report.retainReport'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }
</style>
