<template>
  <div :class="{ 'bg-white': showwhitebg }">
    <div class="!overflow-x-auto whitespace-nowrap" ref="scrollContainer">
      <Draggable
        :list="btnListData"
        :animation="100"
        item-key="id"
        class="list-group"
        :forceFallback="true"
        ghost-class="ghost"
        @end="onMoveCallback"
      >
        <template #item="{ element }">
          <cdBlockCurrency
            :key="element.value"
            class="inline-block mx-15px my-15px cursor-pointer"
            :active="modelValue === element.value"
            :currencyName="element.name"
            :label="element.lable"
            :move="true"
            @click="changeClick(element.value, $event)"
          />
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import cdBlockCurrency from '../block/cd-block-currency.vue';
  import { isEmpty } from '/@/utils/is';
  import Draggable from 'vuedraggable';

  const props = withDefaults(
    defineProps<{
      btnList: {
        name: string;
        value: string | number;
        lable?: string | number | null;
      }[];
      firstList: {
        name: string;
        value: string | number;
        lable?: string | number | null;
      }[];
      modelValue: string | number | null;
      showwhitebg: boolean | null;
      currencyType: string | number | null;
    }>(),
    {
      firstList: [], // 默认值为 null
      showwhitebg: true,
    },
  );

  const btnListData: any = ref([]);
  const scrollContainer = ref<HTMLElement | null>(null);

  watchEffect(() => {
    btnListData.value = !isEmpty(props.firstList)
      ? isEmpty(props.firstList)
        ? [...props.btnList]
        : [...props.firstList, ...props.btnList]
      : props.btnList;
  });

  const emit = defineEmits(['update:modelValue', 'ChangeButtonCurrency', 'moveCurrencyIds']);

  function changeClick(value, event: MouseEvent) {
    if (event != undefined || event != null) {
      const element = event.target as HTMLElement;
      if (scrollContainer.value) {
        const elementCenter = element.offsetLeft + element.offsetWidth / 2;
        const containerCenter = scrollContainer.value.offsetWidth / 2;
        const scrollTarget = elementCenter - containerCenter;
        scrollContainer.value.scroll({
          left: scrollTarget,
          behavior: 'smooth',
        });
      }
    }
    emit('ChangeButtonCurrency', value);
    emit('update:modelValue', value);
  }

  const onMoveCallback = async (e) => {
    let moveIds = [];
    btnListData.value.forEach((el) => {
      moveIds.push(el.value);
    });
    emit('moveCurrencyIds', moveIds, props.currencyType);
  };
</script>
