import { FormSchema } from '/@/components/Table';
import { ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';

const { t } = useI18n();
export const dateGroupButtonList = [
  { label: t('business.common_month'), value: 'month' },
  { label: t('modalForm.common.last_month'), value: 'lastMonth' },
];
export const searchForm: FormSchema[] = [
  {
    field: 'dateGroup',
    component: 'Input',
    label: '',
    slot: 'dateGroup',
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    //colProps: { class: 'ant-col-auto' },
    componentProps: ({ formActionType }) => {
      const dates = ref();
      const value = ref();
      const hackValue = ref();
      return {
        format: 'YYYY-MM-DD',
        disabledDate: (current) => {
          if (!dates.value || (dates.value as any).length === 0) {
            return false;
          }
          const tooLate = dates.value[0] && current.diff(dates.value[0], 'days') > 60;
          const tooEarly = dates.value[1] && dates.value[1].diff(current, 'days') > 60;
          return tooEarly || tooLate;
        },
        onChange: async (val) => {
          value.value = val;
        },
        onOpenChange: (open) => {
          if (open) {
            if (!value.value) {
              value.value = [dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()];
            }
            value.value = formActionType.getFieldsValue().time;
            formActionType.setFieldsValue({ time: [] });
            dates.value = [] as any;
            hackValue.value = [] as any;
          } else {
            formActionType.setFieldsValue({
              time: value.value ? value.value : hackValue.value,
            });
            if (formActionType.submit != undefined) formActionType.submit();
            hackValue.value = undefined;
          }
        },
        onCalendarChange: (val) => {
          dates.value = val;
        },
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'functionButton',
    component: 'Input',
    label: '',
    slot: 'functionButton',
  },
  {
    field: 'iconGroup',
    component: 'Input',
    label: '',
    slot: 'iconGroup',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.iconGroup != 2;
    },
  },
  {
    field: 'titleGroup',
    component: 'Input',
    label: '',
    slot: 'titleGroup',
    colProps: {
      span: 24,
      style: {
        overflowX: 'auto',
        paddingBottom: '6px',
      },
    },
    ifShow: ({ values }) => {
      return values.iconGroup != 2;
    },
  },
];
