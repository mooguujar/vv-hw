import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
/** 活动管理列表 */
export const columns: BasicColumn[] = [
  {
    title: t('table.discountActivity.missain_ty_1'), //ID
    dataIndex: 'id',
    minWidth: 50,
  },
  {
    title: t('table.discountActivity.task_name'), //任务名称
    dataIndex: 'names',
    minWidth: 80,
    slots: { customRender: 'categoryNames' },
  },
  {
    title: t('table.discountActivity.missain_ty'), //关联任务
    dataIndex: 'ty',
    minWidth: 80,
    slots: { customRender: 'taskType' },
  },
  {
    title: t('table.discountActivity.task_category'), //关联任务
    dataIndex: 'cate_name',
    minWidth: 80,
    customRender: ({ record }) => {
      if (record.cate_name === '[]') {
        return '-';
      } else {
        return h('div', record.cate_name);
      }
    },
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
];

useAutoTableLabelWidth(columns);
export const schemas: FormSchema[] = [
  {
    field: 'category_name',
    component: 'Input',
    label: t('common.category_name') + ':',

    required: true,
    colProps: {
      span: 23,
    },
    dynamicDisabled: true,
  },
  {
    field: 'category_task',
    component: 'Input',
    label: t('table.discountActivity.task_related_tasks') + ':',

    required: true,
    colProps: {
      span: 23,
    },
    dynamicDisabled: true,
    slot: 'categoryTask',
  },
];
useAutoLabelWidth(schemas);
