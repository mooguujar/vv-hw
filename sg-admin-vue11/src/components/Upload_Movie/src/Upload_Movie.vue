<template>
  <div class="display-flex content-end">
    <Upload
      :name="name"
      :multiple="multiple"
      :showUploadList="showUploadList"
      :accept="accept"
      :action="`${VITE_GLOB_API_URL}${action}?token=${token}`"
      :headers="{
        authorization: 'authorization-text',
      }"
      @change="handleChange"
      @progress="handleProgress"
    >
      <div class="upload">
        <Button>
          <cloud-upload-outlined />
          {{ t('common.translate.upload_files') }}
        </Button>
      </div>
    </Upload>
    <div class="flex-1 m-t-3">
      <Progress :stroke-color="{ '0%': '#108ee9', '100%': '#87d068' }" :percent="percentValue" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { Upload, UploadChangeParam, message, Button, Progress } from 'ant-design-vue';
  import { getAppEnvConfig } from '/@/utils/env';
  import { useUserStore } from '/@/store/modules/user';
  import { CloudUploadOutlined } from '@ant-design/icons-vue';
  import { ref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  const userStore = useUserStore();
  const { t } = useI18n();
  const token = userStore.getToken;

  const emit = defineEmits(['change']);

  const { VITE_GLOB_API_URL } = getAppEnvConfig();

  let percentValue = ref(0);

  const props = defineProps({
    name: {
      type: String,
      default: 'file',
    },
    action: {
      type: String,
      default: '/file/upload/movie',
    },
    accept: {
      type: String,
      default:
        'video/mp4,video/asx,video/asf,video/mpg,video/wmv,video/3gp,video/mov,video/avi,video/flv',
    },
    showUploadList: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  });
  const { name, action, accept, showUploadList, multiple } = props;

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status !== 'uploading') {
    }

    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        emit('change', info);

        message.success(`${info.file.name}${t('component.upload.uploadSuccess')}`);
      } else {
        percentValue.value = 0;
        message.error(`${info.file.name}${t('component.upload.uploadError')}`);
      }
    } else if (info.file.status === 'error') {
      percentValue.value = 0;
      message.error(`${info.file.name}${t('component.upload.uploadError')}`);
    }
  };

  const handleProgress = ({ percent }) => {
    percentValue.value = parseFloat(percent.toFixed(2));
  };
</script>
