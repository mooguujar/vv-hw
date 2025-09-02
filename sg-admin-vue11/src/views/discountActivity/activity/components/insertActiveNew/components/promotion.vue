<template>
  <div class="ml-11">
    <Form :model="formState" ref="formRef" :rules="rules">
      <div class="title">
        <div class="mb-4">
          <span class="text-2xl font-bold">有效会员标准</span>
          <BasicHelp
            placement="top"
            class="mx-1"
            text="<p>下级会员达成以下条件才算有效，单位是USDT</p>"
          />
        </div>
        <FormItem label="账号首充:" first_deposit_amount="first_deposit_amount">
          <InputNumber
            v-model:value="formState.first_deposit_amount"
            :stringMode="true"
            :size="FORM_SIZE"
            placeholder="清输入金额，0表示不限制，单位是USDT"
          />
        </FormItem>
        <FormItem label="累计充值:">
          <InputNumber
            v-model:value="formState.total_deposit_amount"
            :stringMode="true"
            :size="FORM_SIZE"
            placeholder="请输入金额，0表示不限制，单位是USDT"
          />
        </FormItem>
        <FormItem label="累计打码:">
          <InputNumber
            v-model:value="formState.total_bet_amount"
            :stringMode="true"
            :size="FORM_SIZE"
            placeholder="请输入金额，0表示不限制，单位是USDT"
          />
        </FormItem>
        <FormItem label="累计充值天数:">
          <InputNumber
            v-model:value="formState.total_deposit_days"
            :stringMode="true"
            :size="FORM_SIZE"
            placeholder="请输入金额，0表示不限制，单位是天"
          />
        </FormItem>
        <FormItem label="累计充值次数:">
          <InputNumber
            v-model:value="formState.total_deposit_times"
            :stringMode="true"
            :size="FORM_SIZE"
            placeholder="请输入金额，0表示不限制，单位是次"
          />
        </FormItem>
        <FormItem label="满足条件:">
          <RadioGroup v-model:value="formState.condition_type">
            <Radio value="1">满足以上全部</Radio>
            <Radio value="2">满足任意一种</Radio>
          </RadioGroup>
        </FormItem>
      </div>
      <div class="title">
        <div class="mb-4">
          <span class="text-2xl font-bold">统计人数限制：</span>
          <BasicHelp
            placement="top"
            class="mx-1"
            text="<p>表示同注册IP/设备，最高有效统计人数</p>"
          />
        </div>
      </div>
      <FormItem label="同注册IP上限:">
        <InputNumber
          :size="FORM_SIZE"
          :stringMode="true"
          :placeholder="t('v.discount.activity.same_registered_device_limit_placeholder')"
          v-model:value="formState.same_registered_ip_limit"
          type="text"
        />
      </FormItem>
      <FormItem label="同注册设备上限:">
        <InputNumber
          :size="FORM_SIZE"
          :stringMode="true"
          :placeholder="t('v.discount.activity.same_registered_device_limit_placeholder')"
          type="text"
          v-model:value="formState.same_registered_device_limit"
        />
      </FormItem>
      <FormItem label="奖励样式">
        <RadioGroup class="" v-model:value="formState.bonus_tpl">
          <Radio value="1">开红包</Radio>
          <Radio value="2">开宝箱</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="显示金额">
        <RadioGroup v-model:value="formState.show_amount">
          <Radio value="1">不显示</Radio>
          <Radio value="2">显示</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="奖金方式">
        <RadioGroup v-model:value="formState.bonus_type">
          <Radio value="1">固定奖金</Radio>
          <Radio value="2">累计日结(领最高档)</Radio>
        </RadioGroup>
      </FormItem>
      <div>
        <Row v-for="(item, index) in formState.settings">
          <Col :span="8">
            <FormItem :key="index">
              <label>有效推广人数(≥)：</label>
              <InputNumber placeholder="推广人数" :size="FORM_SIZE" v-model:value="item.ppl" />
            </FormItem>
          </Col>
          <Col :span="10" offset="1">
            <FormItem>
              <label>奖励金额:</label>
              <InputNumber
                placeholder="推广金额"
                :size="FORM_SIZE"
                :stringMode="true"
                v-model:value="item.bonus"
              />
            </FormItem>
          </Col>
          <Col :span="4" class="pt-5">
            <Button
              v-if="index === 0"
              class="m-t-1 m-l-5"
              preIcon="material-symbols:add"
              type="primary"
              @click="addRateConfig"
            />
            <Button
              v-if="index > 0"
              class="m-t-1 m-l-5"
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
  import { ref, onMounted, nextTick, reactive } from 'vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { BasicHelp } from '/@/components/Basic';
  import { Form, FormItem, InputNumber, RadioGroup, Radio, Row, Col } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import type { Rule } from 'ant-design-vue/es/form';
  import { Button } from '/@/components/Button/index';
  const formState = ref({
    first_deposit_amount: '',
    totleDiposit: '',
    total_bet_amount: '',
    total_deposit_days: '',
    total_deposit_times: '',
    condition_type: '',
    same_registered_ip_limit: '',
    same_registered_device_limit: '',
    bonus_tpl: '1',
    show_amount: '1',
    bonus_type: '1',
    settings: [
      {
        ppl: null,
        bonus: '',
      },
    ],
  } as any);
  const FORM_SIZE = useFormSetting().getFormSize;
  const rules: Record<string, Rule[]> = {
    first_deposit_amount: [
      { required: true, message: 'Please input Activity name', trigger: 'change' },
    ],
  };

  function addRateConfig() {
    formState.value.settings.push({
      ppl: null,
      bonus: '',
    });
  }

  //抽奖金额删减
  function removeRateConfig(item) {
    const index = formState.value.settings.indexOf(item);
    if (index !== -1) {
      formState.value.settings.splice(index, 1);
    }
  }
  onMounted(() => {
    // nextTick(() => {
    //   formState.value = reactiveAct.value
    // })
  });
  defineExpose({
    formState,
  });
</script>
