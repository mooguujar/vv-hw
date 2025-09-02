import { FormSchema, BasicColumn } from '/@/components/Table';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { useLinkRecordTypeList } from '../../../common/const';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
import { auths } from '/@/utils/authFunction';
import { isHasAuth } from '/@/utils/authFunction';
import { isControlValueSet } from '/@/utils/domUtils';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { linkRecordTypeList } = useLinkRecordTypeList();
const { t } = useI18n();

export const searchForm: FormSchema[] = [
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'profitListMonitor',
    ifShow: isControlValueSet() ? false : isHasAuth('60510'),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'category',
    component: 'Select',
    labelPrefix: t('table.risk.report_link_type'), //关联类型
    defaultValue: '',
    colProps: { xxl: 7, xl: 6, lg: 6, md: 6, sm: 7 },
    componentProps: {
      placeholder: t('common.chooseText'), //请选择
      options: linkRecordTypeList,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    component: 'Input',
    slot: 'usernameSlot',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.risk.report_link_type'), //关联类型
    dataIndex: 'category',
    customRender: ({ record }: any) => {
      if (!record.category) return '-';
      return linkRecordTypeList.find((item) => item.value == record.category)?.label;
    },
  },
  {
    title: t('table.risk.report_link_info'), //关联信息
    dataIndex: 'content',
  },
  {
    title: t('table.risk.report_link_number'), //关联人数
    dataIndex: 'num',
    slots: { customRender: 'people' },
  },
  {
    title: t('business.common_status'), //状态
    dataIndex: 'limit_type',
    customRender: ({ record }: any) => {
      return h(
        'div',
        { style: 'color:gray' },
        record.limit_type == 3 ? t('table.risk.report_ignored') : '-',
      );
    },
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'agency_commission',
    minWidth: 220,
    slots: { customRender: 'action', style: { textAlign: 'center' } },
    ifShow: isControlValueSet() ? false : auths(['60605', '60602']),
  },
  {
    title: t('table.risk.report_link_time') + '/' + t('table.risk.report_operating_time'), //关联时间/操作时间
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return h(cdBlockTwoline, {
        line1: record.created_at ? toTimezone(record.created_at) : '-',
        line2: record.updated_at ? toTimezone(record.updated_at) : '-',
      });
    },
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'updated_name',
  },
];
useAutoTableLabelWidth(columns);
