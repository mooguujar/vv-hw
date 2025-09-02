<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    :title="title"
    :showOkBtn="false"
    :showCancelBtn="false"
  >
    <div v-if="lines.length > 0">
      <div v-if="modalType === 'remark'">
        <p class="text-gray-500" v-for="(item, index) in lines" :key="index">
          {{ item[0] }}，{{ $t('business.you') }}
          <strong class="text-gray-900">
            {{ item[1] == 'system' ? $t('business.his2') : item[1] }}</strong
          >
          {{ remarkEventOptions[item[2]] }}，{{ $t('business.you1') }}
          <strong class="text-gray-900">{{ item[3] }}</strong>
        </p>
      </div>

      <div v-if="modalType === 'history'">
        <p class="text-gray-500" v-for="(item, index) in lines" :key="index">
          {{ item[0] }}，{{ $t('business.you') }}
          <strong class="text-gray-900">
            {{ item[1] == 'system' ? $t('business.his2') : item[1] }}</strong
          >
          {{ historyEventOptions[item[2]] }}，{{ $t('business.you2') }}
          <span :style="{ color: stateListColor[item[3]] }">
            {{
              item[3] == 1
                ? $t('business.common_state1')
                : item[3] == 2
                ? $t('business.common_state2')
                : item[3] == 3
                ? $t('business.common_to_be_paid')
                : item[3] == 4
                ? $t('business.finsh1')
                : $t('business.zd')
            }}</span
          >
        </p>
      </div>
    </div>
    <template v-else>
      <Empty />
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Empty } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  export default defineComponent({
    components: { BasicModal, Empty },
    setup() {
      const remarkEventOptions = {
        update: '修正数据',
        update_gift_fee: '优惠金额',
      };
      const historyEventOptions = {
        create: '创建报表',
        update: '更新状态',
        update_discounted_fee: '修改折扣费用',
      };
      const stateListColor = {
        '1': '#F9BA73',
        '2': '#F9BA73',
        '3': '#E0343C',
        '4': 'green',
      };
      const modalType = ref<String>('');

      const loading = ref(true);
      const lines = ref([]);
      const title = ref('' as any);
      const [register, { redoModalHeight }] = useModalInner(async (data, type) => {
        if (data.type === 1) {
          title.value = t('table.system.system_his');
          modalType.value = 'history';
        } else {
          title.value = t('common.ViewNotes');
          modalType.value = 'remark';
        }
        lines.value = data.data
          .split('\n')
          .filter((line) => line.trim() !== '')
          .map((item) => item.split(','));
      });

      watch(
        () => lines.value,
        () => {
          redoModalHeight();
        },
      );

      return {
        register,
        loading,
        lines,
        title,
        remarkEventOptions,
        historyEventOptions,
        stateListColor,
        modalType,
      };
    },
  });
</script>
<style scoped>
  .empty-tips {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
