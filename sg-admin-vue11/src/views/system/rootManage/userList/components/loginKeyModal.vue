<template>
  <div>
    <BasicModal
      :showCancelBtn="false"
      :showOkBtn="false"
      :title="$t('table.system.longin_single')"
      @register="registerLoginKey"
      width="600px"
      class="modal"
    >
      <BasicForm @register="BasicFormRegister" class="registerBasicForm">
        <template #qcodeInput="{ model, field }">
          <div class="flex items-center">
            <Textarea
              disabled
              v-model:value="qrUrl"
              :auto-size="{ minRows: 2, maxRows: 5 }"
              style="width: 380px"
              class="!pr-2 !mr-5px"
            />
            <div class="cursor-pointer mx-10px" v-if="qrUrl">
              <img :src="CopyTwoToneSrc" @click="handleCopy(qrUrl)" alt="" />
            </div>
            <Button @click="refresh" size="large" type="primary">
              <template #icon>
                <img :src="RedoOutlinedSrc" alt="" />
              </template>
            </Button>
          </div>
        </template>
        <template #qcodeGoogle="{ model, field }">
          <div class="flex justify-center p-10px border m-x-auto w-170px mt-5">
            <QrCode :width="150" :value="defaultUrl" />
          </div>
        </template>
        <template #qcodeGoogleText>
          <div class="flex">{{ $t('table.system.longin_desc') }}</div>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { Button, message, Textarea } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { QrCode } from '/@/components/Qrcode';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref, unref } from 'vue';
  import { getUpdateKey } from '/@/api/sys/index';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import CopyTwoToneSrc from '/@/assets/svg/copyKey.svg';
  import RedoOutlinedSrc from '/@/assets/svg/refreshKey.svg';

  const { t } = useI18n();
  const getRecord = ref({} as any);
  const FORM_SIZE = useFormSetting().getFormSize;

  const [registerLoginKey, { closeModal }] = useModalInner((data) => {
    getRecord.value = data.data;
  });

  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const qrUrl = ref(window.otplib.authenticator.generateSecret(40) as any);
  const defaultUrl = ref(window.otplib.authenticator.generateSecret(40) as any);
  const schemas: FormSchema[] = [
    {
      field: 'seamoInput',
      component: 'Input',
      label: t('table.system.longin_single') + ':',
      labelWidth: 'auto',
      slot: 'qcodeInput',
      componentProps: {
        addonAfter: t('common.redo'),
      },
      colProps: {
        span: 20,
      },
    },
    {
      field: 'seamo',
      component: 'Input',
      label: ' ',
      labelWidth: 100,
      slot: 'qcodeGoogle',
      colProps: {
        span: 20,
      },
    },
    {
      field: 'field3',
      component: 'Input',
      label: ' ',
      labelWidth: 50,
      slot: 'qcodeGoogleText',
      colProps: { span: 24 },
    },
  ];
  const [BasicFormRegister, { setFieldsValue }] = useForm({
    schemas: schemas,
    showActionButtonGroup: false,
    size: FORM_SIZE,
    baseColProps: {
      span: 20,
    },
  });

  function createQrUrl(qrUrl) {
    return window.otplib.authenticator.keyuri(
      getRecord.value.username,
      t('table.system.longin_admin'),
      qrUrl,
    );
  }

  async function refresh() {
    qrUrl.value = window.otplib.authenticator.generateSecret(40);
    defaultUrl.value = createQrUrl(qrUrl.value);
    const { data, status } = await getUpdateKey({ uid: getRecord.value.id, val: qrUrl.value });
    if (status) {
      message.success(data);
    }
  }

  function handleCopy(value) {
    if (!value) {
      message.warning(t('business.common_copy_tip'));
      return;
    }
    clearClipboard();
    clipboardRef.value = value;
    if (unref(copiedRef)) {
      message.success(t('business.common_copy_suceess'));
    }
  }
</script>
<style lang="less" scoped>
  .border {
    border: 1px solid #d9d9d9;
  }
  .suffixBox {
    position: absolute;
    right: 0;
  }

  .copy {
    position: absolute;
    top: 10px;
    right: 33px;
    img {
      display: flex;
      justify-content: center;
      margin: 18px auto 0;
    }
  }
  ::v-deep(.ant-form-item-label > .ant-form-item-no-colon) {
    height: 56px !important;
  }
  .refreshClass {
    width: 50px;
    height: 54px;
  }
  ::v-deep(.ant-input[disabled]) {
    background-color: #dce3f1;
    color: #444444;
  }
</style>
