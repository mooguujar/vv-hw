<template>
  <div class="advertiseNewAddClass venuesClassZoom" ref="main">
    <BasicModal
      @register="registerNewAddModal"
      :title="titleName"
      v-bind="$attrs"
      :width="600"
      :okText="submitName"
      cancelText=""
      :destroyOnClose="isDestroy"
      :getContainer="() => $refs.main"
      @ok="handleSubmit"
    >
      <BasicForm @register="registerNewAdd" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref, defineEmits, h, nextTick } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { postAdGroupInsert, postAdGroupUpdate } from '/@/api/promotion';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const emits = defineEmits(['activeSuccess']);
  const titleName = ref(t('table.advertise.modal_new_increase_advertise_grouping'));
  const submitName = ref(t('table.promotion.promotion_confirm_add'));
  const isDestroy = ref(false);
  const modalType = ref(1);
  const recordId = ref(0);
  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: t('table.advertise.table_grouping_name') + ':',
      defaultValue: '',
      rules: [
        {
          required: true,
          validator: (_, value) => {
            const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;

            if (!value) {
              return Promise.reject(t('table.advertise.table_grouping_p_1'));
            }
            if (!regex.test(value)) {
              return Promise.reject(t('table.advertise.table_grouping_p_2'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
      componentProps: {
        size: 'large',
        placeholder: t('table.advertise.table_grouping_p_3'),
        maxlength: 30,
      },
    },
    {
      field: 'account',
      component: 'Input',
      label: t('table.advertise.table_contact_account') + ':',
      defaultValue: '',
      rules: [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('table.advertise.table_grouping_p_4'));
            }
            const regex = /\s/;
            if (regex.test(value)) {
              return Promise.reject(t('table.system.system_incorrect_format'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
      componentProps: {
        placeholder: t('table.advertise.table_grouping_p_5'),
        size: 'large',
      },
    },
    {
      field: 'sum_status',
      component: 'RadioGroup',
      label: t('table.advertise.table_look_total') + ':',
      defaultValue: 'no',
      componentProps: {
        options: [
          { label: t('business.common_no'), value: 'no' },
          { label: t('business.common_yes'), value: 'yes' },
        ],
        style: { marginTop: '10px' },
      },
      helpMessage: '-',
      helpComponentProps: {
        text: `<span><div>${t('common.define_no')}</div><div>${t('common.no_means')}</div><div>${t(
          'common.yes_means',
        )}</div></span>`,
        placement: 'right',
        isBefore: true,
      },
    },
  ];
  useAutoLabelWidth(schemas);
  const [registerNewAddModal, { closeModal }] = useModalInner(async (data) => {
    if (data.id) {
      modalType.value = 2;
      titleName.value = t('table.advertise.table_grouping_name_1');
      submitName.value = t('business.banner_confrim');
      isDestroy.value = true;
      recordId.value = data.id;
      setFieldsValue({ name: data.name, account: data.account, sum_status: data.sum_status });
    }
    if (!data.id) {
      titleName.value = t('table.advertise.table_grouping_name_2');
      submitName.value = t('table.promotion.promotion_confirm_add');
      modalType.value = 1;
      isDestroy.value = false;
    }
  });

  const [registerNewAdd, { validate, setFieldsValue }] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  async function handleSubmit() {
    const values = await validate();

    const { data, status } =
      modalType.value == 1
        ? await postAdGroupInsert(values)
        : await postAdGroupUpdate({ ...values, ...{ id: recordId.value } });
    if (status) {
      isDestroy.value = true;
      await closeModal();
      emits('activeSuccess');

      if (data) {
        nextTick(() => {
          const warnText = t('table.advertise.table_grouping_name_3');
          const errTextArea = h('div', { class: 'errorTextBox' }, data);
          const errFrom = h('div', { class: 'errorFormBox' }, [
            h('div', {}, warnText),
            errTextArea,
          ]);
          Modal.confirm({
            title: t('sys.api.errorTip'),
            content: h('div', { class: 'errModalBox' }, [errFrom]),
            centered: true,
            wrapClassName: 'adGrouping__class',
            icon: '',
            maskClosable: true,
            okButtonProps: { style: { display: 'none' } },
            cancelButtonProps: { style: { display: 'none' } }, // 取消取消按钮的显示
            closable: true,
            afterClose: async () => {},
          });
        });
      } else {
        message.success(t(`sys.api.operationSuccess`));
      }
    } else {
      message.error(data);
    }
  }
</script>
<style lang="scss" scoped>
  .advertiseNewAddClass {
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
      line-height: 40px !important;
    }

    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      max-height: 734px;
      padding: 30px 35px 0;
    }

    ::v-deep(.ant-modal-footer) {
      padding: 0 16px 20px;
    }

    ::v-deep(.ant-checkbox-group-item) {
      width: 72px;
      margin-right: 12px;
      margin-bottom: 5px;
      white-space: nowrap;
    }

    ::v-deep(.ant-checkbox-group) {
      width: 290px;
    }

    .ant-upload-select-picture-card i {
      color: #999;
      font-size: 32px;
    }

    .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }

    .appIconClass {
      width: 120px;
      height: 120px;
      overflow: hidden;

      ::v-deep(.ant-upload.ant-upload-select-picture-card) {
        width: 120px !important;
        height: 120px !important;
      }

      ::v-deep(.ant-upload-list-picture-card-container) {
        width: 120px !important;
        height: 120px !important;
      }
    }

    .appNoticeClass {
      ::v-deep(.ant-upload.ant-upload-select-picture-card) {
        width: 126px !important;
        height: 224px !important;
      }

      ::v-deep(.ant-upload-list-picture-card-container) {
        width: 126px !important;
        height: 224px !important;
      }

      ::v-deep(.uploadMain .ant-upload-list-item-thumbnail img) {
        width: 126px !important;
        object-fit: cover;
      }
    }
  }
</style>
<style lang="scss">
  .adGrouping__class {
    .ant-modal-confirm-body-wrapper {
      height: 240px;
    }

    .ant-modal-confirm-title {
      padding: 16px 16px 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      background-color: #1475e1;
      color: white;
      font-size: 16px;
      line-height: 24px;
    }

    .ant-modal-confirm .ant-modal-body {
      padding: 0 !important;
    }

    .errorTextBox {
      display: block;
      height: 130px;
      margin-top: 5px;
      padding: 8px;
      padding-right: 0;
      overflow: hidden;
      overflow-y: scroll;
      border: 1px solid #f0f0f0;
    }

    .errModalBox {
      padding: 0 16px;
      color: #333;
    }

    .errorTextBox::-webkit-scrollbar-track {
      background-color: transparent;
    }

    .errorFormBox {
      margin-bottom: 16px;
      color: black !important;
    }
  }
</style>
