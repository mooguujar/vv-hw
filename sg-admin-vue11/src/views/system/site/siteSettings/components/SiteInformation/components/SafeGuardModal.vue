<template>
  <BasicModal
    v-bind="$attrs"
    :width="864"
    :minHeight="300"
    :maxHeight="400"
    :centered="true"
    :canFullscreen="false"
    :title="t('common.nSiteMaitianSetting', [modalTitle])"
    cancelText=""
    :okText="t('modalForm.finance.common_income.submit')"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerVip" class="editVipModal" :size="FORM_SIZE">
      <template #startTime="{ model, field }">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          :size="FORM_SIZE"
          class="w-100%"
          :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
          :showNow="false"
        />
      </template>
      <template #endTime="{ model, field }">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          :size="FORM_SIZE"
          class="w-100%"
          :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #notice="{ model, field }">
        <LangRadioGroup
          class="!m-b-5 !-mt-1"
          :contentList="contentList"
          :showTranslation="true"
          @click:radio="handlelanguageLevel"
          @click:translation="handleClickTranslation"
        />
        <Textarea
          style="margin-top: 8px"
          class="maintain-textarea"
          :rows="6"
          :placeholder="t('table.system.system_matain_info')"
          status="error"
          :value="textValue"
          v-model:value="model[field]"
          @change="handelTextValueChange"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { editData } from './safeGuard.data';
  import dayjs, { Dayjs } from 'dayjs';
  import moment from 'moment';
  import {
    Tabs,
    TabPane,
    DatePicker,
    Textarea,
    Button,
    message,
    FormItem,
    RadioGroup,
    RadioButton,
  } from 'ant-design-vue';
  import LangRadioGroup from '@/views/discountActivity/activity/components/insertActiveNew/LangRadioGroup.vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { useI18n } from '@/hooks/web/useI18n';
  import { updateMaintain } from '@/api/sys';
  import { useFormSetting } from '@/hooks/setting/useFormSetting';
  import { LangItem } from '@/views/system/informationCenter/common/setting';
  import { useLocalList } from '@/settings/localeSetting';
  import translateContentList from '/@/views/common/language-a';
  import utc from 'dayjs/plugin/utc';
  import timezone from 'dayjs/plugin/timezone';
  import { useTimezoneStore } from '@/store/modules/timezone';

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const timezoneStore = useTimezoneStore();
  const currTimezone = ref(timezoneStore.getTimezone);
  const localeList = useLocalList();
  const modalTitle = ref('');
  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const langList = localeList.map((item) => {
    return {
      label: item.text,
      value: item.event,
      transitionValue: '',
      transitionValueBtn: '',
      btnShow: true,
      image_url: '',
      language: item.language || '',
      fileList: [],
    };
  });

  interface FormModel {
    maintain_start_time: Date | null;
    maintain_end_time: Date | null;
  }

  const selectIndex = ref(0);
  const setStatus = ref('error' as any);
  const isIndex = ref(0 as Number);
  const contentList = ref<Array<LangItem>>(langList);
  const currentLang = ref(contentList.value[0]);
  const textValue = ref('');
  const helpMessage = ref('');
  const startTime = ref<Dayjs>();
  const model = ref<FormModel>({
    maintain_start_time: dayjs().startOf('day').toDate(),
    maintain_end_time: dayjs().endOf('day').toDate(),
  });
  export default defineComponent({
    name: 'SafeGuardModal',
    components: {
      LangRadioGroup,
      BasicModal,
      Tabs,
      TabPane,
      BasicForm,
      DatePicker,
      Textarea,
      Button,
      FormItem,
      RadioGroup,
      RadioButton,
    },
    props: ['labelWidth'],
    emits: ['register', 'submit', 'success'],
    setup(_, { emit, props }) {
      let closeReload = function () {};
      const timeZone = ref('');
      const currentLangIndex = ref(0 as any);
      const [
        registerVip,
        { setFieldsValue, getFieldsValue },
      ] = useForm({
        schemas: editData,
        showActionButtonGroup: false,
        size: FORM_SIZE,
      });
      let title = ref('');
      let dataId = ref('');
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        timeZone.value = data.data.brand_timezone || '';
        closeReload = data.reloadData;
        modalTitle.value = data.data.name;
        isIndex.value = 0;
        setTimeout(() => {
          handleClickContent(0);
        }, 500);
        currentLang.value = contentList.value[0];
        let initStart = data.data.maintain_start_time * 1000;
        let initEnd = data.data.maintain_end_time * 1000;
        let initData = getFieldsValue();
        initData.maintain = data.data.maintain;
        if (initData.maintain === 1) {
          initData.maintain_start_time = dayjs();
          initData.maintain_end_time = '';
          setFieldsValue({ maintain_end_time: '' });
        } else {
          initData.maintain_start_time = dayjs.tz(initStart, currTimezone.value);
          initData.maintain_end_time = dayjs.tz(initEnd, currTimezone.value);
        }
        dataId.value = data.data.id;
        setFieldsValue(initData);

        if (data.data.maintain_content) {
          if (initData.maintain === 2) {
            textValue.value = JSON.parse(data.data.maintain_content)
              [currentLang.value.value || 'zh-CN'].split('<p>')[1]
              .split('</p>')[0];
            contentList.value[0].transitionValue = textValue.value;
            translateContentList(
              contentList.value,
              textValue.value,
              currentLangIndex.value,
              'transitionValue',
              currentlanguageVal.value,
            );
          } else {
            textValue.value = '';
          }
        }
        setModalProps({ confirmLoading: false });
      });
      const disabledStartDate = (date) => {
        if (!model.value.maintain_end_time || !date) return false;
        return date.valueOf() > model.value.maintain_end_time.valueOf();
      };
      const disabledEndDate = (date) => {
        if (!model.value.maintain_start_time || !date) return false;
        return date.valueOf() < model.value.maintain_start_time.valueOf();
      };
      const onStartDateChange = (value) => {
        model.value.maintain_start_time = value;
      };
      const currentlanguageVal = ref('' as string | number);
      const handlelanguageLevel = (idx) => {
        currentLangIndex.value = idx;
        currentLang.value = contentList.value[idx];
        textValue.value = contentList.value[idx].transitionValue;
      };
      const handleClickTranslation = async () => {
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
      };
      const onEndDateChange = (value) => {
        model.value.maintain_end_time = value;
      };
      const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      };

      // 禁止选择当时之后的时刻
      const disabledDateStartTime = (date) => {
        const hours = moment().hours();
        const minutes = moment().minutes();
        return {
          disabledHours: () => range(hours + 1, 24),
          disabledMinutes: () => range(minutes + 1, 60),
          disabledSeconds: () => [],
        };
      };
      //禁止选择以后的时间
      const disabledDateEndTime = (date) => {
        const hours = moment().hours();
        const minutes = moment().minutes();
        return {
          disabledHours: () => range(0, hours),
          disabledMinutes: () => range(0, minutes + 1),
          disabledSeconds: () => [],
        };
      };

      const handleClickContent = (idx) => {
        currentLangIndex.value = idx;
        currentLang.value = contentList.value[idx];
        textValue.value = contentList.value[idx].transitionValue;
      };

      const handelTextValueChange = (e) => {
        textValue.value = e.target.value;
        contentList.value[currentLangIndex.value].transitionValue = textValue.value;
      };

      async function handleSubmit(e): Promise<void> {
        try {
          setModalProps({ confirmLoading: true });
          const { maintain, maintain_start_time, maintain_end_time } = getFieldsValue();
          let maintain_content = {};
          for (let i = 0; i < contentList.value.length; i++) {
            if (
              maintain === 2 &&
              (!contentList.value[i].transitionValue ||
                !contentList.value[i].transitionValue.trim())
            ) {
              return message.error(
                t('table.promotion.promotion_please_enter') +
                  contentList.value[i].label +
                  t('table.system.system_matain_info'),
              );
            }

            maintain_content[contentList.value[i].value] =
              '<p>' + contentList.value[i].transitionValue + '</p>';
          }
          let _data = {
            maintain,
          };
          if (maintain === 2) {
            _data['maintain_start_time'] = maintain_start_time;
            _data['maintain_end_time'] = maintain_end_time;
            _data['maintain_content'] = JSON.stringify(maintain_content);
          }
          if (maintain === 2 && (!maintain_end_time || !maintain_start_time)) {
            return;
          }
          if (maintain === 2 && !textValue.value) {
            setStatus.value = 'error';
            helpMessage.value = t('common.enterMaintainDes');
            return message.error(t('common.enterMaintainDes'));
          }
          const { status, data } = await updateMaintain(_data);
          if (status) {
            emit('success');
            closeReload && closeReload();
            closeModal();
            selectIndex.value = 0;
            message.success(data);
          } else {
            message.error(data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        modalTitle,
        registerModal,
        handleSubmit,
        title,
        registerVip,
        dayjs,
        contentList,
        handleClickContent,
        currentLang,
        textValue,
        handelTextValueChange,
        translateContentList,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
        currentLangIndex,
        disabledDateStartTime,
        disabledDateEndTime,
        t,
        currTimezone,
        handlelanguageLevel,
        handleClickTranslation,
        FORM_SIZE,
      };
    },
  });
</script>
<style lang="less" scoped>
  .languageBox {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }

  .bannerLanguage {
    display: inline-block;
    width: 68px;
    height: 33px;
    margin-top: 4px;
    margin-right: 4px;
    border: 1px solid rgb(2 167 240 / 100%);
    color: rgb(2 167 240 / 100%);
    line-height: 33px;
    text-align: center;
    cursor: pointer;
  }

  .bannerLanguageChecked {
    background: linear-gradient(90deg, rgb(27 194 216 / 100%) 0%, rgb(64 158 255 / 100%) 100%);
    color: #fff;
  }

  .maintain-textarea {
    width: 94%;
    height: 253px;
    margin-left: -75px;
  }
  textarea.ant-input {
    max-width: 94%;
  }
</style>
