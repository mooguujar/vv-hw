<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    @ok="okFun"
    :title="t('modalForm.member.member_authorized_update')"
    :width="600"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
    @visible-change="handleVisibleChange"
  >
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { channelUploadOpen } from '/@/api/promotion';
  import { cloneDeep } from 'lodash-es';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;

  const colSpan = 20;

  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: t('table.promotion.promotion_tunnel_name'), //渠道名称
      componentProps: {
        placeholder: t('table.report.report_p_enter_channel_name'), //请输入渠道名称
        maxLength: 64,
      },
      show: false,
    },
    {
      field: 'app_open',
      label: t('table.promotion.app_build_chose'), //大厅APP展示
      component: 'RadioGroup',
      colProps: { span: colSpan },
      defaultValue: 2,
      componentProps: {
        options: [
          { label: t('table.promotion.app_build_2_1'), value: 2 }, //关闭
        ],
      },
    },
    {
      field: 'apk',
      component: 'Input',
      label: t('common.apkAddress'), //Android地址
      colProps: { span: colSpan },
      componentProps: ({ schema, formActionType, formModel }) => {
        return {
          placeholder: t('common.enter_android_address'), //请输入Android地址
          onBlur: (event) => {
            if (event.target.value) {
              const fileName = event.target.value.split('/').pop();
              const { updateSchema, setFieldsValue } = formActionType;
              setFieldsValue({ apk_name: fileName });
            }
          },
        };
      },
      ifShow: ({ values }) => values.app_open == 2,
    },
    {
      field: 'apk_name',
      component: 'Input',
      label: t('common.android_name'), //包名
      colProps: { span: colSpan },
      componentProps: {
        disabled: true,
      },
      ifShow: ({ values }) => values.app_open == 2,
    },
  ];
  useAutoLabelWidth(schemas);
  export default defineComponent({
    name: 'UpdateModal',
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    emits: ['success', 'register'],
    setup(props, context) {
      const modelRef = ref({});
      const [registerForm, { setFieldsValue, validate }] = useForm({
        showResetButton: false,
        showSubmitButton: false,
        schemas,
        size: FORM_SIZE as any,
      });

      const [register, { setModalProps, closeModal }] = useModalInner((data) => {
        data && onDataReceive(data);
      });

      function onDataReceive(data) {
        let _data = cloneDeep(data);
        if (_data.apk == '打包失败') {
          // todo
          _data.apk = '';
          _data.apk_name = '';
        }
        setFieldsValue({ ..._data });
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      async function okFun() {
        try {
          setModalProps({ confirmLoading: true });
          const value = await validate();
          const { status, data } = await channelUploadOpen(value);
          if (status) {
            message.success(data);
            context.emit('success');
            closeModal();
          } else {
            message.error(data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { register, schemas, registerForm, model: modelRef, handleVisibleChange, okFun, t };
    },
  });
</script>
