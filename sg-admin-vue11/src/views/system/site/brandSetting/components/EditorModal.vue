<template>
  <BasicModal
    :title="modalTitle"
    :width="800"
    :okText="t('common.confirmSave')"
    @register="registerEditorModal"
    :cancelText="t('business.common_cancel')"
    @ok="submitFunc"
  >
    <BasicForm @register="registerEditor">
      <template #languageSwitcher>
        <LangRadioGroup :contentList="contentList" @click:radio="handlelanguageLevel" />
      </template>
      <template #contentEditor>
        <Tinymce />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import LangRadioGroup from '/@/views/system/informationCenter/common/components/LangRadioGroup.vue';
  import { useLocalList } from '@/settings/localeSetting';
  import { inserStationInfo } from '/@/api/sys';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Tinymce } from '/@/components/Tinymce/index';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const localeList = useLocalList();
  interface LangItem {
    label: string; // 多语言描述
    value: string | number; // 多语言key
    transitionValue: string; // 多语言文本
    image_url: string; // 多语言图片地址
    language: string; // 多语言类型
    file?: FileReader; // file文件
  }
  const emit = defineEmits(['success']);
  const modalTitle = ref<any>(t('table.system.system_send_message'));
  const { createMessage } = useMessage();
  const extraList = [
    {
      label: t('business.common_original'),
      value: 'zh-CN',
      transitionValue: '',
      image_url: '',
      language: 'zh-CN',
    },
  ];

  const langList = localeList.map((item) => {
    return {
      label: item.text,
      value: item.event,
      transitionValue: '',
      image_url: '',
      language: item.language || '',
    };
  });

  const currentlanguageIndex = ref(0); // 当前
  const contentList = ref<Array<LangItem>>([...extraList, ...langList]);
  const modelType = ref('FrontPage' as string);

  const [registerEditor, { setFieldsValue, validate, resetFields }] = useForm({
    showActionButtonGroup: false,
    labelWidth: '120px',
    schemas: [
      {
        field: 'languageSwitcher',
        component: 'Input',
        label: t('common.content'),
        slot: 'languageSwitcher',
        rules: [{ required: true }],
      },
      {
        field: 'contentEditor',
        component: 'Input',
        slot: 'contentEditor',
      },
    ],
  });

  const [registerEditorModal, { closeModal }] = useModalInner(async (data) => {
    if (data.type == 'content') {
      modalTitle.value = t('table.system.system_message_send_detail');
      let copyValue = JSON.parse(JSON.stringify(data));
      const content = JSON.parse(copyValue.content);
      contentList.value.forEach((el) => {
        el.transitionValue = content[el.value];
      });
      copyValue.contentEdit = contentList.value[0].transitionValue;
      await setFieldsValue({ ...copyValue });
    } else {
      resetFields();
    }
    modelType.value = data.type;
  });

  const handlelanguageLevel = (value, el) => {
    currentlanguageIndex.value = value;
    setFieldsValue({
      contentEdit: el.transitionValue || null,
    });
  };

  async function submitFunc(): Promise<void> {
    try {
      const values = await validate();
      const content = {};
      contentList.value.forEach((el) => {
        content[el.value] = el.transitionValue || '';
      });
      if (values.flag_val) {
        values.flag_val =
          values.flags === 3
            ? JSON.stringify(values.flag_val)
            : JSON.stringify(values.flag_val.split(','));
      }
      const payload = {
        ...values,
        content: JSON.stringify(content),
      };
      delete payload.contentEdit;
      const { status, data } = await inserStationInfo({ ...payload });
      if (status) {
        createMessage.success(data);
        closeModal();
        emit('success');
      } else {
        createMessage.error(data);
      }
    } catch (e) {
      console.error(e);
    }
  }
</script>
