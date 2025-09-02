import { FormSchema } from '/@/components/Form';
import { useMemberStore } from '/@/store/modules/member';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs, { Dayjs } from 'dayjs';
import { useTreeListStore } from '/@/store/modules/treeList';
import { useLocale } from '@/locales/useLocale';
import { unref } from 'vue';

const { countryTreeCodeList } = useTreeListStore();
const { t } = useI18n();
const { getLocale } = useLocale();
export const schemas: FormSchema[] = [
  {
    field: 'basic-info',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo',
  },
  {
    field: 'member_type',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    show: false,
  },
  {
    field: 'username',
    component: 'Input',
    dynamicDisabled: true,
    label: t('business.common_member_account') + ':',
    colProps: {
      style: 'width:25%;marginRight: 20px',
    },
    componentProps: {},
  },
  {
    field: 'realname',
    component: 'Input',
    dynamicDisabled: true,
    label: t('business.common_realiy_name') + ':',
    componentProps: {
      maxlength: 20,
    },
    colProps: {
      style: 'width:25%;marginRight: 20px',
    },
  },
  {
    field: 'vip',
    component: 'ApiSelect',
    label: t('business.commin_vip_level') + ':',
    colProps: {
      style: 'width:25%;',
    },
    componentProps: {
      api: async () => {
        const memberStore = useMemberStore();
        const outputArray: { label: string; value: string }[] = [];
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
      allowClear: false,
    },
  },
  {
    field: 'lock_vip',
    label: t('table.member.member_vip_state') + ':',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: t('table.member.member_locked_no'), value: 2 },
        { label: t('table.system.system_locked'), value: 1 },
      ],
    },
    colProps: {
      class: 'compatible-style',
      style: 'width:20%;',
    },
  },
  {
    field: 'parent_name',
    component: 'Input',
    label: t('business.common_super_agent') + ':',
    colProps: {
      style: 'width:25%;marginRight: 20px',
    },
    dynamicDisabled: true,
    required: true,
    componentProps: {
      placeholder: t('business.common_nothing_message'),
      onChange: (e) => {},
    },
    ifShow: ({ values }) => {
      return values.member_type !== '3';
    },
  },
  {
    field: 'birthday',
    label: t('table.member.member_birthday_') + ':',
    component: 'DatePicker',
    colProps: {
      style: 'width:25%;marginRight: 20px',
    },
    componentProps: () => {
      return {
        getPopupContainer: () => document.body,
        style: {
          width: '100%',
        },
        disabledDate: (current: Dayjs) => {
          return current && current > dayjs();
        },
      };
    },
  },
  {
    field: 'countryCode',
    label: `${t('business.common_phone_number')}:`,
    component: 'Select',
    colProps: {
      class: 'countryCode',
    },
    defaultValue: '+1',
    componentProps: () => {
      const arr = countryTreeCodeList.map((item) => {
        return {
          value: item.attr,
          label: item.attr,
        };
      });
      return {
        allowClear: false,
        options: arr,
        getPopupContainer: () => document.body,
        class: 'countryCodeClass',
        style: { width: '100px' },
      };
    },
    ifShow: ({ values }) => {
      return values.member_type === '3';
    },
  },
  {
    field: 'phone',
    component: 'InputNumber',
    label: '',
    defaultValue: '',
    colProps: {
      class: ['zh_CN'].includes(unref(getLocale)) ? 'phoneCol' : 'phoneSty',
    },
    componentProps: {
      class: 'countryCodeInput',
      controls: false,
      stringMode: true,
      maxLength: '11',
      placeholder: t('common.inputText'),
      onChange: (e) => {},
    },
    ifShow: ({ values }) => {
      return values.member_type === '3';
    },
  },
  {
    field: 'level_id',
    component: 'ApiSelect',
    label: t('business.common_member_level') + ':',
    colProps: {
      style: 'width:25%;',
    },
    componentProps: {
      api: async () => {
        const memberStore = useMemberStore();
        const outputArray: { label: string; value: string }[] = [];
        for (const key in memberStore.levelSelect) {
          outputArray.push({ label: memberStore.levelSelect[key], value: key });
        }
        return outputArray;
      },
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
      allowClear: false,
    },
  },
  {
    field: 'level_lock_state',
    component: 'RadioGroup',
    label: t('business.common_hierarchy_status') + ':', //层级状态
    componentProps: {
      options: [
        { label: t('table.member.member_locked_no'), value: 2 },
        { label: t('table.system.system_locked'), value: 1 },
      ],
    },
    colProps: {
      class: 'compatible-style',
      style: 'width:20%;',
    },
  },
  {
    field: 'countryCode',
    label: `${t('business.common_phone_number')}:`,
    component: 'Select',
    colProps: {
      class: 'countryCode',
    },
    defaultValue: '+1',
    componentProps: () => {
      const arr = countryTreeCodeList.map((item) => {
        return {
          value: item.attr,
          label: item.attr,
        };
      });
      return {
        allowClear: false,
        options: arr,
        getPopupContainer: () => document.body,
        class: 'countryCodeClass',
      };
    },
    ifShow: ({ values }) => {
      return values.member_type !== '3';
    },
  },
  {
    field: 'phone',
    component: 'InputNumber',
    label: '',
    defaultValue: '',
    colProps: {
      class: ['zh_CN'].includes(unref(getLocale)) ? 'phoneCol' : 'phoneSty',
    },
    componentProps: {
      class: 'countryCodeInput',
      controls: false,
      stringMode: true,
      maxLength: '11',
      placeholder: t('common.inputText'),
      onChange: (e) => {},
    },
    ifShow: ({ values }) => {
      return values.member_type !== '3';
    },
  },

  {
    field: 'email',
    component: 'Input',
    defaultValue: '',
    label: t('modalForm.member.member_email_adress') + ':',
    colProps: {
      style: 'width:25%;marginRight: 20px',
    },
    componentProps: {
      placeholder: t('business.common_email_account_tip1'),
      onChange: (e) => {},
    },
  },
  {
    field: 'note',
    component: 'Input',
    label: t('modalForm.member.member_username_remark') + ':',
    colProps: {
      style: 'width:25%;',
    },
    componentProps: {
      placeholder: t('business.common_nothing_message_remark'),
      onChange: (e) => {},
    },
  },
];
