<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, ref, reactive, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import BasicConfig from './BasicConfig.vue';
  import TimeConfig from './TimeConfig.vue';
  import DollarCondition from './DollarCondition.vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import LangRadioGroup from '../../LangRadioGroup.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';

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

  const { t } = useI18n();
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
  const FORM_SIZE = useFormSetting().getFormSize;

  const conditionData = ref({
    zh_CN: [
      {
        key: '1',
        index: '1',
        type: '1',
        miniDeposit: '',
        chipsMultiple: '',
        conditionType: '1',
        conditionTime: [],
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
        conditionTime: [],
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
        conditionTime: [],
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
        conditionTime: [],
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
        conditionTime: [],
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
        conditionTime: [],
      },
    ],
  });
  const conditionType = ref('1');
  const activeConfig = ref(0 as any);
  const selectedWeek = ref([]);
  const startDate = ref();
  const endDate = ref();
  const dayTimeTagSelected = ref();
  const otherTimeTagSelected = ref();
  const timeConfigDom = ref();
  const basicConfigDom = ref();
  const basicConValidate = ref(true);
  const conditionTime = ref([]);
  const basicIndex = ref(0);
  const deleteKey = ref(0);
  const RedEnvelope = ref([
    {
      label: t('v.discount.activity.activeConfig1'),
      value: 0,
    },
    {
      label: t('v.discount.activity.activeConfig3'),
      value: 1,
    },
  ]);
  const currencyId = computed(() => props.modelValue);
  const currencyName = computed(() => currencyNameList[currencyId.value]);
  const firstCurrencyId = computed(() => props.firstCurrencyId);
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
      const miniDepositBackup = conditionData.value[lang].map((item) => item.miniDeposit);
      const chipsMultiple = conditionData.value[lang].map((item) => item.chipsMultiple);

      // 克隆 firstCurrencyName 的数据
      const clonedData = cloneDeep(conditionData.value[firstCurrencyName.value]);
      if (!clonedData) return;
      // 遍历克隆出来的数据，并将原来的 miniDeposit 重新赋值
      clonedData.forEach((entry, index) => {
        entry.miniDeposit = miniDepositBackup[index] || ''; // 保留原值，如果没有则设为空
      });
      clonedData.forEach((entry, index) => {
        entry.chipsMultiple = chipsMultiple[index] || ''; // 保留原值，如果没有则设为空
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
      if (newArray?.length > 0) {
        if (newArray.length != oldArray?.length) return;
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

  defineExpose({
    // redUpperLimit, //前台红包上限
    selectedWeek, //每周
    startDate, //每周开始时间
    endDate, //结束时间
    dayTimeTagSelected, // 每日时间筛选
    otherTimeTagSelected, //每周时间晒讯
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
    // langList.forEach((lang) => {
    //   if (!dailyCollectionLimit.value[lang].trim()) isInput.dailyState = false;
    // });
    // if (!isInput.dailyState || !isInput.redBagState) {
    // } else {
    //   r = true;
    // }
    // return r;
  }
</script>

<template>
  <!-- <button @click="valide">校验</button> -->
  <PageWrapper :contentStyle="{ margin: '0px' }">
    <!-- <RadioGroup class="!mb-5" :size="FORM_SIZE" v-model:value="activeConfig" button-style="solid">
      <RadioButton :value="0">基础配置</RadioButton>
      <RadioButton :value="1">时间配置</RadioButton>
      <RadioButton :value="2">红包条件</RadioButton>
    </RadioGroup> -->
    <LangRadioGroup
      class="mb-5 !-mt-2"
      :contentList="RedEnvelope"
      v-model:modelValue="activeConfig"
      v-model:basicIndex="basicIndex"
      @update:click="changeHandle"
    />
    <!-- v-model:redUpperLimit="redUpperLimit" -->
    <basic-config
      ref="basicConfigDom"
      v-if="activeConfig === 0"
      v-model:dailyCollectionLimit="dailyCollectionLimit[currentConditionData]"
      v-model:redBagCountDown="redBagCountDown[currentConditionData]"
      v-model:currencyName="currencyName"
    />
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
