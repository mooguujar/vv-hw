<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, ref, reactive, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DollarCondition from './DollarCondition.vue';
  import TableCheckbox from '@/components/TableCheckbox/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

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
  const currencyCodeList = {
    zh_CN: '701',
    pt_BR: '702',
    vi_VN: '704',
    th_TH: '705',
    hi_IN: '703',
    en_US: '706',
  };

  const { t } = useI18n();
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
  const currencyName = 'CNY';
  const firstCurrencyId: any = computed(() => props.firstCurrencyId);
  const defaultCheckedKeys: any = computed(() => props.selectList);
  const firstConditionData: any = '';
  const current_platform_ids = ref([]);
  function changeHandle(v) {
    activeConfig.value = v;
    basicIndex.value = v;
  }

  watch(
    () => conditionData.value.bonus,
    (newArray, oldArray) => {
      defaultCheckedKeys.value = props.selectList;
      // current_platform_ids.value = props.selectList;
    },
    { deep: true },
  );
  let arr2 = [];

  nextTick(() => {
    current_platform_ids.value = props.selectList;
  });
  watch(
    () => props.clientList, //币种变化时
    (newArray, oldArray) => {
      if (newArray) {
        newArray.forEach((p) => {
          p.name = t('business.common_select_all');
          p.id = p.contract_id;
        });
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

  const handleCheckboxChange = (e) => {
    setTimeout(() => {
      emits('update:selectList', current_platform_ids.value);
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
      <div class="left h-40px leading-40px" v-if="incentiveConfig == 1"
        ><span class="E91134">*</span>{{ t('table.finance.finance_Way') }}：</div
      >
      <TableCheckbox
        :data="clientList"
        :check-strictly="false"
        :default-checked-keys="defaultCheckedKeys"
        v-model:checkedKeys="current_platform_ids"
        defaultExpandAll
        :replaceFields="{
          children: 'selectOptions',
          title: 'name',
          key: 'id',
          label: 'label',
        }"
        class="left ml-5px"
        @check-change="handleCheckboxChange"
      />

      <!-- <abRoundButtonGroup
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
      </CheckboxGroup> -->
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
