<template>
  <img :src="srcs[props.icon]" />
</template>
<script setup lang="ts">
  import language from '/@/assets/images/userDropdownIcon/language.webp';
  import currency from '/@/assets/images/userDropdownIcon/currency.webp';
  import timezone from '/@/assets/images/userDropdownIcon/timezone.webp';
  import dataset from '/@/assets/images/userDropdownIcon/dataset.webp';
  import changepwd from '/@/assets/images/userDropdownIcon/changepwd.webp';
  import loginlog from '/@/assets/images/userDropdownIcon/loginlog.webp';
  import exit from '/@/assets/images/userDropdownIcon/exit.webp';

  const props = defineProps<{
    icon: string;
  }>();
  const srcs = {
    language,
    currency,
    timezone,
    dataset,
    changepwd,
    loginlog,
    exit,
  };
</script>
