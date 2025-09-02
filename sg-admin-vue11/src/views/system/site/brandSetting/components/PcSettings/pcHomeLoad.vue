<template>
  <div class="pc-setting-box mb-10px">
    <div class="pc-setting-box-item">
      <BasicForm @register="logoForm">
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
                :height="height"
                :width="'397-900'"
                :disabled="isControlValueSet()"
                :apiMap="pcLogApiMap"
                :url="pcLogImg"
                :CheckSize="false"
                :accept="'image/webp,image/png,image/jpeg'"
                :isShowButton="true"
                :file-list="pcLogfileList"
                @change="handleChangePcLogUpload"
                @save="handleSave"
                @remove="handleRemovePcLogUpload"
                :bgColor="{
                  backgroundColor: getSettingStyle(currentTpl, 'pc_logo_white', 'backgroundColor'),
                }"
                :previewClss="getSettingStyle(currentTpl, 'pc_logo_white', 'previewClss')"
              />
            </div>
            <div style="margin-left: 100px">
              <div class="pc-setting-box-item">
                <div class="pc-log-pic-box">
                  <Image
                    :src="getDataTypePreviewUrl(pcLogImg)"
                    width="143"
                    height="116"
                    :preview="false"
                  />
                </div>
                <div
                  class="pc-log-bg"
                  :style="{
                    backgroundImage: `url(${getSettingStyle(
                      currentTpl,
                      'pc_logo_white',
                      'bgImg',
                    )})`,
                  }"
                ></div>
              </div>
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
  import { Image, message } from 'ant-design-vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { updateSiteBrand, uploadSiteBrand } from '/@/api/sys/index';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getSettingStyle } from '/@/views/common/common';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const props = defineProps({
    pcLogData: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'white',
    },
    id: {
      type: String,
      default: '1',
    },
    width: {
      type: Number,
      default: 67,
    },
    height: {
      type: Number,
      default: 34,
    },
  });

  watch(
    () => props.pcLogData,
    (val) => {
      if (val) {
        pcLogImg.value = val;
        pcLogSetDefault.value = true;
        pcDefaultValue.value = val;
        updateSchema([
          {
            field: 'pcLogo',
            defaultValue: pcDefaultValue.value
              ? pcDefaultValue.value
              : t('modalForm.common.not_set'),
          },
        ]);
      }
    },
    { deep: true },
  );
  const userStore = useUserStore();
  let pcLogSetDefault = ref(false);
  let pcDefaultValue = ref('');
  let schemas: FormSchema[] = [
    {
      field: 'pcLogo',
      component: 'Upload',
      label:
        props.type == 'white'
          ? t('modalForm.system.PC_logo_gray_loading')
          : props.type == 'gray'
          ? t('modalForm.system.PC_logo_gray')
          : t('modalForm.system.PC_logo_shink'),
      slot: 'logoSetting',
      defaultValue: pcDefaultValue.value,
    },
  ];
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
  const pcLogApiMap = reactive({
    uploadApi: uploadSiteBrand,
    language: null, //先写为null
    type: 'pcLogDataIcon',
  });

  const pcLogImg = ref('');
  const pcLogfileList = ref([]);
  const onChangeImg = ref(false);
  // 上传成功返回
  function handleChangePcLogUpload(data) {
    pcLogImg.value = data;
    pcLogfileList.value = [{ uid: '1', name: data, status: 'done' }];
    pcLogSetDefault.value = false;
    onChangeImg.value = true;
    updateSchema([
      {
        field: 'pcLogo',
        defaultValue: data,
      },
    ]);
    setFieldsValueBasicSettings({
      pcLogo: data,
    });
  }
  // 删除
  function handleRemovePcLogUpload(data) {
    pcLogImg.value = '';
    pcLogfileList.value = [];
    pcLogSetDefault.value = true;
    onChangeImg.value = false;
  }

  function handleSave(save) {
    if (save) {
      handleSubmit();
    }
  }

  //表单提交
  async function handleSubmit() {
    const value = await validate();
    const { pcLogo, ...rest } = value;
    const params = {
      name: 'pc',
      ...rest,
    };
    if (props.type == 'white') params['field'] = 'home_page_loading';
    else if (props.type == 'gray') params['field'] = 'pc_logo_gray';
    else params['field'] = 'pc_first_letter';
    params['content'] = pcLogo;
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
      onChangeImg.value = false;
    } else {
      message.error(data);
      onChangeImg.value = false;
    }
  }
  const currentTpl = computed(() => {
    return userStore.getCurrentSite['tpl'] || 1;
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
    border: 1px solid #e1e1e1;
    background-color: #fff;

    .pc-setting-box-item {
      width: 100%;
      //height: 560px;
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

  .pc-log-bg {
    //margin-top: 35px;
    width: 514px;
    height: 412px;
    // background-image: url('@/assets/images/loadingBg.webp');
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .pc-log-pic-box {
    position: absolute;
    z-index: 300;
    width: 153px;
    height: 75px;
    //border: 1px solid rgb(149, 242, 4);
    margin-top: 90px;
    margin-left: 180px;
    background-color: rgb(26 44 55);

    ::v-deep(.ant-image-img) {
      position: absolute;
      width: 150px;
      //max-width: 22px;
      height: auto;
      //max-height: 8px;
      //border: 1px solid red!important;

      img {
        width: auto;
        //max-width: 22px;
        height: auto;
        //max-height: 8px;
      }
    }
  }

  .web-icon-bg {
    //margin-top: 35px;
    width: 514px;
    height: 412px;
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
    //margin-top: 35px;
    width: 514px;
    height: 412px;
    background-image: url('@/assets/images/u737.webp');
    background-size: 100%;
  }

  .defaultValue {
    position: absolute;
    margin-top: -40px;
  }

  .settingBox {
    display: flex;
    justify-content: center;
  }
</style>
