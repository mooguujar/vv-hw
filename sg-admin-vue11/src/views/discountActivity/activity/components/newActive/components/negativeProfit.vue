<template>
  <div class="ml-10">
    <Form>
      <Row>
        <Col :span="24">
          <FormItem label="$t('v.discount.activity.Cashback_configuration6') }}">
            <InputNumber
              :placeholder="$t('v.discount.activity.Cashback_configuration5')"
              :size="FORM_SIZE"
              v-model:value="formState.prize_limit"
            />
          </FormItem>
        </Col>
      </Row>
      <div>
        <Row>
          <Col>
            <label>{{ $t('v.discount.activity.Cashback_configuration') }}：</label>
          </Col>
          <Col class="w-15">
            <label>{{ $t('v.discount.activity.Cashback_configuration1') }}</label>
          </Col>
          <Col :span="7">
            <label> {{ $t('v.discount.activity.Cashback_configuration2') }}(≥)</label>
          </Col>
          <Col :span="6" offset="1">
            <label> {{ $t('v.discount.activity.Cashback_configuration3') }}(%)</label>
          </Col>
        </Row>
        <Row v-for="(item, index) in formState.prize_config" :key="index" class="ml-16">
          <Col :span="2">
            <p class="text-center pt-2">{{ index + 1 }}</p>
          </Col>
          <Col :span="12">
            <FormItem>
              <InputNumber
                :placeholder="$t('v.discount.activity.Cashback_configuration4')"
                :size="FORM_SIZE"
                v-model:value="item.valid_bet_amount"
              />
            </FormItem>
          </Col>
          <Col :span="12" offset="1">
            <FormItem>
              <InputNumber
                :size="FORM_SIZE"
                :placeholder="$t('v.discount.activity.Cashback_configuration3')"
                addon-after="%"
                v-model:value="item.bonus_rate"
              />
            </FormItem>
          </Col>
          <Col :span="4">
            <Button
              v-if="index == 0"
              class="m-l-5 mt-0"
              :size="FORM_SIZE"
              preIcon="material-symbols:add"
              type="primary"
              @click="addRateConfig"
            />
            <Button
              v-if="index > 0"
              :size="FORM_SIZE"
              class="m-l-5"
              preIcon="material-symbols:remove"
              @click="removeRateConfig(item)"
            />
          </Col>
        </Row>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Form, FormItem, Input, InputNumber, Row, Col } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { uniqueId, cloneDeep } from 'lodash-es';

  const FORM_SIZE = useFormSetting().getFormSize;
  const formState = ref({
    prize_limit: '',
    prize_config: [
      {
        level: null,
        valid_bet_amount: '',
        bonus_rate: '',
      },
    ],
  } as any);

  function uniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  //抽奖金额新增
  function addRateConfig() {
    formState.value.prize_config.push({
      level: uniqueId() + 1,
      rate: '',
      valid: '',
    });
  }

  function removeRateConfig(item) {
    const index = formState.value.prize_config.indexOf(item);
    if (index !== -1) {
      formState.value.settings.splice(index, 1);
    }
  }
  defineExpose({
    formState,
  });
</script>
