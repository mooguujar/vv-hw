<script lang="ts" setup>
  import { computed, reactive, ref, watch, defineEmits, withDefaults, defineProps } from 'vue';
  import type { Ref, UnwrapRef } from 'vue';
  import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
  import { Table, Input, Select, InputNumber } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  interface Props {
    modelValue: DataItem[];
    conditionType: ConditionType;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [
      {
        key: '1',
        index: '1',
        type: '1',
        chipsRange: { min: '', max: '' },
        miniDeposit: '',
        chipsMultiple: '',
        dollarPercent: '',
      },
    ],
    conditionType: '1',
  });

  interface DataItem {
    key: string;
    index: string;
    /** 条件类型 */
    type: ConditionType;
    /** 要求范围 */
    chipsRange: { min: string; max: string };
    /** 最低存款 */
    miniDeposit: string;
    /** 打码倍数 */
    chipsMultiple: string;
    /** 红包占比 */
    dollarPercent: string;
  }

  const emit = defineEmits(['update:modelValue', 'update:conditionType']);

  type ConditionType = '1' | '2' | '3' | '4' | '5' | '6';

  const conditionOptions = reactive<{ label: string; value: ConditionType; columns: string[] }[]>([
    {
      label: t('v.discount.activity.red_lop_1'),
      value: '1',
      columns: [
        'index',
        'type',
        'chipsRange',
        'miniDeposit',
        // 'chipsMultiple',
        'dollarPercent',
        'operation',
      ],
    },
    {
      label: t('v.discount.activity.red_lop_2'),
      value: '2',
      columns: ['index', 'type', 'chipsRange', 'chipsMultiple', 'dollarPercent', 'operation'],
    },
    {
      label: t('v.discount.activity.red_lop_3'),
      value: '3',
      columns: ['index', 'type', 'chipsRange', 'dollarPercent', 'operation'],
    },
    {
      label: t('v.discount.activity.red_lop_4'),
      value: '4',
      columns: ['index', 'type', 'chipsRange', 'miniDeposit', 'dollarPercent', 'operation'],
    },
    // {
    //   label: '按现金输',
    //   value: '5',
    //   columns: ['index', 'type', 'chipsRange', 'chipsMultiple', 'dollarPercent', 'operation'],
    // },
    // {
    //   label: '按现金赢',
    //   value: '6',
    //   columns: [
    //     'index',
    //     'type',
    //     'chipsRange',
    //     'miniDeposit',
    //     'chipsMultiple',
    //     'dollarPercent',
    //     'operation',
    //   ],
    // },
  ]);
  const curConditionOption = computed(
    () => conditionOptions.filter((c) => c.value === props.conditionType)[0],
  );
  const columns = computed(() =>
    [
      {
        title: t('business.common_hb'),
        dataIndex: 'index',
        width: '8%',
        align: 'center',
      },
      {
        title: t('common.translate.word27'),
        dataIndex: 'type',
        align: 'center',
      },
      {
        title: t('common.translate.word28'),
        dataIndex: 'chipsRange',
        align: 'center',
        width: 300,
      },
      {
        title: t('modalForm.finance.finance_min_deposit'),
        dataIndex: 'miniDeposit',
        align: 'center',
      },
      {
        title: t('business.common_member_Coding_multiple'),
        dataIndex: 'chipsMultiple',
        align: 'center',
      },
      {
        title: t('common.translate.word29'),
        dataIndex: 'dollarPercent',
        align: 'center',
      },
      {
        title: ' ',
        dataIndex: 'operation',
      },
    ].filter((c) => curConditionOption.value.columns.indexOf(c.dataIndex) !== -1),
  );
  const dataSource: Ref<DataItem[]> = ref(
    props.modelValue.map((item, idx) => ({ ...item, key: idx + 1, index: idx + 1 })),
  );
  const count = computed(() => dataSource.value.length + 1);
  const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

  const edit = (key: string) => {
    editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
  };
  const save = (key: string) => {
    Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key]);
    delete editableData[key];
  };

  const onDelete = (key: string) => {
    dataSource.value = dataSource.value.filter((item) => item.key !== key);
  };
  const handleAdd = () => {
    const newData: DataItem = {
      key: `${count.value}`,
      index: `${count.value}`,
      type: props.conditionType,
      chipsRange: { min: '', max: '' },
      miniDeposit: '',
      chipsMultiple: '',
      dollarPercent: '',
    };
    dataSource.value.push(newData);
  };

  function conditionTypeChange(v) {
    dataSource.value[0].type = v;
    dataSource.value = [dataSource.value[0]];
    emit('update:conditionType', v);
  }

  watch(
    dataSource,
    (val) => {
      emit('update:modelValue', val);
    },
    { deep: true },
  );
</script>

<template>
  <div>
    <Table bordered :data-source="dataSource" :columns="columns" size="small" :pagination="false">
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'index'">
          <div>{{ index + 1 }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'type'">
          <div v-if="index === 0">
            <Select
              :value="conditionType"
              :options="conditionOptions"
              size="large"
              @change="conditionTypeChange"
            />
          </div>
          <div class="pl-1" v-else>
            {{ curConditionOption.label }}
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'chipsRange'">
          <div class="chips-range">
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              v-model:value="record.chipsRange.min"
              :placeholder="
                conditionType == '1'
                  ? t('table.system.system_min_m')
                  : conditionType == '2'
                  ? t('modalForm.finance.finance_min_deposit')
                  : conditionType == '3' || conditionType == '5'
                  ? t('common.translate.word30')
                  : t('common.translate.word31')
              "
            />
            <div>~</div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              v-model:value="record.chipsRange.max"
              :placeholder="
                conditionType == '1'
                  ? t('common.translate.word32')
                  : conditionType == '2'
                  ? t('modalForm.finance.finance_max_deposit')
                  : conditionType == '3' || conditionType == '5'
                  ? t('common.translate.word33')
                  : t('common.translate.word34')
              "
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'miniDeposit'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              v-model:value="record.miniDeposit"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'chipsMultiple'">
          <div>
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              v-model:value="record.chipsMultiple"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'dollarPercent'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :min="0"
              :max="100"
              :stringMode="true"
              v-model:value="record.dollarPercent"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a v-if="index > 0" @click="onDelete(record.key)"><img :src="RECT_DELETE" /></a>
          <a v-else @click="handleAdd"><img :src="RECT_ADD" /></a>
        </template>
      </template>
    </Table>
  </div>
</template>

<style lang="less" scoped>
  .chips-range {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 7px;
  }
</style>
