<template>
  <UploadDragger
    class="image-container"
    v-model:file-list="fileData"
    :multiple="multiple"
    :name="name"
    :showUploadList="showUploadList"
    :accept="accept"
    :customRequest="customUpload"
    :previewType="previewType"
    :headers="{
      authorization: 'authorization-text',
      t: token,
      lang: lang,
    }"
    :maxCount="maxNumber"
    @drop="handleDrop"
    @remove="handRemove"
  >
    <div class="w-full h-full flex justify-center items-center">
      <div>
        <p class="ant-upload-drag-icon">
          <inbox-outlined />
        </p>
        <p class="ant-upload-text" v-html="uploadText"></p>
        <p class="ant-upload-hint" v-if="isUploadTextBotom">WEB/APP</p>
        <p class="ant-upload-hint" v-else>
          {{ t('common.pic_format') }}：{{ acceptFileType }}， {{ t('common.pic_size') }}：<span
            v-if="showLimitSize"
            >{{ width }}*{{ height }}</span
          ><span v-else>{{ t('common.pic_no_Limit') }}</span
          >，{{ t('common.size') }}：{{ maxSize }}{{ sizeUnit }}
        </p>
      </div>
      <!-- 新的图片预览 -->
      <div v-if="fileUrl" class="upload-container">
        <div class="upload-image-section">
          <div class="upload-overlay"></div>
          <div class="upload-option">
            <span @click.stop="handlePreview">
              <eye-outlined :style="{ fontSize: '18px', color: '#444444' }" />
            </span>
            <span @click.stop="handRemove">
              <delete-outlined :style="{ fontSize: '18px', color: '#E91134' }" />
            </span>
          </div>
          <img
            v-if="!previewType"
            class="image-preview"
            :src="getDataTypePreviewUrl(fileUrl)"
            alt=""
          />
        </div>
        <div class="w-610px flex-1 flex justify-between mt-10px">
          <div class="text-left">
            <p style="color: #444">WEB/APP</p>
            <p style="color: #b5b5b5">{{ t('modalForm.system.system_drag_doc_tip') }}</p>
          </div>
          <div>
            <button class="upload-upload-button">{{ t('modalForm.system.re_upload') }}</button>
          </div>
        </div>
      </div>
      <!-- 新的图片预览结束 -->
    </div>
  </UploadDragger>
  <Modal
    :visible="previewVisible"
    :title="t('table.system.system_img_view')"
    width="560"
    :footer="null"
    @cancel="handleCancel"
    centered
    wrapClassName="previewPicModal"
  >
    <div v-if="fileUrl && !previewType" class="previewBox">
      <img alt="example" :src="getDataTypePreviewUrl(fileUrl)" />
    </div>
    <div v-if="fileUrl && previewType === 'h5limit'" class="previewBox">
      <div class="h5limitBg">
        <img alt="example" :src="getDataTypePreviewUrl(fileUrl)" />
      </div>
    </div>
    <div v-if="fileUrl && previewType === 'pclimit'" class="previewBox">
      <div class="pclimitBg" style="width: 500px">
        <img alt="example" :src="getDataTypePreviewUrl(fileUrl)" />
      </div>
    </div>
    <div v-if="fileUrl && previewType === 'pcIcon'" class="previewBox">
      <div class="pcIconBg w-140px">
        <img class="h-97px" :src="getDataTypePreviewUrl(fileUrl)" alt="" />
      </div>
    </div>
    <div v-if="fileUrl && previewType === 'appIcon'" class="previewBox">
      <div class="appIconBg">
        <img class="h-97px" :src="getDataTypePreviewUrl(fileUrl)" alt="" />
      </div>
    </div>
    <div v-if="fileUrl && previewType === 'appDownIcon'" class="previewBox">
      <div class="appDownIconBg">
        <img class="h-97px" :src="getDataTypePreviewUrl(fileUrl)" alt="" />
      </div>
    </div>
    <div v-if="fileUrl && previewType === 'openingIcon'" class="previewBox">
      <div class="openingIconBg">
        <div class="h-60px w-62px mt-81px openingIconSheet"></div>
        <div class="openingIconImg">
          <img :src="getDataTypePreviewUrl(fileUrl)" alt="" />
        </div>
      </div>
    </div>
    <div v-if="fileUrl && previewType === 'openingIconNew'" class="previewBox">
      <div class="openingIconBg">
        <div class="h-312px w-148px openingIconSheet"></div>
        <div class="openingIconImg1">
          <img :src="getDataTypePreviewUrl(fileUrl)" alt="" />
        </div>
      </div>
    </div>
    <div v-if="fileUrl && previewType === 'leadDragger'" class="previewBox">
      <div class="leadDragger">
        <div class="h-56px w-60px leadDraggerSheet"></div>
        <div class="leadDraggerImg"><img :src="getDataTypePreviewUrl(fileUrl)" alt="" /></div>
      </div>
    </div>
    <span>{{ previewType }}</span>
  </Modal>
  <div v-if="isShowPopover && isShowButton" class="!h-10 url-item">
    <Popover placement="bottomLeft" v-if="!!fileUrl">
      <div class="url-item-box">
        <div><img v-if="fileUrl" :src="pre" class="h-28px mr-10px" />{{ fileUrl }}</div>
        <div
          ><Button type="primary" @click="handSave">{{ t('common.saveText') }}</Button></div
        >
      </div>
    </Popover>
    <div v-else class="url-item-box">
      <div><img v-if="isDisplayButton" :src="pre" class="h-28px mr-10px" />{{ fileUrl }}</div>
      <div
        ><Button type="primary" @click="handSave" v-if="isDisplayButton">{{
          t('common.saveText')
        }}</Button></div
      >
    </div>
  </div>
  <div style="flex: 1" v-if="isShowInput">
    <div>{{ fileUrl }}</div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, toRefs, watchEffect } from 'vue';
  import { InboxOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue';
  import { UploadDragger, Popover, message, Modal, Button } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useLocale } from '/@/locales/useLocale';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { useI18n } from '/@/hooks/web/useI18n';
  import pre from '/@/assets/images/previewIcon.webp';

  const { t } = useI18n();
  const emit = defineEmits(['change', 'remove', 'save']);

  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
    name: {
      type: String,
      default: 'file',
    },
    action: {
      type: String,
      default: '/file/upload/photo',
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/png,image/gif,image/jpg,image/webp',
    },
    url: {
      type: String,
      default: '',
    },
    showUploadList: {
      type: Boolean,
      default: false,
    },
    checkSize: {
      type: Boolean,
      default: true,
    },
    isShowInput: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    isShowPopover: {
      type: Boolean,
      default: false,
    },
    inputDisabled: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: useI18n().t('table.discountActivity.discount_upload_pic'),
    },
    maxNumber: {
      type: Number,
    },
    maxSize: {
      type: Number,
    },
    sizeUnit: {
      type: String,
      default: 'MB',
    },
    uploadText: {
      type: String,
      default: `${useI18n().t(
        'common.translate.drag_files',
      )}<span class="primary-color">${useI18n().t('common.translate.clickUpload')}</span>`,
    },
    height: {
      type: Number,
    },
    width: {
      type: [Number, String],
      default: '500',
    },
    previewType: {
      type: String,
      default: '',
    },
    isShowButton: {
      type: Boolean,
      default: false,
    },
    isDisplayButton: {
      type: Boolean,
      default: false,
    },
    showLimitSize: {
      type: Boolean,
      default: true,
    },
    isUploadTextBotom: {
      type: Boolean,
      default: false,
    },
  });
  const previewVisible = ref(false);
  const fileData = ref([]);
  const userStore = useUserStore();
  const token = userStore.getToken;
  const lang = useLocale().getLocale.value;
  const fileUrl = ref(props.url);
  const showUploadList = ref(props.showUploadList);

  const acceptFileType = computed(() =>
    props.accept
      .split(',')
      .map((type) => {
        if (type.includes('icon')) {
          return 'ICON'; // 处理 microsoft icon
        }
        return type.replace('image/', ''); // 移除 'image/' 前缀
      })
      .join(', ')
      .toUpperCase(),
  );

  const { fileList, url } = toRefs(props);

  watchEffect(() => {
    fileUrl.value = url.value;
    fileData.value = fileList.value;
  });
  const fileSizeCheck = ref(false);

  const handleCancel = () => {
    previewVisible.value = false;
  };
  const handlePreview = async (file: any) => {
    previewVisible.value = true;
  };

  const beforeUploadFile = async (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve, reject) => {
        reader.onload = (event) => {
          if (event.target?.result) {
            const img = new (window as any).Image();
            img.src = event.target.result as string;
            const dataURI = img.src;
            // 将data URI解码为原始二进制数据
            // 计算二进制数据的大小
            const fileSizeInKB = file.size / 1024;
            const fileSizeInMB = file.size / 1024 / 1024;
            if (props.sizeUnit == 'KB') {
              if (fileSizeInKB > props.maxSize) {
                fileData.value = [];
                return message.error(`${t('common.must_smaller')} ${props.maxSize}KB`);
              }
            } else if (props.sizeUnit === 'MB') {
              if (fileSizeInMB > props.maxSize) {
                fileData.value = [];
                return message.error(`${t('common.must_smaller')} ${props.maxSize}MB`);
              }
            }
            if (!props.accept.split(',').includes(file.type)) {
              fileData.value = [];
              const type = props.accept
                .replace(/image\//g, '')
                .replace(/,/g, ',')
                .toUpperCase();
              message.error(`${t('common.translate.image_format', { size: type })}`);
              resolve(false);
            }

            img.onload = () => {
              if (props.checkSize) {
                let isSizeValid;
                if (typeof props.width === 'string' && props.width.includes('-')) {
                  const [minWidth, maxWidth] = props.width.split('-').map(Number);
                  isSizeValid =
                    img.width >= minWidth && img.width <= maxWidth && img.height == props.height;
                } else {
                  isSizeValid = img.width == props.width && img.height == props.height;
                }
                fileSizeCheck.value = isSizeValid;
                if (!isSizeValid) {
                  fileData.value = [];
                  message.error(`${t('common.must_size')} ${props.width} * ${props.height}`);
                  resolve(false);
                } else {
                  resolve(true);
                }
              } else {
                fileSizeCheck.value = true;
                resolve(true);
              }
            };
          } else {
            message.error(t('v.discount.activity.cannot_read_file'));
            fileSizeCheck.value = false;
            resolve(false);
          }
        };
      });
    }
    return true;
  };

  const customUpload = async (e) => {
    if (!e.file.type.startsWith('image/')) {
      if (!props.accept.split(',').includes(e.file.type)) {
        fileData.value = [];
        const type = props.accept
          .replace(/image\//g, '')
          .replace(/,/g, ',')
          .toUpperCase();
        message.error(`${t('common.translate.image_format', { size: type })}`);
        return false;
      }
    }

    const isFileValid = await beforeUploadFile(e.file);
    if (!isFileValid) return false;

    const params = {
      file: e.file,
      name: 'uploadfile',
      ...(props.apiMap.language && { lang: props.apiMap.language }),
    };

    try {
      const type = props?.apiMap?.type ? props?.apiMap?.type : 'defaultType'; // 或者提供一个合适的默认值
      const { data } = await props.apiMap.uploadApi(params, type);
      if (data.status) {
        const imageUrl = data.data;
        emit('change', imageUrl);
        e.onSuccess(imageUrl, e);
        message.success(t('component.upload.uploadSuccess'));
      } else {
        message.error(data.data);
      }
    } catch (error) {
      console.error(error);
      message.error(t('component.upload.uploadError'));
      throw new Error(error.response.data);
    }
  };

  function handleDrop(e: DragEvent) {}

  const handRemove = (e) => {
    emit('remove', props.apiMap.language);
  };

  const handSave = () => {
    emit('save', 'toSave');
  };
</script>

<style scoped>
  .image-container {
    position: relative;
  }

  .overlayImg {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #d9d9d9;

    /* 添加过渡效果 */
  }

  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;

    /* 初始时设置透明度为0 */
    transition: opacity 0.3s ease;
    opacity: 0;
    background-color: rgb(0 0 0 / 50%);

    span {
      font-size: 0;
    }

    span:first-child::before {
      content: '';
      display: block;
      width: 34px;
      height: 34px;
      border-radius: 5px;
    }

    span:nth-child(2)::before {
      content: '';
      display: block;
      width: 34px;
      height: 34px;
      margin-left: 5px;
      border-radius: 5px;
    }
  }

  .image-section:hover .overlay {
    opacity: 1;

    /* 鼠标移上去时设置透明度为1 */
  }

  .cursor {
    display: inline-block;
    width: auto;
  }

  .url-item {
    display: flex;
    height: 60px !important;
    margin-top: 10px;
    padding: 14px 20px;
    border: 1px solid #dce3f1;
    border-radius: 4px;
    background: #f6f9ff;

    span {
      width: 100%;

      /* border:1px solid red!important; */
    }

    .url-item-box {
      display: flex;
      position: relative;
      justify-content: space-between;
      width: 100%;
      float: left;

      div {
        line-height: 2;
      }
    }
  }

  /* 上传区背景 */
  .pcIconBg,
  .appIconBg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 140px;
    overflow: hidden;
    background-color: #0f212e;

    img {
      width: auto;
      max-width: 140px;
      height: auto;
      max-height: 140px;

      /* border:1px solid red!important; */
    }
  }

  .appIconBg {
    border-radius: 40px !important;
  }

  .appDownIconBg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 140px;

    img {
      width: auto;
      max-width: 140px;
      height: auto;
      max-height: 140px;

      /* border:1px solid red!important; */
    }
  }

  .openingIconBg {
    display: block;
    width: 148px;
    height: 312px;
    overflow: hidden;
    background-image: url('/@/assets/images/previewBorder/open-dragger-bg.webp');
    background-repeat: no-repeat;
    background-size: 100%;

    .openingIconSheet {
      display: block;
      position: absolute;
      margin-left: 43px;
      border-radius: 15px;
      background-color: #1b2d38;
    }

    .openingIconImg {
      display: flex;
      position: absolute;
      align-items: center;
      justify-content: center;
      width: 62px;
      height: 60px;
      margin-top: 81px;
      margin-left: 42px;
      overflow: hidden;
      border-radius: 17px;

      img {
        width: auto;
        max-width: 62px;
        height: auto;
        max-height: 60px;
      }
    }

    .openingIconImg1 {
      display: flex;
      position: absolute;
      align-items: center;
      justify-content: center;
      width: 148px;
      height: 312px;
      overflow: hidden;
      border-radius: 17px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .leadDragger {
    display: block;
    width: 500px;
    height: 67.73px;
    background-image: url('/@/assets/images/previewBorder/lead-dragger-bg.webp');
    background-repeat: no-repeat;
    background-size: 100%;

    .leadDraggerSheet {
      position: absolute;
      margin-top: 5px;
      margin-left: 64px;
      border-radius: 12px;
      background-color: #304554;
    }

    .leadDraggerImg {
      display: flex;
      position: absolute;
      align-items: center;
      justify-content: center;
      width: 55px;
      height: 56px;
      margin-top: 5px;
      margin-left: 70px;
      overflow: hidden;
      border-radius: 12px;

      img {
        width: auto;
        max-width: 55px;
        height: auto;
        max-height: 56px;
        margin-left: 0 !important;
      }
    }
  }

  .h5limitBg {
    display: flex;
    width: 158px;
    height: 298px;
    border-radius: 4px;
    background-color: #fff;

    img {
      width: auto;
      max-width: 66.5%;
      height: auto;
      max-height: 200px;
      margin: auto;
      box-shadow: 0 0 40px -1px rgb(0 0 0 / 51%);
    }
  }

  .pclimitBg {
    display: flex;
    width: 550px;
    height: 282px;
    border-radius: 4px;
    background-color: #fff;

    img {
      width: auto;
      max-width: 330px;
      height: auto;
      max-height: 139px;
      margin: auto;
      box-shadow: 0 0 15px -1px rgb(0 0 0 / 71%);
    }
  }

  .image-preview {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    border-radius: 8px;
  }

  /** 上传后的样式 */
  .uploaded-container {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  .image-section {
    position: relative;
    width: 300px; /* 根据需要调整 */
    height: 110px; /* 根据需要调整 */
    margin-right: 20px;
    overflow: hidden;
    border-radius: 8px;
    background-color: #1b2d38; /* 背景色 */
  }

  .upload-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .upload-button {
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
  }

  /* 新的图片预览 */
  .upload-container {
    display: flex;
    position: absolute;
    top: 0;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 30px;
    background-color: #fff;
  }

  .upload-image-section {
    position: relative;
    width: 610px;
    height: 220px;
    overflow: hidden;
    border-radius: 8px;
    background-color: #1b2d38;
  }

  .upload-overlay {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease;
    opacity: 0;
    background-color: rgb(0 0 0 / 50%);
    pointer-events: none;
  }

  .upload-option {
    display: flex;
    position: absolute;
    z-index: 2;
    top: 10px;
    right: 10px;
    transition: opacity 0.3s ease;
    opacity: 0;
    gap: 8px;
  }

  .upload-option span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    transition: all 0.3s;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
  }

  .upload-option span:hover {
    background-color: #f0f0f0;
  }

  /* 鼠标悬停时显示蒙层和操作按钮 */
  .upload-image-section:hover .upload-overlay,
  .upload-image-section:hover .upload-option {
    opacity: 1;
  }

  .upload-upload-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .upload-upload-button {
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
  }
</style>
