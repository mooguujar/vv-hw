<template>
  <img :src="srcs[props.icon]" />
</template>
<script setup lang="ts">
  import US from '/@/assets/svg/language/US.svg';
  import BR from '/@/assets/svg/language/BR.svg';
  import VN from '/@/assets/svg/language/VN.svg';
  import CN from '/@/assets/svg/language/CN.svg';
  import ID from '/@/assets/svg/language/ID.svg';
  import IN from '/@/assets/svg/language/IN.svg';
  import JP from '/@/assets/svg/language/JP.svg';
  import KR from '/@/assets/svg/language/KR.svg';
  import TH from '/@/assets/svg/language/TH.svg';

  const props = defineProps<{
    icon: string;
  }>();
  const srcs = {
    CN,
    VN,
    BR,
    US,
    ID,
    IN,
    JP,
    KR,
    TH,
  };
</script>
