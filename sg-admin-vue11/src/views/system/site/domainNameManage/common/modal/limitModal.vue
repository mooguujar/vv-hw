<template>
  <div>
    <BasicModal @register="registerLimit" :title="$t('table.system.system_limit_info')">
      <p>{{ $t('table.system.system_limit_info1') }}</p>
      <p>{{ $t('table.system.system_limit_info2') }}</p>
      <p>{{ $t('table.system.system_limit_info2_1') }}</p>
      <p>{{ $t('table.system.system_limit_info2_2') }}</p>
      <p>{{ $t('table.system.system_limit_info3') }}</p>
      <p>{{ $t('table.system.system_limit_info4') }}</p>
      <p>{{ $t('table.system.system_limit_info4_1') }}</p>
      <p>{{ $t('table.system.system_limit_info4_2') }}</p>
      <p>{{ $t('table.system.system_limit_info4_3') }}</p>
      <p>{{ $t('table.system.system_limit_info5') }}</p>
    </BasicModal></div
  >
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const [registerLimit] = useModalInner();
</script>
