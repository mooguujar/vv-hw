<script setup lang="ts">
  import { ref, defineProps, defineEmits, watch, computed } from 'vue';
  import { Form, FormItem, Input, Col } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { FormInstance } from 'ant-design-vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  interface Item {
    id: number;
    charge: string;
    rewardRate: string;
    rewardLimit: string;
  }

  interface Props {
    rateMoney: Item[];
    currency: string;
    getDeatilId: String;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['update:constants']);
  const { t } = useI18n();

  const rateFormRef = ref<FormInstance>();
  const activeRateMoney = ref<Item[]>(props.rateMoney);

  const currency = computed(() => props.currency);

  const removeConstants = (index: number) => {
    activeRateMoney.value.splice(index, 1);
    emit('update:constants', activeRateMoney.value);
  };

  const addConstants = () => {
    activeRateMoney.value.push({
      id: Date.now(),
      charge: '',
      rewardRate: '',
      rewardLimit: '',
    });
    emit('update:constants', activeRateMoney.value);
  };

  function rateFormRefVal() {
    return new Promise((resolve, reject) => {
      if (rateFormRef.value) {
        rateFormRef.value
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
  function formatValidator1(_, value) {
    if (!value) {
      return Promise.reject(t('common.deposit_m_1'));
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
      return Promise.reject(t('common.pls_reward_ratio'));
    } else {
      const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
      if (!regex.test(value)) {
        return Promise.reject(t('table.discountActivity.discountActivity_deposit_err'));
      } else {
        return Promise.resolve();
      }
    }
  }
  function formatValidator3(_, value) {
    if (!value) {
      return Promise.reject(t('common.pls_reward_cap'));
    } else {
      const regex = /^(0|[1-9]\d*)(\.\d+)?$/;
      if (!regex.test(value)) {
        return Promise.reject(t('common.reward_cap_err'));
      } else {
        return Promise.resolve();
      }
    }
  }

  watch(
    () => props.rateMoney,
    (newVal) => {
      activeRateMoney.value = newVal;
    },
    { immediate: true },
  );
  defineExpose({ rateFormRefVal });
</script>

<template>
  <Form ref="rateFormRef" :model="activeRateMoney">
    <div
      v-for="(item, index) in activeRateMoney"
      :key="item.id"
      style="display: flex; margin-bottom: 8px"
    >
      <Col :span="3" :style="{ marginRight: '20px' }">
        <FormItem
          :name="[index, 'charge']"
          :colon="false"
          :style="{ display: index == 0 ? 'block' : '' }"
          :rules="{
            required: true,
            trigger: 'blur',
            validator: formatValidator1,
          }"
        >
          <template #label v-if="index == 0">
            {{ t('v.discount.activity.recharge_amount') }} ≥
            <cdIconCurrency :icon="currency" class="w-5 ml-1" />
          </template>
          <Input
            :size="'large'"
            v-model:value="item.charge"
            autocomplete="off"
            :disabled="!!getDeatilId"
            :placeholder="t('v.discount.activity.recharge_amount')"
          />
        </FormItem>
      </Col>
      <Col :span="3" :style="{ marginRight: '20px' }">
        <FormItem
          :name="[index, 'rewardRate']"
          :colon="false"
          :label="index == 0 ? t('common.reward_ratio') : ''"
          :style="{ display: index == 0 ? 'block' : '' }"
          :rules="{
            required: true,
            trigger: 'blur',
            validator: formatValidator2,
          }"
        >
          <Input
            :size="'large'"
            v-model:value="item.rewardRate"
            :placeholder="t('common.reward_ratio')"
            :addonAfter="'%'"
            autocomplete="off"
            :disabled="!!getDeatilId"
            class="rateMoney__input__class"
          />
        </FormItem>
      </Col>
      <Col :span="3" :style="{ marginRight: '20px' }">
        <FormItem
          :name="[index, 'rewardLimit']"
          :colon="false"
          :label="index == 0 ? t('common.reward_cap') : ''"
          :style="{ display: index == 0 ? 'block' : '' }"
          :rules="{
            required: true,
            trigger: 'blur',
            validator: formatValidator3,
          }"
        >
          <Input
            :size="'large'"
            v-model:value="item.rewardLimit"
            autocomplete="off"
            :disabled="!!getDeatilId"
            :placeholder="t('v.discount.activity.same_registered_device_limit_placeholder')"
          />
        </FormItem>
      </Col>
      <Col :span="5">
        <FormItem>
          <div v-if="index == 0" :class="[index == 0 ? 'h-10 flex items-center ml-10' : '']">{{
            t('v.discount.activity.operation')
          }}</div>
          <img
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
            v-if="index > 0"
            class="cursor-pointer ml-10px"
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
<style scoped lang="less">
  .rateMoney__input__class {
    ::v-deep(.ant-input-group-addon) {
      background-color: #d8deef;
    }
  }

  .disabled-link {
    cursor: not-allowed;
  }

  :deep(.ant-form-item-label) {
    width: 100%;
    text-align: center;
  }
</style>
