<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="560"
    :title="title"
    @ok="handleSubmit"
    :okText="getTitle"
    :showCancelBtn="false"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './addIpModal.data.ts';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { insertBlackList, updateBlackList } from '/@/api/site';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'AddIpModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;
      const [registerForm, { setFieldsValue, updateSchema, validate, resetFields }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
        size: FORM_SIZE,
      });
      const title = ref('' as string);
      const idEdit = ref('' as any);
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        title.value = data.title;
        idEdit.value = data.id;
        if (data.category == 1) {
          updateSchema({
            field: 'val',
            label: t('table.risk.report_ip_address') + ':', //IP地址
            componentProps: {
              placeholder: t('table.risk.report_ip_address_tip'), //请输入IP地址
            },
          });
        } else if (data.category == 2) {
          updateSchema({
            field: 'val',
            label: t('table.member.member_device_no') + ':', //设备号
            componentProps: {
              placeholder: t('table.member.member_device_no_tip'), //请输入设备号
            },
          });
        } else if (data.category == 3) {
          updateSchema({
            field: 'val',
            label: t('business.common_email_account') + ':', //邮箱账号
            componentProps: {
              placeholder: t('business.common_email_account_tip'), //请输入邮箱账号
            },
          });
        }
        if (data.id) {
          //if (data.val.length < 10) data.val = '-';
          await setFieldsValue({
            id: data.id,
            val: data.val,
            remark: data.remark,
            limit_type: JSON.parse(data.limit_type),
            ipLocation: data.ip_info,
          });
        }
        setFieldsValue({ category: data.category });
        setModalProps({ confirmLoading: false });
      });
      const getTitle = computed(() =>
        !unref(idEdit) ? t('table.system.system_conform_add') : t('business.banner_confrim'),
      ); //新增账号，编辑账号
      async function handleSubmit() {
        try {
          const values = await validate();
          values['cate'] = values.category;
          values['ip_info'] = values.ipLocation;
          values['limit_type'] = JSON.stringify(values.limit_type);
          delete values['ipLocation'];
          delete values['category'];
          setModalProps({ confirmLoading: true });
          values.ipPlaceOfBelonging = '';
          const { status, data } = idEdit.value
            ? await updateBlackList(values)
            : await insertBlackList(values);
          if (status) {
            message.success(data);
            closeModal();
            emit('success');
          } else {
            message.error(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, handleSubmit, title, getTitle };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-col.ant-col-24 .ant-form-item-explain-error) {
    // transform: translateY(-10px);
  }
</style>
