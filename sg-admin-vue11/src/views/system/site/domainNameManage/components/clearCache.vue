<template>
  <div class="p-4">
    <RadioGroup
      v-model:value="activeKey"
      button-style="solid"
      size="large"
      v-if="!isControlValueSet()"
    >
      <RadioButton v-for="option in options" :key="option.value" :value="option.value">{{
        option.label
      }}</RadioButton>
    </RadioGroup>
    <div class="my-4"
      ><Alert :message="t('v.sytem.site.cleat_warning')" type="warning" show-icon
    /></div>
    <Form ref="formIns" layout="vertical" :model="formData" :rules="rules">
      <FormItem :label="t('v.sytem.site.url_adds')" name="name">
        <a-textarea
          :disabled="isControlValueSet()"
          v-model:value="nameMiddleWare"
          :placeholder="t('v.sytem.site.url_clear_tip')"
          :auto-size="{ minRows: 8, maxRows: 12 }"
        />
      </FormItem>
    </Form>

    <a-button
      type="primary"
      size="large"
      :disabled="isControlValueSet()"
      @click="submit"
      :loading="loading"
      >{{ t('v.sytem.site.fresh_now') }}</a-button
    >
  </div>
</template>
<script setup lang="ts">
  import { useSwitch, useform } from './clearCache.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { RadioGroup, RadioButton, Alert, Form } from 'ant-design-vue';
  import { isControlValueSet } from '/@/utils/domUtils';

  const FormItem = Form.Item;
  const { t } = useI18n();
  const { activeKey, options } = useSwitch();
  const { nameMiddleWare, formData, rules, formIns, submit, loading } = useform();
</script>
