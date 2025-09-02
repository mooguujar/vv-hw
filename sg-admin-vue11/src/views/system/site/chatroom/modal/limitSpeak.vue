<template>
  <div class="limitClass venuesClassZoom" ref="main">
    <BasicModal
      @register="registerLimitModal"
      :title="t('table.system.system_ban')"
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
                class="whitespace-nowrap"
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
  import { CheckboxGroup, Checkbox, FormItemRest, Col, message } from 'ant-design-vue';
  import { ref, reactive, watch, defineEmits, unref } from 'vue';
  import { forbidInsert, forbidUpdate } from '/@/api/site';
  import { useLocale } from '@/locales/useLocale';

  const { t } = useI18n();
  const state = reactive({
    indeterminate: true,
    checkAll: false,
    checkedList: [t('common.common_zh_CN')],
  });
  const emit = defineEmits(['activeSuccess']);
  const { getLocale } = useLocale();
  const checkList = [
    t('common.common_zh_CN'),
    t('common.langEn'),
    t('common.LangVetnam'),
    t('common.LangPt'),
    t('common.common_th_TH'),
    t('common.LangIndia'),
  ];
  const record = ref(null);
  const requestType = ref('');
  const langs = {
    英文: 'en_US',
    葡萄牙语: 'pt_BR',
    泰语: 'th_TH',
    越南文: 'vi_VN',
    中文: 'zh_CN',
    印度语: 'hi_IN',
  };
  const langsCn = {
    en_US: t('common.langEn'),
    pt_BR: t('common.LangPt'),
    th_TH: t('common.common_th_TH'),
    vi_VN: t('common.LangVetnam'),
    zh_CN: t('common.common_zh_CN'),
    hi_IN: t('common.LangIndia'),
  };

  const schemas: FormSchema[] = [
    {
      field: 'username',
      component: 'Input',
      label: t('table.discountActivity.discountActivity_member') + ':',
      defaultValue: '',
      componentProps: () => {
        return {
          disabled: true,
        };
      },
    },
    {
      field: 'regulation',
      component: 'CheckboxGroup',
      label: t('table.system.system_ban_lang') + ':', //选择节点
      slot: 'checkSlot',
      defaultValue: [t('common.common_zh_CN')],
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
        autoSize: { minRows: 4 },
        placeholder: t('table.member.member_stop_remark'),
        maxlength: 100,
      },
    },
  ];
  const [registerLimitModal, { closeModal, setModalProps }] = useModalInner((data) => {
    if (data.type === 'limit') {
      record.value = data.record;
      requestType.value = 'limit';
      setFieldsValue({ username: data.record.n });
    } else if (data.type === 'update') {
      record.value = data.record;
      requestType.value = 'update';
      const tongueKey = JSON.parse(data.record.tongue);
      state.checkedList = tongueKey.map((item) => langsCn[item]);
      setFieldsValue({
        username: data.record.username,
        del_chat: data.record.del_chat,
        remark: data.record.remark,
      });
    }
  });

  const [registerFromLimit, { validate, setFieldsValue, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    labelWidth: 120,
    baseColProps: { span: 24 },
  });

  async function limitSubmit() {
    const values = await validate();
    if (requestType.value === 'limit') {
      values['uid'] = record.value.u;
      values['tongue'] = JSON.stringify(state.checkedList.map((item) => langs[item]));
      delete values.regulation;
      const { status } = await forbidInsert(values);
      if (status) {
        closeModal();
        resetFields();
        message.success(t(`sys.api.operationSuccess`));
        emit('activeSuccess');
        setModalProps({ confirmLoading: false });
      } else {
        message.error(t(`sys.api.operationFailed`));
        setModalProps({ confirmLoading: false });
      }
    } else if (requestType.value === 'update') {
      values['uid'] = record.value.uid;
      values['tongue'] = JSON.stringify(state.checkedList.map((item) => langs[item]));
      delete values.regulation;
      delete values.username;
      const { status } = await forbidUpdate(values);
      if (status) {
        closeModal();
        resetFields();
        message.success(t(`sys.api.operationSuccess`));
        emit('activeSuccess');

        setModalProps({ confirmLoading: false });
      } else {
        message.error(t(`sys.api.operationFailed`));
        setModalProps({ confirmLoading: false });
      }
    }
  }
  function chooseAllList(e, model, field) {
    Object.assign(state, {
      checkedList: e.target.checked ? checkList : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? checkList : [];
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
      width: 160px;
      height: auto !important;
      margin-right: 5px;
      line-height: 32px !important;
    }

    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      padding: 30px 35px 0;
    }

    ::v-deep(.ant-form-item-label) {
      width: 140px !important;
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
