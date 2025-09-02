<template>
  <BasicModal
    v-bind="$attrs"
    :width="700"
    @register="registerModal"
    title="t('table.system.system_edit_game')"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <!-- <template #upload-img="{ model, field }">
        <Upload_Popover
          name="uploadfile"
          :isShowPopover="false"
          :action="'/game/upload'"
          :url="model[field]"
          :placeholder="'支持格式:.webp .jpeg .jpg .gif .webp'"
        />
      </template> -->
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Upload_Popover } from '/@/components/Upload_Popover';
  import { gameFormSchema } from './gameManage.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updateGame } from '/@/api/sys/index';

  interface Id {
    id: string;
  }

  export default defineComponent({
    name: 'EditGameModal',
    components: { BasicModal, BasicForm, Upload_Popover },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;
      let record = {};

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 22 },
        schemas: gameFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 22,
        },
        size: FORM_SIZE,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        const lang: Array<Id> = JSON.parse(data.record.lang).map((item: Id) => item.id);
        const currency: Array<Id> = JSON.parse(data.record.currency).map((item: Id) => item.id);
        record = data.record;
        setFieldsValue({
          ...data.record,
          lang,
          currency,
        });
      });

      async function handleSubmit() {
        try {
          const values = await validate();

          const currency = JSON.stringify(
            unref(values['currency']).map((item) => {
              return { id: item };
            }),
          );
          const lang = JSON.stringify(
            unref(values['lang']).map((item) => {
              return { id: item };
            }),
          );
          const params = { ...record, ...values, currency, lang };
          setModalProps({ confirmLoading: true });
          const { data, status } = await updateGame(params);
          if (status) {
            message.success(data);
            closeModal();
            emit('success');
          } else {
            message.error(data);
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, handleSubmit };
    },
  });
</script>
