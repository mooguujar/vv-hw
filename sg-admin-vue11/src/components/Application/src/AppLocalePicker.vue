<template>
  <Dropdown
    placement="bottom"
    :trigger="['click']"
    :dropMenuList="localeList"
    @menu-event="handleMenuEvent"
    @click="changeDropdown"
    overlayClassName="app-locale-picker-overlay"
  >
    <span class="cursor-pointer flex items-center">
      <Icon :color="'#00E701'" icon="ant-design:global-outlined" size="18" />
      <span v-if="showText" class="ml-1">{{ getLocaleText }}</span>
    </span>
  </Dropdown>
</template>
<script lang="ts" setup>
  import type { LocaleType } from '/#/config';
  import type { DropMenu } from '/@/components/Dropdown';
  import { ref, watchEffect, unref, computed } from 'vue';
  import { Dropdown } from '/@/components/Dropdown';
  import Icon from '@/components/Icon/Icon.vue';
  import { useLocale } from '/@/locales/useLocale';
  import { useI18n } from '/@/hooks/web/useI18n';

  // const localeList = useLocalList();
  const { t } = useI18n();

  // todo
  const localeList = [
    {
      key: 'lan_zh_CN',
      label: t('common.common_zh_CN'), //中文
      title: 'zh_CN',
      img: 'CN',
      event: 'zh_CN',
      text: t('common.common_zh_CN'),
    },
    {
      key: 'lan_en_US',
      label: t('common.common_en_US'),
      title: 'en_US',
      img: 'US',
      event: 'en_US',
      text: t('common.common_en_US'),
    },
    {
      key: 'lan_vi_VN',
      label: t('common.common_vi_VN'),
      title: 'vi_VN',
      img: 'VN',
      event: 'vi_VN',
      text: t('common.common_vi_VN'),
    },
    {
      key: 'lan_pt_BR',
      label: t('common.common_pt_BR'),
      title: 'pt_BR',
      img: 'BR',
      event: 'pt_BR',
      text: t('common.common_pt_BR'),
    },
    // {
    //   key: 'lan_th_TH',
    //   label: t('common.common_th_TH'),
    //   title: 'th_TH',

    //   img: 'TH',
    //   event: 'th_TH',
    //   text: t('common.common_th_TH'),
    // },
    // {
    //   key: 'lan_hi_IN',
    //   label: t('common.common_hi_IN'),
    //   title: 'hi_IN',

    //   img: 'IN',
    //   event: 'hi_IN',
    //   text: t('common.common_hi_IN'),
    // },
  ];
  const props = defineProps({
    /**
     * Whether to display text
     */
    showText: { type: Boolean, default: true },
    /**
     * Whether to refresh the interface when changing
     */
    reload: { type: Boolean },
  });
  const selectedKeys = ref<string[]>([]);

  const { changeLocale, getLocale } = useLocale();
  const showColorIcon = ref(true);
  const getLocaleText = computed(() => {
    const key = selectedKeys.value[0];
    if (!key) {
      return '';
    }
    return localeList.find((item) => item.event === key)?.text;
  });

  watchEffect(() => {
    selectedKeys.value = [unref(getLocale)];
  });

  async function toggleLocale(lang: LocaleType | string) {
    await changeLocale(lang as LocaleType);
    selectedKeys.value = [lang as string];
    props.reload && location.reload();
  }
  function changeDropdown() {
    showColorIcon.value = !showColorIcon.value;
  }
  function handleMenuEvent(menu: DropMenu) {
    showColorIcon.value = false;
    if (unref(getLocale) === menu.event) {
      return;
    }
    toggleLocale(menu.event as string);
  }
</script>

<style lang="less">
  .app-locale-picker-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }
</style>
