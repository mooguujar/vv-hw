<template>
  <div>
    <BasicTable
      @register="registerTable"
      class="with-more-input"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-startDate="{ model, field }">
        <DatePicker v-model:value="model[field]" @change="onStartDateChange" />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #form-profitListMonitor>
        <Button
          type="primary"
          :disabled="isControlValueSet()"
          @click="handleMonitoring()"
          class="mr-2"
          >{{ $t('table.risk.report_monitor_data') }}</Button
        >
      </template>
      <template #form-usernameSlot>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption value="username">{{
              $t('table.system.system_member_account')
            }}</SelectOption>
            <SelectOption value="game_name">{{ $t('table.report.report_game_name') }}</SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #tableTitle>
        <template v-if="currentList.length > 0">
          <div class="w-full">
            <cdButtonCurrency
              :btn-list="currentList"
              @change-button-currency="changeClick"
              v-model="currency_id"
            />
          </div>
        </template>
      </template>
      <template #num="{ record }">
        <div class="primary-color cursor" @click="openFightFun(record)">{{ record.num }} </div>
      </template>
      <template #commission="{ record }">
        <span class="primary-color cursor" @click="openFightFun(record)">{{
          $t('business.common_detail')
        }}</span>
      </template>
    </BasicTable>
    <ParameterMonitoringModal @register="registerMonitoringModal" />
    <FightInfoModal @register="registerFightInfoModal" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, ref, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchForm } from './index.data';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { DatePicker, Select, SelectOption, Input } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import { useModal } from '/@/components/Modal';
  import FightInfoModal from '../../common/components/fightInfoModal.vue';
  import ParameterMonitoringModal from '../../../common/components/parameterMonitoringModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setStartformatDate, setEndformatDate, updateButtonDay } from '/@/utils/dateUtil';
  import { getFightList } from '/@/api/risk/index';
  import dayjs from 'dayjs';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: dayjs().startOf('day'),
    end_time: dayjs().endOf('day'),
  });

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(520).value);

  const props = defineProps({
    record: { type: String },
  });

  const currency_id = ref('' as string);
  const currentList = ref([] as any);
  const currentType = ref('username' as string);
  const fromSearch = ref('' as string);
  let isFirst = true;
  const record = ref(null as any);
  watch(
    () => props.record,
    () => {
      record.value = props.record;
    },
    { deep: true },
  );
  const { currencyTreeList } = useTreeListStore();
  const [registerFightInfoModal, { openModal: openFight }] = useModal();
  const [registerMonitoringModal, { openModal }] = useModal();
  const [registerTable, { reload, getRawDataSource, getForm }] = useTable({
    api: getFightList,
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
      params[currentType.value] = fromSearch.value;
      params['currency_id'] = currency_id.value;
      //setDateParmas(params);
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      if (record.value) {
        params['username'] = fromSearch.value = record.value;
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
      record.value = null;
      currentList.value = [];
      let rawDataSource = getRawDataSource();
      if (rawDataSource.n) {
        rawDataSource.n.map((item) => {
          currencyTreeList.map((crrrencyItem) => {
            if (crrrencyItem.id == item.currency_id) currentList.value.push(crrrencyItem);
          });
        });
      }
      if (isFirst) {
        currency_id.value = currentList.value.length ? currentList.value[0].value : '';
        reload();
      }
      isFirst = false;
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
    openModal(true, { risk_code: 'mutual_bet' });
  }

  function changeClick(v) {
    reload();
  }
  function openFightFun(record) {
    openFight(true, record);
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-table-wrapper .ant-table-title) {
    min-height: 0 !important;
  }
</style>
