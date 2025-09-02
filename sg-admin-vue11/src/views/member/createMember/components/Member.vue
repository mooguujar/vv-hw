<template>
  <BasicForm @register="registerForm">
    <template #password>
      <Input v-model:value="passwordvalue" disabled :size="FORM_SIZE">
        <template #suffix>
          <CopyOutlined class="btnClass" @click="handleCopy(passwordvalue)" />
        </template>
      </Input>
    </template>
    <template #localSearch="{ model, field }">
      <Select
        show-search
        v-model:value="model[field]"
        :placeholder="t('table.member.member_verify_3')"
        :fieldNames="{ label: 'username', value: 'uid' }"
        :options="datalist"
        :not-found-content="fetching ? undefined : null"
        @search="handleSearch"
        :size="FORM_SIZE"
        allowClear
      >
        <template v-if="fetching" #notFoundContent>
          <Spin size="small" />
        </template>
      </Select>
    </template>
  </BasicForm>
</template>

<script setup lang="ts">
  import { unref, ref, inject } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { Input, Select, Spin } from 'ant-design-vue';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  //import { memberSchemas } from './Member.data';
  import { getByMemberId } from '/@/api/member/index';
  import { generateCustomPassword } from '/@/utils/auth/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const memberSchemas: FormSchema[] = [
    {
      field: 'parent_name',
      component: 'Input',
      label: t('business.common_super_agent') + ':',
      //slot: 'localSearch',
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('table.member.member_verify_1'));
            }
            const pattern = /^[a-zA-Z0-9]{3,14}$/;
            const { data, status } = await existsMember({ agent_username: value });
            if (!status) {
              return Promise.reject(data);
            }
            if (!pattern.test(value)) {
              return Promise.reject(t('table.member.member_verify_2'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
      componentProps: {
        placeholder: t('table.member.member_verify_3'),
      },
    },
    {
      field: 'username',
      component: 'Input',
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            const pattern = /^[a-zA-Z0-9]{3,14}$/;
            if (!value) {
              return Promise.reject(t('table.member.member_username_tip2'));
            }
            const { data, status } = await existsMember({ username: value });
            if (!status) {
              return Promise.reject(data);
            }
            if (!pattern.test(value)) {
              return Promise.reject(t('table.member.member_verify_2'));
            }
            return Promise.resolve();
          },
        },
      ],
      label: t('business.common_member_account') + ':',
      componentProps: {
        placeholder: t('table.member.member_username_tip2'),
      },
    },
    {
      field: 'realname',
      component: 'Input',
      label: t('business.common_realiy_name') + ':',
      componentProps: {
        placeholder: t('table.member.member_name_tip'),
        // maxlength: 20,
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('table.member.member_name_tip'));
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
      field: 'password',
      component: 'Input',
      label: t('business.common_password'),
      dynamicDisabled: true,
      //defaultValue: generateCustomPassword(),
      slot: 'password',
    },
  ];
  const labelWidth = useAutoLabelWidth(memberSchemas, {
    other: [{ label: t('table.member.member_agency_type') }],
  });
  const setLabelWidth = inject('setLabelWidth');
  setLabelWidth(labelWidth);
  const datalist = ref([] as any);
  const { getFormSize } = useFormSetting();
  const FORM_SIZE = getFormSize;
  const { createMessage } = useMessage();
  const passwordvalue = ref<any>();
  passwordvalue.value = generateCustomPassword();
  const emit = defineEmits(['password']);
  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  // 加载状态
  const fetching = ref(false as boolean);
  const [registerForm, { validate: values, resetFields: resetFields }] = useForm({
    schemas: memberSchemas,
    showActionButtonGroup: false,
    // labelWidth: 100,
    baseColProps: {
      span: 24,
    },
    size: FORM_SIZE,
  });
  //handleSearch();
  async function handleSearch(value?: any) {
    fetching.value = true;
    datalist.value = [];
    const { data } = await getByMemberId({ word: value });
    datalist.value = data;
    fetching.value = false;
  }

  function handleCopy(value) {
    if (!value) {
      createMessage.warning(t('business.common_copy_tip'));
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
