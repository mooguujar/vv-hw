<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, ref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import SignInTable from './signInTable.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { isStrictNumber } from '/@/utils/number';
  import { mweekly, monthly } from '/@/views/discountActivity/activity/common/setting.ts';

  interface Props {
    modelValue: String;
    form_data: object;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);

  const { t } = useI18n();

  const templateData = {
    currency_id: '',
    platform_range: 1, //统计场馆 1:统一模式 2:指定场馆
    platform_ids: [], //场馆ID 如果是统一模式 空数组 []
    period: 1, //签到周期 1:周 2:月
    //周配置
    period_1: {
      //循环方式 1:循环 2:一次性
      loop: 1,
      //奖励配置 1:固定金额 2:充值比例 3:打码比例
      type: 1,
      //额外奖励 0:否(默认) 1:是
      extra: 0,
      //基础条件 周条件固定星期一到星期日
      base_conf: {
        type1: mweekly.map((p, index) => {
          return {
            // signIn: p.label,
            day: index + 1,
            deposit: '',
            bet: '',
            bonus: '',
          };
        }),
        type2: mweekly.map((p, index) => {
          return {
            // signIn: p.label,
            day: index + 1,
            deposit: '',
            bet: '',
            bonus: '',
          };
        }),
        type3: mweekly.map((p, index) => {
          return {
            // signIn: p.label,
            day: index + 1,
            deposit: '',
            bet: '',
            bonus: '',
          };
        }),
      },
      extra_conf: {
        //连续签到奖励 如果没有配置传 [] 空的数组
        serial: [],
        //累计签到奖励 如果没有配置传 [] 空的数组
        jackpot: [],
      },
    },
    //月配置
    period_2: {
      //循环方式 1:循环 2:一次性
      loop: 1,
      //奖励配置 1:固定金额 2:充值比例 3:打码比例
      type: 1,
      //额外奖励 0:否(默认) 1:是
      extra: 0,
      //基础条件 月条件固定31天
      base_conf: {
        type1: monthly.map((p, index) => {
          return {
            // signIn: p.label,
            day: index + 1,
            deposit: '',
            bet: '',
            bonus: '',
          };
        }),
        type2: monthly.map((p, index) => {
          return {
            // signIn: p.label,
            day: index + 1,
            deposit: '',
            bet: '',
            bonus: '',
          };
        }),
        type3: monthly.map((p, index) => {
          return {
            // signIn: p.label,
            day: index + 1,
            deposit: '',
            bet: '',
            bonus: '',
          };
        }),
      },
      extra_conf: {
        //连续签到奖励 如果没有配置传 [] 空的数组
        serial: [],
        //累计签到奖励 如果没有配置传 [] 空的数组
        jackpot: [],
      },
    },
  };
  const conditionData = ref({});
  const currencyId: any = computed(() => props.modelValue);
  const tableData: any = computed(() => {
    const period = props.form_data.period == 1 ? 'period_1' : 'period_2';
    const type = 'type' + props.form_data.type;
    return conditionData.value[currencyId.value][period].base_conf[type];
  });
  // watch(
  //   () => conditionData.value[currencyId.value],
  //   (newArray, oldArray) => {},
  //   { deep: true },
  // );

  watch(
    () => currencyId.value,
    (n, o) => {
      if (!conditionData.value?.hasOwnProperty(n)) {
        const cloneData = cloneDeep(templateData);
        cloneData['currency_id'] = n;
        conditionData.value[n] = cloneData;
      }
    },
    { immediate: true, deep: true },
  );
  watch(
    () => props.form_data,
    (n, o) => {
      if (n.currentCurryId && currencyId.value) {
        nextTick(() => {
          let { currentCurryId, platform_range, platform_ids, period, loop, type, extra } = n;
          // conditionData.value[currencyId.value]['currency_id'] = currentCurryId || currencyId.value;
          conditionData.value[currencyId.value]['platform_range'] = platform_range;
          conditionData.value[currencyId.value]['platform_ids'] = platform_ids;
          conditionData.value[currencyId.value]['period'] = period;
          const periodName = period == 1 ? 'period_1' : 'period_2';
          conditionData.value[currencyId.value][periodName]['loop'] = loop;
          conditionData.value[currencyId.value][periodName]['type'] = type;
          conditionData.value[currencyId.value][periodName]['extra'] = extra;
        });
      }
    },
    { immediate: true, deep: true },
  );

  // async function valide() {
  //   const tableData = cloneDeep(conditionData.value[currencyId.value]);
  //   return tableData?.bonus_base?.some((item) => !isStrictNumber(item.amt) || item.day?.length < 1);
  // }

  function getData() {
    return cloneDeep(conditionData.value);
  }
  defineExpose({
    // valide, //条件类型
    conditionData, //表格数据
    templateData,
    getData,
  });
</script>

<template>
  <PageWrapper :contentStyle="{ marginLeft: '-25px' }">
    <SignInTable
      ref="dollarConditionRef"
      v-model="tableData"
      :form_data="form_data"
      v-model:currencyId="currencyId"
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
