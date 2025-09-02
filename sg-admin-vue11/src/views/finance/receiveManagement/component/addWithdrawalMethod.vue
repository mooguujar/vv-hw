<template>
  <BasicModal
    @ok="okFun"
    :title="t('modalForm.finance.finance_withdrawal_method')"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
    @register="registeraddDemond"
    :width="943"
    wrap-class-name="withdrawal-pay"
  >
    <!-- <div class="t-form-label-com">
      <RadioGroup v-model:value="currentCurrencyIndex" button-style="solid" @change="changeClick">
        <RadioButton v-for="(item, index) in currencyList" :value="index" :key="index">
          {{ item.name }}
        </RadioButton>
      </RadioGroup>
    </div> -->
    <div class="w-full">
      <cdButtonCurrency
        :btn-list="currencyList"
        @change-button-currency="changeClick"
        v-model="activeKey"
      />
    </div>
    <div class="flex items-center flex-wrap flex-1 mt-20px pl-15px">
      <!-- <div
        :class="index != 0 ? 'ml-2' : ''"
        class="base-tag flex items-center justify-center cursor relative mr-6px"
        v-for="(item, index) in withdrawTypeCurrencyList[activeKey]"
        v-draggable="{ index, swap }"
        :value="index"
        :key="index"
      >
        <img :src="Move" alt="" class="drag_img_m" />
        <div
          class="base-tag-text leading-loose flex-1 text-ellipsis overflow-hidden whitespace-nowrap text-center"
          style="position: relative; text-align: center !important"
          @click="handleClick(item)"
        >
          {{ item.name }}
          <CheckOutlined class="check-icon" v-show="item.state == 1" />
          <div class="triangle" v-show="item.state == 1"> </div>
        </div>
      </div> -->
      <Draggable
        :list="withdrawTypeCurrencyList[activeKey]"
        :animation="100"
        item-key="id"
        class="list-group flex"
        :forceFallback="true"
        ghost-class="ghost"
        @end="onMoveCallback"
      >
        <template #item="{ element, index }">
          <div
            :class="index != 0 ? 'ml-2' : ''"
            class="base-tag flex items-center justify-center cursor relative mr-20px"
          >
            <img :src="Move" alt="" class="drag_img_m" />
            <div
              class="base-tag-text leading-loose flex-1 text-ellipsis overflow-hidden whitespace-nowrap flex items-center justify-center"
              style="position: relative"
              @click="handleClick(element)"
            >
              {{ element.name }}
              <CheckOutlined class="check-icon" v-show="element.state == 1" />
              <div class="triangle" v-show="element.state == 1"> </div>
            </div>
          </div>
        </template>
      </Draggable>
    </div>
  </BasicModal>
</template>
<script setup lang="ts" name="addWithdrawalMethod">
  import Move from '/@/assets/images/move.webp';
  import { computed, ref, watch, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { RadioGroup, RadioButton, message } from 'ant-design-vue';
  import { getFirstProperty } from '/@/utils/common';
  import { CheckOutlined } from '@ant-design/icons-vue';
  import { updateWithdrawTypeState, withdraw_type_sort } from '/@/api/finance';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import Draggable from 'vuedraggable';

  const { t } = useI18n();
  const emit = defineEmits(['diamondsuccess']);
  const currentCurrencyIndex = ref(0); // 当前币种下标
  let activeKey = ref(getFirstProperty()?.id || '701');
  const withdrawTypeCurrencyList = ref({}); // 出款管理-列表
  let copywithdrawTypeCurrencyList = {};

  const [registeraddDemond, { setModalProps, closeModal }] = useModalInner(async (values) => {
    withdrawTypeCurrencyList.value = values;
    copywithdrawTypeCurrencyList = cloneDeep(values);
    setModalProps({ confirmLoading: false });
  });

  const { currencyTreeList } = useTreeListStore();

  const onMoveCallback = async (e) => {
    swap(e.oldDraggableIndex, e.newDraggableIndex);
  };

  const swap = (fromIndex, toIndex) => {
    let items = withdrawTypeCurrencyList.value[activeKey.value];
    items.forEach((element, i) => {
      element.seq = i + 1;
    });
    if (fromIndex != toIndex)
      withdraw_type_sort({ setting: [...items] }).then((data) => {
        if (data) {
          message.success(t('layout.setting.operatingTitle'));
        }
      });
  };

  // const activelen = computed(()=>{
  //   const len = withdrawTypeCurrencyList.value[activeKey.value]
  //   // .filter((item)=>item.state==1)
  //   return len
  // });
  const activelen = ref(0);
  watch(
    () => withdrawTypeCurrencyList.value,
    () => {
      const len =
        withdrawTypeCurrencyList.value[activeKey.value]?.filter((item) => item.state == 1).length ||
        0;
      activelen.value = len;
    },
    {
      deep: true,
    },
  );

  // 切换币种
  function changeClick(e) {
    currentCurrencyIndex.value = e;
    activeKey.value = e;
    // currentCurrencyIndex.value = e.target.value;
    // activeKey.value = currencyList.value[currentCurrencyIndex.value].id;
  }

  const currencyList = computed(() => {
    const list = currencyTreeList.map((item) => {
      return { ...item, loaded: false };
    });
    const listNew = list.filter((item) => {
      const id = item.id;
      return (
        withdrawTypeCurrencyList.value.hasOwnProperty(id) &&
        withdrawTypeCurrencyList.value[id].length > 0
      );
    });
    return [...listNew];
  });

  const handleClick = async (el) => {
    const { id, state } = el;
    const currencyList = withdrawTypeCurrencyList.value[activeKey.value];
    const index = currencyList.findIndex((item) => item.id === id);

    if (index !== -1) {
      currencyList[index].state = state === 1 ? 2 : 1;
      setTimeout(() => {
        if (activelen.value < 1) {
          currencyList[index].state = 1;
          return message.error(t('common.at_least_one'));
        }
      }, 11);
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
    if (activelen.value < 1) {
      return message.error(t('common.at_least_one_sel'));
    }
    try {
      // const result = findDifferentStates(
      //   copywithdrawTypeCurrencyList,
      //   withdrawTypeCurrencyList.value,
      // );
      const result = withdrawTypeCurrencyList.value[activeKey.value];
      const { data, status } = await updateWithdrawTypeState({ setting: result });
      if (status) {
        message.success(data);
        emit('diamondsuccess', activeKey.value, result);
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
<style lang="less">
  .withdrawal-pay {
    .ant-modal .ant-modal-body > .scrollbar {
      padding-top: 0 !important;
    }
  }
</style>
<style lang="less" scoped>
  .base-tag {
    min-width: 80px;
    height: 35px;
    border: 1px solid #d9d9d9;
    border-radius: @border-radius-base;
    background-color: #fff;

    .base-tag-text {
      // height: 100%;
      padding: 4px 7px;
      font-size: 12px;
    }
  }

  .active {
    border: 1px solid lighten(@primary-color, 10%);
    color: lighten(@primary-color, 10%);
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
    // border-width: 50px 0 0 50px;
    // border-style: solid;
    // border-color: transparent;
  }

  .triangle::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-bottom: 25px solid rgb(76 155 239);
    border-left: 25px solid transparent;
  }
  //    {
  //   position: absolute;
  //   right: 0;
  //   bottom: 0;
  //   width: 0;
  //   height: 0;
  //   border-bottom: 25px solid rgb(76 155 239);
  //   border-left: 25px solid transparent;
  // }

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
    border-left-width: 1px solid #d9d9d9;
    text-align: center;
  }

  // 银行卡样式
  .base-tag {
    height: auto !important;
    border: none !important;
  }

  .base-tag-text {
    min-width: 100px;
    height: 42px;
    padding-top: 9px !important;
    padding-bottom: 9px !important;
    border-radius: 4px !important;
    font-size: 14px !important;

    &.active {
      background-color: #1475e1;
      color: #fff !important;
    }
  }

  .base-tag-text:not(.active) {
    border: 1px solid #e1e1e1;
    color: #2f4553;
  }

  .drag_img_m {
    position: absolute;
    z-index: 111;
    top: -10px;
    left: -10px;
    width: 21px;
    height: 21px;
  }

  .draggable-item {
    cursor: grab;
    user-select: none;
  }

  .dragging {
    opacity: 0.5;
  }

  .over {
    border: 2px dashed #000;
  }

  .withdrawal-pay {
    .ant-modal .ant-modal-body > .scrollbar {
      padding-top: 0 !important;
    }
  }
</style>
