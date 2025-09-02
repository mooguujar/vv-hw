<script setup lang="ts">
import { useRoute } from 'vue-router'

import AppFiatDepositSubmit from './_components/fiat-deposit-submit.vue'
import AppVirDepositSubmit from './_components/vir-deposit-submit.vue'

defineOptions({
  name: 'AppDepositFiatSubmitWrap',
})

const route = useRoute()
const { currencyType } = route.query
</script>

<template>
  <AppVirDepositSubmit v-if="currencyType === 'virtual'" />
  <AppFiatDepositSubmit v-else />
</template>

<style lang='scss' scoped>

</style>
