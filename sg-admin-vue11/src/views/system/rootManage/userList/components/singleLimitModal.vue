<template>
  <div>
    <BasicModal @register="registerSingle" :showCancelBtn="false" :showOkBtn="false" :width="650">
      <template #title>
        <span class="firstTitle">{{ setTitle }}</span>
        <span class="firstTitle">（{{ subtitle }}）</span>
      </template>
      <div class="main">
        <div class="main-table">
          <template v-for="(item, index) in listCurrency" :key="index">
            <div
              class="main-table-item"
              v-if="
                (quota_data.funds_limit_state &&
                  type == 'add' &&
                  quota_data.funds_limit_state[item.id] == 1) ||
                !!!quota_data.funds_limit_state ||
                (quota_data.funds_limit_state &&
                  type != 'add' &&
                  quota_data.single_limit_state[item.id] == 1) ||
                !!!quota_data.single_limit_state
              "
            >
              <span>{{ item.name }}：</span>
              <span>{{
                (type == 'add' ? quota_data[item.name] : single_limit_map[item.id]) ?? '0'
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useCurrencyStore } from '/@/store/modules/currency';

  const { getCurrencyList } = useCurrencyStore();
  const { t } = useI18n();
  const setTitle = ref(t('table.system.system_root_addMony') as any);
  const subtitle = ref('' as any);
  const listCurrency = ref();
  const quota_data = ref();
  const single_limit_map = ref({});
  const type = ref('add');
  const [registerSingle] = useModalInner((data) => {
    quota_data.value = data.record;
    type.value = data.type;
    single_limit_map.value = data.record?.single_limit_map ?? {};
    listCurrency.value = getCurrencyList;
    if (data.type === 'add') {
      setTitle.value = t('table.system.system_root_addMony');
      subtitle.value = t('table.system.system_root_tip3');
    } else {
      setTitle.value = t('table.system.system_root_single');
      subtitle.value = t('table.system.system_root_tip3');
    }
  });
</script>
<style lang="less" scoped>
  .subtitle {
    margin-left: 4px;
    color: #fff;
    font-weight: 400;
  }

  .main-table {
    display: flex;
    flex-wrap: wrap;
    padding: 0 20px;

    &-item {
      display: flex;
      justify-content: center;
      width: 25%;
      height: 42px;
      border-top: 1px solid #dadada;
      border-right: 1px solid #dadada;
      line-height: 42px;
    }

    &-item:nth-last-child(-n + 4) {
      border-bottom: 1px solid #dadada;
    }

    &-item:nth-child(4n + 1) {
      border-left: 1px solid #dadada;
    }

    &-item:nth-child(odd) {
      background-color: @header-bg !important;
    }
  }
</style>
