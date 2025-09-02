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
        <LangRadioGroup
          :contentList="contentList"
          @click:radio="handleClickContent"
          :istop="true"
          :key="componentKey"
        />
      </template>
      <template #contentEditor>
        <Tinymce
          :showImageUpload="false"
          v-model="currentLang.transitionValue"
          @change="handleTinymceChange"
          @blur="handleTinymceBlur"
        />
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
  import { uploadCategoryBrand } from '/@/api/sys';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Tinymce } from '/@/components/Tinymce/index';
  import translateContentList from '/@/views/system/informationCenter/common/language';
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
  const emit = defineEmits(['update:ok']);
  const modalTitle = ref<any>('');
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

  const contentList = ref<Array<LangItem>>([...extraList, ...langList]);
  const tinymceIsChange = ref(false);
  const componentKey = ref(0);
  const currentLangIndex = ref(0); // 当前语言公告内容下标
  const currentLang = ref(contentList.value[0]); // 当前语言公告内容

  const [registerEditor, { setFieldsValue, validate, resetFields }] = useForm({
    showActionButtonGroup: false,
    schemas: [
      {
        label: t('common.content'),
        field: 'id',
        component: 'Input',
        colProps: { span: 24 },
        labelWidth: 180,
        show: false,
      },
      {
        field: 'languageSwitcher',
        component: 'Input',
        label: t('common.content'),
        slot: 'languageSwitcher',
      },
      {
        field: 'contentEditor',
        component: 'Input',
        slot: 'contentEditor',
      },
    ],
  });

  const [registerEditorModal, { closeModal }] = useModalInner(async (data) => {
    const { name, content } = data;
    setFieldsValue({ ...data });
    modalTitle.value = name;
    contentList.value.forEach((item) => {
      item.transitionValue = content[item.value];
    });
    handleClickContent(0);
    componentKey.value++;
  });

  const handleClickContent = (index) => {
    tinymceIsChange.value = false;
    currentLangIndex.value = index;
    currentLang.value = contentList.value[currentLangIndex.value];
  };

  function handleTinymceChange(value) {
    tinymceIsChange.value = true;
    contentList.value[currentLangIndex.value].transitionValue = value;
  }

  function handleTinymceBlur() {
    if (tinymceIsChange.value) {
      translateContentList(
        contentList.value,
        currentLang.value.transitionValue,
        currentLangIndex.value,
      );
    }
  }

  async function submitFunc(): Promise<void> {
    try {
      const values = await validate();
      const content = {};
      contentList.value.forEach((el) => {
        content[el.value] = el.transitionValue || '';
      });
      const payload = {
        id: values.id,
        content: content,
      };
      const { status, data } = await uploadCategoryBrand({ ...payload });
      if (status) {
        createMessage.success(data);
        closeModal();
        emit('update:ok');
      } else {
        createMessage.error(data);
      }
    } catch (e) {
      console.error(e);
    }
  }
</script>
