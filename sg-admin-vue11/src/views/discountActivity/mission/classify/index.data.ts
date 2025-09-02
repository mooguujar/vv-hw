import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import Icon from '/@/components/Icon';
import { auths, isHasAuth } from '/@/utils/authFunction';
import { isControlValueSet } from '/@/utils/domUtils';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: '',
    label: '',
    component: 'Input',
    slot: 'created',
    ifShow: !isControlValueSet(),
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];

/** 任务分类管理列表 */
export const columns: BasicColumn[] = [
  {
    title: t('business.common_sort'), //排序
    dataIndex: 'id',
    width: 60,
    customRender: () => {
      return h(Icon, { icon: 'ri:drag-move-2-line' });
    },
    ifShow: isControlValueSet() ? false : isHasAuth('41009'),
  },
  {
    title: t('common.category_name'), //分类名称
    dataIndex: 'category_name',
    minWidth: 100,
    slots: { customRender: 'categoryNames' },
  },
  {
    title: t('table.discountActivity.task_related_tasks'), //关联任务
    dataIndex: 'related_count',
    slots: { customRender: 'relatedCount' },
    minWidth: 100,
    ifShow: isControlValueSet() ? true : auths(['41007']),
  },
  {
    title: t('business.common_operate'),
    dataIndex: '',
    minWidth: 160,
    slots: { customRender: 'action' },
    ifShow: isControlValueSet() ? false : auths(['41003', '41006']),
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
useAutoTableLabelWidth(columns);
