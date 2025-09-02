<template>
  <div class="pc-setting-box mb-10px">
    <div class="settingItem">
      <BasicForm @register="openForm">
        <template #openSetting="{ model, field }">
          <div class="settingBox">
            <div style="width: 45%; height: 325px">
              <BaseUploadDragger
                name="uploadfile"
                :upload-text="t('modalForm.system.system_drag_doc_tip')"
                :maxNumber="1"
                :showUploadList="true"
                :isShowPopover="true"
                :height="2340"
                :width="1080"
                :apiMap="OpenApiMap"
                :url="OpenImg"
                :CheckSize="true"
                :accept="'image/webp,image/png,image/jpeg'"
                :isShowButton="true"
                :file-list="OpnefileList"
                :previewType="'openingIconNew'"
                :maxSize="500"
                :sizeUnit="'KB'"
                @change="handleChangeOpenUpload"
                @remove="handleRemoveOpenUpload"
                @save="handleSave"
              />
            </div>
            <div class="show-modale">
              <div class="show-bg"></div>
              <div class="openDraggerImgBox">
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
  const emit = defineEmits(['openPicChange']);
  const props = defineProps({
    openData: {
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

  let OpenSetDefault = ref(false);
  let openDefaultValue = ref('');
  let schemas: FormSchema[] = [
    {
      field: 'h5open',
      component: 'Upload',
      label: t('modalForm.system.app_open_cfg'),
      slot: 'openSetting',
      required: true,
      defaultValue: openDefaultValue.value,
    },
  ];
  const [openForm, { updateSchema, validate, setFieldsValue: setFieldsValueBasicSettings }] =
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
  const OpenApiMap = reactive({
    uploadApi: uploadSiteBrand,
    language: null, //先写为null
  });

  const OpenImg = ref('');
  const OpnefileList = ref([]);
  // 上传成功返回
  function handleChangeOpenUpload(data) {
    OpenImg.value = data;
    OpnefileList.value = [{ uid: '1', name: data, status: 'done' }];
    OpenSetDefault.value = false;
    updateSchema([
      {
        field: 'h5open',
        defaultValue: data,
      },
    ]);
    setFieldsValueBasicSettings({ h5open: data });
    emit('openPicChange', OpenImg.value);
  }
  // 删除
  function handleRemoveOpenUpload(data) {
    OpenImg.value = '';
    OpnefileList.value = [];
    OpenSetDefault.value = true;
    emit('openPicChange', openDefaultValue.value);
  }

  function handleSave(save) {
    if (save) {
      handleSubmit();
    }
  }

  //表单提交
  async function handleSubmit() {
    const value = await validate();
    const { h5open, ...rest } = value;
    const params = {
      //id: props.id,
      ...rest,
      name: 'app',
      content: h5open,
      field: 'app_open',
      // app_open_image: h5open,
      //app_open: h5open,
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  }

  // onMounted(() => {
  //   let _data = props.openData;
  //   if (_data) {
  //     OpenSetDefault.value = true;
  //     openDefaultValue.value = _data.image;
  //     updateSchema([
  //       {
  //         field: 'h5open',
  //         defaultValue: openDefaultValue.value ? openDefaultValue.value : '未设置',
  //       },
  //     ]);
  //     emit('openPicChange',openDefaultValue.value);
  //   }
  // });
  watch(
    () => props.openData,
    (val) => {
      if (val) {
        OpenImg.value = val;
        OpenSetDefault.value = true;
        openDefaultValue.value = val;
        updateSchema([
          {
            field: 'h5open',
            defaultValue: openDefaultValue.value
              ? openDefaultValue.value
              : t('modalForm.common.not_set'),
          },
        ]);
        emit('openPicChange', openDefaultValue.value);
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
    background-image: url('@/assets/images/previewBorder/open-dragger.webp');
    background-repeat: no-repeat;
    background-size: 100%;

    .openDraggerImgBox {
      display: flex;
      position: absolute;
      align-items: center;
      justify-content: center;
      width: 197px;
      height: 414px;
      overflow: hidden;
      border-radius: 20px;
    }

    ::v-deep(.ant-image) {
      max-width: 100%;
      max-height: 100%;

      img {
        width: auto;
        max-width: 100%;
        height: auto;
        max-height: 100%;
      }
    }
  }

  .show-bg {
    display: block;
    position: absolute;
    //background-color: red;
    top: 114px;
    width: 80px;
    height: 80px;
    margin-left: 58px;
    overflow: hidden;
    border-radius: 20px;
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
