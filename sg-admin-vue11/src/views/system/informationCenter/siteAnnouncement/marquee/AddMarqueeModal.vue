<template>
  <BasicModal
    @register="registerMarquee"
    :width="800"
    :title="modalTitle"
    :okText="$t('common.confirmSave')"
    :cancelText="$t('common.cancelText')"
    @ok="submitFunc"
  >
    <BasicForm @register="createForm">
      <template #zhNameTextSlot="{ model, field }">
        <Row>
          <Col :span="16">
            <FormItem>
              <Input
                :size="FORM_SIZE"
                :placeholder="t('modalForm.system.system_input_title_tip')"
                v-model:value="zhText"
                @blur="changInputzhText"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <Button
              type="primary"
              class="ml-10px"
              size="large"
              @click="handleMoreLagarage('zh_name')"
              >{{ t('v.discount.activity.more_language') }}</Button
            >
          </Col>
        </Row>
      </template>
      <template #startDate="{ model, field }">
        <DatePicker
          :size="FORM_SIZE"
          v-model:value="model[field]"
          show-time
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #endDate="{ model, field }">
        <DatePicker
          :size="FORM_SIZE"
          v-model:value="model[field]"
          show-time
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #clientSlot="{ model, field }">
        <FormItemRest>
          <!--全选-->
          <Checkbox
            v-model:checked="openTerminalState.checkAll"
            :indeterminate="openTerminalState.indeterminate"
            @change="onCheckAllChange($event, model, field)"
          >
            {{ $t('business.common_select_all') }}
          </Checkbox>
        </FormItemRest>
        <CheckboxGroup
          v-model:value="openTerminalState.checkedList"
          :options="openTerminalOptions"
          @change="onChangeOpenTerminal($event, model, field)"
        />
      </template>
      <template #content>
        <LangRadioGroup :contentList="contentList" @click:radio="handlelanguageLevel" />
      </template>
      <template #stateSlot="{ model, field }">
        <RadioGroup v-model:value="model[field]" :options="stateOptions" />
      </template>
    </BasicForm>
  </BasicModal>
  <buttonTextModal @emits-values="emitsValues" @register="textModal" />
</template>
<script lang="ts" setup>
  import {
    Row,
    Col,
    Input,
    Checkbox,
    CheckboxGroup,
    FormItem,
    FormItemRest,
    RadioGroup,
    DatePicker,
  } from 'ant-design-vue';
  import { reactive, watch, ref, withDefaults, defineProps } from 'vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { Button } from '/@/components/Button/index';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useStateOptions } from '../helper';
  import dayjs from 'dayjs';
  import { Client, ClientMappings, OPEN_TERMINAL_OPTIONS } from '/@/views/common/commonSetting';
  import LangRadioGroup from '../../common/components/LangRadioGroup.vue';
  import { useLocalList } from '/@/settings/localeSetting';
  import { marquee_insert, marquee_update } from '/@/api/sys';
  import eventBus from '/@/utils/eventBus';
  import translateContentList from '/@/views/common/language';
  import { formatToDateTime, timeChange } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import buttonTextModal from '/@/components/buttonTextModal/buttonTextModal.vue';
  import { useLocale } from '/@/locales/useLocale';
  import { transform } from 'lodash-es';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const localeList = useLocalList();
  const { t } = useI18n();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
    state: string | number;
  }

  interface LangItem {
    label: string; // 多语言描述
    value: string; // 多语言key
    text: string; // 多语言文本
    url: string; // 多语言图片地址
  }

  interface Props {
    isEdit?: boolean;
    editBulletinData?: any;
  }

  const props = withDefaults(defineProps<Props>(), {
    isEdit: false,
    editBulletinData: null,
  });

  const { stateOptions } = useStateOptions();
  const FORM_SIZE = useFormSetting().getFormSize;
  const openTerminalOptions = OPEN_TERMINAL_OPTIONS;

  const syslang = useLocale().getLocale.value;

  const { createMessage } = useMessage();
  const currentlanguageIndex = ref(0); // 当前
  const rowKey = ref<any>('');
  const btnLange = ref({});
  const btnText = ref(null);
  const setTitle = ref({} as any);
  const zxLange = ref({});
  const zhText = ref(null);

  const [textModal, { openModal }] = useModal();

  const extraList = [
    {
      label: t('business.common_original'),
      value: 'default',
      transitionValue: '',
      transitionTitle: '',
      image_url: '',
      language: 'original',
    },
  ];
  const langList = localeList.map((item) => {
    return {
      label: t('common.common_' + item.event),
      value: item.event,
      transitionValue: '',
      image_url: '',
      transitionTitle: '',
      language: item.language || '',
    };
  });

  const contentList = ref<Array<LangItem>>([...extraList, ...langList]);

  const currentLang = ref(contentList.value[0]); // 当前语言公告内容

  function marqueeFormData() {
    const marqueeForm = [
      {
        field: 'title',
        component: 'Input',
        label: t('table.system.system_notice_title') + ':', //消息标题
        slot: 'zhNameTextSlot',
        componentProps: {
          placeholder: t('modalForm.system.system_input_title_tip'), //请输入消息标题
        },
        colProps: {
          span: 24,
        },
      },
      {
        field: 'start_time',
        label: t('business.common_period_start') + ':', //开始时间
        rules: [{ required: true, trigger: 'change', type: 'object' }],
        component: 'DatePicker',
        componentProps: {
          placeholder: t('table.discountActivity.discount_select_start_time'), //请选择开始时间
        },
        defaultValue: dayjs().startOf('day').toDate(),
        slot: 'startDate',
        colProps: {
          span: 12,
        },
      },
      {
        field: 'end_time',
        label: t('business.common_period_end') + ':', //结束时间
        rules: [{ required: true, trigger: 'change', type: 'object' }],
        component: 'DatePicker',
        componentProps: {
          placeholder: t('table.discountActivity.discount_select_end_time'), //请选择结束时间
        },
        defaultValue: dayjs().endOf('day').toDate(),
        slot: 'endDate',
        colProps: {
          span: 12,
          class: 'pr-20px',
        },
      },
      {
        field: 'client',
        component: 'CheckboxGroup',
        label: t('table.report.report_client') + ':', //客户端
        rules: [{ required: true }],
        colProps: {
          span: 24,
        },
        slot: 'clientSlot',
        dynamicRules: ({ values }) => {
          return [
            {
              required: true,
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(t('table.discountActivity.discount_select_client')); //请选择客户端
                }
                return Promise.resolve();
              },
            },
          ];
        },
      },
      {
        field: 'content',
        component: 'CheckboxGroup',
        label: t('table.system.system_notice_content') + ':', //消息内容
        colProps: {
          span: 24,
        },
        slot: 'content',
      },
      {
        field: 'contentEdit',
        component: 'InputTextArea',
        colProps: { span: 24 },
        componentProps: ({ formActionType, formModel }) => {
          return {
            autoSize: { minRows: 8, maxRows: 12 },
            placeholder: t('common.inputText'), //请输入
            onBlur: async (value) => {
              if (currentlanguageIndex.value == 0) {
                translateContentList(
                  contentList.value,
                  formModel.contentEdit,
                  currentlanguageIndex.value,
                  'transitionValue',
                );
              } else {
                contentList.value[currentlanguageIndex.value].transitionValue =
                  formModel.contentEdit;
              }
            },
          };
        },
      },
      {
        field: 'state',
        label: t('modalForm.finance.finance_now_status') + ':', //当前状态
        required: true,
        component: 'RadioGroup',
        colProps: { span: 24 },
        defaultValue: 1,
        componentProps: {
          options: [
            { label: t('business.common_show'), value: 1 }, //显示
            { label: t('business.common_hidden'), value: 2 }, //隐藏
          ],
        },
      },
    ];
    useAutoLabelWidth(marqueeForm);
    return marqueeForm;
  }

  const [createForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: marqueeFormData(),
    actionColOptions: {
      span: 18,
    },
    size: FORM_SIZE,
    showResetButton: false,
    showSubmitButton: false,
  });

  const modalTitle = ref<any>(t('table.system.system_add_marquee')); //新增跑马灯

  // const openTerminalState = reactive({
  //   indeterminate: false,
  //   checkAll: true,
  //   checkedList: openTerminalOptions,
  // });

  const openTerminalState = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: openTerminalOptions || [],
  });

  function emitsValues(value, type) {
    if (type === 'zh_name') {
      zhText.value = value[syslang];
      setFieldsValue({ title: setTitle.value });
      zxLange.value = value;
    } else if (type === 'button_text') {
      btnText.value = value[syslang];
      setFieldsValue({ button_text: btnText.value });
      btnLange.value = value;
    } else {
      btnText.value = value[syslang];
      setFieldsValue({ button_text: btnText.value });
      btnLange.value = value;
    }
  }

  //更多语言
  async function handleMoreLagarage(type) {
    openModal(true, { data: setTitle.value, type });
  }

  function changInputzhText(e) {
    zxLange.value[syslang] = zhText.value;
    translateContentList(contentList.value, zhText.value, 0, 'transitionTitle');
    setTitle.value = transform(
      contentList.value,
      function (result, item, key) {
        result[item.value] = item.transitionTitle;
      },
      {},
    );
    setFieldsValue({ title: setTitle.value });
  }
  // 全选开放终端
  function onCheckAllChange(e: any, model: any, field: any): void {
    Object.assign(openTerminalState, {
      checkedList: e.target.checked ? openTerminalOptions : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? openTerminalOptions : [];
  }

  function onChangeOpenTerminal(value: string[], model: any, field: any): void {
    model[field] = value;
  }

  watch(
    () => openTerminalState.checkedList,
    (val) => {
      openTerminalState.indeterminate = !!val.length && val.length < openTerminalOptions.length;
      openTerminalState.checkAll = val.length === openTerminalOptions.length;
      setFieldsValue({ client: openTerminalState.checkedList });
    },
  );

  watch(
    () => props.editBulletinData,
    (val) => {
      setFieldsValue({
        ...val,
        showType: val.showType.split(','),
        state: val.state.toString(),
      });

      Object.assign(openTerminalState, {
        checkedList: val.showType.split(','),
      });
    },
  );

  async function submitFunc(): Promise<void> {
    try {
      const values = await validate();
      values.start_time = timeChange(formatToDateTime(values.start_time)) / 1000;
      values.end_time = timeChange(formatToDateTime(values.end_time)) / 1000;
      if (values.end_time < values.start_time) {
        createMessage.error(t('table.discountActivity.discount_time_err'));
        return;
      }
      for (const el of contentList.value) {
        if (el.label == t('business.common_original') && !el.transitionValue) {
          createMessage.error(`${t('business.banner_tip')}${el.label}`);
          return;
        }
      }
      const content = {};
      await contentList.value.forEach((el) => {
        content[el.value] = el.transitionValue || '';
      });
      const newClientArray = values.client.map((el) => ClientMappings[el]);
      const payload = {
        ...values,
        notice_type: 2,
        title: JSON.stringify(values.title),
        client: newClientArray.join(','),
        content: JSON.stringify(content),
      };
      delete payload.contentEdit;
      const { status, data } = rowKey.value
        ? await marquee_update({ ...payload, id: rowKey.value })
        : await marquee_insert({ ...payload });
      if (status) {
        createMessage.success(data);
        eventBus.emit('marqSearchSubmit');
        closeModal();
      } else {
        createMessage.error(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const model = ref<FormModel>({
    start_time: dayjs().startOf('day').toDate(),
    end_time: dayjs().endOf('day').toDate(),
    state: '',
  });

  const disabledStartDate = (date) => {
    if (!model.value.end_time || !date) return false;
    return date.valueOf() > model.value.end_time.valueOf();
  };

  const disabledEndDate = (date) => {
    if (!model.value.start_time || !date) return false;
    return date.valueOf() < model.value.start_time.valueOf();
  };

  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = value;
  };

  const handlelanguageLevel = (value, el) => {
    currentlanguageIndex.value = value;
    setFieldsValue({
      contentEdit: el.transitionValue || null,
    });
  };

  const [registerMarquee, { closeModal }] = useModalInner(async (data) => {
    if (data.id) {
      let copyValue = JSON.parse(JSON.stringify(data));
      copyValue.start_time = dayjs(copyValue.start_time * 1000).format('YYYY-MM-DD HH:mm:ss');
      copyValue.end_time = dayjs(copyValue.end_time * 1000).format('YYYY-MM-DD HH:mm:ss');
      openTerminalState.checkedList = copyValue.client.map((id) => {
        return Client[Number(id)];
      });
      const content = copyValue.content;
      contentList.value.forEach((el) => {
        el.transitionValue = content[el.value];
      });
      copyValue.client = openTerminalState.checkedList;
      copyValue.contentEdit = contentList.value[0].transitionValue;
      zxLange.value = copyValue.title;
      zhText.value = zxLange.value[syslang];
      await setFieldsValue({ ...copyValue });
      modalTitle.value = t('table.discountActivity.discount_edit_marquee');
      rowKey.value = data.id;
    } else {
      resetFields();
      zxLange.value = {};
      zhText.value = null;
      setFieldsValue({ client: openTerminalOptions });
      modalTitle.value = t('table.system.system_add_marquee'); //新增跑马灯
    }
  });
</script>
<style lang="less" scoped>
  .activeTag {
    background: linear-gradient(90deg, rgb(76 155 239) 0%, lighten(@primary-color, 10%) 100%);
    color: #fff !important;
  }

  ::v-deep(.ant-col-12:nth-child(3) > div) {
    float: right;
  }

  ::v-deep(.ant-col-12:nth-child(3) > div > div:last-child) {
    width: 278px !important;
  }

  ::v-deep(.ant-col-12:nth-child(3) > div > div:last-child > div > div > div) {
    width: 278px !important;
  }

  ::v-deep(.textarea.ant-input) {
    width: 760px !important;
  }
</style>
