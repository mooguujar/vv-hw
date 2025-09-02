import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
import { useActiveMainOptions } from '/@/views/common/commonSetting';
import { useTaskTypeOptions } from '../../insertmission/index.data';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

const { activityMainMap } = useActiveMainOptions();
const { taskTypeOptions } = useTaskTypeOptions();

export const schemas: FormSchema[] = [
  {
    field: 'created',
    label: '',
    component: 'Input',
    slot: 'created',
  },
  {
    field: 'cate_id',
    component: 'Select',
    labelPrefixWidth: 40,
    labelPrefix: t('table.discountActivity.task_category'), //分类
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    slot: 'cateSlot',
    defaultValue: null,
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'ty',
    component: 'Select',
    labelPrefixWidth: 40,
    labelPrefix: t('table.discountActivity.missain_ty'), //分类
    colProps: { xxl: 4, xl: 4, lg: 4, md: 4, sm: 5 },
    defaultValue: 0,
    componentProps: () => {
      return {
        dropdownMatchSelectWidth: false,
        allowClear: false,
        options: [{ label: t('business.common_all'), value: 0 }, ...taskTypeOptions],
        getPopupContainer: () => document.body,
        onChange: async () => {},
      };
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];

/** 活动管理列表 */
export const columns: BasicColumn[] = [
  {
    title: t('table.discountActivity.missain_ty_1'), //ID
    dataIndex: 'id',
    minWidth: 50,
  },
  {
    title: t('table.discountActivity.task_name'), //分类名称
    dataIndex: 'names',
    minWidth: 100,
    slots: { customRender: 'categoryNames' },
  },
  {
    title: t('table.discountActivity.missain_ty'), //任务类型
    dataIndex: 'ty',
    minWidth: 80,
    slots: { customRender: 'taskType' },
  },
  {
    title: t('table.discountActivity.task_category'), //任务分类
    dataIndex: 'cate_name',
    minWidth: 80,
    slots: { customRender: 'cateName' },
  },
  {
    title: t('common.lang'), //语言
    dataIndex: 'lang',
    minWidth: 80,
    slots: { customRender: 'lang' },
  },
  {
    title: t('business.common_type_1'), //稽核
    dataIndex: 'multiple',
    minWidth: 80,
  },
  {
    title: `${t('business.common_period_start')}\n${t('business.common_period_end')}`, //关联任务
    dataIndex: 'start_at',
    minWidth: 170,
    customRender: ({ record }) => {
      return h(cdBlockTwoline, {
        line1: record.start_at ? toTimezone(record.start_at, 'YYYY-MM-DD HH:mm:ss') : '-',
        line2: record.end_at ? toTimezone(record.end_at, 'YYYY-MM-DD HH:mm:ss') : '-',
      });
    },
  },
  {
    title: t('table.discountActivity.task_status'), //任务状态
    dataIndex: 'state',
    minWidth: 80,
    slots: { customRender: 'activeState' },
  },
  {
    title: t('business.common_operate'),
    dataIndex: '',
    width: 120,
    slots: { customRender: 'action' },
  },
  {
    title: t('table.risk.report_operate_people'),
    dataIndex: 'updated_name',
    minWidth: 100,
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'updated_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];

export function getActiviTy(type: number): string {
  const valuesToRemove = [10001, 10002, 10003];

  // 获取活动选项并处理 type === 2 的情况
  const options: Array<{ label: string; value: number }> =
    type === 2
      ? [
          { label: t('v.discount.activity.type_charge'), value: 8 },
          ...activityMainMap[type].filter((option) => !valuesToRemove.includes(option.value)),
        ]
      : activityMainMap[type];

  // 提取 value 并转换为逗号分隔的字符串
  return options.map(({ value }) => value).join(',');
}
