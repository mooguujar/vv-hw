<template>
  <RadioGroup
    v-model:value="selectIndex"
    option-type="button"
    button-style="solid"
    size="large"
    @change="changDayInex"
  >
    <RadioButton
      :value="index.toString()"
      size="large"
      v-for="(item, index) in currencySource['recharge_config']"
      >{{ $t('common.mystery9') }}{{ index + 1 }}</RadioButton
    >
    <button type="button" class="ant-tabs-nav-add" @click="addTab" aria-label="Add tab"
      ><span role="img" aria-label="plus" class="anticon anticon-plus"
        ><svg
          focusable="false"
          class=""
          data-icon="plus"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
          viewBox="64 64 896 896"
          style="font-size: 24px"
        >
          <path fill="#1475E1" d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
          <path
            fill="#1475E1"
            d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"
          /></svg></span
    ></button>
  </RadioGroup>
  <div class="mt-20px w-50%">
    <Form ref="chargeFormRef1" :model="currencySource['recharge_config'][selectIndex]">
      <FormItem
        :colon="false"
        name="deposit"
        :rules="{
          required: true,
          message:
            mysteryCurrencySource['award_mode'] == 'recharge'
              ? $t('common.deposit_m_1')
              : $t('common.mystery15'),
          trigger: 'blur',
        }"
      >
        <template #label>
          {{
            mysteryCurrencySource['award_mode'] == 'recharge'
              ? $t('v.discount.activity.recharge_amount')
              : $t('common.platform_loss')
          }}:</template
        >
        <Input
          :size="'large'"
          v-model:value="currencySource['recharge_config'][selectIndex].deposit"
          autocomplete="off"
          :placeholder="
            mysteryCurrencySource['award_mode'] == 'recharge'
              ? $t('common.mystery12')
              : $t('common.mystery13')
          "
        />
      </FormItem>
    </Form>
    <Form
      ref="chargeFormRef2"
      class="show—e-form"
      :model="currencySource['recharge_config'][selectIndex]"
    >
      <div class="ant-form-item-label">
        <label class="ant-form-item-required">
          {{ $t('v.discount.activity.show_amount') }}
        </label>
      </div>

      <div class="show—e">
        <FormItem
          :colon="false"
          name="show_min"
          :rules="{
            required: true,
            message: $t('common.mystery14'),
            trigger: 'blur',
          }"
        >
          <Input
            :size="'large'"
            v-model:value="currencySource['recharge_config'][selectIndex].show_min"
            autocomplete="off"
            :placeholder="$t('common.mystery11')"
          />
        </FormItem>
        <div class="mx-10px mb-20px">～</div>
        <FormItem
          :colon="false"
          name="show_max"
          :rules="{
            required: true,
            message: $t('common.mystery14'),
            trigger: 'blur',
          }"
        >
          <Input
            :size="'large'"
            v-model:value="currencySource['recharge_config'][selectIndex].show_max"
            autocomplete="off"
            :placeholder="$t('common.mystery11')"
          />
        </FormItem>
      </div>
    </Form>
  </div>
  <div>
    <Table
      :data-source="dataSource"
      :columns="columns"
      size="small"
      :pagination="false"
      ref="redBagRainRef"
    >
      <!-- 每日奖励 -->
      <template #reward>
        <span
          >{{ $t('v.discount.activity.amount_bonus') }}
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
        <span class="ml-10px">
          <Tooltip :title="t('common.mystery18')" placement="right">
            <Icon icon="tabler:bulb" />
          </Tooltip>
        </span>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          <div>{{ index + 1 }}</div>
        </template>
        <!-- 条件类型 -->
        <!-- 最低打码量 -->
        <template v-else-if="column.dataIndex === 'bet_multiple'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              v-model:value="record.bet_multiple"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <!-- 每日奖励 -->
        <template v-else-if="column.dataIndex === 'rewardMax'">
          <div class="flex items-center">
            <InputNumber
              :min="0"
              size="large"
              :stringMode="true"
              :controls="false"
              v-model:value="record.min"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
            <div class="mx-10px">～</div>
            <InputNumber
              :min="0"
              size="large"
              :stringMode="true"
              :controls="false"
              v-model:value="record.max"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <!-- 操作 -->
        <template v-else-if="column.dataIndex === 'operation'">
          <div>
            <!-- 删除领取条件 -->
            <div v-if="index > 0" class="flex justify-center">
              <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="onDelete(index)"><img :src="RECT_DELETE" /></a>
            </div>
            <!-- 添加领取条件 -->
            <div v-else class="flex justify-center">
              <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="reset(record)"><img :src="RECT_DELETE" /></a>
            </div>
          </div>
        </template>
      </template>
    </Table>
  </div>
</template>
<script setup lang="ts">
  import {
    RadioGroup,
    RadioButton,
    Form,
    FormItem,
    Input,
    Col,
    Row,
    Table,
    InputNumber,
    Tooltip,
  } from 'ant-design-vue';
  import { computed, nextTick, ref, watch } from 'vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { currentyOptions } from '/@/settings/commonSetting';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import Icon from '@/components/Icon/Icon.vue';

  interface Props {
    current: number | string;
    selectValue: number;
    getDeatilId: String;
    mysterySource?: any;
  }
  const { t } = useI18n();
  const columns: any = computed(() => [
    {
      title: t('common.mystery10'),
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: t('business.common_member_Coding_multiple') + '(≥)',
      dataIndex: 'bet_multiple',
      align: 'center',
      slots: { title: 'bet' },
    },
    {
      slots: { title: 'reward' },
      dataIndex: 'rewardMax',
      align: 'center',
    },
    {
      title: t('v.discount.activity.operation'),
      dataIndex: 'operation',
      align: 'center',
    },
  ]);
  const count = ref(1);
  const props = defineProps<Props>();
  const mysterySource = computed(() => props.mysterySource);
  const currencyName = computed(() => currentyOptions[props.current]);
  const mysteryCurrencySource = computed(() => props.mysterySource[props.current]);
  const selectIndex = ref(
    mysterySource.value[props.current]['reward_config'][props.selectValue]['award_type'] || 0,
  );
  const currencySource: any = ref(
    mysterySource.value[props.current]['reward_config'][props.selectValue],
  );
  const dataSource = ref(currencySource.value['reward_cond'][selectIndex.value] || []);
  const chargeFormRef1 = ref();
  const chargeFormRef2 = ref();
  function setCurrencySource() {
    if (mysterySource.value && mysterySource.value[props.current]) {
      currencySource.value = mysterySource.value[props.current]['reward_config'][props.selectValue];
      dataSource.value = currencySource.value['reward_cond'][selectIndex.value] || [];
    }
  }

  function changDayInex(e: any) {
    selectIndex.value = e.target.value;
    setCurrencySource();
  }

  const onDelete = (index: number) => {
    dataSource.value.splice(index, 1);
    // emit('update:deleteKey', index);
  };
  // 添加领取条件
  const handleAdd = () => {
    count.value++;
    const newData = {
      key: `${count.value}`,
      index: `${count.value}`,
      bet_multiple: '',
      min: '',
      max: '',
    };
    dataSource.value.push(newData);
  };

  // 重置领取条件
  function reset(data) {
    data.conditionType = null;
    data.miniDeposit = null;
    data.chipsMultiple = null;
    data.everyReward = null;
  }
  async function valide() {
    let validate1 = new Promise((resolve, reject) => {
      if (chargeFormRef1.value) {
        chargeFormRef1.value
          .validate()
          .then(() => {
            resolve(true); // 校验成功
          })
          .catch(() => {
            reject(false); // 校验失败
          });
      }
    });
    let validate2 = new Promise((resolve, reject) => {
      if (chargeFormRef2.value) {
        chargeFormRef2.value
          .validate()
          .then(() => {
            resolve(true); // 校验成功
          })
          .catch(() => {
            reject(false); // 校验失败
          });
      }
    });
    return validate1 && validate2;
  }

  function addTab() {
    currencySource.value['recharge_config'].push({
      deposit: '',
      show_min: '',
      show_max: '',
    });

    const newIndex = Object.keys(currencySource.value['reward_cond']).length;
    currencySource.value['reward_cond'][newIndex] = [
      { bet_multiple: '', min: '', max: '', key: 1, index: 1 },
    ];
  }

  watch(
    () => props.current,
    (n) => {
      if (n) {
        setCurrencySource();
      }
    },
  );

  watch(
    () => props.selectValue,
    (n) => {
      if (n) {
        setCurrencySource();
      }
    },
  );

  defineExpose({
    valide,
  });
</script>
<style lang="less" scoped>
  .ant-tabs-nav-add {
    min-width: 40px;
    height: 40px;
    margin-left: 10px;
    padding: 0 8px;
    border: 1px solid #1475e1;
    border-radius: 4px;
    outline: none;
    background: #fff;
    cursor: pointer;
  }

  .ant-radio-group {
    display: flex;
  }

  .show—e-form {
    display: flex;

    .show—e {
      display: flex;
      flex-grow: 1;
      align-items: center;
      // margin-bottom: 20px;

      > .ant-form-item {
        flex-grow: 1;
        // margin-bottom: 0;
      }
    }
  }
</style>
