<template>
  <div class="pc-setting-box">
    <div class="pc-setting-box-item">
      <BasicForm @register="loadingForm">
        <template #loadingSetting="{ model, field }">
          <BaseUploadDragger
            name="uploadfile"
            :upload-text="t('modalForm.system.system_drag_doc_tip')"
            :maxNumber="1"
            :maxSize="2"
            :showUploadList="true"
            :isShowPopover="true"
            :height="500"
            :width="1000"
            :apiMap="webLoadingApiMap"
            :url="webLoadingImg"
            :CheckSize="false"
            accept="image/webp"
            :file-list="webLoadingfileList"
            @change="handleChangewebLoadingUpload"
            @remove="handleRemovewebLoadingUpload"
            @save="handleSave"
          />
          <div v-if="webLoadingSetDefault" class="defaultValue">
            {{ model.loadingSpinner }}
          </div>
        </template>
      </BasicForm>
    </div>
    <div class="pc-setting-box-item">
      <div class="web-icon-pic-box">
        <Image v-if="!webLoadingSetDefault" :src="getDataTypePreviewUrl(webLoadingImg)" />
        <Image v-if="webLoadingSetDefault" :src="getDataTypePreviewUrl(webLoadingDefaultValue)" />
      </div>
      <div class="web-loading-bg"></div>
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

  const props = defineProps({
    loadingData: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: '1',
    },
  });

  const { t } = useI18n();

  let webLoadingSetDefault = ref(false);
  let webLoadingDefaultValue = ref('');
  let schemas: FormSchema[] = [
    {
      slot: 'loadingSetting',
      field: 'loadingSpinner',
      component: 'Upload',
      label: t('common.pageLoading'),
      required: true,
      defaultValue: webLoadingDefaultValue.value,
      rulesMessageJoinLabel: true,
    },
  ];
  const [loadingForm, { updateSchema, validate, setFieldsValue: setFieldsValueBasicSettings }] =
    useForm({
      schemas,
      labelCol: { span: 24 },
      baseColProps: { span: 24 },
      actionColOptions: { span: 24 },
      submitButtonOptions: {
        text: t('business.comon_save'),
      },
      showResetButton: false,
      submitFunc: handleSubmit,
    });
  const webLoadingApiMap = reactive({
    uploadApi: uploadSiteBrand,
    language: null, //先写为null
  });
  //
  const webLoadingImg = ref('');
  const webLoadingfileList = ref([]);
  // 上传成功返回
  const handleChangewebLoadingUpload = (data) => {
    webLoadingImg.value = data;
    webLoadingfileList.value = [{ uid: '1', name: data, status: 'done' }];
    webLoadingSetDefault.value = false;
    updateSchema([
      {
        field: 'loadingSpinner',
        defaultValue: data,
      },
    ]);
    setFieldsValueBasicSettings({
      loadingSpinner: data,
    });
  };
  //删除
  const handleRemovewebLoadingUpload = (data) => {
    webLoadingImg.value = '';
    webLoadingfileList.value = [];
    webLoadingSetDefault.value = true;
  };
  // //表单提交
  async function handleSubmit() {
    const value = await validate();
    const { loadingSpinner, ...rest } = value;
    const params = {
      id: props.id,
      ...rest,
      pc_loading_image: loadingSpinner,
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
        webLoadingImg.value = val;
        webLoadingSetDefault.value = true;
        webLoadingDefaultValue.value = val;
        updateSchema([
          {
            field: 'favIcon',
            defaultValue: webLoadingDefaultValue.value
              ? webLoadingDefaultValue.value
              : t('modalForm.common.not_set'),
          },
        ]);
      }
    },
    { deep: true },
  );

  function handleSave(save) {
    if (save) {
      handleSubmit();
    }
  }

  onMounted(() => {
    let _data = props.loadingData;
    if (_data) {
      webLoadingSetDefault.value = true;
      webLoadingDefaultValue.value = _data.image;
      updateSchema([
        {
          field: 'loadingSpinner',
          defaultValue: webLoadingDefaultValue.value
            ? webLoadingDefaultValue.value
            : t('modalForm.common.not_set'),
        },
      ]);
    }
  });
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

    .pc-setting-box-item {
      width: 45%;
    }
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
    margin-top: 73px;
    margin-left: 81px;
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
</style>
