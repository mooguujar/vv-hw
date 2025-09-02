import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { h, ref } from 'vue';
import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
import { Client, useActiveMainOptions } from '/@/views/common/commonSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();

const { activityMainMap } = useActiveMainOptions();
const clinetlist = [
  {
    label: 'PC',
    value: '24',
  },
  {
    label: 'H5',
    value: '25',
  },
  {
    label: 'PWA',
    value: '28',
  },
  {
    label: 'IOS',
    value: '27',
  },
  {
    label: 'Android',
    value: '26',
  },
];
export const schemas: FormSchema[] = [
  {
    field: 'state',
    component: 'Select',
    labelPrefixWidth: 40,
    labelPrefix: t('table.system.system_table_header_status'),
    colProps: { xxl: 4, xl: 4, lg: 4, md: 4, sm: 5 },
    defaultValue: '3,5',
    componentProps: () => {
      return {
        dropdownMatchSelectWidth: false,
        allowClear: false,
        options: [
          { label: t('business.common_all'), value: '3,5' },
          { label: t('common.ssd1'), value: 5 },
          { label: t('common.qq1'), value: 3 },
        ],
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'device',
    component: 'Select',
    labelPrefixWidth: 40,
    labelPrefix: t('common.show_terminal'), //展示终端
    colProps: { xxl: 4, xl: 4, lg: 4, md: 4, sm: 5 },
    defaultValue: null,
    componentProps: () => {
      return {
        dropdownMatchSelectWidth: false,
        allowClear: false,
        options: [{ label: t('business.common_all'), value: null }, ...clinetlist],
        getPopupContainer: () => document.body,
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
    title: t('table.discountActivity.task_name'), //分类名称
    dataIndex: 'names',
    minWidth: 100,
    slots: { customRender: 'categoryNames' },
  },

  {
    title: t('table.discountActivity.task_category'), //任务分类
    dataIndex: 'cate_name',
    minWidth: 120,
    slots: { customRender: 'cateName' },
  },
  {
    title: t('table.discountActivity.missain_ty'), //任务类型
    dataIndex: 'ty',
    minWidth: 120,
    slots: { customRender: 'taskType' },
  },
  {
    title: t('common.show_terminal'), //clinetlist
    dataIndex: 'device',
    minWidth: 200,
    customRender: ({ record }) => {
      let list = typeof record.device === 'string' ? JSON.parse(record.device) : [];
      const text =
        (list &&
          list
            .map((id) => {
              return Client[Number(id)];
            })
            .join(',')) ||
        '-';
      if (list.length >= clinetlist.length) {
        return t('common.qbzd1');
      }
      return text;
    },
    // slots: { customRender: 'lang' },
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
    title: t('business.common_type_1'), //稽核
    dataIndex: 'audit_multiple',
    minWidth: 120,
  },
  {
    title: t('table.discountActivity.task_status'), //任务状态
    dataIndex: 'state',
    minWidth: 120,
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
useAutoTableLabelWidth(columns);
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
