<script lang="ts" setup>
  import { withDefaults, defineProps, ref, computed } from 'vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import eventBus from '/@/utils/eventBus';
  import { FormItem, Row, Col, InputNumber, Input, Form, FormItemRest } from 'ant-design-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  interface Props {
    // redUpperLimit: string | number;
    dailyCollectionLimit: string | number;
    redBagCountDown: string | number;
    currencyName: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    dailyCollectionLimit: '',
    redBagCountDown: '',
  });

  const FORM_SIZE = useFormSetting().getFormSize;

  const emit = defineEmits(['update:dailyCollectionLimit', 'update:redBagCountDown']); // 'update:redUpperLimit',

  const basicConfigRef = ref();

  const formState = computed(() => ({
    // redUpperLimit: props.redUpperLimit,
    dailyCollectionLimit: props.dailyCollectionLimit,
    redBagCountDown: props.redBagCountDown,
  }));
  const currencyName = computed(() => props.currencyName);

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
  async function clearValidateInfo() {
    basicConfigRef.value.clearValidate();
  }

  function updatedailyCollectionLimit(e) {
    emit('update:dailyCollectionLimit', e.target.value);
    eventBus.emit('updatedailyCollectionLimit', e.target.value);
  }
  function updateRedBagCountdown(e) {
    emit('update:redBagCountDown', e.target.value);
    // eventBus.emit('updateRedBagCountdown', val);
  }
  // function validateLimit(_, value) {
  //   if (value && value <= 0) {
  //     return Promise.reject('奖金必须大于0');
  //   }
  // }
  defineExpose({
    validationFunc,
    clearValidateInfo,
  });
</script>

<template>
  <div>
    <Form ref="basicConfigRef" :model="formState" validate-trigger="blur">
      <Row>
        <Col :span="16">
          <FormItem
            required
            :label="t('v.discount.activity.receive_maximum')"
            :rules="[
              { required: true, message: t('v.discount.activity.each_account1') },
              {
                pattern: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?)$/,
                message: t('v.discount.activity.incorrect_format'),
              },
            ]"
            name="dailyCollectionLimit"
          >
            <Input
              :min="0"
              :size="FORM_SIZE"
              :stringMode="true"
              :value="dailyCollectionLimit"
              :placeholder="t('v.discount.activity.each_account')"
              @change="(e) => updatedailyCollectionLimit(e)"
            >
              <template #prefix>
                <cd-icon-currency :icon="currencyName" class="w-5" />
              </template>
            </Input>
          </FormItem>
        </Col>

        <Col :span="16" style="margin-left: 27px">
          <FormItem
            required
            :label="t('v.discount.activity.Red_countdown')"
            :rules="[
              { required: true, message: t('v.discount.activity.packet_countdown') },
              {
                pattern: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?)$/,
                message: t('v.discount.activity.incorrect_format'),
              },
            ]"
            name="redBagCountDown"
          >
            <Input
              :min="0"
              :size="FORM_SIZE"
              :stringMode="true"
              :value="redBagCountDown"
              :placeholder="t('v.discount.activity.counting_down')"
              @change="(e) => updateRedBagCountdown(e)"
              :addon-after="t('component.time.minutes')"
              style="max-width: 96.5%"
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<style lang="less" scoped>
  ::v-deep(.ant-input-group-addon) {
    background-color: #dce3f1;
  }
</style>
