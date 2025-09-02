<template>
  <div class="pc-setting-box" style="margin-bottom: 10px">
    <div class="settingItem">
      <BasicForm @register="logoForm">
        <template #logoSetting="{ model, field }">
          <div class="settingBox">
            <div style="width: 45%; height: 325px">
              <BaseUploadDragger
                name="uploadfile"
                :upload-text="t('modalForm.system.system_drag_doc_tip')"
                :maxNumber="1"
                :showUploadList="true"
                :isShowPopover="true"
                :apiMap="LogoApiMap"
                :url="LogoImg"
                :CheckSize="true"
                :accept="'image/webp,image/png,image/jpeg'"
                :isShowButton="true"
                :file-list="LogofileList"
                :height="100"
                :width="100"
                :maxSize="2"
                :sizeUnit="'M'"
                @change="handleChangeLogoUpload"
                @remove="handleRemoveLogoUpload"
                @save="handleSave"
              />
            </div>
            <div class="show-modale">
              <div class="show-bg"></div>
              <Image v-if="LogoImg" :src="getDataTypePreviewUrl(LogoImg)" :preview="false" />
            </div>
          </div>
        </template>
      </BasicForm>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref, onMounted, watch, computed } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { BaseUploadDragger } from '/@/components/BaseUploadDragger';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { updateSiteBrand, uploadSiteBrand } from '/@/api/sys/index';
  import { message, Image } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['logoPicChange']);
  const props = defineProps({
    logoData: {
      type: [Object, String],
    },
    id: {
      type: String,
      default: '1',
    },
    type: {
      type: String,
      default: '',
    },
    logoPic: {
      type: String,
      default: '',
    },
  });
  let LogoSetDefault = ref(false);
  let LogoDefaultValue = ref('');

  watch(
    () => props.logoData,
    (val) => {
      if (val) {
        LogoImg.value = val;
        LogoSetDefault.value = true;
        LogoDefaultValue.value = val;
        updateSchema([
          {
            field: 'h5logo',
            defaultValue: LogoDefaultValue.value
              ? LogoDefaultValue.value
              : t('modalForm.common.not_set'),
          },
        ]);
        emit('logoPicChange', LogoDefaultValue.value);
      }
    },
    { deep: true },
  );
  let schemas: FormSchema[] = [
    {
      field: 'h5logo',
      component: 'Upload',
      label: t('table.system.system_app_logo'),
      slot: 'logoSetting',
      required: true,
      defaultValue: LogoDefaultValue.value,
    },
  ];
  const logoPic = computed(() => {
    return props.logoPic;
  });

  const [logoForm, { updateSchema, validate, setFieldsValue: setFieldsValueBasicSettings }] =
    useForm({
      schemas,
      labelCol: { span: 24 },
      baseColProps: { span: 24 },
      actionColOptions: { span: 24 },
      // submitButtonOptions: {
      //   text: t('common.saveText'),
      // },
      showSubmitButton: false,
      showResetButton: false,
      submitFunc: handleSubmit,
    });
  const LogoApiMap = reactive({
    uploadApi: uploadSiteBrand,
    language: null, //先写为null
  });

  const LogoImg = ref('');
  const LogofileList = ref([]);
  // 上传成功返回
  function handleChangeLogoUpload(data) {
    LogoImg.value = data;
    LogofileList.value = [{ uid: '1', name: data, status: 'done' }];
    LogoSetDefault.value = false;
    updateSchema([
      {
        field: 'h5logo',
        defaultValue: data,
      },
    ]);
    setFieldsValueBasicSettings({
      h5logo: data,
    });
    emit('logoPicChange', LogoImg.value);
  }
  // 删除
  function handleRemoveLogoUpload(data) {
    LogoImg.value = '';
    LogofileList.value = [];
    LogoSetDefault.value = true;
    emit('logoPicChange', LogoDefaultValue.value);
  }

  function handleSave(save) {
    if (save) {
      handleSubmit();
    }
  }
  //表单提交
  async function handleSubmit() {
    const value = await validate();
    const { h5logo, ...rest } = value;
    const params = {
      ...rest,
      name: 'app',
      content: h5logo,
      field: 'app_first_letter',
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  }
</script>

<style lang="less" scoped>
  .site-card-form {
    .ant-page-header-back {
      display: none;
    }
  }

  .pc-setting-box {
    display: flex;
    justify-content: space-between;
    border: 1px solid #e1e1e1;
    background-color: #fff !important;

    .pc-setting-box-item {
      width: 100%;
    }

    ::v-deep(.ant-form-item-label) {
      height: 60px;
      margin-bottom: 30px;
      padding-left: 10px;
      border-bottom: 1px solid #e1e1e1;
      background-color: #f6f7fb;
      line-height: 60px;
    }
  }

  .settingItem {
    width: 100%;
    height: 560px;
  }

  .settingBox {
    display: flex;
    justify-content: center;
  }

  .show-modale {
    width: 197px;
    height: 414px;
    margin-left: 100px;
    //background-color: red!important;
    background-image: url('@/assets/webp/appLogin.webp');
    background-repeat: no-repeat;
    background-size: 100%;

    ::v-deep(.ant-image) {
      position: absolute;
      top: 15px;
      width: 40px;
      height: 15px;
      margin-left: 15px;

      img {
        width: auto;
        max-width: 40px;
        height: auto;
        max-height: 15px;
        margin-top: -11px;
      }

      ::v-deep(.ant-image-mask) {
        margin-top: -3px;
      }
    }
  }

  .show-bg {
    display: block;
    position: absolute;
    top: 13px;
    width: 46px;
    height: 18px;
    margin-left: 10px;
    overflow: hidden;
    border-top-left-radius: 5px;
    background-color: #1b2d38;
  }

  .pc-log-bg {
    width: 477px;
    height: 282px;
    margin-top: 35px;
    background-image: url('@/assets/images/u754.webp');
    background-size: 100%;
  }

  .pc-log-pic-box {
    position: absolute;
    z-index: 300;
    width: 85px;
    height: 40px;
    margin-top: 42px;
    margin-left: 15px;
    overflow: hidden;
    border: 1px solid rgb(149 242 4);
    background-color: rgb(26 44 55);
  }

  .web-icon-bg {
    width: 393px;
    height: 103px;
    margin-top: 35px;
    background-image: url('@/assets/images/u747.webp');
    background-size: 100%;
  }

  .web-icon-pic-box {
    position: absolute;
    z-index: 300;
    width: 29px;
    height: 30px;
    margin-top: 42px;
    margin-left: 93px;
    overflow: hidden;
    border: 2px solid #95f204;
  }

  .web-loading-bg {
    width: 180px;
    height: 136px;
    margin-top: 35px;
    background-image: url('@/assets/images/u737.webp');
    background-size: 100%;
  }

  .defaultValue {
    position: absolute;
    margin-top: -40px;
  }

  ::v-deep(.ant-form-item-explain) {
    width: 1033px;
    margin: auto;
    margin-top: 18px;
  }
</style>
