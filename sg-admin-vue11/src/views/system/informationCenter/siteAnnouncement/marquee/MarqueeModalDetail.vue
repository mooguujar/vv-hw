<template>
  <!--跑马灯详情-->
  <BasicModal
    @register="registerMarquee"
    :width="900"
    :title="$t('modalForm.system.system_marquee_detail')"
    :showOkBtn="false"
    :showCancelBtn="false"
    :destroyOnClose="true"
  >
    <BasicForm @register="createForm">
      <template #content>
        <LangRadioGroup :contentList="contentList" @click:radio="handlelanguageLevel" />
      </template>
      <template #marquee="{ model, field }">
        <div class="marquee-bg">
          <Marquee class="!h-10">{{ model[field] }}</Marquee>
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useStateOptions } from '../helper';
  import LangRadioGroup from '../../common/components/LangRadioGroup.vue';
  import { useLocalList } from '/@/settings/localeSetting';
  import { marqueeDetailFormData } from './marqueeFormData';
  import { Marquee } from '/@/components/Marquee';
  import { LangItem } from '../../common/setting';
  import { useI18n } from '/@/hooks/web/useI18n';

  const localeList = useLocalList();
  const { t } = useI18n();
  export default defineComponent({
    name: 'MarqueeModalDetail',
    components: {
      BasicModal,
      BasicForm,
      LangRadioGroup,
      Marquee,
    },
    props: {},
    setup() {
      const { stateOptions } = useStateOptions();
      const FORM_SIZE = useFormSetting().getFormSize;
      const currentlanguageIndex = ref(0); // 当前

      const langList = localeList.map((item) => {
        return {
          label: item.text,
          // label: t('comon.common_' + item.event),
          value: item.event,
          transitionValue: '',
          image_url: '',
          language: item.language || '',
        };
      });

      const contentList = ref<Array<LangItem>>(langList);
      const [createForm, { setFieldsValue }] = useForm({
        schemas: marqueeDetailFormData(contentList.value, currentlanguageIndex.value),
        actionColOptions: {
          span: 24,
        },
        size: FORM_SIZE,
        showResetButton: false,
        showSubmitButton: false,
        showActionButtonGroup: false,
      });

      const handlelanguageLevel = (value, el) => {
        currentlanguageIndex.value = value;
        setFieldsValue({
          contentEdit: el.transitionValue || null,
        });
      };
      let parseData = (record) => {
        try {
          typeof record.content === 'string' ? (record.content = JSON.parse(record.content)) : '';
          typeof record.title === 'string' ? (record.title = JSON.parse(record.title)) : '';
          record.client =
            typeof record.client === 'string' ? record.client.split(',') : record.client;
        } catch (e) {
          console.error(e);
        }
        return record;
      };
      const [registerMarquee] = useModalInner(async (data) => {
        if (data.id) {
          let copyValue = JSON.parse(JSON.stringify(parseData(data)));
          const content = copyValue.content;
          contentList.value.forEach((el) => {
            el.transitionValue = content[el.value];
          });
          copyValue.contentEdit = contentList.value[currentlanguageIndex.value].transitionValue;
          await setFieldsValue({ ...copyValue });
        }
      });

      return {
        FORM_SIZE,
        createForm,
        stateOptions,
        registerMarquee,
        handlelanguageLevel,
        currentlanguageIndex,
        contentList,
      };
    },
  });
</script>
<style lang="less" scoped>
  .activeTag {
    background: linear-gradient(90deg, rgb(76 155 239) 0%, lighten(@primary-color, 10%) 100%);
    color: #fff !important;
  }

  .marquee-bg {
    background-color: @header-bg-100;
  }
</style>
