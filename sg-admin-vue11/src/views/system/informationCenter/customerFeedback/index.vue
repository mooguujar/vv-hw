<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <div class="pl-20px pt-20px">
      <Tabs v-model:activeKey="activeKey" @change="tabsChange" class="tab capsule_tap">
        <TabPane :key="1" :tab="$t('table.system.system_pending')" />
        <TabPane :key="2" :tab="$t('table.system.system_adopted')" />
        <TabPane :key="3" :tab="$t('table.system.system_ignored')" />
      </Tabs>
    </div>
    <BasicTable
      @register="registerTable"
      :columns="variableColumns"
      class="LayoutTable"
      :scroll="{ y: scrollHeight }"
    >
      <template #image-action="{ record }">
        {{ JSON.parse(record.images).length == 0 ? '-' : '' }}
        <TableImg :imgList="record.images ? toPairs(record.images) : []" />
      </template>
      <template #amount="{ record }">
        <span v-if="record.amount" class="text-amount">
          <cdIconCurrency class="w-20px mr-5px" :icon="'USDT'" />USDT:{{ record.amount }}.00
        </span>
        <span v-if="!record.amount">-</span>
      </template>
      <template #action="{ record }">
        <TableAction
          class="!justify-center"
          :actions="[
            {
              label: $t('business.common_detail'),
              onClick: handleDetails.bind(null, record),
            },
            {
              label: $t('business.common_replay'),
              ifShow: activeKey === 1 && isHasAuth('70544'),
              onClick: handleReply.bind(null, record),
            },
            {
              label: $t('business.comon_ignore'),
              ifShow: activeKey === 1 && isHasAuth('70545'),
              onClick: forgetFun.bind(null, record, 'del', $t('table.system.system_sure_message')),
            },
            {
              label: $t('business.common_adapt'),
              ifShow: activeKey === 1 && isHasAuth('70546'),
              onClick: adoptionFun.bind(null, record, 'ado', contentHtml),
            },
          ]"
        />
      </template>
      <template #replayRecord="{ record }">
        <Badge :count="record.newest">
          <div class="w-8 h-8 leading-8 bg-blue-100 rounded-md">{{ record.replys }}</div>
        </Badge>
      </template>
    </BasicTable>
    <FeedbackDetailModal
      @register="feedbackDetailModal"
      @reload="reload"
      @close-model-fun="closeModelFun"
    />
    <CustomerAdoptModal
      @register="customerAdoptModal"
      @reload="reload"
      @close-model-fun="closeModelAdopt"
      :titleicon="'notice'"
    />
  </PageWrapper>
</template>

<script lang="ts" setup name="CustomerFeedbackNocash">
  import { ref, h } from 'vue';
  import { Tabs, TabPane, Badge, InputNumber, FormItem, message } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction, TableImg } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    ignoredColumns,
    adoptedColumns,
    processedColumns,
    searchFormSchema,
  } from './feedback.data';
  import { getFeedbackList, updateFeedback } from '/@/api/sys/index';
  import FeedbackDetailModal from './components/FeedbackDetailModal.vue';
  import CustomerAdoptModal from './components/customerAdoptModal.vue';
  import { openConfirmTip } from '/@/utils/confirm';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(430).value);
  const adoptBonus = ref('' as string);
  const contentHtml = h(
    FormItem,
    { label: t('table.system.system_adoption_bonus') + '：', required: true },
    [
      h(InputNumber, {
        class: '!w-70',
        addonBefore: h(cdBlockCurrency, { currencyName: 'USDT' }),
        placeholder: t('table.system.system_one_twenty'),
        controls: false,
        min: '0',
        max: '20',
        stringMode: true,
        value: adoptBonus,
        onInput: ($event) => {
          adoptBonus.value = $event;
        },
      }),
    ],
  );
  const activeKey = ref(1 as number);
  const [
    feedbackDetailModal,
    { openModal: openFeedbackDetailModal, closeModal: closeFeedbackDetailModal },
  ] = useModal();
  const [
    customerAdoptModal,
    { openModal: openCustomerAdoptModal, closeModal: closeCustomerAdoptModal },
  ] = useModal();
  const variableColumns = ref<any>(processedColumns);
  const [registerTable, { reload, setPagination }] = useTable({
    api: getFeedbackList,
    bordered: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      showResetButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
    },
    beforeFetch: (param) => {
      param['state'] = activeKey.value;
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
      return param;
    },
    useSearchForm: true,
    showIndexColumn: false,
  });
  function tabsChange(v) {
    activeKey.value = v;
    reload();
    setPagination({ current: 1 });
    if (v === 1) {
      variableColumns.value = processedColumns;
    } else if (v === 2) {
      variableColumns.value = adoptedColumns;
    } else {
      variableColumns.value = ignoredColumns;
    }
  }
  const toPairs = (v) => {
    let a = [];
    try {
      a = JSON.parse(v);
    } catch (e) {
      console.error(e);
    }
    return a;
  };
  function forgetFun(record, type, msg) {
    openConfirmTip(t('common.warning'), msg, async () => {
      if (type == 'del') {
        await updateFeedback({
          id: record.id,
          newest: 0,
          state: 3,
        });
      }
      reload();
    });
  }
  async function handleDetails(response) {
    openFeedbackDetailModal(true, { response, reply: 0 });
    if (activeKey.value === 1) {
      await updateFeedback({ id: response.id });
    }
  }
  async function adoptionFun(record, type, msg) {
    // 不要用openConfirmTip 警告弹窗做功能
    //需要改成 modal
    openConfirmTip(t('table.system.system_adapt_feedbook'), msg, async (e) => {
      if (type == 'ado') {
        const numericValue = parseFloat(adoptBonus.value);
        const numericRegex = /^[0-9]+(?:\.[0-9]{1,2})?$/;
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 20) {
          return new Promise((resolve, reject) => {
            message.error(t('table.system.system_one_twenty'));
            adoptBonus.value = '';
            reject();
          });
        } else if (!numericRegex.test(adoptBonus.value)) {
          return new Promise((resolve, reject) => {
            message.error(t('table.system.system_only_number'));
            adoptBonus.value = '';
            reject();
          });
        } else {
          const { data, status } = await updateFeedback({
            id: record.id,
            newest: 0,
            state: 2,
            reward: adoptBonus.value,
          });
          if (status) {
            message.success(data);
            adoptBonus.value = '';
          }
        }
      }
      reload();
    });
  }
  async function closeModelFun() {
    reload();
  }
  async function closeModelAdopt() {
    reload();
  }
  async function handleReply(response) {
    openFeedbackDetailModal(true, { response, reply: 1 });
    if (activeKey.value === 1) {
      await updateFeedback({ id: response.id });
    }
  }
</script>
<style lan="less" scoped>
  ::v-deep(.vben-basic-table-form-container) {
    background-color: #eef1f7 !important;
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding: 0 !important;
  }

  ::v-deep(.vben-basic-table .ant-table-wrapper .ant-table.ant-table-bordered .ant-table-title) {
    padding-bottom: 0 !important;
    background-color: #eef1f7 !important;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    margin: 0 !important;
  }

  ::v-deep(.ant-tabs) {
    margin: 0 !important;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin-bottom: 12px !important;
  }

  .text-amount {
    color: red !important;
  }
</style>
