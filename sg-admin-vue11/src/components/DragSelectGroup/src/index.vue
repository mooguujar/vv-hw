<template>
  <draggable
    v-bind="$attrs"
    tag="div"
    item-key="id"
    :sort="isSort"
    :forceFallback="true"
    :animation="300"
    :list="listRef"
    ghost-class="ghost"
    :move="onMove"
    @end="end"
    :disabled="dragDisabled"
    class="itemDrage"
  >
    <template #item="{ element, index }">
      <div
        class="flex items-center"
        :class="
          element.id === '1' || (element.state && !subTitle)
            ? 'forbid'
            : element.platform_name && subTitle && !element.state
            ? 'plateform_name'
            : element.state && subTitle
            ? 'plateform_name plateform_name_forbid'
            : ''
        "
        v-show="element.state != 2 ? (show100 ? (element.id == 100 ? false : true) : true) : false"
        :element="element.state"
      >
        <div class="group-item" :style="{ width: selectWidth }" :class="itemClass">
          <template v-if="suffix === 'edit'">
            <CheckOutlined
              v-if="element.isEdit && !element.state && showPrefixIcon"
              class="prefix-icon cursor"
              :value="element.value"
              @click="handleCloseEdit(element)"
            />
          </template>
          <template v-if="suffix === 'move'">
            <img class="prefix-icon-move move cursor" :src="dragger" v-if="showSuffixIcon" />
            <!-- <Icon
              v-if="showSuffixIcon"
              class="prefix-icon-move move cursor"
              icon="ri:drag-move-2-fill"
              color="#35a7f0"
              size="14"
            /> -->
          </template>
          <template v-if="editor === 'tag'">
            <baseTitleSub
              :value="element.value"
              :title="element.platform_name"
              :element="element"
              v-if="subTitle && element.platform_name"
              :class="{
                activeMultiple:
                  selected.indexOf(element) != -1 &&
                  activeMultipleState &&
                  !element.state &&
                  showSuffixIcon,
              }"
              @click.stop="handleClickTag(index, element)"
            />
            <BaseTag
              v-else
              class="text-center cursor"
              v-bind="$attrs"
              :key="element.id"
              :class="{
                active: currentIndexRef === index && !element.isEdit && activation,
                cursor: activation,
                disabled: disabled && element.state,
                choosed: element._index >= 0,
                move: !element.state && showSuffixIcon,
                activeMultiple:
                  selected.indexOf(element) != -1 && activeMultipleState && !element.state,
              }"
              :categoryId="categoryId"
              :value="element.value"
              :isEdit="element.isEdit"
              :element="element"
              :isLogo="isLogo"
              :isToolTip="isToolTip"
              @default:change="(value) => handleChange(value, index)"
              @click.stop="handleClickTag(index, element)"
            />
          </template>

          <template v-if="editor === 'select' && !categoryId">
            <BaseSelect
              :value="element.value"
              :options="element.selectOptions"
              :placeholder="element.placeholder"
              :key="`${element.placeholder}-${element.id}`"
              @default:change="(value) => handleChange(value, index)"
            />
          </template>
          <!-- <CloseOutlined
            v-if="!element.state && showCloseIcon"
            class="close cursor"
            @click="emit('click:del', index)"
          /> -->
          <img
            v-if="
              lastClose
                ? index == listRef.length - 1 &&
                  showCloseIcon &&
                  element.id !== '1' &&
                  element.pid !== 0
                : showCloseIcon && element.id !== '1' && element.pid !== 0
            "
            class="cursor close"
            :src="close"
            @click="emit('click:del', index)"
          />
          <!-- <Icon
            v-if="!element.state && showCloseIcon && element.id !== '1' && element.pid !== 0"
            icon="ri:close-circle-line"
            class="cursor close"
            size="20"
            style="color: #e25061"
            @click="emit('click:del', index)"
          /> -->
        </div>
      </div>
    </template>
    <template #footer v-if="showAddIcon">
      <div class="flex items-center" role="group">
        <PlusCircleOutlined class="add-icon cursor" @click="emit('click:add')" />
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
  import { watch, ref } from 'vue';
  import {
    DragOutlined,
    CloseOutlined,
    EditOutlined,
    PlusCircleOutlined,
    CheckOutlined,
  } from '@ant-design/icons-vue';
  import baseTitleSub from './baseTitleSub.vue';
  import BaseSelect from './BaseSelect.vue';
  import BaseTag from './BaseTag.vue';
  import draggable from 'vuedraggable';
  import { Icon } from '/@/components/Icon';
  import dragger from '/@/assets/svg/dragger.svg';
  import close from '/@/assets/svg/close.svg';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const props = defineProps({
    end: { type: [Function, undefined], undefined },
    show100: { type: [Boolean], default: false },
    grayness: { type: [Boolean], default: false },
    lastClose: { type: [Boolean], default: false },
    currentIndex: { type: [Number, String], default: 0 || null },
    selectWidth: { type: String, default: '100%' },
    itemClass: { type: String, default: '' },
    draggableList: { type: Array, default: () => [] },
    activation: { type: Boolean, default: true }, // 点击是否激活颜色
    suffix: { type: String, default: () => 'move' }, // 前缀按钮功能 edit | move
    editor: { type: String, default: 'tag' }, // 主体展示编辑器 select | tag
    isToolTip: { type: Boolean, default: false },
    disabled: { type: Boolean, default: true },
    showPrefixIcon: { type: Boolean, default: true },
    showSuffixIcon: { type: Boolean, default: true },
    showAddIcon: { type: Boolean, default: true },
    showCloseIcon: { type: Boolean, default: true },
    isLogo: { type: Boolean, default: false },
    activeMultipleState: { type: Boolean, default: false },
    dragDisabled: { type: Boolean, default: false },
    selectRemove: { type: Array, default: Array },
    subTitle: { type: Boolean, default: false },
    rightPadding: { type: Boolean, default: false },
    categoryId: { type: String, default: '' }, //分类id传入
    kindPadding: { type: Boolean, default: false },
    topPadding: { type: Boolean, default: false },
    sixRightPadding: { type: Boolean, default: false },
    isSort: { type: Boolean, default: true },
  });
  const { t } = useI18n();
  const listRef = ref(props.draggableList);
  const currentIndexRef = ref(props.currentIndex);
  const selected = ref([] as any);
  if (props.editor) {
    // 开启编辑初始化
    listRef.value?.forEach((item: any) => {
      item.isEdit = false;
    });
  }
  watch(
    () => props.selectRemove,
    (v) => {
      if (v.length === 0) {
        selected.value = [];
      }
      //selected.value = []
    },
  );
  watch(
    () => props.draggableList,
    (v) => {
      listRef.value = v;
    },
  );

  watch(
    () => props.currentIndex,
    (v) => {
      currentIndexRef.value = v;
    },
  );

  const emit = defineEmits([
    'update:value',
    'click:del',
    'click:add',
    'click:tag',
    'edit:complete',
    'move:changeMove',
  ]);

  function handleOpenEdit(element) {
    element.isEdit = true;
  }

  // function onMove(e) {
  //    if(e.draggedContext.element&&e.draggedContext.element.type=='game-bottom') {
  //     if(e.relatedContext.element&&e.relatedContext.element.type=='game-top'){
  //       return false;
  //     }
  //    }
  //    let uniqueItems = [];
  //     e.relatedContext.list.forEach((item) => {
  //       // 检查 uniqueItems 数组中是否已经存在相同 id 的项目
  //       if (!uniqueItems.some((uniqueItem: any) => uniqueItem.id === item.id)) {
  //         // 如果不存在，则将此项目添加到 uniqueItems 数组中
  //         uniqueItems.push(item as never);
  //       }
  //     });
  //     e.relatedContext.list = uniqueItems;
  //   if (e.relatedContext.element && e.relatedContext.element.id === '1') return false;
  //   return true;
  // }
  function onMove(e) {
    const { from, to } = e;
    if (e.to.className.includes('大厅导航')) {
      if (e.from.className.includes('全部品牌')) {
        return false;
      }
    }
    if (e.to.className.includes('row-config')) {
      if (e.from.className.includes('subgame')) {
        return false;
      }
      if (e.from.className.includes('brand-list')) {
        return false;
      }
      if (e.from.className.includes('游戏厂商')) {
        return false;
      }
    }
    if (e.to.className.includes('all-game')) {
      if (e.from.className.includes('brand-list')) {
        return false;
      }
    }
    if (from != to) {
      let draggedContextId = e.draggedContext.element.id || e.draggedContext.element.platform_id;

      let exetId =
        e.relatedContext.list &&
        e.relatedContext.list.find(
          (item) => item.id == draggedContextId || item.platform_id == draggedContextId,
        );
      if (exetId) {
        if (e.draggedContext.element.id) message.warn(t('table.system.sys_msg_1'));
        else message.warn(t('table.system.sys_msg_2'));
        return false;
      }
    }
    const isGameBottom =
      e.draggedContext.element && e.draggedContext.element.type === 'game-bottom';
    const isGameTop =
      e.relatedContext.list && e.relatedContext.list.find((item) => item.type == 'game-top');

    if (isGameBottom && isGameTop) {
      return false;
    }

    if (e.relatedContext.element && e.relatedContext.element.id === '1') {
      return false;
    }
    const uniqueItems = Array.from(new Set(e.relatedContext.list.map((item) => item.id))).map(
      (id) => e.relatedContext.list.find((item) => item.id === id),
    );
    // let draggedContextId = e.draggedContext.element.id;

    // if (!draggedContextId) {
    //   draggedContextId = e.draggedContext.element.platform_id;
    // }

    // let exetId;

    // if (e.draggedContext.element.id) {
    //   exetId = e.relatedContext.list.find((item) => item.id == draggedContextId);
    // } else {
    //   exetId = e.relatedContext.list.find((item) => item.platform_id == draggedContextId);
    // }

    // if (exetId) {
    //   return false;
    // }
    // Use Set to remove duplicates based on item id

    // Update the relatedContext.list with unique items
    e.relatedContext.list = uniqueItems;
    emit('move:changeMove', e);
    return true;
  }
  function handleCloseEdit(element) {
    emit('edit:complete', element);
  }

  function handleClickTag(index: any, element: any) {
    //如果多选
    if (selected.value.indexOf(element) !== -1) {
      selected.value.splice(selected.value.indexOf(element), 1);
    } else {
      selected.value.push(element as never);
    }
    if (props.activeMultipleState) {
      emit('click:tag', selected.value);
    } else {
      emit('click:tag', index, element);
    }
  }

  function handleChange(value, index) {
    emit('update:value', { value, index });
  }
</script>

<style scoped lang="less">
  .is-hot {
    position: absolute;
    z-index: 5;
    right: 8px;
    width: 20px;
    height: 15px;
    border-radius: 3px;
    background-color: #f90;
    color: #fff;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
  }

  .itemDrage {
    /* webkit浏览器 */

    /* 早期浏览器 */

    /* IE10 */
    user-select: none;
    -webkit-touch-callout: none; /* 系统默认菜单被禁用 */

    /* 火狐 */
  }

  .plateform_name {
    height: 62px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    background-color: #fff;

    .prefix-icon-move {
      top: -7px;
      left: -9px !important;
    }

    .prefix-icon {
      top: -9px;
      left: -8px !important;
    }

    .close {
      top: -7px;
      right: -9px;
    }

    .group-item {
      height: 100% !important;
      padding: 0 !important;
    }
  }

  .forbid .base-tag {
    background-color: #d7d7d7;
  }

  .plateform_name_forbid {
    background: #d7d7d7;
  }

  ::v-deep(.plateform_name_forbid .base-sub-title .base-sub-title-top) {
    border-bottom: 1px solid #c7c7c7 !important;
  }

  .grayness .grayness {
    background: #fff;
    cursor: unset;
  }

  .row-config .plateform_name_forbid {
    background: #fff !important;
  }

  .row-config .plateform_name .base-sub-title-top {
    border-bottom: 1px solid rgb(225 225 225 / 26.1%) !important;
  }

  .bg_white .plateform_name_forbid {
    background: #fff !important;
  }

  .group-item {
    position: relative;
  }

  .prefix-icon {
    position: absolute;
    z-index: 20;
    top: 0;
    left: 4px;
    border: 1px solid rgb(2 167 240 / 100%);
    border-radius: 100%;
    background-color: #fff;
    color: #02a7f0;
  }

  .prefix-icon-move {
    position: absolute;
    z-index: 20;
    top: -6px;
    left: -6px;
    //border: 1px solid rgb(2 167 240 / 100%);
    border-radius: 100%;
    background-color: #fff;
  }

  .close {
    position: absolute;
    z-index: 10;
    top: -6px;
    right: -8px;
    // border: 1px solid #d44;
    //border-radius: 100%;
    //padding: 2px;
    border-radius: 100%;
    background-color: #fff;
    //font-size: 11px;
    color: #d44;
  }

  .add-icon {
    color: rgb(64 158 255 / 100%);
    font-size: 20px;
  }

  .move-icon {
    font-size: 16px;
  }

  .disabled {
    background-color: rgb(242 242 242 / 100%);
    color: #2f4553;
  }

  .active {
    background-color: linear-gradient(
      90deg,
      rgb(27 194 216 / 100%) 0%,
      rgb(64 158 255 / 100%) 100%
    ) !important;
  }

  .activeMultiple {
    background: linear-gradient(90deg, #4c9bef 0%, #0b79ee 100%);
    color: #fff !important;

    .base-sub-title-top {
      color: #fff !important;
    }
  }

  .choosed {
    border: 1px solid #d44 !important;
  }

  .unforbid .base-tag {
    background-color: #fff !important;
    color: #000;
  }

  .unforbid .active {
    background-color: #1475e1 !important;
    color: #fff;
  }
</style>
