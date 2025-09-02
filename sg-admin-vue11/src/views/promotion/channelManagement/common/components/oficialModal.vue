<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    @ok="okFun"
    :title="t('business.official_app')"
    :width="600"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
    :footer="null"
    @visible-change="handleVisibleChange"
  >
    <BasicForm @register="registerForm" :schemas="generateSchemas(schemasData)" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, unref, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { channelUploadOpen } from '/@/api/promotion';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;

  const colSpan = 24;

  export default defineComponent({
    name: 'UpdateModal',
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    emits: ['success', 'register'],
    setup(props, context) {
      const schemasData = ref({});
      const modelRef = ref({});

      const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();

      const { createMessage } = useMessage();

      const [registerForm, { validate }] = useForm({
        showResetButton: false,
        showSubmitButton: false,
        size: FORM_SIZE as any,
      });

      const [register, { setModalProps, closeModal }] = useModalInner(() => {});

      function handleDownload(url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'app.apk'; // 默认文件名为 app.apk
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      function handleCopy(value) {
        clearClipboard();
        clipboardRef.value = value;

        if (unref(copiedRef)) {
          createMessage.success(t('business.common_copy_suceess'));
        }
      }

      function generateSchemas(obj) {
        const { ios, android } = obj || {};
        const newAddresses = {
          apkAddress: android.link.primary || '',
          spareApkAddress: android.link.backup || '',
          ipaAddress: ios.link.primary || '',
          spareIpaAddress: ios.link.backup || '',
        };
        // Define the desired order for the fields
        const fieldOrder = [
          { key: 'apkAddress', label: t('common.android_address') + '：' },
          { key: 'spareApkAddress', label: t('table.system.system_apk_spare') + '：' },
          { key: 'ipaAddress', label: t('common.ios_address') + '：' },
          { key: 'spareIpaAddress', label: t('table.promotion.spareIpaAddress') + '：' },
        ];

        // Filter out fields that don't have values, then generate the schema in the desired order
        const schemas = fieldOrder
          .filter(({ key }) => newAddresses[key]) // Only keep fields that have values
          .map(({ key, label }) => ({
            field: key,
            component: 'Input',
            label: label,
            defaultValue: newAddresses[key],
            colProps: { span: colSpan },
            componentProps: () => ({
              disabled: true, // Disable input
            }),
            renderComponentContent: () => ({
              suffix: () =>
                h('div', { class: 'flex gap-2' }, [
                  h(
                    'span',
                    {
                      style: { color: '#1475e1', cursor: 'pointer' },
                      onClick: () => handleCopy(newAddresses[key]), // Handle copy action
                    },
                    t('common.copy'),
                  ),
                  h(
                    'span',
                    {
                      style: { color: '#1475e1', cursor: 'pointer' },
                      onClick: () => handleDownload(newAddresses[key]), // Handle download action
                    },
                    t('component.upload.download'),
                  ),
                ]),
            }),
          }));
        useAutoLabelWidth(schemas);
        return schemas;
      }

      function onDataReceive(data) {
        schemasData.value = data;
      }

      function handleVisibleChange(v) {
        v && props.userData && onDataReceive(props.userData);
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
          console.error('Error during form submission:', e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        register,
        generateSchemas,
        registerForm,
        model: modelRef,
        schemasData,
        handleVisibleChange,
        okFun,
        t,
      };
    },
  });
</script>
