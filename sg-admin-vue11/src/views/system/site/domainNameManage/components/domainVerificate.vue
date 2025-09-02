<template>
  <div>
    <div v-if="getDateDiff.state === 1">
      <span class="light-green">{{ t('table.system.NDS_is') }}</span>:
      <span class="primary-color cursor-pointer" @click="handleExpand">{{
        !expandText ? t('table.system.expand') : t('table.system.collapse')
      }}</span>
      <domainDisplay v-if="expandText" :serverList="serverList" />
    </div>
    <!--获取NS-->
    <span
      v-if="getDateDiff.state === 2 && getDateDiff.id !== showVerifica"
      class="primary-color cursor-pointer"
      @click="handleDns(getDateDiff)"
      >{{ $t('table.system.system_get_ns') }}</span
    >
    <!--请将DNS改为以下服务器后，-->
    <!--点击验证-->
    <div v-if="getDateDiff.state === 2 && getDateDiff.id === showVerifica"
      >{{ $t('table.system.system_get_ns_change_dns') }}，
      <span class="primary-color cursor-pointer" @click="handleVerifica(getDateDiff)">{{
        $t('table.system.system_get_ns_click_verify')
      }}</span>
      <domainDisplay :serverList="serverList" /> </div
  ></div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import domainDisplay from '../common/domainDisplay.vue';
  import eventBus from '/@/utils/eventBus';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const getDateDiff = ref({} as any);
  const expandText = ref(false as boolean);
  const serverList = ref([] as any);
  const props = defineProps({
    records: {
      type: Object,
      defalut: { state: 0, name_server: '' },
    },
    showVerifica: {
      type: [String, Number, Boolean],
    },
    handleVerifica: Function,
  });
  function handleDns(getDateDiff) {
    eventBus.emit('handleVerificatEmit', getDateDiff);
  }
  function changeValue(value) {
    const textArray = value.split(',').map((domain, index) => {
      const value = `ns${index + 1}`;
      return { name: domain, value: value };
    });
    serverList.value = textArray;
  }
  function handleExpand() {
    expandText.value = !expandText.value;
  }
  onMounted(() => {
    changeValue(props?.records?.name_server);
    getDateDiff.value = props.records;
  });
</script>
<style lang="less" scoped>
  .light-green {
    color: #1CD91C!important;
  }
</style>
