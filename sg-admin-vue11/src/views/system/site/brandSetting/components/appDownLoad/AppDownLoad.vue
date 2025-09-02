<template>
  <div class="registerAppDownLoadBox">
    <BasicForm @register="registerRegister">
      <template #androidSetting>
        <div class="display-flex mb-20px mt-10px">
          <div class="mr-2 title-block"></div>
          <h1>{{ $t('table.system.system_android_conf') }}</h1>
        </div>
      </template>
      <template #iosSetting>
        <div class="display-flex mt-10px mb-20px">
          <div class="mr-2 title-block"></div>
          <h1>{{ $t('table.system.system_ios_conf') }}</h1>
        </div>
      </template>
      <template #language-slot>
        <RadioGroup
          v-model:value="currentLanguage"
          button-style="solid"
          size="large"
          @change="handleChange"
        >
          <RadioButton
            style="padding-right: 43px; padding-left: 43px; font-size: 14px"
            v-for="item of langsList"
            :value="item.en"
            :key="item.cn"
            >{{ item.cn }}</RadioButton
          >
        </RadioGroup>
      </template>
    </BasicForm>
    <!-- <div class="text-center submit-btn">
      <Button type="primary" size="large" @click="handleSubmit" class="t-form-label-com mt-60px">
        {{ $t('common.saveText') }}
      </Button>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form';

  import { registerSchema } from './base.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { onMounted, reactive, ref } from 'vue';
  import { getZkSiteAppUpdateDetail } from '/@/api/site';

  const { t } = useI18n();
  const langsList = [
    { cn: t('common.common_zh_CN'), en: 'zh_CN' },
    { cn: t('common.common_en_US'), en: 'en_US' },
    { cn: t('common.common_pt_BR'), en: 'pt_BR' },
    { cn: t('common.common_vi_VN'), en: 'vi_VN' },
    { cn: t('common.common_th_TH'), en: 'th_TH' },
    { cn: t('common.common_hi_IN'), en: 'hi_IN' },
    { cn: t('common.common_tl_PH'), en: 'tl_PH' },
    { cn: t('common.common_ko_KR'), en: 'ko_KR' },
  ];
  // const langs = {
  //   zh_CN: '中文',
  //   en_US: '英文',
  //   pt_BR: '葡萄牙语',
  //   vi_VN: '越南文',
  //   th_TH: '泰语',
  //   hi_IN: '印度语',
  // };
  const apkObj = reactive({
    en_US: '',
    pt_BR: '',
    th_TH: '',
    vi_VN: '',
    zh_CN: '',
    hi_IN: '',
    ko_KR: '',
    tl_PH: '',
  });
  const ipaObj = reactive({
    en_US: '',
    pt_BR: '',
    th_TH: '',
    vi_VN: '',
    zh_CN: '',
    hi_IN: '',
    ko_KR: '',
    tl_PH: '',
  });
  const FORM_SIZE = useFormSetting().getFormSize;
  const currentLanguage = ref('zh_CN');

  const [registerRegister, { setFieldsValue }] = useForm({
    rowProps: {
      gutter: 36, // 设置列之间的间距
    },
    schemas: registerSchema() as any,
    actionColOptions: { span: 14 },
    size: FORM_SIZE as any,
    showResetButton: false,
    showActionButtonGroup: false,
  });

  function handleChange(e) {
    setFieldsValue({ apkDescribe: apkObj[e.target.value] || '-' });
    setFieldsValue({ ipaDescribe: ipaObj[e.target.value] || '-' });
  }
  onMounted(async () => {
    const res = await getZkSiteAppUpdateDetail();
    const android = res.android;
    const ios = res.ios;

    setFieldsValue({
      androidMainVer: android.ver || '-',
      iosMainVer: ios.ver || '-',
      androidApkUrl: android.link.primary || '-',
      iosApkUrl: ios.link.primary || '-',
      spare_androidApkUrl: android.link.backup || '-',
      spare_iosApkUrl: ios.link.backup || '-',
      apkUpdateType: android.force ? t('common.Forced_update') : t('common.Selective_update'),
      ipaUpdateType: ios.force ? t('common.Forced_update') : t('common.Selective_update'),
    });
    const noteKeys = Object.keys(apkObj);
    noteKeys.forEach((lang) => {
      apkObj[lang] = android.lang[lang];
      ipaObj[lang] = ios.lang[lang];
    });
    setFieldsValue({
      apkDescribe: apkObj['zh_CN'] || '-',
      ipaDescribe: ipaObj['zh_CN'] || '-',
    });
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }

  ::v-deep(.ant-checkbox-wrapper-checked) {
    color: #0960bd;
  }

  ::v-deep(.ant-checkbox-wrapper-disabled .ant-checkbox-inner) {
    background-color: rgb(0 0 0 / 25%);
  }

  .registerAppDownLoadBox {
    padding: 20px;
    padding-bottom: 30px;
    border: 1px solid #e1e1e1 !important;
    background-color: #fff;

    h1 {
      margin: 0 !important;
      font-size: 18px !important;
      font-weight: 600;
      line-height: 18px !important;
    }

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

    .title-block {
      width: 6px !important;
      height: 15px !important;
      margin-top: 2px;
      background-color: #1475e1 !important;
    }

    .submit-btn {
      width: 100%;
      margin: auto;
      float: left;

      button {
        min-width: 240px;
      }
    }

    ::v-deep(.app__special__background) {
      background-color: #f6f7fb;
    }
  }
</style>
