import { BasicColumn, FormSchema } from '/@/components/Table';
import { useMemberStore } from '/@/store/modules/member';
import { useMemberTypeList, useClientSelect } from '/@/views/common/commonSetting';
import { getkeyValues } from '/@/utils/common';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { Checkbox } from 'ant-design-vue';

import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
const { clientSelect } = useClientSelect();
const { memberTypeList } = useMemberTypeList();
const { t } = useI18n();
// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    slots: { customRender: 'username' },
  },
  {
    title: t('business.common_realiy_name'),
    dataIndex: 'username',
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
      //return setTooltip(getkeyValues(record.level_id));
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
    slots: { customRender: 'Balance' },
  },
  {
    title: t('table.member.member_commission_state'),
    dataIndex: 'MemberCommissionData',
    slots: { customRender: 'MemberCommissionData' },
  },
  {
    title: t('table.member.member_registe_time'),
    dataIndex: 'google_key',
  },
];
useAutoTableLabelWidth(columns);
// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'last_login_device',
    labelPrefix: t('business.common_client'),
    labelPrefixWidth: 60,
    component: 'Select',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    defaultValue: '',
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
    labelPrefixWidth: 66,
    defaultValue: null,
    componentProps: {
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
      placeholder: t('business.common_all'),
    },
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
  },
  {
    field: 'level_id',
    component: 'ApiSelect',
    labelPrefix: t('business.common_member_level'),
    labelPrefixWidth: 72,
    defaultValue: '',
    componentProps: {
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
      placeholder: t('business.common_all'),
    },
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
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
    // colProps: { style: { width: '275px' } },
  },
  {
    field: '',
    labelBorder: false,
    component: 'InputGroup',
    slot: 'custom',
    // colProps: { xxl: 7, xl: 5, lg: 5, md: 5, sm: 7 },
  },
];
