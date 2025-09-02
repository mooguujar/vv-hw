<template>
  <div class="ml-11">
    <Form :model="formState" ref="formRef" :rules="rules">
      <div class="title">
        <div class="mb-4">
          <span class="text-2xl font-bold">{{
            t('v.discount.activity.configuration_memeber_config')
          }}</span>
          <BasicHelp
            placement="top"
            class="mx-1"
            :text="`<p>${t('common.translate.word17')}</p>`"
          />
        </div>
        <FormItem
          :label="`${t('v.discount.activity.first_deposit_amount')}:`"
          first_deposit_amount="first_deposit_amount"
        >
          <InputNumber
            v-model:value="formState.first_deposit_amount"
            :stringMode="true"
            :size="FORM_SIZE"
            :placeholder="t('common.translate.word18')"
          />
        </FormItem>
        <FormItem :label="`${t('v.discount.activity.total_deposit_amount')}:`">
          <InputNumber
            v-model:value="formState.total_deposit_amount"
            :stringMode="true"
            :size="FORM_SIZE"
            :placeholder="t('common.translate.word18')"
          />
        </FormItem>
        <FormItem :label="`${t('v.discount.activity.total_bet_amount')}:`">
          <InputNumber
            v-model:value="formState.total_bet_amount"
            :stringMode="true"
            :size="FORM_SIZE"
            :placeholder="t('common.translate.word18')"
          />
        </FormItem>
        <FormItem :label="`${t('v.discount.activity.total_deposit_days')}:`">
          <InputNumber
            v-model:value="formState.total_deposit_days"
            :stringMode="true"
            :size="FORM_SIZE"
            :placeholder="t('v.discount.activity.total_deposit_days_placeholder')"
          />
        </FormItem>
        <FormItem :label="`${t('v.discount.activity.total_deposit_times')}:`">
          <InputNumber
            v-model:value="formState.total_deposit_times"
            :stringMode="true"
            :size="FORM_SIZE"
            :placeholder="t('v.discount.activity.total_deposit_times_placeholder')"
          />
        </FormItem>
        <FormItem :label="`${t('table.system.system_condition')}:`">
          <RadioGroup v-model:value="formState.condition_type">
            <Radio value="1">{{ t('v.discount.activity.condition_type_1') }}</Radio>
            <Radio value="2">{{ t('v.discount.activity.condition_type_2') }}</Radio>
          </RadioGroup>
        </FormItem>
      </div>
      <div class="title">
        <div class="mb-4">
          <span class="text-2xl font-bold">{{ t('v.discount.activity.Head_limit') }}：</span>
          <BasicHelp
            placement="top"
            class="mx-1"
            :text="`<p>${t('v.discount.activity.Maximum_statistics')}</p>`"
          />
        </div>
      </div>
      <FormItem :label="`${t('v.discount.activity.same_registered_ip_limit')}:`">
        <InputNumber
          :size="FORM_SIZE"
          :stringMode="true"
          :placeholder="t('v.discount.activity.same_registered_device_limit_placeholder')"
          v-model:value="formState.same_registered_ip_limit"
          type="text"
        />
      </FormItem>
      <FormItem :label="`${t('v.discount.activity.same_registered_device_limit')}:`">
        <InputNumber
          :size="FORM_SIZE"
          :stringMode="true"
          :placeholder="t('v.discount.activity.same_registered_device_limit_placeholder')"
          type="text"
          v-model:value="formState.same_registered_device_limit"
        />
      </FormItem>
      <FormItem :label="`${t('v.discount.activity.bonus_tpl')}:`">
        <RadioGroup class="" v-model:value="formState.bonus_tpl">
          <Radio value="1">{{ t('v.discount.activity.bonus_tpl_1') }}</Radio>
          <Radio value="2">{{ t('v.discount.activity.bonus_tpl_2') }}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label="`${t('v.discount.activity.show_amount')}:`">
        <RadioGroup v-model:value="formState.show_amount">
          <Radio value="1">{{ t('setting.menuTriggerNone') }}</Radio>
          <Radio value="2">{{ t('business.banner_button_show') }}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label="`${t('v.discount.activity.bonus_type')}:`">
        <RadioGroup v-model:value="formState.bonus_type">
          <Radio value="1">{{ t('v.discount.activity.bonus_type_1') }}</Radio>
          <Radio value="2">{{ t('v.discount.activity.bonus_type_2') }}</Radio>
        </RadioGroup>
      </FormItem>
      <div>
        <Row v-for="(item, index) in formState.settings">
          <Col :span="8">
            <FormItem :key="index">
              <label>{{ t('v.discount.activity.Effective_outreach') }}(≥)：</label>
              <InputNumber
                :placeholder="t('v.discount.activity.Personal_Player')"
                :size="FORM_SIZE"
                v-model:value="item.ppl"
              />
            </FormItem>
          </Col>
          <Col :span="10" offset="1">
            <FormItem>
              <label> {{ t('v.discount.activity.amount_bonus') }}:</label>
              <InputNumber
                :placeholder="t('common.translate.word19')"
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
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
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
