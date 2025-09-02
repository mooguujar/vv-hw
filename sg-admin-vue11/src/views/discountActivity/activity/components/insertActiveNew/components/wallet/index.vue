<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, ref, reactive, watch } from 'vue';
  import abRoundButtonGroup from '/@/components/abRoundButtonGroup/ab-round-button-group.vue';

  import { PageWrapper } from '/@/components/Page';
  import BasicConfig from './BasicConfig.vue';
  import TimeConfig from './TimeConfig.vue';
  import DollarCondition from './DollarCondition.vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import LangRadioGroup from '../../LangRadioGroup.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import {
    // RadioGroup,
    Input,
    FormItem,
    Row,
    Col,
    CheckboxGroup,
    Checkbox,
    InputNumber,
  } from 'ant-design-vue';
  interface Props {
    selectList: Array<any>;
    clientList: Array<any>;
    XYtableData: object;
    getDeatilId: boolean;
    modelValue: String;
    currencyName_: String;
    firstCurrencyId: String;
    incentiveConfig: number;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue', 'update:selectList']);
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
  const FORM_SIZE = useFormSetting().getFormSize;

  let keyv = ref(1);
  let keyv2 = ref(2);
  // 基础配置 - 按日条件 ｜ 必须至少要有一个且金额大于0
  const conditionData = ref({
    wallet: [],
    cryptocurrency: [],
    bonus: { 701: [{ index: '1', d: '', c: '' }] },
  });
  const conditionType: any = ref('1');
  const activeConfig = ref(1 as any);
  const basicConfigDom = ref();
  const basicConValidate = ref(true);
  const conditionTime = ref([]);
  const basicIndex = ref(0);
  const deleteKey = ref(0);
  const currencyId: any = computed(() => props.modelValue);
  // const currencyName = computed(() => props.currencyName_);
  const currencyName = 'CNY';
  const firstCurrencyId: any = computed(() => props.firstCurrencyId);
  const currentConditionData = computed(() => currencyList[currencyId.value]);
  const firstCurrencyName = computed(() => currencyList[firstCurrencyId.value]);
  // const firstConditionData = computed(() => conditionData.value[firstCurrencyName.value]);
  const firstConditionData: any = '';

  function changeHandle(v) {
    activeConfig.value = v;
    basicIndex.value = v;
  }
  function updateConditionData(newArray) {
    // const langList = Object.keys(conditionData.value).filter(
    //   (item) => item != firstCurrencyName.value,
    // );
    // langList.forEach((lang) => {
    //   newArray.forEach((item, index) => {
    //     conditionData.value[lang][index].conditionType = newArray[index].conditionType;
    //     conditionData.value[lang][index].conditionTime = newArray[index].conditionTime;
    //   });
    // });
  }
  function updateOtherLang(langList) {
    langList.forEach((lang) => {
      // const miniDepositBackup = conditionData.value[lang].map((item) => item.miniDeposit);
      // const chipsMultiple = conditionData.value[lang].map((item) => item.chipsMultiple);
      // 克隆 firstCurrencyName 的数据
      // const clonedData = cloneDeep(conditionData.value[firstCurrencyName.value]);
      // if (!clonedData) return;
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
    () => conditionData.value.bonus['701']?.length,
    (newLen, oldLen) => {
      // const langList = Object.keys(conditionData.value).filter(
      //   (item) => item != firstCurrencyName.value,
      // );
      if (newLen > oldLen) {
        // updateOtherLang(langList);
      }
      if (newLen < oldLen) {
        // langList.forEach((item) => {
        //   conditionData.value[item] = conditionData.value[item].filter(
        //     (item) => item.index !== deleteKey.value,
        //   );
        // });
      }
    },
  );

  watch(
    () => conditionData.value.bonus,
    (newArray, oldArray) => {
      current_platform_ids.value = props.selectList;
      tabValue.value = props.clientList[0].value;
      // conditionData.value.bonus = newArray.bonus;
      // if (newArray > 0) {
      //   if (newArray.length != oldArray.length) return;
      //   // updateConditionData(newArray);
      // }
    },
    { deep: true },
  );
  let arr2 = [];
  const current_platform_ids = ref(props.selectList);
  watch(
    () => props.clientList, //币种变化时
    (newArray, oldArray) => {
      if (newArray) {
        let listCNY = props.clientList[0]?.currency_id == '701';
        if (listCNY) {
          arr2 = props.clientList[0].selectOptions.map((item) => item.id);
        }
        conditionData.value.wallet = props.selectList.filter((item) => arr2.includes(item));
        conditionData.value.cryptocurrency = props.selectList.filter(
          (item) => !arr2.includes(item),
        );
      }
    },
    { deep: true, immediate: true },
  );

  watch(
    () => currencyId.value,
    (n) => {
      tabValue.value = props.clientList[0].value;
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
    conditionData, //表格数据
  });
  const tabValue = ref(props.clientList[0]?.value);
  const tabIndex = ref(0);
  watch(
    () => tabValue.value,
    (newV) => {
      let index_ = props.clientList.findIndex((itemL) => itemL.value == newV);
      tabIndex.value = index_;
    },
  );

  const handleCheckboxChange = (e) => {
    setTimeout(() => {
      let targetValue = e.target?.value;
      if (
        e.target?.checked &&
        targetValue &&
        props.selectList.some((item) => item != targetValue)
      ) {
        current_platform_ids.value = props.selectList;
        current_platform_ids.value.push(targetValue);
        emits('update:selectList', current_platform_ids.value);
      } else {
        current_platform_ids.value = props.selectList.filter((item) => item != targetValue);
        emits('update:selectList', current_platform_ids.value);
      }
      conditionData.value.wallet = current_platform_ids.value.filter((item) => arr2.includes(item));
      conditionData.value.cryptocurrency = current_platform_ids.value.filter(
        (item) => !arr2.includes(item),
      );
    }, 88);
  };
</script>

<template>
  <PageWrapper :contentStyle="{ margin: '0px' }">
    <div class="clearfix">
      <div class="left h-40px leading-56px" v-if="incentiveConfig == 1"
        ><span class="E91134">*</span>{{ t('table.finance.finance_Way') }}：</div
      >
      <!-- {{ clientList[0].selectOptions }} -->
      <abRoundButtonGroup
        class="left ml-5px"
        v-model="tabValue"
        :blackEdge="true"
        :btnList="clientList"
      />
      <CheckboxGroup
        class="!mt-25px !ml-100px h-70px"
        v-model:value="current_platform_ids"
        style="width: 100%"
      >
        <Row>
          <Col :span="4" v-for="item in clientList[tabIndex]?.selectOptions">
            <Checkbox @change="handleCheckboxChange($event, item)" :value="item.id">{{
              item.name
            }}</Checkbox>
          </Col>
        </Row>
      </CheckboxGroup>
    </div>
    <dollar-condition
      ref="dollarConditionRef"
      v-if="activeConfig === 1"
      :getDeatilId="getDeatilId"
      :incentiveConfig="incentiveConfig"
      v-model="conditionData.bonus['701']"
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
