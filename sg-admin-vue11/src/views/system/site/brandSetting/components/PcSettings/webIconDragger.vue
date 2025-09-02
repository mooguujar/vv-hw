<template>
  <div class="pc-setting-box">
    <div class="pc-setting-box-item">
      <BasicForm @register="favIconForm">
        <template #favIconSetting="{ model, field }">
          <div class="settingBox">
            <div style="width: 45%; height: 325px">
              <BaseUploadDragger
                name="uploadfile"
                :upload-text="t('modalForm.system.system_drag_doc_tip')"
                :maxNumber="1"
                :maxSize="2"
                :showUploadList="true"
                :isShowPopover="true"
                :height="64"
                :disabled="isControlValueSet()"
                :width="64"
                :apiMap="webIconApiMap"
                :url="webIconImg"
                :CheckSize="true"
                :accept="'image/webp,image/png,image/jpeg,image/vnd.microsoft.icon'"
                :isShowButton="true"
                :file-list="webIconfileList"
                :previewType="'pcIcon'"
                @change="handleChangewebIconUpload"
                @remove="handleRemovewebIconUpload"
                @save="handleSave"
                :bgColor="{
                  backgroundColor: getSettingStyle(currentTpl, 'pc_logo_white', 'backgroundColor'),
                }"
                :previewClss="getSettingStyle(currentTpl, 'pc_logo_white', 'previewClss')"
              />
            </div>
            <div style="margin-left: 100px">
              <!--            <div v-if="webIconSetDefault" class="defaultValue">-->
              <!--              {{ model.favIcon }}-->
              <!--            </div>-->

              <div class="pc-setting-box-item">
                <div class="web-icon-pic-box">
                  <Image :src="getDataTypePreviewUrl(webIconImg)" :preview="false" />
                  <!--                  <Image v-if="!webIconSetDefault" :src="getDataTypePreviewUrl(webIconImg)" />-->
                  <!--                  <Image v-if="webIconSetDefault" :src="getDataTypePreviewUrl(webIconDefaultValue)" />-->
                </div>
                <div
                  class="web-icon-bg"
                  :style="{
                    backgroundImage: `url(${getSettingStyle(
                      currentTpl,
                      'pc_logo_white',
                      'iconImg',
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
    iconData: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '1',
    },
  });
  watch(
    () => props.iconData,
    (val) => {
      if (val) {
        webIconImg.value = val;
        webIconSetDefault.value = true;
        webIconDefaultValue.value = val;
        updateSchema([
          {
            field: 'favIcon',
            defaultValue: webIconDefaultValue.value
              ? webIconDefaultValue.value
              : t('modalForm.common.not_set'),
          },
        ]);
      }
    },
    { deep: true },
  );
  const userStore = useUserStore();
  let webIconSetDefault = ref(false);
  let webIconDefaultValue = ref('');
  let onChangeImg = ref(false);
  let schemas: FormSchema[] = [
    {
      field: 'favIcon',
      component: 'Upload',
      label: t('modalForm.system.site_icon'),
      required: true,
      defaultValue: webIconDefaultValue.value,
      rulesMessageJoinLabel: true,
      slot: 'favIconSetting',
    },
  ];

  const [favIconForm, { updateSchema, validate, setFieldsValue: setFieldsValueBasicSettings }] =
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
  const webIconApiMap = reactive({
    uploadApi: uploadSiteBrand,
    language: null, //先写为null
  });
  //
  const webIconImg = ref('');
  const webIconfileList = ref([]);
  // 上传成功返回
  const handleChangewebIconUpload = (data) => {
    webIconImg.value = data;
    webIconfileList.value = [{ uid: '1', name: data, status: 'done' }];
    webIconSetDefault.value = false;
    onChangeImg.value = true;
    updateSchema([
      {
        field: 'favIcon',
        defaultValue: data,
      },
    ]);
    setFieldsValueBasicSettings({
      favIcon: data,
    });
  };
  //删除
  const handleRemovewebIconUpload = (data) => {
    webIconImg.value = '';
    webIconfileList.value = [];
    webIconSetDefault.value = true;
    onChangeImg.value = false;
  };
  // //表单提交
  async function handleSubmit() {
    const value = await validate();
    const { favIcon, ...rest } = value;
    const params = {
      //id: props.id,
      name: 'pc',
      ...rest,
      field: 'pc_icon',
      content: favIcon,
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
      onChangeImg.value = false;
    } else {
      message.error(data);
      onChangeImg.value = false;
    }
  }

  function handleSave(save) {
    if (save) {
      handleSubmit();
    }
  }

  onMounted(() => {
    let _data = props.iconData;
    if (_data) {
      webIconSetDefault.value = true;
      webIconDefaultValue.value = _data.image;
      updateSchema([
        {
          field: 'favIcon',
          defaultValue: webIconDefaultValue.value
            ? webIconDefaultValue.value
            : t('modalForm.common.not_set'),
        },
      ]);
    }
  });
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
    width: 514px;
    height: 412px;
    background-image: url('@/assets/images/previewBorder/pcLogDraggerIcon.webp');
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .web-icon-pic-box {
    position: absolute;
    z-index: 300;
    width: 9px;
    height: 9px;
    margin-top: 9px;
    margin-left: 118px;
    overflow: hidden;
    //border: 2px solid #95f204;
    background-color: black;

    ::v-deep(.ant-image-img) {
      display: flex;
      position: absolute;
      align-items: center;
      justify-content: center;
      width: auto;
      max-width: 9px;
      height: auto;
      max-height: 9px;
      //border: 1px solid red!important;
      margin-top: -16px !important;
    }
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

  .settingBox {
    display: flex;
    justify-content: center;
  }
</style>
