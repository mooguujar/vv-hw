<template>
  <BasicModal
    :title="$t('business.banner_confrim_1')"
    @register="registerUpdate"
    @ok="updateOk"
    :okText="t('business.banner_confrim')"
    :showCancelBtn="false"
    width="700px"
  >
    <BasicForm @register="registerForm" />
    <resultModal @register="registerResult" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { updateBatchMember } from '/@/api/member/index';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import resultModal from './resultModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const emit = defineEmits(['successLoad']);
  const schemas: FormSchema[] = [
    {
      field: 'name',
      label: t('business.accout_1') + ':',
      component: 'InputTextArea',
      componentProps: ({ formModel }) => {
        return {
          placeholder: t('business.accout_2'),
          rows: 4,
          onBlur: () => {
            formModel.name = formModel.name ? processString(formModel.name) : '';
          },
        };
      },
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('business.accout_3'));
            }
            const pattern = /^[a-zA-Z0-9\r\n, ]+$/gm;
            const chinese = /[^\w\s\r\n,]/;
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
    },
    {
      field: 'member',
      label: t('table.member.member_account_state') + ':',
      component: 'RadioGroup',
      defaultValue: 3,
      componentProps: () => {
        return {
          options: [
            {
              label: t('business.common_nochang'),
              value: 3,
            },
            {
              label: t('business.common_normal'),
              value: 1,
            },
            {
              label: t('business.common_deactivate'),
              value: 2,
            },
          ],
        };
      },
      ifShow: isHasAuth('10103'),
    },
    {
      field: 'promo',
      label: t('table.member.member_discount_status') + ':',
      component: 'RadioGroup',
      defaultValue: 3,
      componentProps: () => {
        return {
          options: [
            {
              label: t('business.common_nochang'),
              value: 3,
            },
            {
              label: t('business.common_normal'),
              value: 1,
            },
            {
              label: t('business.common_deactivate'),
              value: 2,
            },
          ],
        };
      },
      ifShow: isHasAuth('10104'),
    },
    {
      field: 'commission',
      label: t('modalForm.member.member_commission_tatus') + ':',
      component: 'RadioGroup',
      defaultValue: 3,
      componentProps: () => {
        return {
          options: [
            {
              label: t('business.common_nochang'),
              value: 3,
            },
            {
              label: t('business.common_normal'),
              value: 1,
            },
            {
              label: t('business.common_deactivate'),
              value: 2,
            },
          ],
        };
      },
      ifShow: isHasAuth('10111'),
    },
    {
      field: 'rebate',
      label: t('table.member.member_rabate_walter') + ':',
      component: 'RadioGroup',
      defaultValue: 3,
      componentProps: () => {
        return {
          options: [
            {
              label: t('business.common_nochang'),
              value: 3,
            },
            {
              label: t('business.common_normal'),
              value: 1,
            },
            {
              label: t('business.common_deactivate'),
              value: 2,
            },
          ],
        };
      },
      ifShow: isHasAuth('10112'),
    },
    {
      field: 'remark',
      label: t('business.common_remarks_infor') + ':',
      required: true,
      component: 'InputTextArea',
      componentProps: {
        placeholder: t('business.common_remarks_reason'),
        rows: 4,
      },
      rules: [
        {
          required: true,
          trigger: 'blur',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('business.common_remarks_reason'));
            }
            return Promise.resolve();
          },
          message: t('table.member.member_stop_remark'),
        },
      ],
    },
  ];
  useAutoLabelWidth(schemas);
  const [registerUpdate, { closeModal }] = useModalInner(() => {
    resetFields();
  });
  const [registerForm, { validate, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    // labelWidth: 200,
    baseColProps: { span: 24 },
  });
  const [registerResult, { openModal }] = useModal();
  //检测重复账号的校验
  function hasDuplicates(queryString) {
    // Split the query string by '&' and ',' to get individual key-value pairs
    const pairs = queryString;

    // Use Set to store unique keys
    const seenKeys = new Set();

    for (const pair of pairs) {
      // Split each key-value pair by '='
      const [key, value] = pair.split('=');

      // Check if the key is already in the Set
      if (seenKeys.has(key)) {
        return true; // Duplicate found
      }

      // Add the key to the Set
      seenKeys.add(key);
    }

    return false; // No duplicates found
  }

  function processString(values) {
    // Split the string into lines, preserving leading and trailing newlines
    let lines = values.split(/\r?\n/);

    // Remove spaces and tabs from each line
    lines = lines.map((line) => line.replace(/[ \t]+/g, ''));

    // Remove empty strings and use a Set to remove duplicate lines
    const uniqueLines = [...new Set(lines.filter((line) => line !== ''))];

    // Join the lines back together with newline characters
    return uniqueLines.join('\n');
  }

  async function updateOk() {
    const values = await validate();
    // const pattern = /^[a-zA-Z0-9\r\n, ]+$/gm;
    // const chinese = /[^\w\s\r\n,]/;
    // if (!pattern.test(values['name']) || chinese.test(values['name'])) {
    //   const val = values.name.split('\n');
    //   const list = val.filter((item) => {
    //     return pattern.test(item) || chinese.test(item);
    //   });
    //   openModal(true, { data: list, type: '1' });
    //   return;
    // }
    const _parmas = {
      name: values['name'].split('\n'),
      uid: [],
      state: {
        promo: values.promo,
        member: values.member,
        rebate: values.rebate,
        commission: values.commission,
      },
      remark: values.remark,
    };

    const { status, data } = await updateBatchMember(_parmas);
    if (status) {
      if (data.flag === 2) {
        openModal(true, { data: data });
      } else {
        closeModal();
        emit('successLoad');
        message.success(data);
      }
      //message.success(data);
    }
    // else {
    //   const val = data.split(',');
    //   openModal(true, { data: val, type: '2' });
    //   message.destroy();
    // }
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-form-item-control-input) {
    margin-top: 5px;
  }
</style>
