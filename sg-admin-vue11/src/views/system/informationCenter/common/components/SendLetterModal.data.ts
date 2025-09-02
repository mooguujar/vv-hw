import translateContentList from '/@/views/common/language';
import { useMemberStore } from '/@/store/modules/member';
import { useMemberOptions } from '/@/views/common/commonSetting';
import { commaSeparatedString } from '/@/utils/regexp';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { memberOptions } = useMemberOptions();
const { t } = useI18n();
const memberStore = useMemberStore();
memberStore.getLevelList();
memberStore.getVipLevelList();
export function marqueeFormData(contentList, currentlanguageIndex, modelType, textValue) {
  if (modelType === 'FrontPage') {
    const marqueeForm1 = [
      {
        field: 'flags',
        label: t('table.system.system_send_crowd') + ':', //发送人群
        defaultValue: 1,
        component: 'RadioGroup',
        colProps: { span: 24 },
        componentProps: {
          options: memberOptions,
        },
      },
      {
        field: 'agents',
        component: 'Input',
        label: memberOptions[5].label + ':',
        required: true,
        colProps: { span: 24 },
        componentProps: {
          placeholder: t('table.system.separated_agents'), //多个代理用“,”隔开
        },
        rules: [
          {
            required: true,
            validator: (rule, value) => {
              if (!value) {
                return Promise.reject(t('common.pleaseEnterN', [memberOptions[5].label]));
              }

              if (!commaSeparatedString.test(value.split(' ').join(''))) {
                return Promise.reject(t('common.enterMutiTips'));
              }

              return Promise.resolve();
            },
            trigger: 'blur',
          },
        ],
        ifShow: ({ values }) => values.flags === 5,
      },
      {
        field: 'usernames',
        component: 'Input',
        label: memberOptions[1].label + ':',
        required: true,
        colProps: { span: 24 },
        componentProps: {
          placeholder: t('table.system.separate_member'),
        },
        rules: [
          {
            required: true,
            validator: (rule, value) => {
              if (!value) {
                return Promise.reject(t('common.pleaseEnterN', [memberOptions[1].label]));
              }

              if (!commaSeparatedString.test(value.split(' ').join(''))) {
                return Promise.reject(t('common.enterMutiMemberTips'));
              }

              return Promise.resolve();
            },
            trigger: 'blur',
          },
        ],
        ifShow: ({ values }) => values.flags === 2,
      },
      {
        field: 'user_levels',
        component: 'ApiSelect',
        label: memberOptions[2].label + ':',
        rules: [
          {
            type: 'array',
          },
          {
            required: true,
            validator: async (rule, value) => {
              if (!Array.isArray(value)) return;
              if (value.length > 0) {
                return Promise.resolve();
              } else {
                return Promise.reject(t('common.pleaseSelectN', [memberOptions[2].label]));
              }
            },
            trigger: 'blur',
          },
        ],
        componentProps: {
          placeholder: t('common.pleaseSelectN', [memberOptions[2].label]),
          api: async () => {
            const outputArray: { label: string; value: string }[] = [];
            // outputArray.push({ label: '全部', value: '' });
            for (const key in memberStore.levelSelect) {
              outputArray.push({ label: memberStore.levelSelect[key], value: key });
            }
            return outputArray;
          },
          mode: 'multiple',
          labelField: 'label',
          valueField: 'value',
          getPopupContainer: () => document.body,
        },
        colProps: { span: 24 },
        ifShow: ({ values }) => values.flags === 3,
      },
      {
        field: 'vip_levels',
        label: memberOptions[3].label + ':',
        component: 'ApiSelect',
        rules: [
          {
            type: 'array',
          },
          {
            required: true,
            validator: async (rule, value) => {
              if (!Array.isArray(value)) return;
              if (value.length > 0) {
                return Promise.resolve();
              } else {
                return Promise.reject(t('common.pleaseSelectN', [memberOptions[3].label]));
              }
            },
            trigger: 'blur',
          },
        ],
        componentProps: {
          placeholder: t('common.pleaseSelectN', [memberOptions[3].label]),
          api: async () => {
            // const memberStore = useMemberStore();
            const outputArray: { label: string; value: string }[] = [];
            // outputArray.push({ label: '全部', value: '' });
            for (const key in memberStore.vipLevelSelect) {
              outputArray.push({ label: `VIP${key}`, value: key });
            }
            return outputArray;
          },
          mode: 'multiple',
          labelField: 'label',
          valueField: 'value',
          getPopupContainer: () => document.body,
        },
        colProps: { span: 24 },
        ifShow: ({ values }) => values.flags === 4,
      },
      {
        field: 'title',
        component: 'Input',
        label: t('table.system.system_notice_title') + ':', //消息标题
        slot: 'titleTextSlot',
        colProps: {
          span: 24,
        },
        dynamicRules: ({ values }) => {
          return [
            {
              required: true,
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                }
                return Promise.resolve();
              },
            },
          ];
        },
      },
      {
        field: 'content',
        component: 'CheckboxGroup',
        label: t('table.system.system_message_content') + ':', //消息内容
        required: true,
        colProps: {
          span: 24,
        },
        slot: 'content',
        dynamicRules: ({ values }) => {
          return [
            {
              required: true,
              validator: (_, value) => {
                return Promise.resolve();
              },
            },
          ];
        },
      },
      {
        field: 'contentEdit',
        component: 'InputTextArea',
        label: ' ',
        colProps: { span: 24 },
        componentProps: ({ formActionType, formModel }) => {
          return {
            autoSize: { minRows: 8, maxRows: 12 },
            placeholder: t('common.inputText'), //请输入
            onChange: async (value) => {
              if (value?.target?.value === undefined) {
              } else {
                textValue = value?.target?.value;
                contentList[currentlanguageIndex].transitionValue = textValue;
              }
            },
          };
        },
        dynamicRules: ({ values }) => {
          return [
            {
              required: false,
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(t('table.system.system_input_tip')); //请输入消息内容
                }
                return Promise.resolve();
              },
            },
          ];
        },
      },
    ];
    useAutoLabelWidth(marqueeForm1);
    return marqueeForm1;
  } else {
    const marqueeForm2 = [
      {
        field: 'title',
        component: 'Input',
        label: t('table.system.system_notice_title') + ':', //消息标题
        //required: true,
        slot: 'titleTextSlot',
        rules: [
          {
            required: true,
            validator: (rule, value) => {
              return Promise.resolve();
            },
          },
        ],
        componentProps: {
          allowClear: false,
          disabled: true,
          placeholder: t('modalForm.system.system_input_title_tip'),
        },
        colProps: {
          span: 24,
        },
      },
      {
        field: 'content',
        component: 'CheckboxGroup',
        label: t('table.system.system_message_content') + ':', //消息内容
        required: true,
        colProps: {
          span: 24,
        },
        slot: 'content',
        dynamicRules: ({ values }) => {
          return [
            {
              required: true,
              validator: (_, value) => {
                return Promise.resolve();
              },
            },
          ];
        },
      },
      {
        field: 'contentEdit',
        component: 'InputTextArea',
        //required: true,
        label: '',
        //labelWidth: 50,
        colProps: { span: 24 },
        componentProps: ({ formActionType, formModel }) => {
          return {
            autoSize: { minRows: 8, maxRows: 12 },
            placeholder: t('common.inputText'), //请输入
            allowClear: false,
            disabled: true,
            onBlur: async (value) => {
              translateContentList(
                contentList,
                formModel.contentEdit,
                currentlanguageIndex,
                'transitionValue',
              );
            },
          };
        },
        dynamicRules: ({ values }) => {
          return [
            {
              //required: true,
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(t('table.system.system_input_tip')); //请输入消息内容
                }
                return Promise.resolve();
              },
            },
          ];
        },
      },
    ];
    useAutoLabelWidth(marqueeForm2);
    return marqueeForm2;
  }
}
