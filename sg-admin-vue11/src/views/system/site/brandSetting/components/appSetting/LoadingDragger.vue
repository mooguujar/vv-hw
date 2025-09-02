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
                :maxSize="2"
                :showUploadList="true"
                :isShowPopover="true"
                :height="500"
                :width="1000"
                :accept="'image/webp,image/png,image/jpeg'"
                :isShowButton="true"
                :apiMap="LoadingApiMap"
                :url="LoadingImg"
                :CheckSize="false"
                :file-list="LoadingfileList"
                @change="handleChangeLoadingUpload"
                @remove="handleRemoveLoadingUpload"
              />
            </div>
            <!--        <div v-if="LoadingSetDefault" class="defaultValue">-->
            <!--          {{ model.h5loading }}-->
            <!--        </div>-->
            <div class="show-modale">
              <div class="show-bg"></div>
              <Image v-if="logoPic" :src="getDataTypePreviewUrl(logoPic)" style="height: 20px" />
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
  const emit = defineEmits(['loadingPicChange']);
  const props = defineProps({
    loadingData: {
      type: Object,
      default: () => ({}),
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

  let LoadingSetDefault = ref(false);
  let loadingDefaultValue = ref('');
  let schemas: FormSchema[] = [
    {
      field: 'h5loading',
      component: 'Upload',
      label: t('modalForm.system.h5_app_loading'),
      slot: 'logoSetting',
      required: true,
      defaultValue: loadingDefaultValue.value,
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
  const LoadingApiMap = reactive({
    uploadApi: uploadSiteBrand,
    language: null, //先写为null
  });

  const LoadingImg = ref('');
  const LoadingfileList = ref([]);
  // 上传成功返回
  function handleChangeLoadingUpload(data) {
    LoadingImg.value = data;
    LoadingfileList.value = [{ uid: '1', name: data, status: 'done' }];
    LoadingSetDefault.value = false;
    updateSchema([
      {
        field: 'h5loading',
        defaultValue: data,
      },
    ]);
    setFieldsValueBasicSettings({ h5loading: data });
    emit('loadingPicChange', LoadingImg.value);
  }
  // 删除
  function handleRemoveLoadingUpload(data) {
    LoadingImg.value = '';
    LoadingfileList.value = [];
    LoadingSetDefault.value = true;
    emit('loadingPicChange', loadingDefaultValue.value);
  }

  //表单提交
  async function handleSubmit() {
    const value = await validate();
    const { h5loading, ...rest } = value;
    const params = {
      //id: props.id,
      ...rest,
      name: 'app',
      feild: 'app_loading_image',
      content: h5loading,
      //app_loading_image: h5loading,
      //app_logo_gray: h5loading,
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  }
  watch(
    () => props.loadingData,
    (val) => {
      if (val) {
        LoadingSetDefault.value = true;
        loadingDefaultValue.value = val;
        updateSchema([
          {
            field: 'h5loading',
            defaultValue: loadingDefaultValue.value
              ? loadingDefaultValue.value
              : t('modalForm.common.not_set'),
          },
        ]);
        emit('loadingPicChange', loadingDefaultValue.value);
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
    background-image: url('@/assets/images/previewBorder/app-h5-logo.webp');
    background-repeat: no-repeat;
    background-size: 100%;

    ::v-deep(.ant-image) {
      position: absolute;
      top: 11px;
      margin-left: 15px;
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

  // button 改不动
  .pc-setting-box-item {
    //border: 1px solid red;
    form {
      //border: 1px solid blue;
      :global {
        //.ant-row {
        //  border: 1px solid blue;
        //}
        //.ant-btn {
        //  margin-top: 20px;
        //}
      }
    }
  }

  ::v-deep(.ant-form-item-explain) {
    width: 1033px;
    margin: auto;
    margin-top: 18px;
  }
</style>
