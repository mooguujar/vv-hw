<template>
  <div>
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }" class="with-more-input">
      <template #form-profitListMonitor>
        <Button type="primary" @click="handleMonitoring()" class="mr-2">{{
          t('table.risk.report_monitor_data')
        }}</Button>
      </template>
      <template #form-usernameSlot>
        <InputGroup class="!flex" compact>
          <Select :style="{ width: currentLangWidth }" v-model:value="currentType" class="br-none">
            <SelectOption value="username">{{ t('business.common_member_account') }}</SelectOption>
            <SelectOption value="parent_name">{{ t('business.common_super_agent') }}</SelectOption>
          </Select>
          <Input
            :style="{ width: inputWidth }"
            allowClear
            :placeholder="t('common.inputText')"
            v-model:value="fromSearch"
          />
        </InputGroup>
      </template>
      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label: `${t('business.common_deal_with')}`, //处理
              onClick: handleFun.bind(null, record),
            },
          ]"
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
      <template #username="{ record }">
        <span @click="toProcessed(record)" class="primary-color cursor"
          >{{ record.username }}
        </span>
      </template>
      <template #currency="{ record }">
        <!--        <span>{{record.currency_id}}</span>-->
        <cdIconCurrency :icon="setCurrencyName(record.currency_id)" class="mr-3px w-20px" /><span>{{
          setCurrencyName(record.currency_id)
        }}</span>
      </template>
    </BasicTable>
    <ParameterMonitoringModal @register="registerMonitoringModal" />
    <HandleModal @register="registerHandleModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, ref, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { columns, searchForm } from './index.data';
  import { InputGroup, Select, SelectOption, DatePicker, Input } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import ParameterMonitoringModal from '../../../common/components/parameterMonitoringModal.vue';
  import HandleModal from '../../../common/components/HandleModal.vue';
  import { getwinTopList } from '/@/api/risk';
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  import { setStartformatDate, setEndformatDate, updateButtonDay } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import { isControlValueSet } from '/@/utils/domUtils';

  const route = useRoute();
  const { t, locale } = useI18n();
  const currentLanguage = useLocaleStoreWithOut();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: dayjs().startOf('day'),
    end_time: dayjs().endOf('day'),
  });

  const emit = defineEmits(['on-click']);
  const toProcessed = (record) => {
    emit('on-click', record);
  };

  const [registerHandleModal, { openModal: openHandle }] = useModal();
  const currentType = ref('username' as string);
  const fromSearch = ref(route.query.userAccount ?? '');
  const timer = ref(route.query.time * 1000 ?? '');

  const { currencyTreeList } = useTreeListStore();
  const currentArr = ref([...currencyTreeList] as any);

  const [registerMonitoringModal, { openModal }] = useModal();

  const [registerTable, { reload, getForm }] = useTable({
    api: getwinTopList,
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
      //resetFunc: handleExportTableList,
    },
    indexColumnProps: {
      title: t('table.risk.report_ranking'), //排行
    },
    actionColumn: {
      title: t('business.common_operate'), //操作
      dataIndex: 'action',
      fixed: false,
      slots: { customRender: 'action' },
      ifShow: isControlValueSet() ? false : isHasAuth('60202'),
    },
    beforeFetch: (params) => {
      params[currentType.value] = fromSearch.value;
      if (timer.value) {
        params.time = [timer.value, timer.value];
      }
      //setDateParmas(params);
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      if (timer.value) {
        getForm().setFieldsValue({ time: [params.start_time, params.end_time] });
      }
      delete params.time;
      return params;
    },
    afterFetch: () => {
      timer.value = null;
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
  function handleFun(record) {
    openHandle(true, { risk_code: 'win_top', ...record });
  }
  function setCurrencyName(id) {
    let name = currentArr.value.filter((c) => c.id === id)[0].name;
    return name;
  }
  function handleSuccess() {
    reload();
  }

  // 计算不同语言下 Select 的宽度
  const currentLangWidth = computed(() => {
    switch (currentLanguage.getLocale) {
      case 'zh_CN': // 中文
        return '40%';
      case 'en_US': // 英文
        return '48%';
      case 'vi_VN': // 越南语
        return '47%';
      case 'pt_BR': // 巴西葡萄牙语
        return '48%';
      default:
        return '38%';
    }
  });

  // 计算 Input 组件的宽度
  const inputWidth = computed(() => {
    switch (currentLanguage.getLocale) {
      case 'zh_CN': // 中文
        return '59%';
      case 'en_US': // 英文
        return '49%';
      case 'vi_VN': // 越南语
        return '50%';
      case 'pt_BR': // 巴西葡萄牙语
        return '49%';
      default:
        return '59%';
    }
  });
</script>
