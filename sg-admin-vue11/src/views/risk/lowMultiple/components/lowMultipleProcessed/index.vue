<template>
  <div>
    <BasicTable
      @register="registerTable"
      class="with-more-input"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-profitListMonitor>
        <Button type="primary" @click="handleMonitoring" class="mr-2">{{
          $t('table.risk.report_monitor_data')
        }}</Button>
      </template>
      <template #form-usernameSlot>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption value="username">{{
              $t('table.system.system_member_account')
            }}</SelectOption>
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
          :placeholder="$t('business.common_period_start')"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :placeholder="$t('business.common_period_end')"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #history="{ record }">
        <span class="primary-color cursor" @click="lowMultipleInfoFun(record)"
          >{{ t('business.common_detail') }}
        </span>
      </template>
      <template #currency="{ record }">
        <cdIconCurrency :icon="setCurrencyName(record.currency_id)" class="w-20px mr-3px" /><span>{{
          setCurrencyName(record.currency_id)
        }}</span>
      </template>
    </BasicTable>
    <ParameterMonitoringModal @register="registerMonitoringModal" />
    <LowMultipleInfoModal @register="registerLowMultipleInfoModal" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, ref, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchForm } from './index.data';
  import { useModal } from '/@/components/Modal';
  import { Select, SelectOption, Input, DatePicker } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import ParameterMonitoringModal from '../../../common/components/parameterMonitoringModal.vue';
  import LowMultipleInfoModal from '../../common/components/lowMultipleInfoModal.vue';
  import { getLowList } from '/@/api/risk';
  import dayjs from 'dayjs';
  import { setStartformatDate, setEndformatDate, updateButtonDay } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(410).value);
  const currentType = ref('username' as string);
  const fromSearch = ref('' as string);

  const props = defineProps({
    record: { type: Object },
  });

  const record = ref(null as any);
  watch(
    () => props.record,
    () => {
      record.value = props.record;
    },
    { deep: true },
  );

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: dayjs().startOf('day'),
    end_time: dayjs().endOf('day'),
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
  const { currencyTreeList } = useTreeListStore();
  const currentArr = ref([...currencyTreeList] as any);
  const [registerLowMultipleInfoModal, { openModal: openLowMultip }] = useModal();
  const [registerMonitoringModal, { openModal }] = useModal();
  const [registerTable, { reload, getForm, getColumns }] = useTable({
    api: getLowList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: true,
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
    indexColumnProps: {
      title: t('table.risk.report_ranking'), //排行
    },
    beforeFetch: (params) => {
      params[currentType.value] = fromSearch.value;
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      if (record.value?.username) {
        params['username'] = fromSearch.value = record.value?.username;
        params['start_time'] = '';
        params['end_time'] = '';
        getForm().setFieldsValue({
          start_time: '',
          end_time: '',
        });
      }
      return params;
    },
    afterFetch: () => {
      record.value = '';
    },
  });

  function handleMonitoring() {
    openModal(true, { risk_code: 'low_multiple_bet' });
  }
  function lowMultipleInfoFun(record) {
    openLowMultip(true, record);
  }
  function setCurrencyName(id) {
    let name = currentArr.value.filter((c) => c.id === id)[0].name;
    return name;
  }
</script>
<style lang="less" scoped>
  .tool-tip {
    span {
      color: #f59a23;
    }
  }
</style>
