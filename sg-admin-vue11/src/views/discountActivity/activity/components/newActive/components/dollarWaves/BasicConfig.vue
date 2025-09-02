<script lang="ts" setup>
  import { withDefaults, defineProps, ref, computed } from 'vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import eventBus from '/@/utils/eventBus';
  import { FormItem, Row, Col, InputNumber, Form } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  interface Props {
    // redUpperLimit: string | number;
    dailyCollectionLimit: string | number;
  }

  const props = withDefaults(defineProps<Props>(), {
    // redUpperLimit: '',
    dailyCollectionLimit: '',
  });

  const FORM_SIZE = useFormSetting().getFormSize;

  const emit = defineEmits(['update:dailyCollectionLimit']); // 'update:redUpperLimit',

  const basicConfigRef = ref();

  const formState = computed(() => ({
    // redUpperLimit: props.redUpperLimit,
    dailyCollectionLimit: props.dailyCollectionLimit,
  }));

  async function validationFunc() {
    return new Promise((resolve) => {
      basicConfigRef.value
        .validate()
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  function updatedailyCollectionLimit(val) {
    emit('update:dailyCollectionLimit', val);
    eventBus.emit('updatedailyCollectionLimit', val);
  }

  defineExpose({
    validationFunc,
  });
</script>

<template>
  <div>
    <Form ref="basicConfigRef" :model="formState" validate-trigger="blur">
      <Row>
        <Col :span="16">
          <FormItem
            required
            :label="t('common.translate.word26')"
            :rules="[{ required: true, message: t('v.discount.activity.each_account1') }]"
            name="dailyCollectionLimit"
          >
            <InputNumber
              :min="0"
              :size="FORM_SIZE"
              :stringMode="true"
              :value="dailyCollectionLimit"
              :placeholder="t('v.discount.activity.each_account')"
              @change="(val) => updatedailyCollectionLimit(val)"
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<style lang="less" scoped></style>
