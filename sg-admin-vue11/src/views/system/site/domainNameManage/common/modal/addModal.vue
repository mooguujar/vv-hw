<template>
  <div class="main venuesClassZoom" ref="main">
    <BasicModal
      @register="registerAddModal"
      :destroyOnClose="true"
      :title="$t('table.system.system_insert_demain')"
      @ok="insertSubmit"
      :width="560"
      :okText="$t('table.system.system_conform_add')"
      cancelText=""
      :getContainer="() => $refs.main"
    >
      <BasicForm @register="registerFromInster" @field-value-change="fieldChang" />

      <div class="">
        <Alert
          :message="$t('modalForm.system.system_add_domain_notice_tip')"
          type="warning"
          banner
        />
        <div class="p-2 mt-2 bg" v-if="showText">
          <h3>{{ $t('modalForm.system.system_add_domain_cost_title_tip') }}</h3>
          <p>{{ $t('modalForm.system.system_add_domain_cost_tip_1') }}</p>
          <p>{{ $t('modalForm.system.system_add_domain_cost_tip_2') }}</p>
          <p>{{ $t('modalForm.system.system_add_domain_cost_tip_3') }}</p>
        </div>
      </div>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { insertDomainName } from '/@/api/domain';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { message, Alert, Modal } from 'ant-design-vue';
  import eventBus from '/@/utils/eventBus';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { domainode } from '../const';
  import { ref, h } from 'vue';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const customInput = ref(true);
  const showText = ref(true);
  const errorMsg = ref('');

  const schemas: FormSchema[] = [
    {
      field: 'cdn_name',
      component: 'RadioGroup',
      label: t('table.system.system_select_node') + '：', //选择节点
      defaultValue: 'cloudflare',
      required: true,
      componentProps: ({ formActionType }) => {
        return {
          options: domainode,
          onChange: (e) => {
            if (e.target.value === 'custom') {
              customInput.value = false;
            } else {
              customInput.value = true;
            }
          },
        };
      },
    },
    {
      field: 'choice',
      component: 'RadioGroup',
      label: t('table.system.system_certificate_selection') + '：', //证书选择
      required: true,
      defaultValue: '0',
      ifShow: () => customInput.value,
      componentProps: {
        options: [
          {
            label: t('modalForm.system.system_add_domain_free_certificate_tip'), //系统免费证书（推荐)
            value: '0',
          },
        ],
      },
    },
    {
      field: 'customInput',
      component: 'Input',
      label: t('table.system.system_cdnname') + '：', //证书选择
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('modalForm.system.system_p_enter_cdnname'));
            } else if (value.length > 64) {
              return Promise.reject(t('modalForm.system.system_cdnname_tips'));
            }
            return Promise.resolve();
          },
          trigger: 'change',
        },
      ],
      ifShow: () => !customInput.value,
      componentProps: () => {
        return {
          placeholder: t('modalForm.system.system_p_enter_cdnname'),
        };
      },
    },
    {
      field: 'name',
      component: 'InputTextArea',
      label: t('table.system.system_domain_main') + '：', //主域名
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            errorMsg.value = '';

            if (!value) {
              return Promise.reject(t('table.system.system_p_enter_primary_cdnname'));
            }
            //校验每行小数点的，产品要求去掉，先注视
            const valueList = value.trim().split('\n');

            for (const item of valueList) {
              if (item.split('.').length < 2) {
                return Promise.reject(t('table.system.system_incorrect_format'));
              }
            }
            const allowedCharsRegex = /^(?=.*\.)[^\s]+$/;
            if (!allowedCharsRegex.test(value.split('\n').join(''))) {
              return Promise.reject(t('table.system.system_incorrect_format'));
            }
            return Promise.resolve();
          },
        },
      ],
      //colProps: { span: 10 },
      componentProps: ({ formModel }) => {
        return {
          rows: 8,
          placeholder: t('modalForm.system.system_add_domain_more_add_tip'), //支持批量添加，最多20个，多个域名，请换行
          onBlur: () => {
            if (formModel.name) {
              formModel.name = processString(formModel.name);
            }
          },
        };
      },
    },
    {
      field: 'remark',
      component: 'InputTextArea',
      label: t('table.system.system_domain_name_remarks') + '：', //主域名
      componentProps: ({ formModel }) => {
        return {
          rows: 8,
          maxLength: 200,
          placeholder: t('table.system.system_p_enter_incorrect_format'),
          autosize: { minRows: 4, maxRows: 5 },
        };
      },
    },
  ];
  useAutoLabelWidth(schemas);
  const [registerAddModal, { closeModal, setModalProps }] = useModalInner(() => {
    resetFields();
  });
  const [registerFromInster, { validate, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    labelWidth: 100,
    baseColProps: { span: 24 },
  });
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
  async function insertSubmit() {
    const values = await validate();
    if (!customInput.value) {
      values['cdn_type'] = 2;
      values.cdn_name = values.customInput;
      values.name = values.name?.split('\n')?.join(',');
      delete values['customInput'];
    } else {
      values['cdn_type'] = 1;
      values.name = values.name?.split('\n')?.join(',');
    }
    delete values['choice'];
    setModalProps({ confirmLoading: true });
    const { status, data } = await insertDomainName(values);
    if (status) {
      closeModal();
      resetFields();
      errorMsg.value = '';
      message.success(data);
      setModalProps({ confirmLoading: false });
      customInput.value = true;
      eventBus.emit('emitLoad');
    } else {
      if (Array.isArray(data)) {
        message.destroy();
        errorModal(data);
        errorMsg.value = data.join('；');

        setModalProps({ confirmLoading: false });
      } else {
        setModalProps({ confirmLoading: false });
      }
    }
  }

  function fieldChang(k, v) {
    if (k == 'cdn_name') {
      if (v == 'custom') showText.value = false;
      else showText.value = true;
    }
  }
  function errorModal(data) {
    const errFromArr = [];
    data.forEach((c) => {
      if (c) {
        var _ob = h('div', {}, c);
        errFromArr.push(_ob);
      }
    });

    const warnText = t('table.system.system_domain_name_warn_text', { len: data.length });
    const errTextArea = h('div', { class: 'errorTextBox' }, errFromArr);
    const errFrom = h('div', { class: 'errorFormBox' }, [h('div', {}, warnText), errTextArea]);
    Modal.confirm({
      title: t('sys.api.errorTip'),
      content: h('div', { class: 'errModalBox' }, [errFrom]),
      centered: true,
      wrapClassName: 'domain',
      icon: '',
      maskClosable: true,
      okButtonProps: { style: { display: 'none' } },
      cancelButtonProps: { style: { display: 'none' } }, // 取消取消按钮的显示
      closable: true,
      afterClose: () => {
        data.value = [];
      },
    });
  }
</script>
<style scoped lang="scss">
  ::v-deep(.ant-form-item-control) {
    justify-content: center;
  }

  .bg {
    background-color: #e9e9e9;
  }
</style>
<style lang="scss">
  .domain .ant-modal-confirm .ant-modal-body {
    padding: 0 !important;
  }

  .domain .ant-modal-confirm-body .ant-modal-confirm-content {
    margin: 0;
    padding: 0;
  }

  .domain .ant-modal-confirm-title {
    margin-bottom: 20px;
    padding: 16px 16px 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 4px 4px 0 0;
    background-color: #1475e1 !important;
    color: white;
    font-size: 16px;
    line-height: 24px;

    .addmoneyText {
      margin-right: 5px;
      padding: 7px 15px;
      border-radius: 50px;
      background-color: #1475e1;
      color: #fff !important;
      text-align: center !important;
    }

    .primary-color {
      //color: @primary-color;
      background-color: #fff;
      color: #1475e1 !important;
    }
  }

  .domain .header {
    height: 30px;
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
</style>
