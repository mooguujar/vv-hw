<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, ref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DollarCondition from './DollarCondition.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';

  interface Props {
    XYtableData: object;
    getDeatilId: boolean;
    modelValue: String;
    firstCurrencyId: String;
    incentiveConfig: number;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);
  const currencyList = {
    '701': 'zh_CN',
    '702': 'pt_BR',
    '704': 'vi_VN',
    '705': 'th_TH',
    '703': 'hi_IN',
    '706': 'en_US',
  };
  const currencyCodeList = {
    zh_CN: '701',
    pt_BR: '702',
    vi_VN: '704',
    th_TH: '705',
    hi_IN: '703',
    en_US: '706',
  };
  const currencyNameList = {
    '701': 'CNY',
    '702': 'BRL',
    '704': 'KVND',
    '705': 'THB',
    '703': 'INR',
    '706': 'USDT',
  };

  const { t } = useI18n();
  const dailyCollectionLimit = ref({
    zh_CN: '',
    pt_BR: '',
    vi_VN: '',
    th_TH: '',
    hi_IN: '',
    en_US: '',
  });
  const redBagCountDown = ref({
    zh_CN: '',
    pt_BR: '',
    vi_VN: '',
    th_TH: '',
    hi_IN: '',
    en_US: '',
  });

  const validTimeList = ref([
    { label: '按存款', value: 1 },
    { label: '按打码', value: 2 },
  ]);
  let keyv = ref(1);
  let keyv2 = ref(2);
  // let value = ref(1);
  // let value2 = ref(1);
  let isTow = ref(true);
  const change = (value, item) => {
    if (value == 1) {
      keyv2.value = 2;
    } else {
      keyv2.value = 1;
    }
    item.bet = 0;
    item.deposit = 0;
  };
  // 基础配置 - 按日条件 ｜ 必须至少要有一个且金额大于0
  const conditionData = ref({
    zh_CN: {
      bonus_serial: [{ index: '1', amt: '', day: null }],
      bonus_base: [{ index: '1', bet: '', deposit: '', amt: '', day: [] }],
      cond: {},
    },
    pt_BR: {
      bonus_serial: [{ index: '1', amt: '', day: null }],
      bonus_base: [{ index: '1', bet: '', deposit: '', amt: '', day: [] }],
      cond: {},
    },
    vi_VN: {
      bonus_serial: [{ index: '1', amt: '', day: null }],
      bonus_base: [{ index: '1', bet: '', deposit: '', amt: '', day: [] }],
      cond: {},
    },
    th_TH: {
      bonus_serial: [{ index: '1', amt: '', day: null }],
      bonus_base: [{ index: '1', bet: '', deposit: '', amt: '', day: [] }],
      cond: {},
    },
    hi_IN: {
      bonus_serial: [{ index: '1', amt: '', day: null }],
      bonus_base: [{ index: '1', bet: '', deposit: '', amt: '', day: [] }],
      cond: {},
    },
    en_US: {
      bonus_serial: [{ index: '1', amt: '', day: null }],
      bonus_base: [{ index: '1', bet: '', deposit: '', amt: '', day: [] }],
      cond: {},
    },
  });
  const conditionType = ref('1');
  const activeConfig = ref(1 as any);
  const basicConfigDom = ref();
  const basicConValidate = ref(true);
  const conditionTime = ref([]);
  const basicIndex = ref(0);
  const deleteKey = ref(0);
  const RedEnvelope = ref([
    {
      label: t('v.discount.activity.luckyConfig'),
      value: 0,
    },
    {
      label: t('v.discount.activity.betConfig'),
      value: 1,
    },
  ]);
  const currencyId: any = computed(() => props.modelValue);
  const currencyName = computed(() => currencyNameList[currencyId.value]);
  const firstCurrencyId: any = computed(() => props.firstCurrencyId);
  const currentConditionData = computed(() => currencyList[currencyId.value]);
  const firstCurrencyName = computed(() => currencyList[firstCurrencyId.value]);
  const firstConditionData = computed(() => conditionData.value[firstCurrencyName.value]);

  function changeHandle(v) {
    activeConfig.value = v;
    basicIndex.value = v;
  }
  function updateConditionData(newArray) {
    const langList = Object.keys(conditionData.value).filter(
      (item) => item != firstCurrencyName.value,
    );
    langList.forEach((lang) => {
      newArray.forEach((item, index) => {
        conditionData.value[lang][index].conditionType = newArray[index].conditionType;
        conditionData.value[lang][index].conditionTime = newArray[index].conditionTime;
      });
    });
  }
  function updateOtherLang(langList) {
    langList.forEach((lang) => {
      // const miniDepositBackup = conditionData.value[lang].map((item) => item.miniDeposit);
      // const chipsMultiple = conditionData.value[lang].map((item) => item.chipsMultiple);
      // 克隆 firstCurrencyName 的数据
      const clonedData = cloneDeep(conditionData.value[firstCurrencyName.value]);
      if (!clonedData) return;
      // 遍历克隆出来的数据，并将原来的 miniDeposit 重新赋值
      // clonedData.forEach((entry, index) => {
      //   entry.miniDeposit = miniDepositBackup[index] || ''; // 保留原值，如果没有则设为空
      // });
      // clonedData.forEach((entry, index) => {
      //   entry.chipsMultiple = chipsMultiple[index] || ''; // 保留原值，如果没有则设为空
      // });
      // conditionData.value[lang] = clonedData;
    });
  }
  watch(
    () => conditionData.value[firstCurrencyName.value]?.length,
    (newLen, oldLen) => {
      const langList = Object.keys(conditionData.value).filter(
        (item) => item != firstCurrencyName.value,
      );
      if (newLen > oldLen) {
        updateOtherLang(langList);
      }
      if (newLen < oldLen) {
        langList.forEach((item) => {
          conditionData.value[item] = conditionData.value[item].filter(
            (item) => item.index !== deleteKey.value,
          );
        });
      }
    },
  );

  watch(
    () => conditionData.value[firstCurrencyName.value],
    (newArray, oldArray) => {
      if (newArray > 0) {
        if (newArray.length != oldArray.length) return;
        updateConditionData(newArray);
      }
    },
    { deep: true },
  );

  watch(
    () => currencyId.value,
    (n) => {
      const langList = Object.keys(conditionData.value).filter(
        (item) => item != firstCurrencyName.value,
      );
      updateOtherLang(langList);
    },
  );

  async function valide(langList, type = true) {
    let r = { dailyState: true, reaBagState: true };
    if (type) {
      for (let i = 0; i < langList.length; i++) {
        const lang = langList[i];
        if (!dailyCollectionLimit.value[lang]) {
          changeHandle(0);
          emits('update:modelValue', currencyCodeList[lang]);
          nextTick(async () => {
            r.dailyState = await basicConfigDom.value.validationFunc(type);
          });
          return false;
        }
        if (!redBagCountDown.value[lang]) {
          changeHandle(0);
          emits('update:modelValue', currencyCodeList[lang]);
          nextTick(async () => {
            r.reaBagState = await basicConfigDom.value.validationFunc(type);
          });
          return false;
        }
      }
    } else {
      nextTick(() => {
        basicConfigDom.value && basicConfigDom.value.clearValidateInfo();
      });
    }
    if (r.dailyState && r.reaBagState) {
      return true;
    } else {
      return false;
    }
  }
  defineExpose({
    currencyName,
    keyv2,
    conditionType,
    valide, //条件类型
    basicConValidate,
    // 这个新模版，有用的就下面三个，其他不动了，以免出现问题
    dailyCollectionLimit, //每日领取上限
    redBagCountDown,
    conditionData, //表格数据
  });
</script>

<template>
  <PageWrapper :contentStyle="{ marginLeft: '-25px' }">
    <dollar-condition
      ref="dollarConditionRef"
      v-if="activeConfig === 1"
      :getDeatilId1="false"
      :getDeatilId="getDeatilId"
      :incentiveConfig="incentiveConfig"
      v-model="conditionData[currentConditionData]"
      v-model:condition-type="conditionType"
      v-model:conditionTime="conditionTime"
      v-model:firstCurrencyId="firstCurrencyId"
      v-model:currencyId="currencyId"
      v-model:firstConditionData="firstConditionData"
      v-model:deleteKey="deleteKey"
      v-model:currencyName="currencyName"
    />
  </PageWrapper>
</template>
<style scoped>
  :deep(.ant-form-item-control-input-content) {
    .doorsillSelect {
      width: 150px;
    }

    .doorsillInput {
      width: 350px !important;
    }
  }

  p {
    margin-bottom: 0;
  }
</style>
