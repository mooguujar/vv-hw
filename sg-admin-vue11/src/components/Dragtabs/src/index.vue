<template>
  <div class="tabs">
    <div class="tab-headers">
      <template v-if="panes.length > 0">
        <draggable @end="onDragEnd" v-model="panes" :disabled="disabled" tag="div" item-key="key">
          <template #item="{ element, index }" class="overflow-auto">
            <div
              :key="element.key"
              :class="['tab-header', { active: activeKey === element.key }]"
              @click="setActive(element.key)"
              ><Icon
                v-if="element.closable"
                icon="ri:drag-move-2-line"
                class="mr-5px"
                :color="activeKey === element.key ? '#fff' : '#444'"
              />
              <span>{{ element.title }}</span>
              <button
                v-if="element.closable"
                class="close ant-tabs-tab-remove"
                @click.stop="removeTab(element.key, element)"
                type="button"
                aria-label="remove"
                tabindex="0"
              >
                <span
                  role="img"
                  aria-label="close"
                  class="anticon anticon-close"
                  v-if="!isControlValueSet()"
                  ><svg
                    focusable="false"
                    class=""
                    data-icon="close"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    fill-rule="evenodd"
                    viewBox="64 64 896 896"
                  >
                    <path
                      fill="#1475e1"
                      d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"
                    /></svg></span
              ></button>
            </div>
          </template>
        </draggable>
        <button
          type="button"
          class="ant-tabs-nav-add"
          @click="addTab"
          aria-label="Add tab"
          v-if="!isControlValueSet() && !noaddBut"
          ><span role="img" aria-label="plus" class="anticon anticon-plus"
            ><svg
              focusable="false"
              class=""
              data-icon="plus"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              viewBox="64 64 896 896"
            >
              <path fill="#1475E1" d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
              <path
                fill="#1475E1"
                d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"
              /></svg></span
        ></button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import draggable from 'vuedraggable';
  import { Icon } from '/@/components/Icon';
  import { ref, defineProps, watch } from 'vue';
  import { isControlValueSet } from '/@/utils/domUtils';

  interface Pane {
    title: string;
    key: string;
    closable: boolean;
  }
  const props = defineProps<{
    panes: Pane[];
    activeKey: string;
    noaddBut: boolean;
    disabled: {
      type: boolean;
      default: false;
    };
  }>();
  const emit = defineEmits(['on-drag-end', 'remove-tab', 'set-active', 'add-tab']);
  const panes = ref<Pane[]>(props.panes || []);
  const activeKey = ref(props.activeKey);
  const setActive = (key: string) => {
    activeKey.value = key;
    emit('set-active', key);
  };

  const removeTab = (index: number, element: any) => {
    emit('remove-tab', index, element);
  };

  const addTab = () => {
    emit('add-tab');
  };
  const onDragEnd = (event: { oldIndex: any; newIndex: any }) => {
    const { oldIndex, newIndex } = event;
    if (oldIndex !== newIndex) {
      // const movedItem = panes.value.splice(oldIndex, 1)[0];
      // panes.value.splice(oldIndex, 0, movedItem);
      emit('on-drag-end', newIndex, oldIndex);
    }
  };
  watch(
    () => props.panes,
    (newVal) => {
      if (newVal && newVal.length > 0) {
        panes.value = newVal;
        // 只有当 activeKey 未设置时才更新
        if (!activeKey.value) {
          activeKey.value = newVal[0].key;
          emit('set-active', activeKey.value);
        }
      }
    },
    { immediate: true, deep: true },
  );

  // 同样监听 activeKey 的变化
  watch(
    () => props.activeKey,
    (newVal) => {
      if (newVal) {
        activeKey.value = newVal;
      }
    },
    { immediate: true },
  );
</script>

<style scoped lang="less">
  ::v-deep(.ant-tabs-tab-remove) {
    position: absolute;
    top: 5px;
    right: 5px;
    margin-right: 0 !important;
    margin-left: 0;
  }

  .tab-headers {
    display: flex;
    height: 63px;
    padding: 10px 0;
    background-color: #e0e5ef;
  }

  .tab-headers > div {
    display: flex;
    flex-direction: row;
    font-size: 1rem;
    overflow-x: auto;
  }

  .tab-header {
    display: flex;
    position: relative;
    align-items: center;
    margin-right: 10px;
    padding: 10px 20px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    background-color: #fafafa;
    cursor: pointer;
    flex: 0 0 auto;
  }

  .tab-header.active {
    background-color: #1475e1;
    color: white;
  }

  .close {
    margin-left: 8px;
    color: #999;
    cursor: pointer;
  }

  .add-tab {
    display: flex;
    align-items: center;
    padding: 10px;
    color: #1475e1;
    cursor: pointer;
  }

  .ant-tabs-nav-add {
    min-width: 40px;
    margin-left: 2px;
    padding: 0 8px;
    border: 1px solid #1475e1;
    border-radius: 4px;
    outline: none;
    background: #fafafa;
    cursor: pointer;
  }
</style>
