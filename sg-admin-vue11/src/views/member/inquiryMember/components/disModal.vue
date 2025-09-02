<template>
  <BasicModal
    @register="registerModal"
    :title="$t('common.friendly_reminder')"
    :cancelText="$t('business.common_cancel')"
    :okText="$t('common.sure')"
    :width="400"
    :canFullscreen="false"
    :minHeight="20"
    @ok="okFunEnable"
  >
    <p class="p-2 text-center">{{ name }}</p>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { bonusEnable, uservEnable } from '/@/api/member';
  // 弹框form配置
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: { BasicForm, BasicModal },
    setup(_, { emit }) {
      const { t } = useI18n();
      const uid = ref<any>('');
      const userid = ref(null as any);
      const state = ref(null as any);
      const statusState = ref(null as any);
      const bonus_state = ref(null as any);
      const stateType = ref(null as any);
      const name = ref<any>();
      const placeholder = ref<any>();
      const modalForm: FormSchema[] = [
        {
          field: 'remarks',
          label: t('business.common_remarks_infor'),
          labelWidth: '68',
          component: 'InputTextArea',
          colProps: { span: 20 },
          rules: [{ required: true }],
          componentProps: {
            style: { height: '120px', width: '250px' },
            placeholder: t('table.member.member_stop_reason'),
          },
          ifShow: () => state.value === 'stop',
        },
      ];
      const [registerForm, { validate, setFieldsValue, resetFields, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: modalForm,
        actionColOptions: {
          span: 14,
        },
        showActionButtonGroup: false,
      });
      //  标记传入的弹框状态
      const [registerModal, { closeModal }] = useModalInner(async (data) => {
        setFieldsValue({ data });
        uid.value = data.data.uid;
        name.value = data.name;
        placeholder.value = data.placeholder;
        userid.value = data.type === 'act' ? data.data.uid : data.data.uid;
        state.value = data.type;
        statusState.value = data.data.state;
        stateType.value = data.stateType;
        bonus_state.value = data.data.bonus_state;
        updateSchema([
          {
            field: 'uid',
            component: 'Input',
            label: 'id',
            show: false,
          },
          {
            field: 'remarks',
            componentProps: {
              placeholder: placeholder.value,
            },
          },
        ]);
      });

      async function okFunEnable() {
        const values = await validate();
        values['uid'] = uid.value;
        values['state'] = statusState.value;
        values['stateType'] = stateType.value;
        // emit('okFun', values);
        if (stateType.value == 'member') {
          //启用/停用的传参
          let params = {
            uids: uid.value,
            state: statusState.value == 1 ? 2 : 1,
            remark: values.remarks,
          };
          const { status, data } = await uservEnable(params);
          status === true && values ? message.success(data) : message.error(data);
          closeModal();
          resetFields();
          emit('enableSuccess');
        } else {
          //返水正常/返水停用的传参
          let params = {
            uid: uid.value,
            bonus_note: values.remarks,
            bonus_state: bonus_state.value == 1 ? 2 : 1,
          };
          const { status, data } = await bonusEnable(params);
          status === true && values ? message.success(data) : message.error(data);
          closeModal();
          resetFields();
          emit('enableSuccess');
        }
      }
      return {
        modalForm,
        registerModal,
        registerForm,
        okFunEnable,
        userid,
        state,
        name,
        uid,
        placeholder,
      };
    },
  });
</script>
