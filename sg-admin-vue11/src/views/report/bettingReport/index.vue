<template>
  <div>
    <PageWrapper :contentStyle="{ margin: 0 }" class="LayoutTable">
      <abRoundButtonGroup
        v-if="auths(['50201', '50202'])"
        class="mt-4 ml-5"
        v-model="tabValue"
        :btn-list="[
          { label: t('table.report.report_betting_record'), value: 'default', id: '50201' },
          { label: t('table.report.report_betting_sport'), value: 'sport', id: '50201' },
          { label: t('table.report.report_betting_all'), value: 'all', id: '50202' },
        ]"
      />
      <KeepAlive>
        <div>
          <bettingRecord v-if="tabValue === 'default'" />
          <bettingSport v-if="tabValue === 'sport'" />
          <bettingAll v-if="tabValue === 'all'" />
        </div>
      </KeepAlive>
    </PageWrapper>
    <NoData class="mt-10" v-if="!auths(['50201', '50202'])" />
  </div>
</template>

<script setup lang="ts" name="BettingReportNocash">
  import { onMounted, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import bettingRecord from './bettingRecord/index.vue';
  import bettingSport from './bettingSport/index.vue';
  import bettingAll from './bettingAll/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import abRoundButtonGroup from '/@/components/abRoundButtonGroup/ab-round-button-group.vue';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import NoData from '/@/views/sys/noData/index.vue';

  const { t } = useI18n();
  const tabValue = ref<string>('default');
  onMounted(() => {
    if (isHasAuth('50201')) {
      tabValue.value = 'default';
    } else if (isHasAuth('50202')) {
      tabValue.value = 'all';
    } else {
      tabValue.value = '';
    }
  });
</script>
