<template>
  <div
    class="base-tag flex items-center justify-center"
    :class="{ categoryId: categoryId === '5' }"
  >
    <template v-if="isLogo">
      <div v-if="element.logo" class="base-logo" @click="handleClick">
        <img
          v-if="!editImage"
          draggable="false"
          :src="getDataTypePreviewUrl(element.logo)"
          alt=""
          @error="onImageError"
        />
        <img v-if="editImage" draggable="false" :src="editImage" alt="" @error="onImageError" />
      </div>
      <div v-if="!element.logo && element.icon" class="base-logo" @click="handleClick">
        <img :src="getDataTypePreviewUrl(element.icon)" draggable="false" alt="" />
      </div>
      <div class="drop-down flex" v-if="dropDown === true">
        <div
          class="items"
          @click="handleClose(item, element)"
          v-for="(item, index) in iconList"
          :key="index"
        >
          <img :src="getDataTypePreviewUrl(item.img)" alt="" />
        </div>
      </div>
    </template>
    <template v-if="!isEdit && !categoryId">
      <Tooltip
        v-if="
          isToolTip &&
          valueRef &&
          Array.from(valueRef).reduce((acc, char) => acc + (/[^\x00-\xff]/.test(char) ? 2 : 1), 0) >
            15
        "
        placement="top"
        :title="valueRef"
      >
        <div
          v-if="!categoryId"
          class="base-tag-text flex-1 text-ellipsis overflow-hidden whitespace-nowrap"
        >
          {{ valueRef }}
        </div>
      </Tooltip>
      <div
        v-else
        ref="textRef"
        class="base-tag-text flex-1 text-ellipsis overflow-hidden whitespace-nowrap"
      >
        {{ valueRef }}
      </div>
    </template>
    <Input
      v-else-if="!categoryId"
      size="small"
      v-model:value="valueRef"
      :bordered="false"
      v-bind="$attrs"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Input, Tooltip } from 'ant-design-vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import err from '/@/assets/images/err.webp';

  const emit = defineEmits(['default:change']);
  const iconList = ref([] as any);
  const dropDown = ref(false as any);
  const editImage = ref('' as any);
  const props = defineProps({
    value: [String, Number],
    isEdit: { type: Boolean, default: false },
    isToolTip: { type: Boolean, default: false },
    element: { type: Object, default: {} },
    isLogo: { type: Boolean, default: false },
    subTitle: { type: Boolean, default: false },
    categoryId: { type: String, default: '' },
  });

  const valueRef = ref(props.value);

  watch(
    () => props.value,
    (v) => {
      valueRef.value = v;
    },
  );

  function handleChange() {
    emit('default:change', valueRef.value);
  }

  async function handleClose(item, element) {
    editImage.value = getDataTypePreviewUrl(item.img);

    dropDown.value = false;
  }

  async function handleClick() {
    if (props.isEdit) {
      dropDown.value = true;
    }
  }

  function onImageError(event) {
    event.target.src = err;
  }
</script>

<style lang="less" scoped>
  .base-sub-title {
    background-color: #fff;
  }

  .categoryId {
    height: 56px;

    .base-logo {
      width: 100%;
      height: 56px;
      margin: 0;
    }
  }

  .base-tag {
    position: relative;
    min-width: 80px;
    border: 1px solid #e1e1e1;
    border-radius: @border-radius-base;
    background-color: #fff;
    color: rgb(0 0 0 / 85%);

    .base-tag-text {
      height: 100%;
      padding: 0 10px;
      font-size: 14px;
      line-height: 40px;
    }
  }

  .lan-radio-box {
    .base-tag > .base-tag-text {
      font-size: 14px !important;
      font-weight: 600 !important;
      line-height: 40px !important;
    }

    .activeTag {
      border: 1px solid #1475e1 !important;
      background-color: #1475e1 !important;
    }
  }

  .active {
    background: #1475e1;
    color: #fff;
  }

  ::v-deep(.ant-input-sm) {
    width: 67px;
    margin-left: 10px;
    padding: 5px 3px;
    font-size: 12px;
  }

  .base-logo {
    width: 15px;
    height: 15px;
    margin-left: 10px;

    img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }

  .drop-down {
    position: absolute;
    top: 38px;
    left: 0;
    width: 200px;

    .items {
      width: 25px;
      height: 25px;
      margin-right: 3px;

      img {
        height: 100%;
      }
    }
  }

  .widthLogo {
    width: 103px;
  }
</style>
