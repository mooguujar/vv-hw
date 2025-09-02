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
    reward: [string, string];
  }

  interface Props {
    arbitrary: Item[];
    currency: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['update:constants']);
  const { t } = useI18n();

  const arbFormRef = ref<FormInstance>();

  const activeArbitrary = ref<Item[]>(props.arbitrary);

  const currency = computed(() => props.currency);

  const removeConstants = (index: number) => {
    activeArbitrary.value.splice(index, 1);
    emit('update:constants', activeArbitrary.value);
  };

  const addConstants = () => {
    activeArbitrary.value.push({
      id: Date.now(),
      charge: '',
      reward: ['', ''],
    });
    emit('update:constants', activeArbitrary.value);
  };

  function arbFormRefVal() {
    return new Promise((resolve, reject) => {
      if (arbFormRef.value) {
        arbFormRef.value
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
    () => props.arbitrary,
    (newVal) => {
      activeArbitrary.value = newVal;
    },
    { immediate: true },
  );
  defineExpose({ arbFormRefVal });
</script>

<template>
  <Form ref="arbFormRef" :model="activeArbitrary">
    <div
      v-for="(item, index) in activeArbitrary"
      :key="item.id"
      style="display: flex; margin-bottom: 8px"
    >
      <Col :span="6">
        <FormItem
          :name="[index, 'charge']"
          :colon="false"
          :style="{ display: index == 0 ? 'block' : '', marginRight: '40px' }"
          :rules="{
            required: true,
            trigger: 'blur',
            validator: formatValidator1,
          }"
        >
          <template #label v-if="index == 0">
            {{ t('table.report.report_agent_money') }} ≥
            <cdIconCurrency :icon="currency" class="w-5 ml-1" />
          </template>
          <Input
            :size="'large'"
            v-model:value="item.charge"
            :placeholder="t('table.report.report_agent_money')"
          />
        </FormItem>
      </Col>
      <Col :span="2">
        <FormItem
          :name="[index, 'reward', 0]"
          :colon="false"
          :label="index == 0 ? t('v.discount.activity.amount_bonus') : ''"
          :style="{ display: index == 0 ? 'block' : '' }"
          :rules="{
            required: true,
            trigger: 'blur',
            validator: formatValidator2,
          }"
        >
          <Input
            :size="'large'"
            v-model:value="item.reward[0]"
            :placeholder="t('v.discount.activity.amount_bonus')"
          />
        </FormItem>
      </Col>
      <Col>
        <FormItem>
          <div :class="[index == 0 ? 'h-12' : '']"></div>
          <div class="text-center w-8">~</div></FormItem
        >
      </Col>
      <Col :span="2">
        <FormItem
          :name="[index, 'reward', 1]"
          :style="{}"
          :rules="{
            required: true,
            trigger: 'blur',
            validator: formatValidator2,
          }"
        >
          <div :class="[index == 0 ? 'h-10' : '']"></div>
          <Input
            :size="'large'"
            v-model:value="item.reward[1]"
            :placeholder="t('v.discount.activity.amount_bonus')"
          />
        </FormItem>
      </Col>
      <Col :span="2">
        <FormItem :style="{ paddingLeft: '20px' }">
          <div :class="[index == 0 ? 'h-10' : '']"></div>
          <img
            v-if="index == 0"
            class="cursor-pointer"
            :src="RECT_ADD"
            alt=""
            @click="addConstants"
          />
          <img
            v-else
            class="cursor-pointer"
            :src="RECT_DELETE"
            alt=""
            @click="removeConstants(index)"
          />
        </FormItem>
      </Col>
    </div>
  </Form>
</template>
