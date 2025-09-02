<template>
  <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
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
    <template #form-usernameSlot>
      <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
        <Select style="width: 50%" v-model:value="currentType" class="br-none">
          <SelectOption value="username">{{ $t('business.common_member_account') }}</SelectOption>
          <SelectOption value="content">{{ $t('table.risk.report_link_info') }}</SelectOption>
          <SelectOption value="updated_name">{{
            $t('table.risk.report_operate_people')
          }}</SelectOption>
        </Select>
        <Input
          style="width: 50%; margin-right: 10px"
          allowClear
          :placeholder="$t('common.inputText')"
          v-model:value="fromSearch"
        />
      </a-input-group>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchForm } from './index.data';
  import { Select, SelectOption, Input, DatePicker } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { getAssociateDetailList } from '/@/api/risk';
  import {
    setDateParmas,
    setStartformatDate,
    setEndformatDate,
    updateButtonDay,
  } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(410).value);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });

  const currentType = ref('username' as string);
  const fromSearch = ref('' as string);
  const [registerTable, { reload, getForm, getColumns }] = useTable({
    api: getAssociateDetailList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchForm,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'), //查询
      },
      showResetButton: false,
    },
    beforeFetch: (params) => {
      setDateParmas(params);
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      params[currentType.value] = fromSearch.value;
      return params;
    },
  });

  nextTick(async () => {
    let time_ = await updateButtonDay('days');
    await getForm().setFieldsValue({ time: time_ });
    reload();
  });

  const disabledStartDate = (date) => {
    let end_time: any = null;
    if (dayjs(model.value.end_time).valueOf()) {
      end_time = model.value.end_time.valueOf();
    } else {
      end_time = dayjs().endOf('days').valueOf();
    }
    return date.valueOf() > end_time;
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
</script>
<style lang="less" scoped></style>
