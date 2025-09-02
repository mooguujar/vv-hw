import { FormSchema, BasicColumn } from '/@/components/Table';
import { ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import eventBus from '/@/utils/eventBus';
import { auths } from '/@/utils/authFunction';
import { isControlValueSet } from '/@/utils/domUtils';

const { t } = useI18n();
const beforeTimeChange = ref('');
const isOpen = ref(false);

export const searchSchema: FormSchema[] = [
  {
    field: 'new',
    component: 'Input',
    label: '',
    slot: 'newAdd',
    ifShow: !isControlValueSet(),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: ({ formActionType }) => {
      return {
        format: 'YYYY-MM-DD',
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
        getPopupContainer: () => document.body,
        onFocus: () => {
          if (!isOpen.value) {
            const currentTime = formActionType.getFieldsValue().time || [];
            beforeTimeChange.value = JSON.stringify(currentTime);
            isOpen.value = true;
          }
        },
        onOpenChange: (state) => {
          if (!state) {
            const afterTimeChange = formActionType.getFieldsValue().time || [];
            const isChange =
              beforeTimeChange.value == JSON.stringify(afterTimeChange) ? false : true;
            isOpen.value = false;
            eventBus.emit('onTimeChange', isChange);
          }
        },
        onChange: (v) => {
          if (!v) {
            eventBus.emit('onTimeChange', true);
          }
        },
      };
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'modelNameSlot',
  },
  {
    field: '',
    component: 'Input',
    slot: 'submitSlot',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.google.report_columns_APP_statistical_name'), //统计名称
    dataIndex: 'name',
    minWidth: 120,
  },
  {
    title: t('routes.promotion.statics_code'), //统计编码
    dataIndex: 'code',
    minWidth: 160,
    width: 260,
    ellipsis: true,
    slots: { customRender: 'codeSlots' },
  },
  {
    title: t('table.google.report_columns_APP_domain_name'), //关联域名
    dataIndex: 'total',
    minWidth: 120,
    slots: { customRender: 'domainTotal' },
  },
  {
    title: t('table.google.report_columns_APP_operate'),
    minWidth: 160,
    slots: { customRender: 'action' },
    dataIndex: 'updated_name',
    ifShow: isControlValueSet() ? false : auths(['90233', '90234']),
  },
  {
    title: t('business.common_update_time'),
    minWidth: 200,
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      if (record.updated_at) return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
      else return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.system.operater'),
    dataIndex: 'updated_name',
    minWidth: 120,
  },
];
