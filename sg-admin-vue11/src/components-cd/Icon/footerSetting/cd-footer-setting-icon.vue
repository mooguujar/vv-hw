<template>
  <img :src="srcs[props.icon]" />
</template>
<script setup lang="ts">
  import facebook from '/@/assets/images/footerSetting/facebook.webp';
  import instagram from '/@/assets/images/footerSetting/instagram.webp';
  import twitter from '/@/assets/images/footerSetting/twitter.webp';
  import youtube from '/@/assets/images/footerSetting/youtube.webp';
  import tiktok from '/@/assets/images/footerSetting/tiktok.webp';
  import telegram from '/@/assets/images/footerSetting/telegram.webp';



  const props = defineProps<{
    icon: string;
  }>();
  const srcs = {
    facebook,
    instagram,
    twitter,
    youtube,
    tiktok,
    telegram,
  };
</script>
