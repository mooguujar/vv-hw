<template>
  <BasicModal
    @ok="okFun"
    :title="t('modalForm.finance.finance_withdrawal_method')"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
    @register="registeraddDemond"
    :width="900"
  >
    <RadioGroup button-style="solid" @change="changeClick">
      <RadioButton v-for="(item, index) in currencyList" :value="index" :key="index">
        {{ item.name }}
      </RadioButton>
    </RadioGroup>
    <div class="flex items-center flex-wrap flex-1 mt-3">
      <div
        :class="index != 0 ? 'ml-2' : ''"
        class="base-tag flex items-center justify-center cursor"
        v-for="(item, index) in withdrawTypeCurrencyList[activeKey]"
        :value="index"
        :key="index"
      >
        <div
          :class="item.state == 1 ? 'active' : ''"
          class="base-tag-text leading-loose flex-1 text-ellipsis overflow-hidden whitespace-nowrap text-center"
          style="position: relative; text-align: center !important"
          @click="handleClick(item)"
        >
          {{ item.name }}
          <CheckOutlined class="check-icon" v-if="item.state == 1" />
          <div class="triangle" v-if="item.state == 1"></div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts" name="CurrencyUsedModal">
  import { computed, ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useTreeListStore } from '@/store/modules/treeList';
  import { RadioGroup, RadioButton, message } from 'ant-design-vue';
  import { getFirstProperty } from '@/utils/common';
  import { CheckOutlined } from '@ant-design/icons-vue';
  import { updateWithdrawTypeState } from '@/api/finance';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
  let activeKey = ref(getFirstProperty()?.id || '701');
  const withdrawTypeCurrencyList = ref({}); // 出款管理-列表
  let copywithdrawTypeCurrencyList = {};

  const [registeraddDemond, { setModalProps, closeModal }] = useModalInner(async (values) => {
    withdrawTypeCurrencyList.value = values;
    copywithdrawTypeCurrencyList = cloneDeep(values);
    setModalProps({ confirmLoading: false });
  });

  const { currencyTreeList } = useTreeListStore();

  // 切换币种
  function changeClick(e) {}

  const currencyList = computed(() => {
    const list = currencyTreeList.map((item) => {
      return { ...item, loaded: false };
    });
    return [...list];
  });

  const handleClick = async (el) => {
    const { id, state } = el;
    const currencyList = withdrawTypeCurrencyList.value[activeKey.value];
    const index = currencyList.findIndex((item) => item.id === id);

    if (index !== -1) {
      currencyList[index].state = state === 1 ? 2 : 1;
    }
  };

  const findDifferentStates = (arr1, arr2) => {
    return Object.keys(arr1)
      .flatMap((key) =>
        arr1[key].map((item1) => {
          const item2 = arr2[key].find((el) => el.id === item1.id);
          if (item2 && item1.state !== item2.state) {
            return { id: item1.id, state: item2.state };
          }
          return null;
        }),
      )
      .filter((item) => item !== null);
  };

  async function okFun() {
    try {
      const result = findDifferentStates(
        copywithdrawTypeCurrencyList,
        withdrawTypeCurrencyList.value,
      );
      const { data, status } = await updateWithdrawTypeState({ setting: result });
      if (status) {
        message.success(data);
        closeModal();
      } else {
        message.error(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<style lang="less" scoped>
  .base-tag {
    min-width: 80px;
    height: 35px;
    border-radius: @border-radius-base;
    background-color: #fff;

    .base-tag-text {
      height: 100%;
      padding: 4px 7px;
      font-size: 12px;
    }
  }

  .ant-input-sm {
    padding: 5px 7px;
    font-size: 12px;
  }

  .triangle {
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-width: 50px 0 0 50px;
    border-style: solid;
    border-color: transparent;
  }

  .triangle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
  }

  .check-icon {
    position: absolute;
    z-index: 100;
    right: -2px;
    bottom: 1px;
    color: #fff;
    font-size: 14px;
  }

  ::v-deep(.ant-radio-button-wrapper:first-child) {
    border-radius: 0;
  }

  ::v-deep(.ant-radio-button-wrapper:last-child) {
    border-left: 0;
    border-radius: 0;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    border-left-width: 1px;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    width: 83px;
    border-left-width: 1px;
    text-align: center;
  }
</style>
