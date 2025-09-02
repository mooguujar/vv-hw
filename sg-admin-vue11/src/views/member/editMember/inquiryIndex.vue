<template>
  <div class="bg-white">
    <ActiveIndex />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import ActiveIndex from './index.vue';

  export default defineComponent({
    name: 'InquiryEditor',
    components: {
      ActiveIndex,
    },
    setup() {
      return {};
    },
  });
</script>
