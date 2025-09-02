<template>
  <div>
    <div class="yh-tabs">
      <Draggable
        :list="list"
        :group="groupName"
        animation="100"
        :item-key="dragKey"
        @end="dragEnd"
        :disabled="disabled"
        class="px-10px"
        style="display: flex; justify-content: space-between; width: 100%"
      >
        <template #item="{ element, index }">
          <span
            v-if="filterShow(element)"
            :class="['yh-tabs-item', modelValue === index ? 'active' : '']"
            @click="changeActive(element, index)"
          >
            <img class="prefix-icon-move move cursor mr-2" :src="dragger" />
            <slot name="head" :data="{ element, index }">
              <span>
                {{ commomVenueList[element.game_type] }}
              </span>
            </slot>
          </span>
        </template>
      </Draggable>
    </div>
    <div class="tab-pane">
      <slot :item="curTabData"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, computed, ref } from 'vue';
  import Draggable from 'vuedraggable';
  import dragger from '/@/assets/svg/dragger.svg';
  import { commomVenueList } from '/@/settings/commonSetting';

  const props = defineProps({
    tabList: {
      type: Array,
      required: true,
    },
    dragKey: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });
  const list = ref(props.tabList);

  const emits = defineEmits(['update:modelValue', 'dragEnd', 'changeActive']);
  if (props.modelValue == 0) {
    if (props.groupName === 'vip') {
      const index = list.value.findIndex((item) =>
        item.data.some((dataItem) => dataItem.show == 1),
      );
      if (index !== -1) {
        emits('update:modelValue', index); // Emit the index to update modelValue
      }
    } else {
      const index = list.value.findIndex((item) =>
        item.config.length > 0
          ? item.config.some(
              (config) =>
                config.data.length > 0 && config.data.some((dataItem) => dataItem.show == 1),
            )
          : false,
      );
      if (index !== -1) {
        emits('update:modelValue', index); // Emit the index to update modelValue
      }
    }
  }

  function filterShow(element) {
    if (props.groupName == 'vip') {
      return element.data.some((el) => el.show == 1);
    } else {
      if (element.config === null) {
        return false;
      } else {
        return element.config.some((config) => config.data.some((dataItem) => dataItem.show == 1));
      }
    }
  }

  const curTabData: any = computed(() => list.value[props.modelValue]);

  const changeActive = (element, index) => {
    emits('update:modelValue', index);
    // emits('changeActive', element);
  };

  const dragEnd = () => {
    emits('dragEnd', list.value);
  };
</script>

<style lang="less" scoped>
  .yh-tabs {
    display: flex;
    position: relative;
    box-sizing: border-box;
    justify-content: space-between;
    width: 90%;
    //border-bottom: 1px solid #ebebeb;
    height: 40px;
    line-height: 40px;

    &::after {
      content: '';
      display: block;
      position: absolute;
      z-index: -1;
      bottom: -7px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #ccc;
    }

    .yh-tabs-item {
      cursor: pointer;
    }

    .yh-tabs-item.active {
      color: #1475e1;

      span {
        border-bottom: 2px solid #1475e1;
      }
    }
  }

  .tab-pane {
    margin-top: 24px;
    padding-left: 10px;
  }
</style>
