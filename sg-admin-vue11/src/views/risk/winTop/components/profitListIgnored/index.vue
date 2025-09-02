<template>
  <div>
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }" class="with-more-input">
      <template #form-profitListMonitor>
        <Button type="primary" @click="handleMonitoring()" class="mr-2">{{
          $t('table.risk.report_monitor_data')
        }}</Button>
      </template>
      <template #form-usernameSlot>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption value="username">{{ $t('business.common_member_account') }}</SelectOption>
            <SelectOption value="parent_name">{{ $t('business.common_super_agent') }}</SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
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
      <template #currency="{ record }">
        <cdIconCurrency :icon="setCurrencyName(record.currency_id)" class="mr-3px w-20px" /><span>{{
          setCurrencyName(record.currency_id)
        }}</span>
      </template>

      <template #action="{ record }">
        <span class="primary-color cursor p1" @click="deletFun(record)">
          {{ t('business.common_delete_b') }}
        </span>
      </template>
    </BasicTable>
    <ParameterMonitoringModal @register="registerMonitoringModal" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchForm } from './index.data';
  import { useModal } from '/@/components/Modal';
  import { Select, SelectOption, DatePicker, Input, message } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import ParameterMonitoringModal from '../../../common/components/parameterMonitoringModal.vue';
  import { openConfirm } from '/@/utils/confirm';
  import { getwinTopList } from '/@/api/risk';
  import dayjs from 'dayjs';
  import { setStartformatDate, setEndformatDate, updateButtonDay } from '/@/utils/dateUtil';
  import { updatewinTopList } from '/@/api/risk/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  const { t } = useI18n();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: dayjs().startOf('day'),
    end_time: dayjs().endOf('day'),
  });
  const { currencyTreeList } = useTreeListStore();
  const currentArr = ref([...currencyTreeList] as any);
  const currentType = ref('username' as string);
  const fromSearch = ref('' as string);
  const [registerMonitoringModal, { openModal }] = useModal();
  const [registerTable, { reload, getForm, getColumns }] = useTable({
    api: getwinTopList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchForm,
      showAdvancedButton: false,
      showIndexColumn: true,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'), //查询
      },
      indexColumnProps: {
        title: t('table.risk.report_ranking'),
      },
      showResetButton: false,
    },
    beforeFetch: (params) => {
      params[currentType.value] = fromSearch.value;
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      return params;
    },
    indexColumnProps: {
      title: t('table.risk.report_ranking'), //排行
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

  function handleMonitoring() {
    openModal(true, { risk_code: 'win_top' });
  }

  function deletFun(record) {
    openConfirm(t('common.warning'), t('modalForm.risk.risk_delete_tip'), async () => {
      try {
        const { status, data } = await updatewinTopList({ id: record.id, limit_type: 4 });
        if (status) {
          message.success(data);
          reload();
        } else {
          message.error(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    });
  }
  function setCurrencyName(id) {
    let name = currentArr.value.filter((c) => c.id === id)[0].name;
    return name;
  }
</script>
<style lang="less" scoped>
  :deep(.ant-divider-horizontal) {
    box-sizing: content-box;
    margin: 0;
    margin-left: -8px;
    padding: 0 8px;
  }
</style>
