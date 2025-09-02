<template>
  <div class="localSettingBox">
    <div class="localSettingItem">
      <BasicForm @register="mobileForm">
        <template #mobileSetting="{ model, field }">
          <div class="mobileSettingBox">
            <div style="width: 45%;">
              <BaseUploadDragger name="uploadfile" :upload-text="t('modalForm.system.system_drag_doc_tip')"
                :maxNumber="1" :showUploadList="true" :isShowPopover="true" :apiMap="localCellApiMap"
                :url="localCellImg" :CheckSize="true" :accept="'image/webp,image/png,image/jpeg'"
                :previewType="'h5limit'" :file-list="localCellList" @change="handleLocalCellUpload" :height="2340"
                :maxSize="500" :sizeUnit="'KB'" :width="1080" @remove="handleRemoveLocalCellUpload" :isShowButton="true"
                @save="handleSave" />
            </div>
            <div class="show-modale">
              <div class="h5-border">
                <Image :src="getDataTypePreviewUrl(localCellImg)" :preview="false" />
              </div>
            </div>
          </div>
        </template>
      </BasicForm>
    </div>
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
import Button from "@/views/member/addSubtractMoney/index.vue";

const { t } = useI18n();
const props = defineProps({
  mobileDetailInfo: {
    type: Object,
    default: () => ({}),
  },
  id: {
    type: String,
    default: '1',
  },
});

let h5SetDefault = ref(false);
let h5DefaultValue = ref('');
let schemas: FormSchema[] = [
  {
    field: 'mobile',
    component: 'Upload',
    label: t('modalForm.system.mobile_region_restriction_pic'),
    required: true,
    defaultValue: h5DefaultValue.value,
    slot: 'mobileSetting',
  },
];

watch(
  () => props.mobileDetailInfo,
  (val) => {
    if (val) {
      h5DefaultValue.value = val;
      localCellImg.value = val;
      h5SetDefault.value = true;
      updateSchema([
        {
          field: 'mobile',
          defaultValue: h5DefaultValue.value
            ? h5DefaultValue.value
            : t('modalForm.common.not_set'),
        },
      ]);
    }
  },
  { deep: true },
);
const [mobileForm, { updateSchema, validate, setFieldsValue: setFieldsValueBasicSettings }] =
  useForm({
    schemas,
    labelCol: { span: 24 },
    baseColProps: { span: 24 },
    actionColOptions: { span: 24 },
    showSubmitButton: false,
    showResetButton: false,
    submitFunc: handleSubmit,
  });
//
const localCellApiMap = reactive({
  uploadApi: uploadSiteBrand,
  language: null, //先写为null
});
const localCellImg = ref('');
const localCellList = ref([]);
// 上传成功返回
function handleLocalCellUpload(data) {
  localCellImg.value = data;
  localCellList.value = [{ uid: '1', name: data, status: 'done' }];
  setFieldsValueBasicSettings({ mobile: data });
  h5SetDefault.value = false;
}
// 删除
function handleRemoveLocalCellUpload(data) {
  localCellImg.value = '';
  localCellList.value = [];
  h5SetDefault.value = true;
}
//表单提交
async function handleSubmit() {
  const value = await validate();
  const { mobile, ...rest } = value;
  const params = {
    //id: props.id,
    name: 'area',
    ...rest,
    field: 'mobile',
    content: mobile,
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

.mobileSettingBox {
  display: flex;
  justify-content: center;
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

.pcImgBox {
  width: 318px;
  height: 338px;
  margin-top: 30px;
  border: 1px solid rgb(242 242 242 / 100%);
}

.localSettingItem {
  width: 100%;
}

.defaultValue {
  position: absolute;
  margin-top: -40px;
}

.h5-border {
  display: block;
  width: 197px;
  height: 414px;
  margin: auto;
  //background-color: red!important;
  background-image: url('@/assets/images/previewBorder/h5limit.webp');
  background-repeat: no-repeat;
  background-size: 100%;

  ::v-deep(.ant-image) {
    margin-top: 100px !important;

    img {
      width: 130px;
      height: auto;
      box-shadow: 0 0 40px -1px rgb(0 0 0 / 51%);
    }
  }
}
</style>
