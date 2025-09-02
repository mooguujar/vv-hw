<template>
  <BasicTitle :helpMessage="helpMessage">
    {{ title }}<cdBlockCurrency :currencyName="currentyOptions[currencyId]" v-if="currencyId" />
  </BasicTitle>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { BasicTitle } from '/@/components/Basic';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
  import { currentyOptions } from '/@/views/common/commonSetting.js';

  export default defineComponent({
    name: 'BasicModalHeader',
    components: { BasicTitle, cdBlockCurrency },
    props: {
      helpMessage: {
        type: [String, Array] as PropType<string | string[]>,
      },
      title: { type: String },
      currencyId: { type: String },
    },
    setup(_, { emit }) {
      return { currentyOptions };
    },
  });
</script>
