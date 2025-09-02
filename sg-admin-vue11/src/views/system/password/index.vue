<template>
  <PageWrapper :title="t('common.changePSW')">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button :size="FORM_SIZE" class="w-50" @click="resetFields">
          {{ t('common.resetText') }}
        </a-button>
        <a-button :size="FORM_SIZE" class="!ml-4 w-50" type="primary" @click="handleSubmit">
          {{ t('component.app.toSearch') }}
        </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchema } from './pwd.data';
  import { useUserStore } from '/@/store/modules/user';
  import { encryptByMd5 } from '/@/utils/cipher';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, PageWrapper },
    setup() {
      const FORM_SIZE = useFormSetting().getFormSize;

      const [register, { validate, resetFields }] = useForm({
        size: FORM_SIZE,
        baseColProps: { span: 24 },
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });
      const userStore = useUserStore();

      async function handleSubmit() {
        try {
          const values = await validate();
          values.password = encryptByMd5(values.password);
          values.newPassword = encryptByMd5(values.newPassword);

          const { password, newPassword } = values;

          // TODO custom api
          //await updatePassWoed({password, newPassword})
          userStore.logout(true);
        } catch (error) {
          console.error(error);
        }
      }

      return { register, resetFields, handleSubmit, FORM_SIZE, t };
    },
  });
</script>
