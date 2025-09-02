<template>
  <div>
    <BasicForm @register="registerFormThird">
      <template #site-form>
        <Tabs v-model:activeKey="activeKey" type="line" class="normal_tab">
          <TabPane
            v-for="item in tabsFormSchema"
            :key="item.key"
            v-bind="omit(item, ['Form', 'key'])"
          >
            <BasicForm
              style="width: 50%"
              v-if="item.Form"
              :disabled="isControlValueSet()"
              @register="item.Form[0]"
              @submit="handleSubmit(item)"
            >
              <template #basicInfo>
                <div class="display-flex thirdSite-title"
                  ><div class="mr-2 title-block"></div
                  ><h1>{{ $t('modalForm.system.system_apply_account') }}</h1
                  ><h1 class="primary-color cursor-pointer" @click="openExternalUrl(item.url)">{{
                    $t('modalForm.system.system_apply_account')
                  }}</h1></div
                >
              </template>
            </BasicForm>
          </TabPane>
        </Tabs>
      </template>
    </BasicForm>
    <div class="submit-btn text-center">
      <a-button
        type="primary"
        size="large"
        :disabled="isControlValueSet()"
        @click="handleSubmit(tabsFormSchema[submitbtnItem(tabsFormSchema, activeKey)])"
        class="mt-30px t-form-label-com"
      >
        {{ $t('common.saveText') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { BasicForm, FormProps, useForm, UseFormReturnType } from '/@/components/Form';
  import { reactive, ref, onMounted } from 'vue';
  import { useFormSchema, threeschema } from './base.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { getSiteBrandDetail, updateSiteBrand } from '/@/api/sys';
  import { message, Tabs, TabPane } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { baseSchema } = useFormSchema();
  useAutoLabelWidth(baseSchema);
  const { t } = useI18n();
  type TabsFormType = {
    key: string;
    tab: string;
    forceRender?: boolean;
    Form?: UseFormReturnType;
  };

  const props = defineProps({
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: '1',
    },
  });

  const emit = defineEmits(['update:ok']);

  const FORM_SIZE = useFormSetting().getFormSize;

  const baseFormConfig: Partial<FormProps> = {
    labelWidth: 100,
    size: FORM_SIZE,
    actionColOptions: { span: 14 },
    // showActionButtonGroup: false,
    showResetButton: false,
    showSubmitButton: false,
    showActionButtonGroup: false,
    // submitButtonOptions: {
    //   text: t('common.saveText'),
    //   size: FORM_SIZE,
    //   style: {
    //     width: '240px',
    //     float: 'right',
    //     marginLeft: '40px',
    //     marginTop: '30px',
    //   },
    // },
  };

  const tabsFormSchema: TabsFormType[] = reactive([
    {
      key: 'third_facebook',
      tab: 'FaceBook',
      echo: 'FaceBook',
      forceRender: true,
      url: 'https://developers.facebook.com',
      Form: useForm(Object.assign({ schemas: baseSchema }, baseFormConfig) as FormProps),
    },
    {
      key: 'third_google',
      tab: 'Google',
      echo: 'Google',
      url: 'https://play.google.com/console/u/0/signup',
      forceRender: true,
      Form: useForm(Object.assign({ schemas: baseSchema }, baseFormConfig) as FormProps),
    },
    {
      key: 'third_line',
      tab: 'Line',
      echo: 'Line',
      url: 'https://developers.line.biz/zh-hant/',
      forceRender: true,
      Form: useForm(Object.assign({ schemas: baseSchema }, baseFormConfig) as FormProps),
    },
    {
      key: 'third_twitch',
      tab: 'Twitch',
      echo: 'Twitch',
      url: 'https://help.twitch.tv/s/article/twitch-account-settings?language=zh_TW',
      forceRender: true,
      Form: useForm(Object.assign({ schemas: baseSchema }, baseFormConfig) as FormProps),
    },
  ]);

  const activeKey = ref('third_facebook');

  const [registerFormThird] = useForm({
    schemas: threeschema,
    actionColOptions: { span: 14 },
    size: FORM_SIZE,
    showActionButtonGroup: false,
    submitButtonOptions: {
      text: t('common.saveText'),
      size: FORM_SIZE,
      style: {
        width: '240px',
        float: 'right',
        marginLeft: '40px',
        marginTop: '30px',
      },
    },
  });

  const setFormList = async (baseInfo) => {
    if (!baseInfo) return;
    // 设置三方登录信息
    for (let i = 0; i < tabsFormSchema.length; i++) {
      let item = tabsFormSchema[i];
      let formValues = baseInfo[item.echo];
      await setInstanceForm(item.Form, formValues);
    }
  };

  const setInstanceForm = async (instance, fields) => {
    const { setFieldsValue } = instance[1];
    await setFieldsValue({ ...fields });
  };
  const submitbtnItem = (_tabsFormSchema, key) => {
    return _tabsFormSchema.findIndex((item) => item.key === key);
  };
  const handleSubmit = async (el) => {
    const { validate, getFieldsValue } = el.Form[1];
    await validate();
    //params[el.echo] = JSON.stringify(getFieldsValue());
    const obj = {};
    tabsFormSchema.map((item, index) => {
      obj[item.echo] = item.Form[1].getFieldsValue();
    });
    const params = {
      name: 'third',
      content: JSON.stringify(obj),
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  };
  const GetSiteBrandDetail = async (param) => {
    const data = await getSiteBrandDetail(param);
    setFormList(data);
  };
  function openExternalUrl(url) {
    if (isControlValueSet()) return;
    window.open(url, '_blank');
  }
  onMounted(() => {
    GetSiteBrandDetail({ tag: 'third' });
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }

  .normal_tab {
    ::v-deep(.ant-tabs-nav) {
      margin-bottom: 0 !important;
    }

    ::v-deep(.ant-tabs-nav-wrap) {
      padding: 18px;
      border: 1px solid #e1e1e1 !important;
    }

    ::v-deep(.ant-tabs-nav-list) {
      padding: 0 !important;
      border: none !important;
      border-radius: 0 !important;
      background-color: transparent !important;
    }

    ::v-deep(.ant-tabs-tab > .ant-tabs-tab-btn) {
      height: 22px !important;
      padding: 0;
      font-size: 14px !important;
      line-height: 22px !important;
    }

    ::v-deep(.ant-tabs-tab) {
      margin-right: 32px !important;
    }

    ::v-deep(.ant-tabs-tab-active > .ant-tabs-tab-btn) {
      background-color: transparent !important;
      color: #1475e1 !important;
    }

    ::v-deep(.ant-tabs-ink-bar) {
      display: block !important;
    }
    //::v-deep(.ant-form-item-control-input) {
    //
    //}
    ::v-deep(.ant-row) {
      .ant-row {
        margin-bottom: 0 !important;
      }

      .ant-form-item {
        .ant-form-item-label {
          margin-bottom: 20px;
        }
      }
    }

    ::v-deep(.ant-tabs-content) {
      padding: 20px;
      padding-bottom: 0;
      border: 1px solid #e1e1e1 !important;
      background-color: #fff;

      .thirdSite-title {
        height: 22px;
        margin-top: -18px;
        line-height: 22px;
      }

      .primary-color {
        color: #1475e1 !important;
      }
      //::v-deep(.ant-form-item-control-input) {
      //  height: 40px;
      //}

      h1 {
        margin: 0 !important;
        font-size: 18px !important;
        font-weight: 600;
      }

      .title-block {
        width: 6px !important;
        height: 15px !important;
        margin-top: 4px;
        background-color: #1475e1 !important;
      }
    }
  }

  .submit-btn {
    width: 100%;
    margin: auto;
    float: left;

    button {
      min-width: 240px;
    }
  }
</style>
