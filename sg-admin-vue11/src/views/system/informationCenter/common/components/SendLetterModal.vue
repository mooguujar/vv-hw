<template>
  <BasicModal
    :title="modalTitle"
    :width="['zh_CN'].includes(unref(getLocale)) ? 820 : 1000"
    :okText="$t('common.confirmSave')"
    @register="registerSendLetterModal"
    :cancelText="$t('common.cancelText')"
    @ok="submitFunc"
    :showCancelBtn="modelType === 'FrontPage'"
    :showOkBtn="false"
    :destroyOnClose="true"
  >
    <BasicForm
      @register="registerSports"
      :schemas="marqueeFormData(contentList, currentLangIndex, modelType)"
    >
      <template #titleTextSlot>
        <FormItemRest>
          <div class="flex">
            <Input
              v-model:value="currentLang.transitionValueTitle"
              :placeholder="t('modalForm.system.system_input_title_tip')"
              @blur="handleBtnTextBlur"
              :disabled="modelType!=='FrontPage'"
              size="large"
            />
            <Button
              size="large"
              :disabled="modelType!=='FrontPage'"
              class="m-l-5"
              @click="moreLangurageModal"
              type="primary"
            >
              {{ t('v.discount.activity.more_language') }}
            </Button>
          </div>
        </FormItemRest>
      </template>
      <template #content>
        <LangRadioGroup
          :showTranslation="modelType === 'FrontPage'"
          :contentList="contentList"
          @click:radio="handlelanguageLevel"
          @click:translation="handleClickTranslation"
        />
      </template>
    </BasicForm>
    <template #appendFooter>
      <Button
        type="primary"
        :disabled="submiting"
        v-if="!submiting && modelType === 'FrontPage'"
        @click="submitFunc()"
        class="!mr-2"
        >{{ $t('common.confirmSave') }}
      </Button>
    </template>
    <buttonTextModal @register="textModal" @emits-values="emitsValues" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { marqueeFormData } from './SendLetterModal.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import LangRadioGroup from '../../common/components/LangRadioGroup.vue';
  import { useLocalList } from '/@/settings/localeSetting';
  import { inserStationInfo } from '/@/api/sys';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { transform } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { FormItemRest, Input, Button, message } from 'ant-design-vue';
  import translateContentList from '/@/views/common/language-a';
  import buttonTextModal from '/@/components/buttonTextModal/buttonTextModal.vue';
  import { useLocale } from '@/locales/useLocale';

  const localeList = useLocalList();
  const { t } = useI18n();
  interface LangItem {
    label: string; // 多语言描述
    value: string | number; // 多语言key
    transitionValue: string; // 多语言文本
    image_url: string; // 多语言图片地址
    language: string; // 多语言类型
    file?: FileReader; // file文件
    transitionValueTitle: String;
  }
  const emit = defineEmits(['success']);
  const modalTitle = ref<any>(t('table.system.system_send_message')); //发送站内信
  const { createMessage } = useMessage();
  const FORM_SIZE = useFormSetting().getFormSize;
  const langList = localeList.map((item) => {
    return {
      label: t('common.common_' + item.event),
      value: item.event,
      transitionValue: '',
      image_url: '',
      transitionValueTitle: '',
      language: item.language || '',
    };
  });
  const { getLocale } = useLocale();
  const currentLangIndex = ref(0); // 当前
  const contentList = ref<Array<LangItem>>(langList);
  const modelType = ref('FrontPage' as string);
  const currentLang = ref(contentList.value[0]); // 当前语言公告内容
  const textValue = ref('');
  const currentlanguageVal = ref('' as string | number);
  const [registerSports, { getFieldsValue, setFieldsValue, validate, resetFields }] = useForm({
    showActionButtonGroup: false,
    size: FORM_SIZE,
  });

  const [registerSendLetterModal, { closeModal }] = useModalInner(async (data) => {
    try {
      if (modelType.value !== 'FrontPage') {
        data.centent = JSON.parse(data.msg);
      }
    } catch (e) {
      console.error('e', e);
      data.centent = '';
    }
    if (data.type === 'FrontPage') {
      modalTitle.value = t('table.system.system_send_message'); //站内信详情
    }
    if (data.type === 'content') {
      modalTitle.value = t('table.system.system_message_send_detail'); //站内信详情
      let copyValue = JSON.parse(JSON.stringify(data));
      const content = copyValue.centent;
      contentList.value.forEach((el) => {
        el.transitionValue = content[el.value];
        el.transitionValueTitle = copyValue.title[el.value];
      });
      copyValue.contentEdit = contentList.value[currentLangIndex.value].transitionValue;
      contentList.value[currentLangIndex.value];
      await setFieldsValue({ ...copyValue, title: copyValue.title['default'] });
    } else {
      contentList.value.forEach((el) => {
        el.transitionValue = '';
        el.transitionValueTitle = '';
      });
      resetFields();
    }
    modelType.value = data.type;
  });
  const [textModal, { openModal }] = useModal();
  function moreLangurageModal() {
    const title = transform(
      contentList.value,
      function (result, item) {
        result[item.value] = item.transitionValueTitle;
      },
      {},
    );
    openModal(true, { data: title });
  }
  function emitsValues(value) {
    value.default =
      value.zh_CN || value.en_US || value.th_TH || value.pt_BR || value.hi_IN || value.vi_VN;
    contentList.value = contentList.value.map((item) => {
      return {
        ...item,
        transitionValueTitle: value[item.value],
      };
    });
    currentLang.value = contentList.value[currentLangIndex.value];
  }
  const handlelanguageLevel = (value, el) => {
    currentLangIndex.value = value;
    currentLang.value = contentList.value[value];
    textValue.value = contentList.value[value].transitionValue;
    setFieldsValue({
      contentEdit: el.transitionValue || null,
    });
  };
  async function handleClickTranslation() {
    const values = await getFieldsValue();
    textValue.value = values?.contentEdit;
    contentList.value[currentLangIndex.value].transitionValue = values;
    currentlanguageVal.value = contentList.value.filter(
        (item, ind) => ind === currentLangIndex.value,
    )[0].value;
    let res = await translateContentList(
        contentList.value,
        textValue.value,
        0,
        'transitionValue',
        currentlanguageVal.value,
    );
    if (res?.success) {
      message.success(t('v.bannner.transitionValue_success'));
    } else {
      message.error(t('v.bannner.transitionValue_error'));
    }
  }
  function validateTransitionValues(extraList, type) {
    let nonDefaultItems = extraList.filter((item) => item.value !== 'default');
    let allTransitionValuesEmpty = nonDefaultItems.every((item) => item[type] === '');
    return allTransitionValuesEmpty;
  }
  function handleBtnTextBlur() {
    translateContentList(
      contentList.value,
      currentLang.value['transitionValueTitle'],
      0,
        'transitionValueTitle',
        currentlanguageVal.value,
    );
  }
  const submiting = ref(false);
  async function submitFunc(): Promise<void> {
    submiting.value = true;
    try {
      setTimeout(() => {
        submiting.value = false;
      }, 1311);
      const values = await validate();

      let istransitionValue = validateTransitionValues(contentList.value, 'transitionValue');
      if (istransitionValue) {
        createMessage.error(t('table.system.system_p_enter_mes'));
        submiting.value = false;
        return false;
      }
      if (!currentLang.value.transitionValueTitle) {
        submiting.value = false;
        message.error(t('table.system.system_p_announce_title1'));
        return;
      }

      if (values.usernames) {
        values['usernames'] = values.usernames
          ? values.usernames.split(' ').join('').split(',')
          : [];
      } else if (values.user_levels) {
        values['user_levels'] = values.user_levels
          ? values.user_levels.map((level) => Number(level))
          : [];
      } else if (values.vip_levels) {
        values['vip_levels'] = values.vip_levels
          ? values.vip_levels.map((level) => Number(level))
          : [];
      } else if (values.agents) {
        values['agents'] = values.agents ? values.agents.split(' ').join('').split(',') : [];
      }
      if (values.flags == 1) values['all'] = 1;
      if (values.flags == 5) values['agent'] = 1;
      const content = await transform(
        contentList.value,
        function (result, item, key) {
          result[item.value] = item.transitionValue;
        },
        {},
      );
      const title = await transform(
        contentList.value,
        function (result, item, key) {
          result[item.value] = item.transitionValueTitle;
        },
        {},
      );
      const params = {
        ...values,
        content: JSON.stringify(content),
        title: JSON.stringify(title),
      };
      delete params.contentEdit;
      const { status, data } = await inserStationInfo({ ...params });
      if (status) {
        createMessage.success(data);
        closeModal();
        submiting.value = false;
        emit('success');
      } else {
        createMessage.error(data);
      }
    } catch (e) {
      console.error(e);
    }
  }
</script>
