<template>
  <div class="limitClass LayoutTable venuesClassZoom" ref="main">
    <BasicModal
      @register="registerLimitModal"
      :title="t('table.system.system_manual_ban')"
      v-bind="$attrs"
      @ok="limitSubmit"
      :width="700"
      :okText="t('business.banner_confrim')"
      cancelText=""
      :getContainer="() => $refs.main"
    >
      <BasicForm @register="registerFromLimit">
        <template #checkSlot="{ model, field }">
          <Col :span="24" style="display: flex">
            <FormItemRest>
              <Checkbox
                :style="{ width: `${['zh_CN'].includes(unref(getLocale)) ? 90 : 110}px` }"
                v-model:checked="state.checkAll"
                :indeterminate="state.indeterminate"
                @change="chooseAllList($event, model, field)"
              >
                {{ t('business.common_select_all') }}
              </Checkbox>
            </FormItemRest>
            <CheckboxGroup
              @change="onChangeCheckBox($event, model, field)"
              v-model:value="state.checkedList"
              :options="checkList"
            />
          </Col>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { CheckboxGroup, Checkbox, FormItemRest, Col, message, Modal } from 'ant-design-vue';
  import { reactive, watch, defineEmits, h, unref } from 'vue';
  import { frobidBatchInsert } from '/@/api/site';
  import { useLocale } from '@/locales/useLocale';

  const { t } = useI18n();
  const state = reactive({
    indeterminate: true,
    checkAll: false,
    checkedList: ['zh_CN'],
  });
  const emit = defineEmits(['activeSuccess']);
  const checkList = [
    {
      label: t('common.common_zh_CN'),
      value: 'zh_CN',
    },
    {
      label: t('common.langEn'),
      value: 'en_US',
    },
    {
      label: t('common.LangVetnam'),
      value: 'vi_VN',
    },
    {
      label: t('common.common_pt_BR'),
      value: 'pt_BR',
    },
    {
      label: t('common.common_th_TH'),
      value: 'th_TH',
    },
    {
      label: t('common.LangIndia'),
      value: 'hi_IN',
    },
  ];
  const { getLocale } = useLocale();
  const schemas: FormSchema[] = [
    {
      field: 'limitList',
      component: 'InputTextArea',
      label: t('table.system.system_banlist') + ':',
      defaultValue: '',
      componentProps: {
        rows: 6,
        autoSize: { minRows: 4, maxRows: 5 },
        placeholder: t('table.system.system_banlist_tips'),
        maxlength: 200,
      },
      rules: [{ required: true, message: t('table.system.system_p_enter_banlist') }],
    },
    {
      field: 'regulation',
      component: 'RadioGroup',
      label: t('table.system.system_ban_lang') + ':', //选择节点
      defaultValue: ['zh_CN'],
      slot: 'checkSlot',
      rules: [
        { required: true, message: t('table.system.system_q_select_ban_lang'), type: 'array' },
      ],
    },
    {
      field: 'del_chat',
      component: 'RadioGroup',
      label: t('table.system.system_his') + ':',
      defaultValue: 2,
      helpMessage: '-',
      helpComponentProps: {
        text: `<div>
                  <span style='color:#FFCB00;'>
                    ${t('table.system.system_his')}：
                  </span>${t('table.system.system_tips')}
                </div>
                `,
        placement: 'right',
        isBefore: true,
      },
      componentProps: ({ formActionType }) => {
        return {
          options: [
            { label: t('table.system.system_no_del'), value: 2 },
            { label: t('table.common.delete'), value: 1 },
          ],
        };
      },
    },
    {
      field: 'remark',
      component: 'InputTextArea',
      label: t('table.system.system_ban_reason') + ':',
      componentProps: {
        rows: 6,
        autoSize: { minRows: 4, maxRows: 5 },
        placeholder: t('table.member.member_stop_remark'),
        maxlength: 200,
      },
    },
  ];
  const [registerLimitModal, { closeModal, setModalProps }] = useModalInner(() => {});

  const [registerFromLimit, { validate, resetFields, setFieldsValue }] = useForm({
    schemas,
    showActionButtonGroup: false,
    labelWidth: 140,
    baseColProps: { span: 24 },
  });

  async function limitSubmit() {
    const userNameList = [];
    const values = await validate();
    if (values.limitList) {
      values.limitList.split('\n').forEach((item) => {
        if (item.trim()) {
          userNameList.push(item);
        }
      });
      values['username'] = userNameList;
    }
    values['tongue'] = JSON.stringify(state.checkedList);

    delete values.limitList;
    delete values.regulation;

    const { status, data } = await frobidBatchInsert(values);
    if (!data) {
      closeModal();
      Modal.destroyAll();
      resetFields();
      message.success(t(`sys.api.operationSuccess`));
      emit('activeSuccess');

      setModalProps({ confirmLoading: false });
    } else {
      const errFromArr = [];
      data.forEach((c) => {
        if (c) {
          var _ob = h('div', {}, c);
          errFromArr.push(_ob);
        }
      });

      const warnText = t('table.system.system_ban_warn_text', { len: data.length });
      const errTextArea = h('div', { class: 'errorTextBox' }, errFromArr);
      const errFrom = h('div', { class: 'errorFormBox' }, [h('div', {}, warnText), errTextArea]);
      Modal.confirm({
        title: t('sys.api.errorTip'),
        content: h('div', { class: 'errModalBox' }, [errFrom]),
        centered: true,
        wrapClassName: 'addMoney',
        icon: '',
        maskClosable: true,
        okButtonProps: { style: { display: 'none' } },
        cancelButtonProps: { style: { display: 'none' } }, // 取消取消按钮的显示
        closable: true,
        afterClose: () => {
          data.value = [];
        },
      });

      setModalProps({ confirmLoading: false });
    }
  }
  function chooseAllList(e, model, field) {
    const format_checkList = checkList.map((item) => item.value);
    Object.assign(state, {
      checkedList: e.target.checked ? format_checkList : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? format_checkList : [];
  }
  function onChangeCheckBox(e, model, field): void {
    model[field] = e;
  }
  watch(
    () => state.checkedList,
    (val) => {
      state.indeterminate = !!val.length && val.length < checkList.length;
      state.checkAll = val.length === checkList.length;
      setFieldsValue({ regulation: state.checkedList });
    },
  );
</script>
<style lang="scss" scoped>
  .limitClass {
    ::v-deep(.ant-form) {
      border-bottom: 1px solid #dce3f1;
    }

    ::v-deep(.ant-form-item-label > label) {
      display: flex;
    }

    ::v-deep(.ant-form-item-no-colon) {
      justify-content: end;
      height: auto !important;
      margin-right: 5px;
      line-height: 32px !important;
    }

    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      padding: 30px 35px 0;
    }

    ::v-deep(.ant-form-item-label) {
    }

    ::v-deep(.ant-modal-footer) {
      padding: 20px 16px;
    }

    ::v-deep(.ant-checkbox-group-item) {
      width: 100px;
      margin-right: 12px;
      margin-bottom: 5px;
      white-space: nowrap;
    }

    ::v-deep(.ant-checkbox-group) {
      width: 380px;
    }
  }
</style>
<style lang="scss">
  .addMoney .moneyLayout .ant-row .rowStyle {
    margin-bottom: 0 !important;
  }

  .addMoney .ant-row .rowStyle .ant-form-item {
    margin-bottom: 20px !important;
  }

  .addMoney .ant-row .ant-col .ant-form-item {
    margin-bottom: 0;
  }

  .addMoney {
    .ant-modal-confirm-title {
      color: white;
      font-weight: bold;
    }
  }

  .errorTextBox {
    display: block;
    height: 100px;
    margin-top: 5px;
    padding: 8px;
    overflow: hidden;
    overflow-y: scroll;
    border: 1px solid #f0f0f0;
  }

  .errModalBox {
    padding: 0 16px 16px;
    color: #333;
  }

  .errorTextBox::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .errorFormBox {
    margin-bottom: 16px;
    color: black !important;
  }
</style>
