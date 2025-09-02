<script setup lang="ts">
  import { ref, defineProps, defineEmits, watch, computed } from 'vue';
  import { Form, FormItem, Input, Col } from 'ant-design-vue';
  import type { FormInstance } from 'ant-design-vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface Item {
    id: number;
    charge: string;
    reward: string;
  }

  interface Props {
    constants: Item[];
    currency: string;
    type: string;
    getDeatilId: String;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['update:constants']);
  const { t } = useI18n();
  const chargeFormRef = ref<FormInstance>();
  const activeConstants = ref<Item[]>(props.constants);

  const currency = computed(() => props.currency);
  const typeModle = computed(() => props.type);
  const removeConstants = (index: number) => {
    activeConstants.value.splice(index, 1);
    emit('update:constants', activeConstants.value);
  };

  const addConstants = () => {
    activeConstants.value.push({
      id: Date.now(),
      charge: '',
      reward: '',
    });
    emit('update:constants', activeConstants.value);
  };

  function formatValidator1(_, value) {
    if (!value) {
      return Promise.reject(
        typeModle.value == 'mystery' ? t('common.deposit_m_1') : t('common.deposit_commission_1'),
      );
    } else {
      const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
      if (!regex.test(value)) {
        return Promise.reject(t('table.discountActivity.discountActivity_deposit_err'));
      } else {
        return Promise.resolve();
      }
    }
  }
  function formatValidator2(_, value) {
    if (!value) {
      return Promise.reject(t('table.discountActivity.discountActivity_p_enter_reward_amount'));
    } else {
      const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
      if (!regex.test(value)) {
        return Promise.reject(t('table.discountActivity.discountActivity_deposit_err'));
      } else {
        return Promise.resolve();
      }
    }
  }
  watch(
    () => props.constants,
    (newVal) => {
      activeConstants.value = newVal;
    },
    { immediate: true },
  );
  function chargeFormRefVal() {
    return new Promise((resolve, reject) => {
      if (chargeFormRef.value) {
        chargeFormRef.value
          .validate()
          .then(() => {
            resolve(true); // 校验成功
          })
          .catch(() => {
            reject(false); // 校验失败
          });
      }
    });
  }

  defineExpose({ chargeFormRefVal });
</script>

<template>
  <Form ref="chargeFormRef" :model="activeConstants" autocomplete="off">
    <div
      v-for="(item, index) in activeConstants"
      :key="item.id"
      style="display: flex; margin-bottom: 8px"
    >
      <Col :span="6">
        <FormItem
          :name="[index, 'charge']"
          :colon="false"
          :style="{ display: index == 0 ? 'block' : '', marginRight: '20px' }"
          :rules="{
            required: true,
            trigger: 'blur',
            validator: formatValidator1,
          }"
        >
          <template #label v-if="index == 0">
            {{
              typeModle === 'mystery'
                ? t('table.report.report_deposit_charge_money')
                : t('table.report.report_agent_money')
            }}
            ≥
            <cdIconCurrency :icon="currency" class="w-5 ml-1" />
          </template>
          <Input
            :size="'large'"
            v-model:value="item.charge"
            :placeholder="
              typeModle === 'mystery'
                ? t('table.report.report_deposit_charge_money')
                : t('table.report.report_agent_money')
            "
            :disabled="!!getDeatilId"
          />
        </FormItem>
      </Col>
      <Col :span="6">
        <FormItem
          :name="[index, 'reward']"
          :colon="false"
          :label="index == 0 ? t('v.discount.activity.amount_bonus') : ''"
          :style="{ display: index == 0 ? 'block' : '', marginRight: '20px' }"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              validator: formatValidator2,
            },
          ]"
        >
          <Input
            :size="'large'"
            v-model:value="item.reward"
            :disabled="!!getDeatilId"
            :placeholder="t('v.discount.activity.amount_bonus')"
          />
        </FormItem>
      </Col>
      <Col :span="2">
        <FormItem>
          <div :class="[index == 0 ? 'h-10' : '']"></div>
          <img
            v-if="index == 0"
            class="cursor-pointer"
            :src="RECT_ADD"
            alt=""
            @click="addConstants"
            :class="{ 'disabled-link': !!getDeatilId }"
            :style="{
              'pointer-events': !!getDeatilId ? 'none' : 'auto',
              opacity: !!getDeatilId ? 0.5 : 1,
            }"
          />
          <img
            v-else
            class="cursor-pointer"
            :src="RECT_DELETE"
            alt=""
            @click="removeConstants(index)"
            :class="{ 'disabled-link': !!getDeatilId }"
            :style="{
              'pointer-events': !!getDeatilId ? 'none' : 'auto',
              opacity: !!getDeatilId ? 0.5 : 1,
            }"
          />
        </FormItem>
      </Col>
    </div>
  </Form>
</template>
<style lang="less" scoped>
  .disabled-link {
    cursor: not-allowed;
  }
</style>
