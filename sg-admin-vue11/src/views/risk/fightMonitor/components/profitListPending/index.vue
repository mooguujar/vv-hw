<template>
  <div>
    <BasicTable
      @register="registerTable"
      class="with-more-input"
      bordered
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-profitListMonitor>
        <Button type="primary" @click="handleMonitoring()" class="mr-2">{{
          $t('table.risk.report_monitor_data')
        }}</Button>
      </template>
      <template #form-usernameSlot>
        <a-input-group compact style="display: flex" class="t-form-label-com">
          <Select v-model:value="currentType" class="br-none">
            <SelectOption value="username">{{
              $t('table.system.system_member_account')
            }}</SelectOption>
            <SelectOption value="game_name">{{ $t('table.report.report_game_name') }}</SelectOption>
          </Select>
          <Input
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
            style="width: 130px; margin-right: 10px"
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
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: t('business.common_detail'), //详情
              onClick: openFightFun.bind(null, record),
            },
            {
              label: t('business.common_deal_with'), //处理
              onClick: handleFun.bind(null, record),
              ifShow: isHasAuth('60504'),
            },
          ]"
        />
      </template>

      <template #username_a="{ record }">
        <div @click="toProcessed(record.username_a)" class="primary-color cursor"
          >{{ record.username_a }}
        </div>
      </template>
      <template #username_b="{ record }">
        <div @click="toProcessed(record.username_b)" class="primary-color cursor"
          >{{ record.username_b }}
        </div>
      </template>
      <template #num="{ record }">
        <div @click="openFightFun(record)" class="primary-color cursor">{{ record.num }} </div>
      </template>
    </BasicTable>
    <ParameterMonitoringModal @register="registerMonitoringModal" />
    <FightInfoModal @register="registerFightInfoModal" />
    <HandleModal @register="registerHandleModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { columns, searchForm } from './index.data';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { useRoute } from 'vue-router';
  import { Select, SelectOption, Input } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import ParameterMonitoringModal from '../../../common/components/parameterMonitoringModal.vue';
  import FightInfoModal from '../../common/components/fightInfoModal.vue';
  import HandleModal from '../../../common/components/HandleModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFightList } from '/@/api/risk/index';
  import {
    setDateParmas,
    setStartformatDate,
    setEndformatDate,
    updateButtonDay,
  } from '/@/utils/dateUtil';
  import dayjs from 'dayjs';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { auths, isHasAuth } from '/@/utils/authFunction';
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
  const route = useRoute();
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(520).value);
  const emit = defineEmits(['on-click']);
  const toProcessed = (record) => {
    emit('on-click', record);
  };
  const [registerHandleModal, { openModal: openHandle }] = useModal();
  const currency_id = ref('' as string);
  const currentList = ref([] as any);
  const currentType = ref('username' as string);
  const fromSearch = ref(route.query.userAccount ?? '');
  const timer = ref(route.query.time * 1000 ?? '');

  let isFirst = true;

  const { currencyTreeList } = useTreeListStore();
  const [registerMonitoringModal, { openModal }] = useModal();
  const [registerFightInfoModal, { openModal: openFight }] = useModal();
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
    actionColumn: {
      minWidth: 100,
      title: t('business.common_operate'), //操作
      dataIndex: 'action',
      slots: { customRender: 'action' },
      ifShow: isControlValueSet() ? false : auths(['60504']),
    },
    beforeFetch: async (params) => {
      params[currentType.value] = fromSearch.value;
      if (timer.value) {
        params.time = [timer.value, timer.value];
        setDateParmas(params);
      }
      params['currency_id'] = currency_id.value;
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
      currentList.value = [];
      timer.value = null;

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

  function handleMonitoring() {
    openModal(true, { risk_code: 'mutual_bet' });
  }
  function openFightFun(record) {
    openFight(true, record);
  }

  function handleFun(record) {
    openHandle(true, { risk_code: 'mutual_bet', ...record });
  }
  function changeClick(v) {
    reload();
  }
  function handleSuccess() {
    reload();
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-table-wrapper .ant-table-title) {
    min-height: 0 !important;
  }
</style>
