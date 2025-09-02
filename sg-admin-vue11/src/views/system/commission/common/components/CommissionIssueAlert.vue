<template>
  <BasicModal
    @register="registerModal"
    :title="title"
    :showCancelBtn="false"
    :showOkBtn="t('table.system.system_click_delivery')"
    min-height="200px"
    :okText="$t('table.system.system_check_to_delivery')"
    @ok="okSubmit"
    width="500px"
  >
    <div class="commission-alert">
      <div class="info-row">
        <div class="info-item">
          <span class="label">{{ $t('table.system.system_send_people') }}:</span>
          <span class="value">{{ getUserCount || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t('table.system.system_lock_people') }}:</span>
          <span class="value">{{ getLockCount || '-' }}</span>
        </div>
      </div>
      <div class="info-row">
        <div class="info-item">
          <span class="label">{{ $t('table.system.system_delivery_amount') }}:</span>
          <ul class="ant-col" v-if="Object.keys(getAmount || {}).length > 0">
            <li v-for="(value, key) in getAmount" :key="key"
              ><cdIconCurrency class="w-20px mr-5px" :icon="String(key)" />
              <span>{{ value }}</span></li
            >
          </ul>
          <span class="value" v-else>-</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t('table.system.system_lock_money') }}:</span>
          <ul class="ant-col" v-if="Object.keys(getLockAmont || {}).length > 0">
            <li v-for="(value, key) in getLockAmont" :key="key"
              ><cdIconCurrency class="w-20px mr-5px" :icon="String(key)" />
              <span>{{ value }}</span></li
            >
          </ul>
          <span class="value" v-else>-</span>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDebounceFn } from '@vueuse/core';
  import {
    getDetailSendAll,
    updateSendReviewAll,
    updateSendSingleReview,
  } from '/@/api/commission/index';
  import { message } from 'ant-design-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';

  const { t } = useI18n();
  // 类型
  const issueType = ref<String>('');
  // 标题
  let title = ref<String>('');
  // 锁定人数
  const getLockCount = ref(null as any);
  // 佣金人数
  const getUserCount = ref(null as any);
  // 锁定金额
  const getLockAmont = ref(null as any);
  // 发放金额
  const getAmount = ref(null as any);
  // 发放详情
  const getSendDeatil = ref(null as any);
  // 单个ID
  const getSingleId = ref(null as any);
  // 单个用户名
  const getSingleUsername = ref(null as any);
  // 发放金额
  const amountTotal = ref('' as any);
  // 币种
  const currenty = ref(null as any);
  // 回调
  const emit = defineEmits(['reloadPage']);
  // 注册弹窗
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(async (data) => {
    // 单个ID
    getSingleId.value = data?.records?.id;
    // 发放金额
    amountTotal.value = data?.records?.commission_amount_total;
    // 单个用户名
    getSingleUsername.value = data?.records?.username;
    // 发放详情
    getSendDeatil.value = data.times;
    // 类型
    issueType.value = data?.issueType;
    // 时间
    data.times.start_time = data.times.time[0] ? setStartformatDate(data.times.time[0]) : null;
    data.times.end_time = data.times.time[1] ? setEndformatDate(data.times.time[1]) : null;
    delete data.times.time;

    // 一键发放
    if (issueType.value === 'issueAll') {
      // 币种
      currenty.value = data.currency;
      // 获取发放详情
      const getData = await getDetailSendAll({
        currency_id: data.currency,
        ...data.times,
      });
      getLockCount.value = getData.lock_user_count;
      getUserCount.value = getData.user_count;
      getLockAmont.value = getData.lock_amount;
      if (Object.keys(getData.amount || {}).length === 0) {
        getAmount.value = null;
      } else {
        getAmount.value = getData.amount;
      }
      if (Object.keys(getData.lock_amount || {}).length === 0) {
        getLockAmont.value = null;
      } else {
        getLockAmont.value = getData.lock_amount;
      }
      delete getLockAmont.value?.uid;
      delete getAmount.value?.uid;
    } else {
      // 币种
      currenty.value = data?.records.currency_id;
    }
    // 标题
    title.value =
      issueType.value == 'issueAll'
        ? t('table.system.system_click_delivery')
        : `${t('table.system.system_delivery_commission')}【${getSingleUsername.value} 】`; // 一键发放' : `发放佣金${'用户username'}
  });
  // 提交按钮
  const okSubmit = useDebounceFn(async function () {
    // 加载
    changeOkLoading(true);
    // 币种
    getSendDeatil.value['currency_id'] = currenty.value;
    // 提交API
    const { status, data } =
      issueType.value == 'issueAll'
        ? await updateSendReviewAll(getSendDeatil.value)
        : await updateSendSingleReview({ id: getSingleId.value });
    if (status) {
      emit('reloadPage');
      changeOkLoading(false);
      message.success(data);
      setTimeout(() => {
        closeModal();
      }, 1000);
    } else {
      changeOkLoading(false);
      message.error(data);
    }
  }, 500);
  defineExpose({
    changeOkLoading,
  });
</script>
<style lang="less" scoped>
  .commission-alert {
    padding: 10px;

    .ant-col {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin-bottom: 0 !important;
    }

    .info-row {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      gap: 10px;

      .info-item {
        display: flex;
        flex: 1;
        flex-direction: row;
        justify-content: flex-start;

        .label {
          min-width: 65px;
          margin-right: 8px;
          color: #666;
        }

        .value {
          display: flex;
          color: #333;
          font-size: 16px;
          font-weight: 500;

          .currency-icon {
            width: 20px;
            margin-right: 4px;
          }
        }
      }
    }
  }
</style>
