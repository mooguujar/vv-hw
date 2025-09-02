<template>
  <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; width: 100%">
    <!--    <component :is="tag" ref="wrapRef" />-->
    <Popover v-if="type === 'button'" trigger="hover">
      <template #content>
        <Button type="primary" @click="handleEmit(record)">{{ value }}</Button>
      </template>
      <Button type="primary" @click="handleEmit(record)">{{ value }}</Button>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { defineComponent, watch, PropType, ref, unref, onMounted } from 'vue';
  import { Popover, Button } from 'ant-design-vue';

  export default defineComponent({
    name: 'QrCode',
    components: {
      Popover,
      Button,
    },
    props: {
      value: {
        type: [String, Array] as PropType<string | any[]>,
        default: null,
      },
      type: {
        type: String,
      },
      func: {
        type: String,
      },
      record: {
        type: Object,
      },
    },
    setup(props, { emit }) {
      const wrapRef = ref<HTMLCanvasElement | HTMLImageElement | null>(null);
      function handleEmit(record) {
        this.$emit('emitFn', record);
      }
      return { wrapRef, handleEmit };
    },
  });
</script>
