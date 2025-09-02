import { BasicColumn, FormSchema } from '/@/components/Table';
import { useMemberStore } from '/@/store/modules/member';
import { stateTypeOptions } from '../common/const';
import { getkeyValues } from '/@/utils/common';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMemberTypeList, useClientSelect } from '../../common/commonSetting';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { auths, isHasAuth } from '/@/utils/authFunction';
import { Checkbox } from 'ant-design-vue';
import { unref, h } from 'vue';
import { useLocale } from '/@/locales/useLocale';

const { clientSelect } = useClientSelect();
const { memberTypeList } = useMemberTypeList();
const { t } = useI18n();
const { getLocale } = useLocale();

// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    slots: { customRender: 'memberId' },
  },
  {
    title: t('business.common_realiy_name'),
    dataIndex: 'names',
    slots: { customRender: 'memberRealname' },
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
    customRender: ({ record }) => {
      return record.parent_name || '-';
    },
  },
  {
    title: t('business.common_account_type'),
    dataIndex: 'member_type',
    customRender: ({ record }: any) => {
      return memberTypeList.find((item) => item.value === record.member_type)?.label;
    },
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level_id',
    customRender: ({ record }) => {
      return getkeyValues(record.level_id);
    },
  },
  {
    title: t('business.commin_vip_level'),
    dataIndex: 'vip',
    customRender: ({ record }: any) => {
      return `VIP${record.vip}`;
    },
  },
  {
    title: t('table.member.member_balance_name'),
    dataIndex: 'MemberBalance',
    sorter: true,
    showSorterTooltip: false,
    slots: { customRender: 'balance' },
  },
  {
    title: t('table.member.member_commission_state'),
    dataIndex: 'MemberCommissionData',
    sorter: true,
    showSorterTooltip: false,
    slots: { customRender: 'MemberCommissionData' },
  },
  {
    title: t('table.member.member_registe_time'),
    dataIndex: 'google_key',
  },
  {
    title: t('business.common_operate'),
    dataIndex: '',
    slots: { customRender: 'action' },
    ifShow: auths(['10103', '10104', '10133', '10112', '10111', '10109']),
  },
];
useAutoTableLabelWidth(columns);
// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'currentType',
    component: 'Input',
    label: '',
    defaultValue: 'username',
    show: false,
    ifShow: false,
  },
  {
    field: 'stateFeild',
    component: 'Select',
    slot: 'stateSelect',
    // colProps: { span: 3 },
    componentProps: {
      allowClear: false,
      options: stateTypeOptions,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'last_login_device',
    labelPrefix: t('business.common_client'),
    // labelPrefixWidth: 150,
    defaultValue: '',
    component: 'Select',
    colProps: { xxl: 3, xl: 3, lg: 3, md: 4, sm: 6 },
    componentProps: {
      placeholder: t('business.common_all'),
      options: clientSelect,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'vip',
    labelPrefix: t('business.commin_vip_level'),
    component: 'ApiSelect',
    defaultValue: '',
    // labelPrefixWidth: 66,
    componentProps: {
      placeholder: t('business.common_all'),
      api: async () => {
        const memberStore = useMemberStore();
        const outputArray: { label: string; value: string }[] = [];
        outputArray.push({ label: t('business.common_all'), value: '' });
        for (const key in memberStore.vipLevelSelect) {
          outputArray.push({
            label: `VIP${memberStore.vipLevelSelect[key]}`,
            value: String(memberStore.vipLevelSelect[key]),
          });
        }
        outputArray.sort((a, b) => {
          // 将 value 转换为数字，并按照数值大小进行排序
          const aValue = parseInt(a.value, 10);
          const bValue = parseInt(b.value, 10);
          return aValue - bValue;
        });
        return outputArray;
      },
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'level_id',
    //defaultValue: '',
    labelPrefix: t('business.common_member_level'),
    labelPrefixWidth: 72,
    component: 'ApiSelect',
    defaultValue: '',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    componentProps: {
      placeholder: t('business.common_all'),
      api: async () => {
        const memberStore = useMemberStore();
        const outputArray: { label: string; value: string }[] = [];
        outputArray.push({ label: t('business.common_all'), value: '' });
        for (const key in memberStore.levelSelect) {
          outputArray.push({ label: memberStore.levelSelect[key], value: key });
        }
        return outputArray;
      },
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'created_at',
    labelPrefix: t('business.time_limite'),
    // labelPrefixWidth: 75,
    component: 'RangePicker',
    // colProps: { class: 'ant-col-auto' },
    colProps: {
      xxl: 6,
      xl: 6,
      lg: 6,
      md: 8,
      sm: 9,
      // style: {
      //   minWidth: '420px',
      // },
    },
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'fuzzy',
    labelBorder: false,
    component: 'Checkbox',
    defaultValue: false,
    render: ({ model, field }) => {
      return h(
        Checkbox,
        {
          style: { lineHeight: '42px' },
          checked: model[field],
          onChange: (e) => {
            model[field] = e.target.checked;
          },
        },
        t('modalForm.member.member_vague'),
      );
    },
    ifShow: ({ values }) => {
      return values.currentType !== 'top_name';
    },
    // colProps: { style: { width: '275px' } },
  },
  {
    field: '',
    labelPrefix: '',
    //labelPrefixWidth: 35,
    labelBorder: false,
    component: 'InputGroup',
    slot: 'custom',
    colProps: { style: { width: '330px' } },
  },
  {
    field: 'search',
    labelPrefix: '',
    //labelPrefixWidth: 35,
    labelBorder: false,
    component: 'InputGroup',
    slot: 'search',
    colProps: {
      style: { minWidth: '70px', marginRight: ['zh_CN'].includes(unref(getLocale)) ? '' : '10px' },
    },
  },
  {
    field: 'importField',
    labelPrefix: '',
    //labelPrefixWidth: 35,
    labelBorder: false,
    component: 'InputGroup',
    slot: 'importField',
    colProps: {
      style: { minWidth: '70px', marginRight: ['zh_CN'].includes(unref(getLocale)) ? '' : '10px' },
    },
    ifShow: isHasAuth('10110'),
  },
  {
    field: 'changeState',
    labelPrefix: '',
    //labelPrefixWidth: 35,
    labelBorder: false,
    component: 'InputGroup',
    slot: 'changeState',
  },
];
