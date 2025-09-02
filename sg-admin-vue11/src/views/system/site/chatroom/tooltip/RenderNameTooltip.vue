<template>
  <div>
    <Tooltip v-if="nameList.length > 0 && nameObj[localeLanguage]" placement="bottom">
      <template #title>
        <div v-for="(item, index) of nameList" :key="index">
          <div
            ><span>{{ countryName[item] }}：</span><span>{{ nameObj[item] }}</span></div
          >
        </div>
      </template>
      <div class="primary-color single-line-ellipsis">{{ setName(nameObj, localeLanguage) }}</div>
    </Tooltip>
    <div v-else>-</div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, toRefs } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import {useI18n} from "@/hooks/web/useI18n";

  interface Props {
    nameObj: Object;
  }
  const props = defineProps<Props>();

  const { t } = useI18n();
  const countryName = {
    cn: t('common.common_zh_CN'),
    en: t('common.common_en_US'),
    vn: t('common.common_vi_VN'),
    th: t('common.common_th_TH'),
    br: t('common.common_pt_BR'),
    in: t('common.common_hi_IN'),
  };

  const transferKey = {
    zh_CN: 'cn',
    en_US: 'en',
    vi_VN: 'vn',
    th_TH: 'th',
    hi_IN: 'in',
    pt_BR: 'br',
  };
  const { nameObj } = toRefs(props);
  const localeStore = useLocaleStoreWithOut();

  const localeLanguage = computed(() => {
    return transferKey[localeStore.localInfo.locale];
  });

  const nameList = Object.keys(countryName).filter((item) => nameObj.value[item]);
  // const nameList = Object.keys(nameObj.value).map((item) => {
  //   return {
  //     key: countryName[item],
  //     value: nameObj.value[item],
  //   };
  // });

  function setName(name, locale) {
    return name[locale];
  }
</script>
