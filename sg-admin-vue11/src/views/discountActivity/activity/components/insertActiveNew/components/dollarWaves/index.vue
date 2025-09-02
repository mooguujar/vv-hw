<script lang="ts" setup name="DollarWaves">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import BasicConfig from './BasicConfig.vue';
  import TimeConfig from './TimeConfig.vue';
  import DollarCondition from './DollarCondition.vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import LangRadioGroup from '../../LangRadioGroup.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  // const redUpperLimit = ref('' as String);
  const dailyCollectionLimit = ref();
  const FORM_SIZE = useFormSetting().getFormSize;
  const conditionData = ref();
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

  const RedEnvelope = ref([
    {
      label: t('v.discount.activity.activeConfig1'),
      value: 0,
    },
    {
      label: t('v.discount.activity.activeConfig2'),
      value: 1,
    },
    {
      label: t('v.discount.activity.activeConfig3'),
      value: 2,
    },
  ]);

  function changeHandle(v) {
    activeConfig.value = v;
  }

  defineExpose({
    // redUpperLimit, //前台红包上限
    dailyCollectionLimit, //每日领取上限
    selectedWeek, //每周
    startDate, //每周开始时间
    endDate, //结束时间
    dayTimeTagSelected, // 每日时间筛选
    otherTimeTagSelected, //每周时间晒讯
    conditionData, //红包
    conditionType,
    valide, //条件类型
    basicConValidate,
  });

  async function valide() {
    const r = await basicConfigDom.value.validationFunc();
    return r;
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
      @update:click="changeHandle"
    />
    <!-- v-model:redUpperLimit="redUpperLimit" -->
    <basic-config
      ref="basicConfigDom"
      v-if="activeConfig === 0"
      v-model:dailyCollectionLimit="dailyCollectionLimit"
    />
    <time-config
      ref="timeConfigDom"
      v-if="activeConfig === 1"
      v-model:selectedWeek="selectedWeek"
      v-model:startDate="startDate"
      v-model:endDate="endDate"
      v-model:dayTimeTagSelected="dayTimeTagSelected"
      v-model:otherTimeTagSelected="otherTimeTagSelected"
    />
    <dollar-condition
      ref="dollarConditionRef"
      v-if="activeConfig === 2"
      v-model="conditionData"
      v-model:condition-type="conditionType"
    />
  </PageWrapper>
</template>
