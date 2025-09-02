<template>
  <div class="localSettingBox">
    <div class="localSettingItem">
      <BasicForm @register="pcForm">
        <template #pcSetting="{ model, field }">
          <div class="pcSettingBox">
            <div style="width: 45%;">
              <BaseUploadDragger name="uploadfile" :upload-text="t('modalForm.system.system_drag_doc_tip')"
                :maxNumber="1" :showUploadList="true" :isShowPopover="true" :height="1080" :width="1920"
                :apiMap="localPcApiMap" :url="localPcImg" :CheckSize="true" :accept="'image/webp,image/png,image/jpeg'"
                :previewType="'pclimit'" :file-list="localPcList" @change="handleLocalPcUpload" :maxSize="500"
                :sizeUnit="'KB'" @remove="handleRemoveLocalPcUpload" :isShowButton="true" @save="handleSave" />
              <!--          <div v-if="pcSetDefault" class="defaultValue">-->
              <!--            {{ model.pc }}-->
              <!--          </div>-->
            </div>
            <div class="show-modale">
              <div class="pc-border">
                <Image :src="getDataTypePreviewUrl(localPcImg)" :preview="false" v-if='localPcImg' />
              </div>
            </div>
          </div>
        </template>
      </BasicForm>
    </div>
    <!--    <div class="localSettingItem">-->
    <!--      <div class="pcImgBox" v-if="localPcImg">-->
    <!--        <Image :src="getDataTypePreviewUrl(localPcImg)" style="width: 100%" />-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { BasicForm, FormSchema, useForm } from '/@/components/Form';
import { BaseUploadDragger } from '/@/components/BaseUploadDragger';
import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
import { updateSiteBrand, uploadSiteBrand } from '/@/api/sys/index';
import { Image, message } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
const props = defineProps({
  pcDetailInfo: {
    type: Object,
    default: () => ({}),
  },
  id: {
    type: String,
    default: '1',
  },
});
let pcSetDefault = ref(false);
let h5DefaultValue = ref('');
let schemas: FormSchema[] = [
  {
    field: 'pc',
    component: 'Upload',
    label: t('modalForm.system.pc_region_restriction_pic'),
    required: true,
    defaultValue: h5DefaultValue.value,
    slot: 'pcSetting',
  },
];
watch(
  () => props.pcDetailInfo,
  (val) => {
    if (val) {
      h5DefaultValue.value = val;
      localPcImg.value = val;
      pcSetDefault.value = true;
      updateSchema([
        {
          field: 'pc',
          defaultValue: h5DefaultValue.value
            ? h5DefaultValue.value
            : t('modalForm.common.not_set'),
        },
      ]);
    }
  },
  { deep: true },
);
const [pcForm, { updateSchema, validate, setFieldsValue: setFieldsValueBasicSettings }] = useForm(
  {
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
  },
);
//
const localPcApiMap = reactive({
  uploadApi: uploadSiteBrand,
  language: null, //先写为null
});
const localPcImg = ref('');
const localPcList = ref([]);
// 上传成功返回
function handleLocalPcUpload(data) {
  localPcImg.value = data;
  localPcList.value = [{ uid: '1', name: data, status: 'done' }];
  setFieldsValueBasicSettings({ pc: data });
  pcSetDefault.value = false;
}
// 删除
function handleRemoveLocalPcUpload(data) {
  localPcImg.value = '';
  localPcList.value = [];
  pcSetDefault.value = true;
}
//表单提交
async function handleSubmit() {
  const value = await validate();
  const { pc, ...rest } = value;
  const params = {
    //id: props.id,
    name: 'area',
    ...rest,
    field: 'pc',
    content: pc,
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

// onMounted(() => {
//   const _data = props.pcDetailInfo;
//   if (_data) {
//     h5DefaultValue.value = _data.image;
//     localPcImg.value = _data.image;
//     pcSetDefault.value = true;
//     updateSchema([
//       {
//         field: 'pc',
//         defaultValue: h5DefaultValue.value ? h5DefaultValue.value : '未设置',
//       },
//     ]);
//   }
// });
</script>

<style lang="less" scoped>
.site-card-form {
  .ant-page-header-back {
    display: none;
  }
}

.localSettingBox {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  border: 1px solid #E1E1E1;
  background-color: #fff !important;

  .localSettingItem {
    ::v-deep(.ant-form-item-label) {
      height: 60px;
      margin-bottom: 30px;
      padding-left: 10px;
      border-bottom: 1px solid #E1E1E1;
      background-color: #F6F7FB;
      line-height: 60px;
    }

    ::v-deep(.image-container) {
      width: 100%;
      height: 320px;
    }
  }
}

.cellImgBox {
  width: 260px;
  height: 440px;
  margin-top: 30px;
  overflow: hidden;
  border: 1px solid rgb(242 242 242 / 100%);
}

.pcImgBox {
  width: 318px;
  height: 338px;
  margin-top: 30px;
  border: 1px solid rgb(242 242 242 / 100%);
}

.localSettingItem {
  width: 100%;
}

.show-modale {
  display: flex;
  width: 510px;
  height: 412px;
  margin-left: 105px;
  text-align: center;

  ::v-deep(.ant-image) {
    position: relative;
    margin: auto;
    margin-top: 0 !important;
  }
}

.pcSettingBox {
  display: flex;
  justify-content: center;
}

.defaultValue {
  position: absolute;
  margin-top: -40px;
}

.pc-border {
  display: block;
  width: 514px;
  height: 412px;
  margin: auto;
  //background-color: red!important;
  background-image: url('@/assets/images/previewBorder/pclimit.webp');
  background-repeat: no-repeat;
  background-size: 100%;

  ::v-deep(.ant-image) {
    margin-top: 100px !important;

    img {
      width: auto;
      max-width: 330px;
      height: auto;
      max-height: 139px;
      box-shadow: 0 0 15px -1px rgb(0 0 0 / 71%);
    }
  }
}
</style>
