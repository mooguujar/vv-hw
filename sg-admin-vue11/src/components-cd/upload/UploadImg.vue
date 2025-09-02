<template>
  <div class="uploadMain">
    <Upload
      v-model:fileList="imgList"
      list-type="picture-card"
      class="w-full"
      :class="imgList_total.length >= showUpload ? 'un_add_card_' : ''"
      :accept="accept"
      :headers="{
        authorization: 'authorization-text',
        t: token,
        lang: lang,
      }"
      :name="name"
      :maxCount="maxCount"
      :before-upload="beforeUpload"
      :customRequest="customUpload"
      @preview="handlePreview"
      @remove="handRemove"
    >
      <div v-show="imgList_total.length < showUpload">
        <img :src="addField" alt="" />
        <div
          style="
            margin-top: 8px;
            color: #444;
            font-size: 12px;
            font-weight: 500;
            line-height: normal;
          "
        >
          <div>{{ describe }}</div>
          <div>{{ limitNum }}</div>
        </div>
      </div>
      <!-- <div v-else>
        <img :src="addField" alt="" />
        <div
          style="
            margin-top: 8px;
            color: #444;
            font-size: 12px;
            font-weight: 500;
            line-height: normal;
          "
        >
          <div>{{ describe }}</div>
          <div>{{ limitNum }}</div>
        </div>
      </div> -->
    </Upload>
    <Modal
      :visible="previewVisible"
      :title="modalTitle"
      :destroyOnClose="true"
      :footer="null"
      :centered="true"
      :width="modalSize[0]"
      :height="modalSize[1]"
      @cancel="handleCancelPreview"
    >
      <div class="w-full p-5">
        <img class="rounded-[4px]" :src="preImgUrl" alt="" style="width: 100%" />
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
  import { useUserStore } from '/@/store/modules/user';
  import { useLocale } from '/@/locales/useLocale';
  import { Upload, Modal, message } from 'ant-design-vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { computed, ref, watch } from 'vue';
  import addField from '/@/assets/svg/addField.svg';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface Props {
    fileList: any[];
    name: string;
    accept: string;
    maxCount: number;
    limitNum: string | number;
    describe: string;
    modalTitle: string;
    limitSizeObj: {
      width: number | boolean;
      height: number | boolean;
    };
    showUpload: number;
    beforeUpload_: Function;
    fileList_clear: boolean;
    modalSize: [number, number];
    api: (data: any) => any;
  }
  const { t } = useI18n();
  const props = defineProps<Props>();

  const emits = defineEmits(['update:fileList', 'remove', 'success']);
  const userStore = useUserStore();
  const token = userStore.getToken;
  const lang = useLocale().getLocale.value;
  const previewVisible = ref(false);

  const showUpload = ref(props.showUpload);
  const imgList = ref(props.fileList);
  const imgList_total = ref(imgList.value);
  const limitSizeObj = computed(() => props.limitSizeObj);
  const preImgUrl = computed(() => props.fileList[0].url);
  const modalSize = computed(() => props.modalSize);
  const accept = computed(() => props.accept);
  watch(
    () => props.fileList_clear,
    (newV) => {
      if (newV) {
        imgList.value = [];
        imgList_total.value = [];
      }
    },
  );
  function handlePreview() {
    previewVisible.value = true;
  }
  function handleCancelPreview() {
    previewVisible.value = false;
  }
  function handRemove(e) {
    imgList_total.value.pop();
    emits('remove', e);
  }
  function beforeUpload(file, list?) {
    if (props.beforeUpload_) {
      if (!props.beforeUpload_(file)) {
        setTimeout(() => {
          imgList.value.pop();
        }, 111);
        return false;
      }
    }
    if (!file.type.startsWith('image/')) {
      return message.error('无法读取文件');
    }
    if (!props.accept.split(',').includes(file.type)) {
      const type = props.accept
        .replace(/image\//g, '')
        .replace(/,/g, ',')
        .toUpperCase();
      message.error(`图片格式必须为${type}`);
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onload = (event) => {
        // 读取完成后，event.target.result 将包含 Data URL
        if (event.target?.result) {
          const img = new Image();
          img.src = event.target.result as string;

          // 计算大小，决定是否通过
          // const fileSizeInKB = file.size / 1024;
          // const fileSizeInMB = file.size / 1024 / 1024;
          // if (sizeUnit == 'KB') {
          //   if (fileSizeInKB > maxSize) {
          //     fileData.value = [];
          //     return message.error(`图片大小必须小于 ${maxSize}KB`);
          //   }
          // } else if (sizeUnit == 'MB') {
          //   if (fileSizeInMB > maxSize) {
          //     fileData.value = [];
          //     return message.error(`图片大小必须小于 ${maxSize}MB`);
          //   }
          // }
          img.onload = () => {
            if (limitSizeObj.value.width)
              if (
                img.width != limitSizeObj.value.width ||
                img.height != limitSizeObj.value.height
              ) {
                message.error(
                  `图片尺寸必须是 ${limitSizeObj.value.width} x ${limitSizeObj.value.height}`,
                );
                return resolve(false);
              }
            resolve(true);
          };
        } else {
          message.error('无法读取文件');
          return resolve(false);
        }
      };
    });
  }

  async function customUpload(e) {
    const msg = await beforeUpload(e.file);
    if (imgList_total.value.length >= showUpload.value) {
      message.error(`图片上传数量已达上限。`);
      return false;
    }
    if (!msg) {
      e.onError(new Error('文件类型不符合要求'), null);
      // imgList.value = [];
      return false;
    }
    const params = {
      file: e.file,
      name: props.name,
      lang: lang,
    };

    try {
      const { data } = await props.api(params);
      const imageUrl = data.data;
      // 转化为有效路径
      const validUrl = await getDataTypePreviewUrl(imageUrl);
      e.onSuccess(imageUrl, e);
      emits('update:fileList', [{ url: validUrl, backUrl: imageUrl }]);
      emits('success', imageUrl);
      imgList_total.value.push(imageUrl);
      message.success(t('component.upload.uploadSuccess'));
    } catch (error) {
      console.error(error);
      message.error(t('component.upload.uploadError'));
      throw new Error(error.response.data);
    }
  }
</script>
<style scoped lang="scss">
  :deep(.un_add_card_) {
    .ant-upload.ant-upload-select-picture-card {
      display: none;
    }
  }
</style>
