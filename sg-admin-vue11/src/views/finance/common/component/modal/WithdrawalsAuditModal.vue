<template>
  <main>
    <BasicModal
      v-bind="$attrs"
      :centered="true"
      :minHeight="1"
      :title="title"
      :cancelText="t('business.common_cancel')"
      :okText="t('modalForm.finance.common_income.submit')"
      width="800px"
      @register="registerModal"
      @ok="handleSubmit"
      :canFullscreen="false"
    >
      <BasicForm @register="createForm" :baseRowStyle="{ 'justify-content': 'center' }" />
    </BasicModal>
  </main>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { getFormSchema } from './withdrawalsAuditModalData';
  // import { WITHDRAWAL_TYPE } from '../../const';
  import { withdrawalsAuditParams } from '/@/api/model/financeModel';

  import dayjs from 'dayjs';
  import { getWithdrawMerchant } from '/@/api/finance';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  type Recordable<T = any> = Record<string, T>;

  export default defineComponent({
    name: 'WithdrawalsAuditModal',
    components: { BasicModal, BasicForm },
    props: {
      title: {
        type: String,
        default: '取款',
      },
      apiMap: {
        type: Object,
        default: () => {},
      },
    },
    emits: ['reload', 'register'],
    setup(props, context) {
      const FORM_SIZE = useFormSetting().getFormSize;
      const formAuditData = ref<Recordable>({});
      const { createMessage } = useMessage();
      const [createForm, { setFieldsValue, getFieldsValue, updateSchema }] = useForm({
        schemas: getFormSchema(props.apiMap.PAGE_TYPE),
        actionColOptions: {
          span: 12,
        },
        size: FORM_SIZE,
        showResetButton: false,
        showSubmitButton: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(
        async (data: { record: Recordable }) => {
          setModalProps({ confirmLoading: false });

          const order = data.record.order || data.record;
          formAuditData.value = order;
          const created_at = dayjs(order.created_at * 1000).format('YYYY-MM-DD hh:mm');

          if (order.currency_id) {
            getCompanyList(order.currency_id);
          }

          const extend = {
            created_at,
            user_balance: data.record.balance || [],
            user_note: data.record.user_note || '',
          };

          setFieldsValue({
            ...order,
            // withdrawTimesStr: getWithdrawTimesData(data.record.withdrawTimes),
            ...extend,
          });
        },
      );

      async function getCompanyList(id) {
        const companyList = await getWithdrawMerchant({
          withdraw: 2,
          currency_id: id,
          filter: 2,
        });
        const options = companyList.map((el) => ({
          label: el.name,
          value: el.id,
        }));
        options.unshift({ label: t('table.report.report_no_use_payment'), value: '' });
        updateSchema([
          {
            field: 'withdraw_merchant_id',
            defaultValue: '',
            componentProps: {
              options: options,
              getPopupContainer: () => document.body,
            },
          },
        ]);
      }

      async function handleSubmit(): Promise<void> {
        try {
          setModalProps({ confirmLoading: true });
          const { review, remark, withdraw_merchant_id } = getFieldsValue();
          const payload: withdrawalsAuditParams = {
            state: review,
            id: formAuditData.value.id,
          };
          if (review == 1) payload.withdraw_merchant_id = withdraw_merchant_id;
          else payload.remark = remark;

          const { status, data } = await props.apiMap.reviewApi(payload);
          if (status) {
            createMessage.success(data);
            context.emit('reload');
            setModalProps({ confirmLoading: false });
            closeModal();
          } else {
            createMessage.error(data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        createForm,
        registerModal,
        handleSubmit,
        // handleReject,
        t,
      };
    },
  });
</script>
