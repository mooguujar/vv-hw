<template>
  <div>
    <div style="display: flex">
      <div style="flex: 1" v-if="isUpload">
        <Popover placement="bottomLeft">
          <template #content>
            <Image
              v-if="fileUrl && fileUrl.split('.')[1] === 'data'"
              style="width: 234px; height: 140px; border-radius: 16px"
              :src="`${baseURL}${preview}/preview/show?url=${ossUrl + fileUrl}&token=${token}&`"
            />
            <Image
              v-else
              class="!w-50"
              style="border-radius: 16px"
              :src="`${VITE_GLOB_UPLOAD_URL}/${preview}/preview/photo?token=${token}&file=${fileUrl}`"
            />
          </template>
          <div>
            <Input v-model:value="fileUrl" @blur="inputChange" :placeholder="placeholder" />
          </div>
        </Popover>
      </div>
      <div v-else style="flex: 1">
        <Input v-model:value="fileUrl" @blur="inputChange" :placeholder="placeholder" />
      </div>

      <Upload
        :multiple="multiple"
        :name="name"
        :showUploadList="showUploadList"
        :accept="accept"
        :action="`${VITE_GLOB_API_URL}${action}?token=${token}`"
        :headers="{
          authorization: 'authorization-text',
        }"
        @change="handleChange"
        @progress="handleProgress"
      >
        <Button>
          <cloud-upload-outlined />
          {{ t('common.translate.upload_files') }}
        </Button>
      </Upload>
    </div>
    <div class="Progress-per">
      <Progress :stroke-color="{ '0%': '#108ee9', '100%': '#87d068' }" :percent="percentValue" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import {
    Upload,
    Input,
    UploadChangeParam,
    message,
    Progress,
    Popover,
    Image,
    Button,
  } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { ref, watch } from 'vue';
  import { CloudUploadOutlined } from '@ant-design/icons-vue';
  import { getAppEnvConfig } from '/@/utils/env';
  import { baseURL } from '/@/settings/siteSetting';
  import { getOssUrlByUploadType } from '/@/utils/auth';
  import { useI18n } from '@/hooks/web/useI18n';

  const { VITE_GLOB_API_URL, VITE_GLOB_UPLOAD_URL } = getAppEnvConfig();
  const { t } = useI18n();
  let percentValue = ref(0);

  const props = defineProps({
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
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '上传图片',
    },
  });

  const { url, showUploadList, placeholder } = props;

  const emit = defineEmits(['change']);

  const fileUrl = ref(url);

  let isUpload = ref(false);

  let preview = ref('file');

  if (props.action) preview.value = props.action.split('/')[1];

  watch(
    () => props.url,
    (value) => {
      fileUrl.value = value;
      if (fileUrl.value && fileUrl.value.split('.')[1] === 'data') {
        isUpload.value = true;
      }
    },
    { immediate: true },
  );

  const userStore = useUserStore();

  const token = userStore.getToken;

  const ossUrl = getOssUrlByUploadType(2);

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status !== 'uploading') {
    }

    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        isUpload.value = true;

        emit('change', info);

        message.success(`${info.file.name}${t('component.upload.uploadSuccess')}`);
      } else {
        message.error(`${info.file.name}${t('component.upload.uploadError')}`);
      }
    } else if (info.file.status === 'error') {
      percentValue.value = 0;
      message.error(`${info.file.name}${t('component.upload.uploadError')}`);
    }
  };

  const inputChange = () => {
    isUpload.value = false;
    emit('change', { file: { response: { path: fileUrl.value } } });
  };

  const handleProgress = ({ percent }) => {
    percentValue.value = parseFloat(percent.toFixed(2));
  };
</script>

<style lang="scss" scoped>
  .Progress-per {
    position: absolute;
    width: 100%;
    top: -20px;
  }
</style>
