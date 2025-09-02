<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, ref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DollarCondition from './DollarCondition.vue';
  // import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  // import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import eventBus from '/@/utils/eventBus';

  interface Props {
    modelValue: String;
    firstCurrencyId: String;
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

  // const { t } = useI18n();
  // const redUpperLimit = ref('' as String);
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
  // const FORM_SIZE = useFormSetting().getFormSize;

  const conditionData = ref({
    zh_CN: [
      {
        key: '1',
        index: '1',
        type: '1',
        miniDeposit: '',
        chipsMultiple: '',
        conditionType: '1',
        everyReward: '',
        // conditionTime: [],
      },
    ],
    pt_BR: [
      {
        key: '1',
        index: '1',
        type: '1',
        miniDeposit: '',
        chipsMultiple: '',
        conditionType: '1',
        everyReward: '',

        // conditionTime: [],
      },
    ],
    vi_VN: [
      {
        key: '1',
        index: '1',
        type: '1',
        miniDeposit: '',
        chipsMultiple: '',
        conditionType: '1',
        everyReward: '',

        // conditionTime: [],
      },
    ],
    th_TH: [
      {
        key: '1',
        index: '1',
        type: '1',
        miniDeposit: '',
        chipsMultiple: '',
        conditionType: '1',
        everyReward: '',

        // conditionTime: [],
      },
    ],
    hi_IN: [
      {
        key: '1',
        index: '1',
        type: '1',
        miniDeposit: '',
        chipsMultiple: '',
        conditionType: '1',
        everyReward: '',

        // conditionTime: [],
      },
    ],
    en_US: [
      {
        key: '1',
        index: '1',
        type: '1',
        miniDeposit: '',
        chipsMultiple: '',
        conditionType: '1',
        everyReward: '',

        // conditionTime: [],
      },
    ],
  });
  const conditionType = ref('1');
  const activeConfig = ref(1 as any);
  const basicConfigDom = ref();
  const basicConValidate = ref(true);
  const conditionTime = ref([]);
  const basicIndex = ref(0);
  const deleteKey = ref(0);
  // const RedEnvelope = ref([
  //   {
  //     label: t('v.discount.activity.luckyConfig'),
  //     value: 0,
  //   },
  //   {
  //     label: t('v.discount.activity.betConfig'),
  //     value: 1,
  //   },
  // ]);
  const currencyId = computed(() => props.modelValue as keyof typeof currencyNameList);
  const currencyName = computed(() => currencyNameList[currencyId.value]);
  const firstCurrencyId = computed(() => props.firstCurrencyId as keyof typeof currencyNameList);
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
        // conditionData.value[lang][index].conditionTime = newArray[index].conditionTime;
      });
    });
  }
  function updateOtherLang(langList) {
    langList.forEach((lang) => {
      const miniDepositBackup = conditionData.value[lang].map((item) => item.miniDeposit);
      const recordReward = conditionData.value[lang].map((item) => item.everyReward);

      // 克隆 firstCurrencyName 的数据
      const clonedData = cloneDeep(conditionData.value[firstCurrencyName.value]);
      if (!clonedData) return;
      // 遍历克隆出来的数据，并将原来的 miniDeposit 重新赋值
      clonedData.forEach((entry, index) => {
        entry.miniDeposit = miniDepositBackup[index] || ''; // 保留原值，如果没有则设为空
      });
      clonedData.forEach((entry, index) => {
        entry.everyReward = recordReward[index] || ''; // 保留原值，如果没有则设为空
      });

      conditionData.value[lang] = clonedData;
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
            (item) => item.key !== deleteKey.value,
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
  watch(
    () => conditionData.value,
    () => {
      const langKeys = Object.keys(conditionData.value);

      const currentMoney = langKeys.reduce((pre, item) => {
        const current = conditionData.value[item];
        const rewardList = current.map((r) => {
          const reward = Number(r.everyReward);
          return isNaN(reward) ? 0 : reward;
        });
        pre[item] = Math.max(...rewardList);
        return pre;
      }, {});
      eventBus.emit('onEvertBetTextChange', { value: currentMoney, type: 'condition' });
    },
    { deep: true },
  );
  defineExpose({
    conditionType,
    valide, //条件类型
    basicConValidate,
    // 这个新模版，有用的就下面三个，其他不动了，以免出现问题
    dailyCollectionLimit, //每日领取上限
    redBagCountDown,
    conditionData, //表格数据
  });

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
</script>

<template>
  <PageWrapper :contentStyle="{ margin: '0px' }">
    <!-- <LangRadioGroup
      class="mb-5 !-mt-2"
      :contentList="RedEnvelope"
      v-model:modelValue="activeConfig"
      v-model:basicIndex="basicIndex"
      @update:click="changeHandle"
    /> -->
    <!-- <basic-config
      ref="basicConfigDom"
      v-if="activeConfig === 0"
      v-model:dailyCollectionLimit="dailyCollectionLimit[currentConditionData]"
      v-model:redBagCountDown="redBagCountDown[currentConditionData]"
      v-model:currencyName="currencyName"
    /> -->
    <dollar-condition
      ref="dollarConditionRef"
      v-if="activeConfig === 1"
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
