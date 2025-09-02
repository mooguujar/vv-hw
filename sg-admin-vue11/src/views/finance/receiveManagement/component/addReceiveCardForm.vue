<template>
  <BasicModal
    @ok="okFun"
    @cancel="cancelFun"
    :title="modalTitle"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
    @register="registeraddDemond"
    :width="560"
  >
    <BasicForm @register="registeraddDemondForm">
      <template #level_ids="{ model, field }">
        <MemberLevel
          class="w-100%"
          v-if="showMemberLevel"
          :currentMemberLevel="model[field]"
          @set-current-member-level="setCurrentMemberLevel"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts" name="addReceiveCardForm">
  import { reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import MemberLevel from '/@/components/MemberLevel/index.vue';
  import { schemas } from './addReceiveForm.data';
  import { message } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { insertWithdraw, updateWithdraw, GetWithdrawMerchantMist } from '/@/api/finance';
  import { useI18n } from '/@/hooks/web/useI18n';
  import eventBus from '/@/utils/eventBus';

  const { t } = useI18n();
  const emit = defineEmits(['diamondsuccess', 'register']);
  const FORM_SIZE = useFormSetting().getFormSize;
  const rowKey = ref<any>('');
  const modalTitle = ref<any>('');
  const showMemberLevel = ref(false);

  interface Props {
    activeKey: string;
    isToAddDepositCardPage: boolean;
  }
  const props = withDefaults(defineProps<Props>(), {
    activeKey: '',
    isToAddDepositCardPage: false,
  });

  const [
    registeraddDemondForm,
    { setFieldsValue, validate, clearValidate, resetFields, updateSchema },
  ] = useForm({
    // labelAlign: 'right',
    showResetButton: false,
    showSubmitButton: false,
    schemas,
    size: FORM_SIZE,
  });

  const setCurrentMemberLevel = (e) => {
    setFieldsValue({ level_ids: e });
    // clearValidate('level_ids');
  };

  eventBus.on('addReceiveCardForm_clearValidate_', () => {
    // clearValidate('level_ids');
  });

  const [registeraddDemond, { setModalProps, closeModal }] = useModalInner(async (values) => {
    showMemberLevel.value = true;
    rowKey.value = values.id;
    if (values.id) {
      values.level_ids = values.level_ids.map(function (str) {
        return parseFloat(str); // 使用 parseFloat 转换
      });
      if (values.method_name == '-') {
        values.method_id = null;
      }
      await setFieldsValue({ ...values });
      modalTitle.value = t('modalForm.member.member_edit_pay_plant'); //编辑代付平台
    } else {
      resetFields();
      modalTitle.value = t('modalForm.finance.finance_help_platform'); //添加代付平台
      updateSchema({ field: 'company_id', componentProps: { options: [] } });
      updateSchema({ field: 'method_id', componentProps: { options: [] } });
    }
    setModalProps({ confirmLoading: false });

    setTimeout(() => {
      if (props.isToAddDepositCardPage) setFieldsValue({ currency_id: props.activeKey });
    }, 155);
  });

  const cancelFun = () => {
    showMemberLevel.value = false;
  };
  async function okFun() {
    try {
      setModalProps({ confirmLoading: true });
      const value = await validate();
      value.level_ids = value.level_ids.map(String);
      const { status, data } = rowKey.value
        ? await updateWithdraw({ ...value, id: rowKey.value })
        : await insertWithdraw(value);
      if (status) {
        message.success(data);
        let type_id = '';
        GetWithdrawMerchantMist({
          company_id: value.company_id,
          currency_id: value.currency_id,
          page: 1,
          state: 1,
          page_size: 10,
        }).then((data) => {
          // if (!!!data.d) return;
          type_id = data.d ? data.d[0]?.type_id : '';
          emit('diamondsuccess', value.currency_id, type_id);
          showMemberLevel.value = false;
        });
        closeModal();
      } else {
        message.error(data);
      }
    } catch (e) {
      setModalProps({ confirmLoading: false });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
