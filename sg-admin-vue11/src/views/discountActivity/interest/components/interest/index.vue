<template>
  <div class="t-form-label-com ml-2.5" v-if="isHasAuth('40301')">
    <!-- <Button
      v-if="currentList.length < currencyTreeList.length && isHasAuth('40301')"
      type="primary"
      @click="openAuditModal"
      >{{ $t('table.discountActivity.discount_add_interest') }}</Button
    > -->
    <Button v-if="isHasAuth('40301')" type="primary" @click="openAuditModal">{{
      $t('table.discountActivity.discount_add_interest')
    }}</Button>
  </div>
  <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }">
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            label:
              record.state == 2
                ? t('business.common_on_activate')
                : t('business.common_deactivate'),
            color: record.state == 2 ? 'success' : 'error',
            onClick: showConfirm.bind(
              null,
              record,
              'state',
              `${
                record.state === 1
                  ? $t('table.discountActivity.to_deactivate_ebao_tip')
                  : $t('table.discountActivity.to_on_activate_ebao_tip')
              }`,
            ),
            ifShow: isHasAuth('40303'),
          },
          {
            label: t('common.editorText'),
            onClick: handleEdit.bind(null, record),
            ifShow: isHasAuth('40302'),
          },
          {
            label: t('common.delText'),
            color: 'error',
            ifShow: isHasAuth('40307'),
            onClick: showConfirm.bind(
              null,
              record,
              'del',
              $t('table.discountActivity.delete_ebao_tip'),
            ),
          },
        ]"
      />
    </template>
    <template #joinObjectType="{ record }">
      <span
        :class="[
          record.join_object_type == 3 ||
          record.join_object_type == 4 ||
          record.join_object_type == 5
            ? 'primary-color cursor'
            : '',
        ]"
        @click="joinObjectTypeFun(record)"
        >{{ joinObjectTypeFilter(record.join_object_type) }}</span
      >
    </template>

    <template #minDeposit="{ record }">
      <span
        v-if="record.configs.length > 1"
        class="primary-color cursor"
        @click="openCurrencyModalFun(record, $t('table.discountActivity.minimum_deposit_detail'))"
        >{{ $t('business.common_go_check') }}
      </span>

      <span v-else-if="record.configs.length == 1">{{ record.configs[0]?.min_deposit ?? '' }}</span>
    </template>

    <template #interestRate="{ record }">
      <span
        v-if="record.configs.length > 1"
        class="primary-color cursor"
        @click="openCurrencyModalFun(record, $t('table.discountActivity.apr_details'))"
        >{{ $t('business.common_go_check') }}
      </span>

      <span v-else-if="record.configs.length == 1">{{
        record.configs[0] ? mul(record.configs[0]?.interest_rate, 100) + '%' : ''
      }}</span>
    </template>
    <template #currency="{ record }">
      <CurrencyDisplay
        :currency_names="record.currency_names"
        :currencyTreeList="currencyTreeList"
      />
      <!-- <div>
        <Tooltip v-if="record.currency_names.length > 1" overlayClassName="!w-auto !max-w-260px ">
          <template #title>
            <div class="flex flex-wrap">
              <div class="m-b-2 w-12 text-center" v-for="item in record.currency_names" :key="item">
                <cdIconCurrency class="w-20px mr-3px" :icon="item" />
                {{ item }}
              </div>
            </div>
          </template>
          <div
            class="w-32"
            style="justify-content: center; overflow: hidden; text-overflow: ellipsis"
          >
            <cdIconCurrency
              v-if="
                record.currency_names.length > 1 &&
                record.currency_names.length !== currencyTreeList.length
              "
              :icon="record.currency_names[0]"
              class="w-20px mr-3px"
            /><span
              v-if="
                record.currency_names.length > 1 &&
                record.currency_names.length !== currencyTreeList.length
              "
              >{{ record.currency_names[0] }}</span
            >
            <cdIconCurrency
              v-if="record.currency_names.length === currencyTreeList.length"
              icon="CAD"
              class="w-20px mr-3px"
            />
            <span v-if="record.currency_names.length === currencyTreeList.length"> 全部</span>

            <span
              v-if="
                record.currency_names.length > 1 &&
                record.currency_names.length !== currencyTreeList.length
              "
              >...</span
            >
          </div>
        </Tooltip>
        <div v-else>
          <div v-for="(item, index) in record.currency_names" :key="item" class="mr-3px">
            <cdIconCurrency :icon="item" class="w-20px mr-3px" />{{ item }}
          </div>
        </div>
      </div> -->
    </template>
  </BasicTable>
  <WithdrawalsAuditModal @register="registerWithdrawalAuditModal" @success="success" />
  <CurrencyModal @register="registerCurrencyModal" />
  <siteModal @register="registerSiteModal" />
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { isHasAuth } from '@/utils/authFunction';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns } from './index.data';
  import { Button } from '/@/components/Button/index';
  import WithdrawalsAuditModal from '../../../common/component/WithdrawalsAuditModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import CurrencyModal from '../../../common/component/currencyModal/index.vue';
  import {
    getInterestList,
    updateInterestState,
    getInterestDetail,
    interestConfigDelete,
    insertInterest,
    updateInterest,
    getUseList,
  } from '/@/api/activity';
  import { openConfirm } from '/@/utils/confirm';
  import { message, Tooltip } from 'ant-design-vue';
  import siteModal from '../../../common/component/siteModal/index.vue';
  import { joinObjectTypeOptionsFilter } from '../../../common/const';
  import { mul } from '/@/utils/number';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import CurrencyDisplay from '/@/components-cd/Icon/CurrencyDisplay.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';

  const { t } = useI18n();
  const { currencyTreeList } = useTreeListStore();
  const [registerSiteModal, { openModal: openSiteModal }] = useModal();
  const [registerWithdrawalAuditModal, { openModal }] = useModal();
  const [registerCurrencyModal, { openModal: openCurrencyModal }] = useModal();
  const currentList = ref([] as any);
  const [registerTable, { reload }] = useTable({
    api: getInterestList,
    columns,
    useSearchForm: false,
    bordered: true,
    showIndexColumn: false,
    // afterFetch: (data) => {
    //   const newData = data.map((item, index, Array) => {
    //     return {
    //       ...item,
    //       config: JSON.parse(item.config),
    //     };
    //   });
    //   return newData;
    // },
  });
  function openAuditModal() {
    openModal(true, {});
  }
  function openCurrencyModalFun(record, title) {
    openCurrencyModal(true, { ...record, title });
  }
  async function handleEdit(record) {
    const response = await getInterestDetail({ id: record.id });
    openModal(true, response);
  }
  function showConfirm(record, type, msg) {
    openConfirm(t('modalForm.finance.finance_operation_confirmation'), msg, async () => {
      if (type === 'state') {
        const { data, status } = await updateInterestState({
          id: record.id,
          state: record.state === 1 ? '2' : '1',
        });
        if (status) {
          message.success(data);
        } else {
          message.error(data);
        }
      } else if (type === 'del') {
        const { data, status } = await interestConfigDelete({ id: record.id, state: '1' });
        if (status) {
          message.success(data);
        } else {
          message.error(data);
        }
      }
      reload();
    });
  }
  function success() {
    reload();
  }

  const joinObjectTypeFun = (record) => {
    switch (record.join_object_type) {
      case 3:
      case 4:
      case 5:
        openSiteModal(true, record);
        break;
    }
  };

  const joinObjectTypeFilter = (joinObjectType) => {
    const findItem = joinObjectTypeOptionsFilter.find((item) => item.value === joinObjectType);
    return findItem ? findItem.label : '';
  };

  onMounted(async () => {
    const data = await getUseList();
    if (!data) currentList.value = [];
    else currentList.value = data;
  });
</script>

<style>
  ::v-deep(.tooptip-new-insterest) {
    width: 320px;
  }
</style>
