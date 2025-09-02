<template>
  <div class="set_status_model">
    <BasicModal
      :minHeight="35"
      :title="$t('table.member.member_oprate_tip')"
      @register="registerSetStateModel"
      @ok="submitState"
      :width="560"
      :destroyOnClose="true"
      :okText="$t('common.okText')"
      :cancelText="$t('common.cancelText')"
      :titleIcon="props.titleicon"
    >
      <div>
        <div class="leading-10 model_contain_title">
          <modalContentTitleIcon
            v-if="getTitlePreIcon"
            class="title_pre_icon"
            :icon="getTitlePreIcon"
          />
          {{ getTitle }}
        </div>
      </div>
      <BasicForm :schemas="schemas" @register="registerForm" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { updatestateMember } from '/@/api/member';
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import modalContentTitleIcon from '/@/components-cd/Icon/modalContentTitleIcon/cd-modal-content-title-icon.vue';

  const { t } = useI18n();
  const props = defineProps<{
    titleicon: string;
    operationApi: any;
  }>();
  const emit = defineEmits(['successLoad', 'register']);
  const schemas: FormSchema[] = [
    {
      field: 'state',
      component: 'Input',
      label: '',
      show: false,
    },
    {
      field: 'note',
      component: 'InputTextArea',
      label: t('business.common_remarks_infor') + ':',
      //required: true,
      ifShow: ({ values }) => {
        return String(values.state) === '1';
      },
      colProps: {
        span: 24,
        class: 'set_status_model_textarea',
      },
      rules: [
        {
          required: true,
          message: t('table.member.member_stop_remark'),
        },
      ],
      componentProps: {
        placeholder: t('table.member.member_stop_remark'),
        rows: 8,
        // maxlength: 200,
      },
    },
  ];
  const getTitle = ref('' as any);
  const getTitlePreIcon = ref('' as any);
  const getType = ref(null as any);
  const getRecord = ref(null as any);
  const getHandle = ref('' as string);
  const [registerForm, { validate, resetFields, setFieldsValue }] = useForm({
    schemas,
    showActionButtonGroup: false,
  });
  const [registerSetStateModel, { closeModal }] = useModalInner((data) => {
    getTitle.value = data.title;
    getTitlePreIcon.value = data.titlePreIcon;
    getRecord.value = data.data;
    getType.value = data.type;
    getHandle.value = data.handle;
    setFieldsValue({ state: Number(data.data[data.handle]), note: data.data.note });
  });
  async function submitState() {
    const values = await validate();
    delete values['state'];
    values['uid'] = getRecord.value.uid;
    values['type'] = getType.value;
    values['value'] = String(getRecord.value[getHandle.value]) === '1' ? '2' : '1';
    if (values) {
      const { status, data } = props.operationApi
        ? await props.operationApi(values)
        : await updatestateMember(values);
      if (status) {
        message.success(data);
        closeModal();
        resetFields();
      } else {
        message.error(data);
      }
      emit('successLoad');
    }
  }
</script>
<style lang="less" scoped>
  //::v-deep(.ant-modal-footer) {
  //  border:1px solid red!important;
  //}
  //.ant-modal-content {
  //  border:1px solid red!important;
  //  //.ant-modal-footer {
  //  //  border:1px solid red!important;
  //  //}
  //}
  ::v-deep(.set_status_model_textarea > div > div) {
    width: 100% !important;
    text-align: left !important;

    textarea {
      height: 179.562px !important;
    }
  }

  ::v-deep(.ant-form-item-label) {
    width: auto !important;
  }
</style>
