import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { navLocation } from '../../../common/const';
import { getExistAccount, getTemplateList } from '/@/api/promotion';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
import { channelProviders } from '@/api/promotion';

const { t } = useI18n();
export let TemplateList = [];
let valuesName = false;
export const accountFormSchema: FormSchema[] = [
  {
    field: 'isEdit',
    component: 'Input',
    show: false,
  },
  {
    field: 'group_idsDisabled',
    component: 'Input',
    show: false,
  },
  {
    field: 'id',
    component: 'Input',
    // labelWidth: 'auto',
    label: t('table.promotion.promotion_tunnel_name') + ':', //渠道名称
    componentProps: {
      placeholder: t('table.report.report_p_enter_channel_name'), //请输入渠道名称
      maxLength: 64,
    },
    show: false,
  },
  {
    field: 'group_id',
    label: t('common.promoters') + ':', //推广商
    component: 'ApiSelect',
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject(
              t('common.chooseText') + t('common.promoters').toLowerCase(),
            );
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      api: async () => {
        const { data } = await channelProviders({ state: 0 });
        return data;
      },
      placeholder: t('common.add_promoters_s'),
      labelField: 'group_name',
      valueField: 'id',
      showSearch: true,
      // allowClear: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().includes(input.toLowerCase());
      },
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: ({ values }) => {
      return values.group_idsDisabled;
    },
  },
  {
    field: 'channel_name',
    // labelWidth: 'auto',
    component: 'Input',
    label: t('table.promotion.promotion_tunnel_name') + ':', //渠道名称
    componentProps: {
      maxLength: 64,
      placeholder: t('common.enter_channel_name'), //请输入渠道名称
    },
    rules: [
      {
        required: true,
        message: t('common.enter_channel_name'),
        trigger: 'blur',
      },
    ],
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    field: 'agent_account',
    component: 'Input',
    // labelWidth: 'auto',
    label: t('table.promotion.promotion_agency_account') + ':', //代理账号
    componentProps: {
      placeholder:
        t('table.promotion.promotion_please_enter') +
        ' ' +
        t('table.promotion.promotion_agency_account').toLowerCase(), //请输入代理账号
    },
    //required: true,
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          return new Promise((resolve, reject) => {
            if (!value) return reject(t('table.member.member_agent_tip1')); //账号不存在
            getExistAccount(value)
              .then(() => {
                resolve();
              })
              .catch(() => {
                return reject(t('table.promotion.promotion_account_not_exite')); //账号不存在
              });
          });
        },
        trigger: 'blur',
      },
    ],
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    field: 'link_type',
    component: 'RadioGroup',
    // labelWidth: 'auto',
    label: t('table.promotion.link_type') + ':', //推广类型
    defaultValue: 2,
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: t('table.promotion.link_type_1'), //渠道链接
          value: 2,
        },
        {
          label: t('table.promotion.link_type_2'), //独立渠道包
          value: 1,
        },
      ],
    },
    required: true,
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    field: 'domain_id',
    label: t('table.promotion.promotion_domain') + ':', //推广域名
    // labelWidth: 'auto',
    component: 'ApiSelect',
    required: false,
    slot: 'domain_id_domain',
    ifShow: ({ values }) => {
      if (values.isEdit) {
        return false;
      } else if (!values.isEdit && values.link_type == 2) {
        return true;
      }
      return false;
    },
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'domain_id',
    label: t('table.promotion.promotion_domain') + ':', //推广域名
    // labelWidth: 'auto',
    component: 'ApiSelect',
    required: true,
    slot: 'domain_id_domain',
    ifShow: ({ values }) => {
      if (values.isEdit) {
        return true;
      } else if (!values.isEdit && values.link_type == 1) {
        return true;
      }
      return false;
    },
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'nav_location',
    component: 'RadioGroup',
    label: t('table.promotion.promotion_jump_position') + ':', //跳转位置
    // labelWidth: 'auto',
    defaultValue: 1,
    colProps: { span: 24 },
    componentProps: {
      options: navLocation,
    },
    required: true,
  },
  {
    field: 'fix_type',
    label: t('table.promotion.fix_type') + ':', //大厅APP展示
    component: 'Select',
    // labelWidth: 'auto',
    defaultValue: 3,
    componentProps: {
      allowClear: false,
      options: [
        { label: t('v.discount.activity.fix_type_3'), value: 3 },
        { label: t('v.discount.activity.fix_type_1_1'), value: 1 },
        // { label: t('v.discount.activity.fix_type_2'), value: 2 },
      ],
      getPopupContainer: () => document.body,
    },
    ifShow: ({ values }) => values.nav_location == 5,
  },
  {
    field: 'fix',
    label: t('table.promotion.fix') + ':', //大厅APP展示
    // labelWidth: 'auto',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('business.common_on'), value: 1 }, //开启
        { label: t('business.common_off'), value: 2 }, //关闭
      ],
    },
    ifShow: ({ values }) => values.nav_location != 5 || values.fix_type == 1,
  },
  {
    field: 'lead_page',
    label: t('table.promotion.lead_page') + ':', //大厅APP展示
    component: 'RadioGroup',
    // labelWidth: 'auto',
    defaultValue: 1,
    componentProps: {
      allowClear: false,
      options: [
        { label: t('v.discount.activity.lead_page_1'), value: 1 },
        { label: t('v.discount.activity.lead_page_2'), value: 2 },
      ],
    },
    ifShow: ({ values }) =>
      (values.nav_location != 5 && values.fix == 1) || (values.fix_type == 1 && values.fix == 1),
  },
  {
    field: 'nav_template',
    label: t('table.promotion.nav_template') + ':', //推广域名
    component: 'ApiSelect',
    // labelWidth: 'auto',
    defaultValue: '',
    componentProps: (e) => {
      return {
        api: async (v) => {
          const { data } = await getTemplateList({});
          TemplateList = data.d;
          return [...[{ name: t('common.random'), id: '' }], ...data.d];
        },
        labelField: 'name',
        valueField: 'id',
        dropdownMatchSelectWidth: true,
        allowClear: false,
        placeholder: t('common.chooseText'), //请选择
        getPopupContainer: () => document.body,
      };
    },
    ifShow: ({ values }) => values.nav_location == 5,
  },
  {
    field: 'down_button',
    component: 'Select',
    // labelWidth: 'auto',
    label: t('modalForm.system.down_button') + ':',
    defaultValue: 1,
    componentProps: {
      allowClear: false,
      placeholder: t('common.chooseText'), //请选择
      options: [
        { label: t('business.common_show'), value: 1 }, //开启
        { label: t('business.common_hidden'), value: 2 }, //关闭
      ],
      getPopupContainer: () => document.body,
    },
    ifShow: ({ values }) => values.nav_location == 5 && values.fix_type != 1,
  },
  {
    field: 'app_open',
    label: t('table.promotion.app_build_chose') + ':', //大厅APP展示
    component: 'RadioGroup',
    // labelWidth: 'auto',
    defaultValue: 2,
    componentProps: {
      allowClear: false,
      options: [
        { label: t('business.his2'), value: 4 }, //系统
        // { label: t('table.promotion.app_build_1_1'), value: 1 }, //开启
        // { label: t('table.promotion.app_build_2_2'), value: 3 }, //关闭
        { label: t('table.promotion.app_build_2_1'), value: 2 }, //关闭
      ],
      onChange: (event) => {
        const value = event?.target?.value || event;
        valuesName = value == 4 ? false : true;
      },
    },
    // ifShow: ({ values }) => values.fix == 1 || values.fix_type == 2 || values.fix_type == 3,
    ifShow: ({ values }) => {
      const { nav_location, fix_type, fix } = values;
      return nav_location == 5 ? fix_type == 3 || (fix_type == 1 && fix == 1) : fix == 1;
    },
  },
  {
    field: 'apk',
    component: 'Input',
    label: t('common.android_address') + ':', //包名
    // labelWidth: 'auto',
    // required: true,
    componentProps: ({ schema, formActionType, formModel }) => {
      return {
        placeholder: t('common.enter_android_address'), //请输入渠道包名
        onBlur: (event) => {
          if (event.target.value && event.target.value.endsWith('.apk')) {
            const fileName = event.target.value.split('/').pop();
            const { setFieldsValue } = formActionType;
            setFieldsValue({ apk_name: fileName });
          }
          // 这里可以处理失去焦点时的逻辑
        },
      };
    },
    rules: [
      {
        validator: (_, value) => {
          if (!valuesName || !value) {
            return Promise.resolve();
          } else if (value && value.endsWith('.apk')) {
            return Promise.resolve();
          } else {
            return Promise.reject(new Error(t('table.promotion.promotion_package_apk_error'))); // "请输入以 .apk 结尾的文件地址"
          }
        },
        trigger: 'blur',
      },
    ],
    ifShow: ({ values }) => {
      const { nav_location, app_open, fix_type, fix } = values;

      return nav_location == 5
        ? (app_open == 2 || app_open == 4) && (fix_type == 3 || (fix_type == 1 && fix == 1))
        : (app_open == 2 || app_open == 4) && fix == 1;
    },
    dynamicDisabled: ({ values }) => {
      return values.app_open == 4 ? true : false;
    },
  },
  {
    field: 'apk_name',
    component: 'Input',
    label: t('common.android_name') + ':', //包名
    // labelWidth: 'auto',
    componentProps: {
      disabled: true,
    },
    // ifShow: ({ values }) => values.app_open == 2 && (values.fix_type == 2 || values.fix_type == 3),
    ifShow: ({ values }) => {
      const { nav_location, app_open, fix_type, fix } = values;
      return nav_location == 5
        ? app_open == 2 && (fix_type == 3 || (fix_type == 1 && fix == 1))
        : app_open == 2 && fix == 1;
    },
  },
  {
    field: 'ios',
    component: 'Input',
    label: t('common.ios_address') + ':', //包名
    // labelWidth: 'auto',
    // required: true,
    componentProps: ({ schema, formActionType, formModel }) => {
      return {
        placeholder: t('common.enter_ios_address'), //请输入渠道包名
        onBlur: (event) => {
          if (event.target.value && event.target.value.endsWith('.plist')) {
            const fileName = event.target.value.split('/').pop();
            const { setFieldsValue } = formActionType;
            setFieldsValue({ ios_name: fileName });
          }
          // 这里可以处理失去焦点时的逻辑
        },
      };
    },
    rules: [
      {
        validator: (_, value) => {
          if (!valuesName || !value) {
            return Promise.resolve();
          } else if (value && value.endsWith('.plist')) {
            return Promise.resolve();
          } else {
            return Promise.reject(new Error(t('common.enter_ios_address_error'))); // "请输入以 .apk 结尾的文件地址"
          }
        },
        trigger: 'blur',
      },
    ],
    ifShow: ({ values }) => {
      const { nav_location, app_open, fix_type, fix } = values;

      return nav_location == 5
        ? (app_open == 2 || app_open == 4) && (fix_type == 3 || (fix_type == 1 && fix == 1))
        : (app_open == 2 || app_open == 4) && fix == 1;
    },
    dynamicDisabled: ({ values }) => {
      return values.app_open == 4 ? true : false;
    },
  },
  {
    field: 'ios_name',
    component: 'Input',
    label: t('common.ios_name') + ':', //包名
    // labelWidth: 'auto',
    componentProps: {
      disabled: true,
    },
    // ifShow: ({ values }) => values.app_open == 2 && (values.fix_type == 2 || values.fix_type == 3),
    ifShow: ({ values }) => {
      const { nav_location, app_open, fix_type, fix } = values;

      return nav_location == 5
        ? app_open == 2 && (fix_type == 3 || (fix_type == 1 && fix == 1))
        : app_open == 2 && fix == 1;
    },
  },
];
export const channelProvidersFormSchema: FormSchema[] = [
  {
    field: 'group_name',
    component: 'Input',
    required: true,
    label: t('common.promoter_name') + ':',
    componentProps: {
      placeholder: t('common.promoter_name_p'),
      maxLength: 64,
    },
  },
];
useAutoLabelWidth(accountFormSchema);
useAutoLabelWidth(channelProvidersFormSchema);
