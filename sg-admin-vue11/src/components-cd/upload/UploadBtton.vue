<template>
  <Upload
    v-model:fileList="imgList"
    :accept="accept"
    :headers="{
      authorization: 'authorization-text',
      t: token,
      lang: lang,
    }"
    :name="name"
    :customRequest="customUpload"
    @preview="handlePreview"
    @remove="handRemove"
  >
    <Button size="large">本地上传</Button>
  </Upload>
</template>
<script setup lang="ts">
  import { useUserStore } from '/@/store/modules/user';
  import { useLocale } from '/@/locales/useLocale';
  import { Upload, message, Button } from 'ant-design-vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { computed, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface Props {
    fileList: any[];
    name: string;
    accept: string;
    limitNum: string | number;
    showUpload: number;
    modalSize: [number, number];
    api: (data: any) => any;
  }
  const props = defineProps<Props>();

  const { t } = useI18n();

  const emits = defineEmits(['update:fileList', 'remove', 'success']);
  const userStore = useUserStore();
  const token = userStore.getToken;
  const lang = useLocale().getLocale.value;
  const previewVisible = ref(false);

  const imgList = ref(props.fileList);
  // const limitSizeObj = computed(() => props.limitSizeObj);
  const preImgUrl = computed(() => props.fileList[0].url);
  const modalSize = computed(() => props.modalSize);
  const accept = computed(() => props.accept);

  function handlePreview() {
    previewVisible.value = true;
  }
  function handleCancelPreview() {
    previewVisible.value = false;
  }
  function handRemove(e) {
    emits('remove', e);
  }
  function beforeUpload(file) {
    // if (!file.type.startsWith('image/')) {
    //   return message.error('无法读取文件');
    // }
    // if (!props.accept.split(',').includes(file.type)) {
    //   const type = props.accept
    //     .replace(/image\//g, '')
    //     .replace(/,/g, ',')
    //     .toUpperCase();
    //   message.error(`图片格式必须为${type}`);
    //   return false;
    // }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onload = (event) => {
        // 读取完成后，event.target.result 将包含 Data URL
        if (event.target?.result) {
          // const img = new Image();
          // img.src = event.target.result as string;
          // 计算大小，决定是否通过
          // const fileSizeInKB = file.size / 1024;
          // const fileSizeInMB = file.size / 1024 / 1024;
          // if (sizeUnit == 'KB') {
          //   if (fileSizeInKB > maxSize) {
          //     fileData.value = [];
          //     return message.error(`${t('common.must_smaller')} ${maxSize}KB`);
          //   }
          // } else if (sizeUnit == 'MB') {
          //   if (fileSizeInMB > maxSize) {
          //     fileData.value = [];
          //     return message.error(`${t('common.must_smaller')} ${maxSize}MB`);
          //   }
          // }
          // img.onload = () => {
          //   // if (img.width != limitSizeObj.value.width || img.height != limitSizeObj.value.height) {
          //   //   message.error(
          //   //     `${t('common.must_size')} ${limitSizeObj.value.width} x ${limitSizeObj.value.height}`,
          //   //   );
          //   //   return resolve(false);
          //   // }
          //   resolve(true);
          // };
          resolve(true);
        } else {
          message.error('无法读取文件');
          return resolve(false);
        }
      };
    });
  }

  async function customUpload(e) {
    const msg = await beforeUpload(e.file);
    if (!msg) {
      e.onError(new Error('文件类型不符合要求'), null);
      imgList.value = [];
      return false;
    }
    const params = {
      file: e.file,
      name: props.name,
    };
    try {
      const { data } = await props.api(params);
      const imageUrl = data.data;
      // 转化为有效路径
      const validUrl = await getDataTypePreviewUrl(imageUrl);
      e.onSuccess(imageUrl, e);
      emits('update:fileList', [{ url: validUrl, backUrl: imageUrl }]);
      emits('success', imageUrl);
      message.success(t('component.upload.uploadSuccess'));
    } catch (error) {
      console.error(error);
      message.error(t('component.upload.uploadError'));
      throw new Error(error.response.data);
    }
  }
</script>
<style scoped lang="scss"></style>
