<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, ref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DollarCondition from './DollarCondition.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';

  const { t } = useI18n();
  interface Props {
    modelValue: String;
    currencyList: Array<any>;
    all_platform_ids: Array<any>;
    current_platform_ids: Array<any>;
    plateOptions: Array<any>;
    firstCurrencyId: String;
    type: number;
    toDisabled: boolean;
    platform_range: number;
    getDeatilId: String;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);

  const { currencyTreeList } = useTreeListStore();

  const currencyNameList = currencyTreeList.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});
  const currencyCodeList = {
    zh_CN: '701',
    pt_BR: '702',
    vi_VN: '704',
    th_TH: '705',
    hi_IN: '703',
    en_US: '706',
  };
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

  const conditionData3 = ref({
    '701': {
      sales: '', // 反水上限
    },
    '702': {
      sales: '', // 反水上限
    },
    '704': {
      sales: '', // 反水上限
    },
    '705': {
      sales: '', // 反水上限
    },
    '703': {
      sales: '', // 反水上限
    },
    '706': {
      sales: '', // 反水上限
    },
  });
  const conditionData2 = ref({});
  const conditionData = ref(
    currencyTreeList.reduce((acc, item) => {
      acc[item.id] = [
        {
          amount: '', // 有效投注金额/充值金额 根据任务类型决定
          award: '', // 奖励金额 or 返奖比例 根据 bonus_type 决定
        },
      ];
      return acc;
    }, {}),
  );
  watch(
    () => props.all_platform_ids,
    (newVal) => {
      if (props.type == 5) {
        let list = props.currencyList;
        list.forEach((item) => {
          let currencyId = ref();
          currencyId.value = item.value;
          let currentData;
          if (conditionData2.value[currencyId.value]) {
            currentData = JSON.parse(JSON.stringify(conditionData2.value[currencyId.value]));
          }
          conditionData2.value[currencyId.value] = {};
          newVal.forEach((element, index) => {
            if (currentData?.[element]) {
              conditionData2.value[currencyId.value][element] = currentData[element];
            } else {
              conditionData2.value[currencyId.value][element] = [
                {
                  coding: '', // 有效打码
                  sales_rate: '', // 反水率
                },
              ];
            }
          });
        });
      }
    },
  );
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
  const currentConditionData = computed(() => currencyId.value);
  const firstCurrencyName = computed(() => currencyId.value);
  const firstConditionData = computed(() => conditionData.value[firstCurrencyName.value]);
  const activeType = computed(() => props.type);
  const deatilId = computed(() => props.getDeatilId || props.toDisabled);
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
  function updateOtherLang(langList) {}
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
    () => {},
    { deep: true },
  );
  defineExpose({
    conditionData2,
    conditionData3,
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
    <dollar-condition
      ref="dollarConditionRef"
      class="w-65% ml-20px"
      v-if="activeConfig === 1"
      v-model="conditionData[currentConditionData]"
      v-model:conditionData2="conditionData2[currencyId]"
      v-model:condition-type="conditionType"
      :plateOptions="plateOptions"
      :platform_range="platform_range"
      :current_platform_ids="current_platform_ids"
      v-model:conditionTime="conditionTime"
      v-model:firstCurrencyId="firstCurrencyId"
      v-model:type="activeType"
      v-model:currencyId="currencyId"
      v-model:getDeatilId="deatilId"
      v-model:firstConditionData="firstConditionData"
      v-model:deleteKey="deleteKey"
      v-model:currencyName="currencyName"
    />
  </PageWrapper>
</template>
