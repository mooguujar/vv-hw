<template>
  <img v-if="props.isRead" :src="srcs[props.icon + 'IsRead']" :color="[props.isRead] ? '#B1BAD3' : '#1FFF20'" />
  <img v-else :src="srcs[props.icon]" :color="[props.isRead] ? '#B1BAD3' : '#1FFF20'" />
  <!--  <svg :class="svgClass" aria-hidden="true">-->
  <!--    <use :xlink:href="srcs[props.icon]" :fill="color" />-->
  <!--  </svg>-->
  <!--    <svg class="svgClass" aria-hidden="true">-->
  <!--      <use :xlink:href="srcs[props.icon]" :fill="[props.isRead] ? '#B1BAD3' : '#1FFF20'" />-->
  <!--    </svg>-->
</template>
<script setup lang="ts">
import OnlineWithdrawalIsRead from '/@/assets/images/noticeListIcon/OnlineWithdrawalIsRead.svg';
import CompanyDepositIsRead from '/@/assets/images/noticeListIcon/CompaneyDepositIsRead.svg';
import CurrencyDepositIsRead from '/@/assets/images/noticeListIcon/CurrencyDepositIsRead.svg';
import HighMultipleIsRead from '/@/assets/images/noticeListIcon/HighMultipleIsRead.svg';
import LinkRecordsIsRead from '/@/assets/images/noticeListIcon/LinkRecordsIsRead.svg';
import WinTopIsRead from '/@/assets/images/noticeListIcon/WinTopIsRead.svg';
import LowMultipleIsRead from '/@/assets/images/noticeListIcon/LowMultipleIsRead.svg';
import OnlineWithdrawal from '/@/assets/images/noticeListIcon/OnlineWithdrawal.svg';
import CompanyDeposit from '/@/assets/images/noticeListIcon/CompaneyDeposit.svg';
import CurrencyDeposit from '/@/assets/images/noticeListIcon/CurrencyDeposit.svg';
import HighMultiple from '/@/assets/images/noticeListIcon/HighMultiple.svg';
import LinkRecords from '/@/assets/images/noticeListIcon/LinkRecords.svg';
import WinTop from '/@/assets/images/noticeListIcon/WinTop.svg';
import LowMultiple from '/@/assets/images/noticeListIcon/LowMultiple.svg';
import announcement from '/@/assets/images/noticeListIcon/announcement.svg';
import announcementIsRead from '/@/assets/images/noticeListIcon/announcementIsRead.svg';
import CurrencyWithdrawal from '/@/assets/images/noticeListIcon/CurrencyWithdrawal.svg';
import CurrencyWithdrawalIsRead from '/@/assets/images/noticeListIcon/CurrencyWithdrawalIsRead.svg';
import Activity from '/@/assets/images/noticeListIcon/Activity.svg';
import ActivityIsRead from '/@/assets/images/noticeListIcon/ActivityIsRead.svg';

const props = defineProps<{
  icon: string;
  isRead: boolean;
}>();
const srcs = {
  CompanyDeposit,
  CurrencyDeposit,
  HighMultiple,
  LinkRecords,
  WinTop,
  LowMultiple,
  CompanyDepositIsRead,
  CurrencyDepositIsRead,
  HighMultipleIsRead,
  LinkRecordsIsRead,
  WinTopIsRead,
  LowMultipleIsRead,
  OnlineWithdrawal,
  OnlineWithdrawalIsRead,
  announcement,
  announcementIsRead,
  CurrencyWithdrawal,
  CurrencyWithdrawalIsRead,
  Activity,
  ActivityIsRead
};
</script>
<style>
.svgClass {
  position: absolute;

  /* border: 1px solid red!important; */
  width: 70px;
  height: 0;
  overflow: hidden;
  fill: currentcolor;
}
</style>
