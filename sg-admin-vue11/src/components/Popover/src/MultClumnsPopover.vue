<script lang="ts" setup>
import { Popover } from 'ant-design-vue';
import { currentyOptions } from '/@/views/common/commonSetting';
import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
import { computed } from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import active from '/@/assets/svg/active.svg';
import {useI18n} from "@/hooks/web/useI18n";

interface Props {
  record: any;
  keyIndex: string;
  labelBefore: string;
  labelAfter: string;
}

const props = defineProps<Props>();
const { t } = useI18n();
const amount = computed(() => props.record[props.keyIndex]);
const teamValue = computed(() => {
  if (props.keyIndex === 'sum_valid_bet_amount') {
    return props.record.team_valid_bet_amount + '/' + props.record.team_bet_user_count + t('component.unit.people');
  } else if (props.keyIndex === 'sum_deposit_amount') {
    return props.record.team_deposit_amount + '/' + props.record.team_deposit_user_count + t('component.unit.people');
  } else if (props.keyIndex === 'sum_withdraw_amount') {
    return props.record.team_withdraw_amount + '/' + props.record.team_withdraw_user_count + t('component.unit.people');
  } else {
    return props.record.team_profit;
  }
});
const myselfValue = computed(() => {
  if (props.keyIndex === 'sum_valid_bet_amount') {
    return props.record.valid_bet_amount;
  } else if (props.keyIndex === 'sum_deposit_amount') {
    return props.record.deposit_amount;
  } else if (props.keyIndex === 'sum_withdraw_amount') {
    return props.record.withdraw_amount;
  } else {
    return props.record.profit;
  }
});
</script>

<template>
  <Popover placement="right" color="rgba(0,0,0,0.8)">
    <template #content>
      <div class="text-white text-center border-b-light">
        {{ t('common.translate.word54') }}: <span class="text-orange">
          <cdIconCurrency :icon="currentyOptions[record.currency_id]" class="w-14px tooltip-currency-img" />
          {{ currentyOptions[record.currency_id] }}
        </span>
      </div>
      <div class="flex text-white mt-10px">
        <div class="flex-colunms border-r-light pr-5px text-center min-w-120px">
          <div>{{ props.labelBefore }}</div>
          <div>{{ teamValue }}</div>
        </div>
        <div class="flex-colunms ml-5px text-center min-w-120px">
          <div>{{ props.labelAfter }}</div>
          <div>{{ myselfValue }}</div>
        </div>
      </div>
    </template>
    <span>{{ amount }} </span>
    <img :src="active" alt="" srcset="" class="w-16px ml-5px mt--4px">
    <!-- <Icon icon="ant-design:info-circle-filled" color="#2F4553" :size="16" /> -->
  </Popover>
</template>

<style scoped>
.load-animation {
  animation: loadingCircle 1s infinite linear;
}
</style>

<style lang="less">
.ad-tooltip {
  max-width: none;

  .ant-tooltip-inner {
    background-color: rgb(0 0 0 / 80%) !important;
  }
}

.text-orange img {
  vertical-align: baseline;
}

.tooltip-currency {
  margin-bottom: 5px;
  font-size: 12px !important;
  font-weight: 500;
  line-height: 1;
}

.tooltip-currency:nth-last-child {
  margin-bottom: 0;
}

.tooltip-currency-img {
  line-height: 0 !important;
}
</style>
