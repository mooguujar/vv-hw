<template>
  <img :src="srcs[props.icon]" />
</template>
<script setup lang="ts">
  import bet from '/@/assets/images/reportDataCards/bet.webp';
  import bet_net from '/@/assets/images/reportDataCards/bet_net.webp';
  import cash_profit from '/@/assets/images/reportDataCards/cash_profit.webp';
  import commission from '/@/assets/images/reportDataCards/commission.webp';
  import deposit from '/@/assets/images/reportDataCards/deposit.webp';
  import first_deposit from '/@/assets/images/reportDataCards/first_deposit.webp';
  import gift from '/@/assets/images/reportDataCards/gift.webp';
  import withdraw from '/@/assets/images/reportDataCards/withdraw.webp';

  const props = defineProps<{
    icon: string;
  }>();
  const srcs = {
    bet,
    bet_net,
    cash_profit,
    commission,
    deposit,
    first_deposit,
    gift,
    withdraw,
  };
</script>
