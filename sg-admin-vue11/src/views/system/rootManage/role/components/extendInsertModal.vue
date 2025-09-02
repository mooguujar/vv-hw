<template>
  <div>
    <BasicModal
      :title="getTitle"
      :showCancelBtn="false"
      @register="registerModal"
      :okText="setButton"
      @ok="handleSubmit"
    >
      <BasicForm :size="FORM_SIZE" @register="registerForm" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { insertGroup, updateGroup } from '/@/api/sys/rootManage';
  import { defineEmits, ref, computed, unref } from 'vue';
  import { schemas } from '../../role/index.data';
  import { useI18n } from '@/hooks/web/useI18n';

  const FORM_SIZE = useFormSetting().getFormSize;

  // 定义可以发射的事件
  const emit = defineEmits(['success']);
  const isUpdate = ref(true);
  const selfGid = ref('');
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    isUpdate.value = !!data?.isUpdate;
    selfGid.value = data?.record?.gid || '';
    if (isUpdate.value) {
      // 设置表单值
      setFieldsValue({
        superiorName: data.superiorName, // 填充 superiorName 字段
        pid: data.gid, // 使用 gid 值填充 pid 字段
        roleName: data.record?.name,
        roleNoted: data.record?.noted,
      });
    } else {
      setFieldsValue({ superiorName: data.superiorName, pid: data.gid });
    }
  });

  const { t } = useI18n();
  const getTitle = computed(() =>
    !unref(isUpdate) ? t('modalForm.system.add_role') : t('table.system.system_edit_role'),
  );
  const setButton = computed(() =>
    !unref(isUpdate) ? t('table.system.system_conform_add') : t('business.banner_confrim'),
  );
  async function handleSubmit() {
    try {
      const values = await validate();

      if (isUpdate.value) {
        // 編輯
        await updateGroup({
          gid: selfGid.value, // 自己那行的gid
          name: values.roleName,
          noted: values.roleNoted,
        });
      } else {
        // 外層pid帶'0'
        const insertResult = await insertGroup({
          pid: values.pid, // 使用表单中的 pid 值
          name: values.roleName,
          noted: values.roleNoted,
        });
      }

      setModalProps({ confirmLoading: true });
      // TODO custom api
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
