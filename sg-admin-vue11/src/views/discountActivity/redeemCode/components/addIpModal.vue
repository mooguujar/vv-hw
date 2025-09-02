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
    <BasicForm @register="registerForm" @field-value-change="fieldChang">
      <!-- 赠送金额 -->
      <template #amount>
        <Input
          allowClear
          :placeholder="$t('modalForm.discountActivity.member_amount_tip')"
          v-model:value="amount"
        />
      </template>
      <!-- 开始时间 -->
      <template #startTime="{ model, field }">
        <DatePicker
          :allowClear="false"
          :disabledDate="disabledStartDate"
          v-model:value="model[field]"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './addIpModal.data.ts';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { Col, DatePicker, FormItem, message, Input, Row } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';
  import { insertExchangeCode } from '@/api/activity';
  import { currentyOptions } from '/@/views/common/commonSetting.js';

  const { t } = useI18n();
  export default defineComponent({
    name: 'AddIpModal',
    components: { DatePicker, FormItem, Input, Col, Row, BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const amount = ref('');
      const expire_at = ref('');
      const FORM_SIZE = useFormSetting().getFormSize;
      const [registerForm, { setFieldsValue, updateSchema, validate, resetFields }] = useForm({
        baseColProps: { span: 24 },
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
        size: FORM_SIZE,
        colon: true,
        schemas: accountFormSchema,
      });
      const title = ref('' as string);
      const idEdit = ref('' as any);
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        title.value = data.title;
        // setFieldsValue({ expire_at: null });
        idEdit.value = data.id;
        setModalProps({ confirmLoading: false });
      });
      const getTitle = computed(() =>
        !unref(idEdit) ? t('table.system.system_conform_add') : t('business.banner_confrim'),
      ); //新增账号，编辑账号
      async function handleSubmit() {
        try {
          const values = await validate();
          values.expire_at = dayjs(values.expire_at).format('YYYY-MM-DD 23:59:59');
          values.count = +values.count;
          values.currency_id = currentyOptions[values.currency_id];
          setModalProps({ confirmLoading: true });
          const { status, data } = await insertExchangeCode(values);
          if (status) {
            message.success(data);
            closeModal();
            emit('success');
            amount.value = '';
          } else {
            message.error(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      const disabledStartDate = (current) => {
        return current && current < dayjs().startOf('day');
      };

      async function fieldChang(k, v) {
        if (k == 'amount') {
          let formatted = v
            .replace(/[^0-9.]/g, '')
            .replace(/^0+(\d)/, '$1')
            .replace(/\.{2,}/g, '.')
            .replace(/^(\d+\.\d{0,2}).*$/, '$1');
          setFieldsValue({ amount: formatted });
        }
      }
      // watch(amount, (newVal, oldValue) => {
      //   if (newVal === '') return;

      // let formatted = newVal
      //   .replace(/[^0-9.]/g, '')
      //   .replace(/^0+(\d)/, '$1')
      //   .replace(/\.{2,}/g, '.')
      //   .replace(/^(\d+\.\d{0,2}).*$/, '$1');

      //   // 防止无限循环赋值
      //   if (formatted !== newVal) {
      //     amount.value = formatted;
      //   }
      // });
      return {
        registerModal,
        registerForm,
        handleSubmit,
        title,
        getTitle,
        amount,
        expire_at,
        disabledStartDate,
        fieldChang,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-select-selection-search-input) {
    height: 40px !important;
  }

  ::v-deep(.ant-input-affix-wrapper) {
    height: 40px !important;
  }

  ::v-deep(.ant-picker) {
    width: 100% !important;
    height: 40px !important;
  }
</style>
