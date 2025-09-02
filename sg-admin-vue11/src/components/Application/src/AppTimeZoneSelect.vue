<template>
  <div>
    <span class="text-slate-700">{{ t('business.common_current_timeZone') }}: </span>
    <Select v-model:value="selectValues" @change="handleChange" :options="options" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Select } from 'ant-design-vue';
  import { useTimezoneStore } from '/@/store/modules/timezone';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const { getTimezoneList, getTimezone, setTimezone } = useTimezoneStore();
  const options = ref(getTimezoneList);
  const selectValues = ref(getTimezone);

  const handleChange = (value) => {
    setTimezone(value);
    document.location.reload();
  };
</script>
