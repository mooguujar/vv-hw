<template>
  <div class="border-1 border-dashed border-gray-600 p-6 mt-4">
    <div class="title">{{ t('common.siteDesTit1') }}</div>
    <div>
      <ul>
        <li
          ><span>{{ t('common.siteDesSubTit1') }}</span
          >：{{ t('common.siteDesSubDetail1') }}</li
        >
        <li
          ><span>{{ t('common.siteDesSubTit2') }}</span
          >：{{ t('common.siteDesSubDetail12') }}</li
        >
        <li
          ><span>{{ t('common.siteDesSubTit3') }}</span
          >：{{ t('common.siteDesSubDetail2') }}</li
        >
        <li
          ><span>{{ t('common.siteDesSubTit4') }}</span
          >：{{ t('common.siteDesSubDetail3') }} <span>{{ t('common.siteDesSubDetail4') }}</span
          >。</li
        >
        <li
          ><span>{{ t('common.siteDesSubTit5') }}</span
          >：{{ t('common.siteDesSubDetail5') }} <span>{{ t('common.siteDesSubDetail6') }}</span
          >。</li
        >
      </ul>
    </div>
    <div class="title">{{ t('common.siteDesTit2') }}</div>
    <div>
      <ul>
        <li
          ><span class="normal">{{ t('common.siteDesSubTit21') }}：</span
          >{{ t('common.siteDesSubDetail_21') }}</li
        >
        <li
          ><span class="warm">{{ t('common.siteDesSubTit_22') }}：</span
          >{{ t('common.siteDesSubDetail_22') }}</li
        >
        <li
          ><span class="limit">{{ t('common.siteDesSubTit_23') }}：</span
          >{{ t('common.siteDesSubDetail_23') }}</li
        >
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
</script>
<style scoped>
  .title,
  span {
    font-weight: 650;
  }
  ul {
    font-size: 12px;
  }
  .normal {
    color: #63a103;
  }
  .warm {
    color: #f59a23;
  }
  .limit {
    color: #ec808d;
  }
  .prohibit {
    color: #d9001b;
  }
  .freeze {
    color: #d9001b;
  }
</style>
