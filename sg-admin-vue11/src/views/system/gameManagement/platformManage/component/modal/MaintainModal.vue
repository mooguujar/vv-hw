<template>
  <main>
    <BasicModal
      v-bind="$attrs"
      :centered="true"
      :minHeight="100"
      :title="$t('table.system.system_maintain_setting')"
      :cancelText="$t('business.common_cancel')"
      :okText="$t('business.common_ok')"
      @register="registerModal"
      @ok="handleSubmit"
      :showCancelBtn="false"
      :canFullscreen="false"
    >
      <BasicForm @register="createForm">
        <template #startDate="{ model, field }">
          <a-date-picker
            :size="FORM_SIZE"
            class="w-full"
            :show-time="{ format: 'HH:mm' }"
            v-model:value="model[field]"
            format="YYYY-MM-DD HH:mm"
            :disabledDate="disabledStartDate"
            @change="onStartDateChange"
          />
        </template>
        <template #endDate="{ model, field }">
          <a-date-picker
            :size="FORM_SIZE"
            class="w-full"
            :show-time="{ format: 'HH:mm' }"
            v-model:value="model[field]"
            format="YYYY-MM-DD HH:mm"
            :disabledDate="disabledEndDate"
            @change="onEndDateChange"
          />
        </template>
      </BasicForm>
    </BasicModal>
  </main>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { DatePicker } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemas } from './maintainModal.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updatePlatformMaintained } from '/@/api/sys/index';

  import dayjs from 'dayjs';

  export default defineComponent({
    name: 'MaintainModal',
    components: { BasicModal, BasicForm, [DatePicker.name]: DatePicker },
    emits: ['submit:ok'],
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;

      const [createForm, { validate }] = useForm({
        labelWidth: 100,
        schemas,
        actionColOptions: {
          span: 12,
        },
        showResetButton: false,
        showSubmitButton: false,
        size: FORM_SIZE,
      });

      let record = ref<any>({});

      const [registerModal, { setModalProps }] = useModalInner((data) => {});

      const model = ref<any>({
        maintStart: dayjs().toDate(),
        maintEnd: dayjs().endOf('day').toDate(),
      });

      const disabledStartDate = (date) => {
        if (!model.value.maintEnd || !date) return false;
        return date.valueOf() < dayjs().valueOf();
      };

      const disabledEndDate = (date) => {
        if (!model.value.maintStart || !date) return false;
        return date.valueOf() < model.value.maintStart.valueOf();
      };

      const onStartDateChange = (value) => {
        model.value.maintStart = value.format('YYYY-MM-DD HH:mm');
      };

      const onEndDateChange = (value) => {
        model.value.maintEnd = value.format('YYYY-MM-DD HH:mm');
      };

      async function handleSubmit(): Promise<void> {
        try {
          const values = await validate();
          if (!values) return;
          values.maintStart = dayjs(values.maintStart).format('YYYY-MM-DD HH:mm:ss');
          values.maintEnd = dayjs(values.maintEnd).format('YYYY-MM-DD HH:mm:ss');
          setModalProps({ confirmLoading: true });

          // updatePlatformMaintained();
          emit('submit:ok', { values });
        } catch (e) {
          console.error(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        FORM_SIZE,
        createForm,
        registerModal,
        handleSubmit,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
      };
    },
  });
</script>
