<template>
  <div class="pc-setting-box mb-10px">
    <div class="settingItem">
      <BasicForm @register="restoreForm">
        <template #logoSetting="{ model, field }">
          <div class="settingBox">
            <div style="width: 45%; height: 325px">
              <BaseUploadDragger
                name="uploadfile"
                :upload-text="t('modalForm.system.system_drag_doc_tip')"
                :maxNumber="1"
                :showUploadList="true"
                :isShowPopover="true"
                :height="1024"
                :width="1024"
                :apiMap="RestoreApiMap"
                :url="RestoreImg"
                :CheckSize="true"
                :accept="'image/webp,image/png,image/jpeg'"
                :isShowButton="true"
                :file-list="RestorefileList"
                :previewType="'appIcon'"
                :maxSize="500"
                :sizeUnit="'KB'"
                @change="handleChangeRestoreUpload"
                @remove="handleRemoveRestoreUpload"
                @save="handleSave"
              />
            </div>
            <div class="show-modale">
              <div class="show-bg"></div>
              <div class="RestoreDraggerImgBox">
                <Image v-if="logoPic" :src="getDataTypePreviewUrl(logoPic)" :preview="false" />
              </div>
            </div>
          </div>
        </template>
      </BasicForm>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref, onMounted, watch } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { BaseUploadDragger } from '/@/components/BaseUploadDragger';
  import { Image, message } from 'ant-design-vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { updateSiteBrand, uploadSiteBrand } from '/@/api/sys/index';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['restorePicChange']);

  const props = defineProps({
    restoreData: {
      type: [Object, String],
    },
    id: {
      type: String,
      default: '1',
    },
    logoPic: {
      type: String,
      default: '',
    },
  });

  let LogoSetDefault = ref(false);
  let restoreDefaultValue = ref('');
  let schemas: FormSchema[] = [
    {
      field: 'h5restore',
      component: 'Upload',
      label: t('modalForm.system.app_repair_icon_cfg'),
      slot: 'logoSetting',
      required: true,
      defaultValue: restoreDefaultValue.value,
    },
  ];
  const [restoreForm, { updateSchema, validate, setFieldsValue: setFieldsValueBasicSettings }] =
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
  const RestoreApiMap = reactive({
    uploadApi: uploadSiteBrand,
    language: null, //先写为null
  });

  const RestoreImg = ref('');
  const RestorefileList = ref([]);
  // 上传成功返回
  function handleChangeRestoreUpload(data) {
    RestoreImg.value = data;
    RestorefileList.value = [{ uid: '1', name: data, status: 'done' }];
    LogoSetDefault.value = false;
    updateSchema([
      {
        field: 'h5restore',
        defaultValue: data,
      },
    ]);
    setFieldsValueBasicSettings({ h5restore: data });
    emit('restorePicChange', RestoreImg.value);
  }
  // 删除
  async function handleRemoveRestoreUpload() {
    RestoreImg.value = '';
    RestorefileList.value = [];
    LogoSetDefault.value = true;
    emit('restorePicChange', restoreDefaultValue.value);
    const params = {
      name: 'app',
      field: 'app_restore',
      content: 'sg.ipx.tw.6666',
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  }
  function handleSave(save) {
    if (save) {
      handleSubmit();
    }
  }
  //表单提交
  async function handleSubmit() {
    const value = await validate();
    const { h5restore, ...rest } = value;
    const params = {
      //id: props.id,
      ...rest,
      name: 'app',
      field: 'app_restore',
      content: h5restore,
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  }

  // onMounted(() => {
  //   let _data = props.restoreData;
  //   if (_data) {
  //     LogoSetDefault.value = true;
  //     restoreDefaultValue.value = _data.image;
  //     updateSchema([
  //       {
  //         field: 'h5restore',
  //         defaultValue: restoreDefaultValue.value ? restoreDefaultValue.value : '未设置',
  //       },
  //     ]);
  //     emit('restorePicChange', restoreDefaultValue.value);
  //   }
  // });
  watch(
    () => props.restoreData,
    (val) => {
      if (val) {
        RestoreImg.value = val;
        LogoSetDefault.value = true;
        restoreDefaultValue.value = val;
        updateSchema([
          {
            field: 'h5restore',
            defaultValue: restoreDefaultValue.value
              ? restoreDefaultValue.value
              : t('modalForm.common.not_set'),
          },
        ]);
        emit('restorePicChange', restoreDefaultValue.value);
      }
    },
    { deep: true },
  );
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
    background-image: url('@/assets/images/previewBorder/app-restore-logo.webp');
    background-repeat: no-repeat;
    background-size: 100%;

    .RestoreDraggerImgBox {
      display: flex;
      position: absolute;
      align-items: center;
      justify-content: center;
      width: 29px;
      height: 28px;
      margin-top: 275px;
      margin-left: 150px;
      overflow: hidden;
      border-radius: 7px;

      ::v-deep(.ant-image) {
        //position: absolute;
        //top: 274.3px;
        //margin-left: 150px;
        max-width: 28px;
        max-height: 29px;
        overflow: hidden;

        img {
          width: auto;
          max-width: 29px;
          height: auto;
          max-height: 28px;
        }
      }
    }
  }

  .show-bg {
    display: block;
    position: absolute;
    //background-color: red;
    top: 274px;
    width: 29px;
    height: 29px;
    margin-left: 150px;
    overflow: hidden;
    border-radius: 7px;
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
