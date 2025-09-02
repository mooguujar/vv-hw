<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
  import DollarCondition from './DollarCondition.vue';
  import { currentyOptions } from '/@/settings/commonSetting';
  import { cloneDeep } from 'lodash-es';
  import eventBus from '/@/utils/eventBus';

  interface Props {
    modelValue: String;
    firstCurrencyId: String;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);

  const currencyCodeList = {
    zh_CN: '701',
    pt_BR: '702',
    vi_VN: '704',
    th_TH: '705',
    hi_IN: '703',
    en_US: '706',
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
  // 每日奖励活动配置数据
  const conditionData = ref({});
  const conditionType = ref('1');
  const activeConfig = ref(1 as any);
  const basicConfigDom = ref();
  const basicConValidate = ref(true);
  const conditionTime = ref([]);
  const basicIndex = ref(0);
  const deleteKey = ref(0);
  const currencyId = computed(() => props.modelValue as keyof typeof currentyOptions);
  const currencyName = computed(() => currentyOptions[currencyId.value]);
  const firstCurrencyId = computed(() => props.firstCurrencyId as keyof typeof currentyOptions);
  const currentConditionData = computed(() => currentyOptions[currencyId.value]);
  const firstCurrencyName = computed(() => currentyOptions[firstCurrencyId.value]);
  const firstConditionData = computed(() => conditionData.value[firstCurrencyName.value]);

  function changeHandle(v) {
    activeConfig.value = v;
    basicIndex.value = v;
  }
  // 更新首币种配置
  function updateConditionData(newArray) {
    const langList = Object.keys(conditionData.value).filter(
      (item) => item != firstCurrencyName.value,
    );
    langList.forEach((lang) => {
      newArray.forEach((item, index) => {
        conditionData.value[lang][index].conditionType = newArray[index].conditionType;
      });
    });
  }
  // 更新其它币种配置
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
  // 找出conditionData.value中对应币种的最大值
  function findMaxReward(currencyName) {
    const currentArray = conditionData.value[currencyName];
    if (!currentArray) return 0;
    const maxReward = Math.max(
      ...currentArray.map((r) => {
        const reward = Number(r.everyReward);
        return isNaN(reward) ? 0 : reward;
      }),
    );
    return maxReward;
  }
  // 找出conditionData.value中对应币种的奖励之和
  function findSumReward(currencyName) {
    const currentArray = conditionData.value[currencyName];
    if (!currentArray) return 0;
    const sumReward = currentArray.reduce((pre, item) => {
      const reward = Number(item.everyReward);
      return pre + (isNaN(reward) ? 0 : reward);
    }, 0);
    return sumReward;
  }

  /* watch(
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
  ); */

  /* watch(
    () => conditionData.value[firstCurrencyName.value],
    (newArray, oldArray) => {
      if (newArray > 0) {
        if (newArray.length != oldArray.length) return;
        updateConditionData(newArray);
      }
    },
    { deep: true },
  ); */
  watch(
    () => currencyId.value,
    () => {
      const maxReward = findMaxReward(currencyName.value);
      const sumReward = findSumReward(currencyName.value);
      eventBus.emit('onEvertBetTextChange', {
        value: { [currencyName.value]: { maxReward: maxReward, sumReward: sumReward } },
        type: 'condition',
      });
    },
  );
  watch(
    () => conditionData.value,
    () => {
      const maxReward = findMaxReward(currencyName.value);
      const sumReward = findSumReward(currencyName.value);
      eventBus.emit('onEvertBetTextChange', {
        value: { [currencyName.value]: { maxReward: maxReward, sumReward: sumReward } },
        type: 'condition',
      });
    },
    { deep: true },
  );

  onBeforeUnmount(() => {
    eventBus.off('onEvertBetTextChange'); // 清理事件监听器
  });

  defineExpose({
    conditionType,
    valide, //条件类型
    basicConValidate,
    // 这个新模版，有用的就下面三个，其他不动了，以免出现问题
    dailyCollectionLimit, //每日领取上限
    redBagCountDown,
    conditionData, //每日奖励活动配置数据
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
  <div>
    <dollar-condition
      ref="dollarConditionRef"
      v-if="activeConfig === 1"
      v-model="conditionData[currentConditionData]"
      v-model:conditionType="conditionType"
      v-model:conditionTime="conditionTime"
      v-model:firstCurrencyId="firstCurrencyId"
      v-model:currencyId="currencyId"
      v-model:firstConditionData="firstConditionData"
      v-model:deleteKey="deleteKey"
      v-model:currencyName="currencyName"
    />
  </div>
</template>
