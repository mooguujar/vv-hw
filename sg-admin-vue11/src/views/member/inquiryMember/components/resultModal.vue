<template>
  <BasicModal
    @register="registerUpdate"
    :showCancelBtn="false"
    :showOkBtn="false"
    :title="$t('sys.api.errorTip')"
  >
    <p v-if="getListFormat.length"
      >{{ $t('table.member.member_follow') }}{{ getListFormat.length }}
      {{ $t('table.member.member_follow_1') }}</p
    >
    <div v-if="getListFormat.length" class="textArea">
      <p class="m-b-0" v-for="item in getListFormat" :key="item">{{ item }}</p>
    </div>
    <p v-if="getListNone.length"
      >{{ $t('table.member.member_follow') }}{{ getListNone.length }} ${{
        $t('table.system.system_ban_warn_text_1')
      }}</p
    >
    <div v-if="getListNone.length" class="textArea">
      <p v-for="item in getListNone" class="m-b-0" :key="item">{{ item }}</p>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  const getListNone = ref([] as any);
  const getListFormat = ref([] as any);
  const [registerUpdate, { closeModal }] = useModalInner((data) => {
    getListNone.value = data.data.none;
    getListFormat.value = data.data.format;
  });
</script>
<style scoped>
  .textArea {
    min-height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
  }
</style>
