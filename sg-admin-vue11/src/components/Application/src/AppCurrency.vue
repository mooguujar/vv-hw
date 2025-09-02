<template>
  <Dropdown placement="bottom" :trigger="['click']" overlayClassName="app-locale-picker-overlay">
    <div class="flex items-center justify-center">
      <span class="flex items-center justify-center rounded-full border border-gray-300 h-6 w-6">
        <span class="text-sm">{{ t('common.zhi') }}</span>
      </span>
    </div>
    <template #overlay>
      <Menu>
        <MenuItem>
          <a href="javascript:;">1st menu item</a>
        </MenuItem>
        <MenuItem>
          <a href="javascript:;">2nd menu item</a>
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>
<script lang="ts" setup>
  import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import type { LocaleType } from '/#/config';
  import type { DropMenu } from '/@/components/Dropdown';
  import { ref, watchEffect, unref, computed } from 'vue';
  import { useLocale } from '/@/locales/useLocale';
  import { useLocalList } from '/@/settings/localeSetting';
  import { useI18n } from '@/hooks/web/useI18n';

  const localeList = useLocalList();
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
  const { t } = useI18n();
  const { changeLocale, getLocale } = useLocale();

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

  function handleMenuEvent(menu: DropMenu) {
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
