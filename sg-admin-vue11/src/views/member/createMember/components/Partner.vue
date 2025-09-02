<template>
  <BasicForm @register="registerForm">
    <template #password="{ model, field }">
      <Input v-model:value="passwordvalue" disabled :size="FORM_SIZE">
        <template #suffix>
          <CopyOutlined class="btnClass" @click="handleCopy(passwordvalue)" />
        </template>
      </Input>
    </template>
    <template #details="{ model }">
      <div class="details">
        <table v-if="model['case'] === 0">
          <tr v-for="(item, index) in testTable1" :key="index" :class="{ th: index === 0 }">
            <td>{{ item.index }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.rate }}</td>
          </tr>
        </table>
        <table v-if="model['case'] === 1">
          <tr v-for="(item, index) in testTable2" :key="index" :class="{ th: index === 0 }">
            <td>{{ item.index }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.rate }}</td>
          </tr>
        </table>
        <table v-if="model['case'] === 2">
          <tr v-for="(item, index) in testTable3" :key="index" :class="{ th: index === 0 }">
            <td>{{ item.index }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.rate }}</td>
          </tr>
        </table>
      </div>
    </template>
  </BasicForm>
</template>

<script setup lang="ts">
  import { unref, ref, inject } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { Input } from 'ant-design-vue';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { testTable1, testTable2, testTable3 } from './Partner.data';
  import { generateCustomPassword } from '/@/utils/auth/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { existsMember } from '/@/api/member/index';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const partnerSchemas: FormSchema[] = [
    {
      field: 'username',
      component: 'Input',
      label: t('table.member.member_partner_username') + ':',
      rules: [
        {
          required: true,
          type: 'string',
          trigger: 'blur',
          validator: async (rule, value) => {
            const pattern = /^[a-zA-Z0-9]{6,18}$/;
            if (!value) {
              return Promise.reject(t('table.member.member_parter_tip1'));
            }
            if (!pattern.test(value)) {
              return Promise.reject(t('table.member.member_verify_2'));
            }
            const { status, data } = await existsMember({ username: value });
            if (pattern.test(value) && !status) {
              return Promise.reject(data);
            }
            return Promise.resolve();
          },
        },
        // {
        //   required: true,
        //   type: 'string',
        //   trigger: 'blur',
        //   validator: async (rule, value) => {
        //     const { status, data } = await existsMember({ username: value });
        //     if (!status) {
        //       return Promise.reject(data);
        //     }
        //     return Promise.resolve();
        //   },
        // },
      ],
      componentProps: {
        maxlength: '18',
        placeholder: t('table.member.member_parter_tip2'),
      },
    },
    {
      field: 'realname',
      component: 'Input',
      label: t('business.common_actual_name') + ':',
      componentProps: {
        placeholder: t('table.member.member_name_tip3'),
        maxlength: 20,
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            const reg = /\d/;
            const english = /[a-zA-Z]/;
            const chinese = /[\u4e00-\u9fa5]/;
            if (!value) {
              return Promise.reject(t('table.member.member_name_tip'));
            } else if (reg.test(value)) {
              return Promise.reject(t('table.member.member_name_tip1'));
            } else if (chinese.test(value) && value.length < 2) {
              return Promise.reject(t('table.member.member_name_tip_text'));
            } else if (english.test(value) && value.length <= 2) {
              return Promise.reject(t('table.member.member_name_tip_text'));
            }
            return Promise.resolve();
          },
          trigger: 'change',
        },
      ],
      // rules: [
      //   {
      //     required: true,
      //     validator: async (rule, value) => {
      //       const values = /^[a-zA-Z\u4e00-\u9fa5]{1,20}$/;
      //       if (value) {
      //         if (!values.test(value)) {
      //           return Promise.reject('只能中文或字母且不能超过20个字符');
      //         }
      //       }
      //       return Promise.resolve();
      //     },
      //     trigger: 'change',
      //   },
      // ],
    },
    {
      field: 'source',
      component: 'Input',
      label: t('table.member.member_promotion') + ':',
      componentProps: {
        placeholder: t('table.member.member_promotion_tip'),
        maxlength: 100,
      },
    },
    {
      field: 'password',
      component: 'Input',
      label: t('business.common_password') + ':',
      defaultValue: generateCustomPassword(),
      slot: 'password',
    },
    // {
    //   field: 'agency_rebate_state',
    //   component: 'Select',
    //   label: '返佣状态:',
    //   defaultValue: 2,
    //   componentProps: {
    //     options: [
    //       { value: 1, label: '开启' },
    //       { value: 2, label: '关闭' },
    //     ],
    //     getPopupContainer: () => document.body,
    //   },
    // },
    // {
    //   field: 'case',
    //   component: 'Select',
    //   label: '佣金方案',
    //   defaultValue: 0,
    //   componentProps: {
    //     options: [
    //       { label: '方案一', value: 0 },
    //       { label: '50%', value: 1 },
    //       { label: '60%', value: 2 },
    //     ],
    //   },
    //   ifShow: ({ values }) => {
    //     return values.agency_rebate_state === 0;
    //   },
    // },
    // {
    //   field: 'details',
    //   component: 'Input',
    //   label: '佣金详情',
    //   slot: 'details',
    //   colProps: { class: 'details' },
    //   ifShow: ({ values }) => {
    //     return values.agency_rebate_state === 0;
    //   },
    // },
  ];
  const labelWidth = useAutoLabelWidth(partnerSchemas, {
    other: [{ label: t('table.member.member_agency_type') }],
  });
  const setLabelWidth = inject('setLabelWidth');
  setLabelWidth(labelWidth);
  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const { getFormSize } = useFormSetting();
  const FORM_SIZE = getFormSize;
  const { createMessage } = useMessage();
  const passwordvalue = ref<any>();
  passwordvalue.value = generateCustomPassword();
  const emit = defineEmits(['password']);
  const [registerForm, { validate: values, resetFields: resetFields }] = useForm({
    schemas: partnerSchemas,
    showActionButtonGroup: false,
    labelWidth: 100,
    baseColProps: {
      span: 24,
    },
    size: FORM_SIZE,
  });
  function handleCopy(value) {
    if (!value) {
      createMessage.warning(t('table.promotion.promotion_please_copy_content'));
      return;
    }
    clearClipboard();
    clipboardRef.value = value;
    if (unref(copiedRef)) {
      createMessage.success(t('business.common_copy_suceess'));
    }
  }
  changePassword();
  function changePassword() {
    emit('password', passwordvalue.value);
  }
  const valueData = values;
  defineExpose({ value: valueData, resetFields });
</script>
<style lang="less" scoped>
  .details > table {
    width: 100%;

    //border: 1px solid #eaeaea;
    td {
      text-align: center;
      line-height: 40px;
      border: 1px solid #eaeaea;
    }

    .th {
      background: #f2f2f2;
    }
  }
</style>
