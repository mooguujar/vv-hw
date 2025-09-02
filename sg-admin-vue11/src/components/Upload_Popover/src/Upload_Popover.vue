<template>
  <div class="prograss-w">
    <div style="display: flex">
      <div style="flex: 1" v-if="isShowPopover" class="!h-10">
        <Popover placement="bottomLeft" v-if="!!fileUrl">
          <template #content>
            <Image
              v-if="fileUrl && fileUrl.split('.')[1] === 'data'"
              style="width: 234px; height: 140px; border-radius: 16px"
              :src="`${baseURL}${preview}/preview/show?url=${ossUrl + fileUrl}&t=${token}&`"
            />
            <Image
              v-else
              class="!w-50"
              style="border-radius: 16px"
              :src="`${VITE_GLOB_UPLOAD_URL}/${preview}/preview/photo?t=${token}&file=${fileUrl}`"
            />
          </template>
          <div>
            <Input
              :disabled="inputDisabled"
              v-model:value="fileUrl"
              :size="FORM_SIZE"
              :placeholder="placeholder"
            />
          </div>
        </Popover>
        <div v-else>
          <Input
            :disabled="inputDisabled"
            v-model:value="fileUrl"
            :size="FORM_SIZE"
            :placeholder="placeholder"
          />
        </div>
      </div>
      <div style="flex: 1" v-if="isShowInput">
        <Input
          :disabled="inputDisabled"
          v-model:value="fileUrl"
          :size="FORM_SIZE"
          @blur="inputChange"
          :placeholder="placeholder"
        />
      </div>

      <Upload
        :multiple="multiple"
        :name="name"
        :showUploadList="showUploadList"
        :accept="accept"
        :action="`${VITE_GLOB_API_URL}${action}?t=${token}`"
        :headers="{
          authorization: 'authorization-text',
          t: token,
          lang: lang,
        }"
        @change="handleChange"
        @progress="handleProgress"
      >
        <Button :size="FORM_SIZE">
          <cloud-upload-outlined />
          {{ t('common.translate.upload_files') }}
        </Button>
      </Upload>
    </div>
    <div>
      <Progress
        class="!w-full"
        :stroke-color="{ '0%': '#108ee9', '100%': '#87d068' }"
        :percent="percentValue"
      />
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
  import { useLocale } from '/@/locales/useLocale';
  import { ref, watch } from 'vue';
  import { CloudUploadOutlined } from '@ant-design/icons-vue';
  import { getAppEnvConfig } from '/@/utils/env';
  import { baseURL } from '/@/settings/siteSetting';
  // import { getOssUrlByUploadType } from '/@/utils/auth';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
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
    isShowInput: {
      type: Boolean,
      default: false,
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
      default: useI18n().t('business.banner_upload_pic'),
    },
  });

  const FORM_SIZE = useFormSetting().getFormSize;

  const { url, showUploadList, placeholder } = props;

  const emit = defineEmits(['change']);

  const fileUrl = ref(url);

  watch(
    () => props.url,
    (value) => {
      if (!value) percentValue.value = 0;
      fileUrl.value = value;
    },
    { immediate: true },
  );

  const userStore = useUserStore();

  let preview = ref('file');

  const token = userStore.getToken;
  const lang = useLocale().getLocale.value;
  let ossUrl = '';
  if (['/file/upload/photo', '/base/upload/photo'].includes(props.action)) {
    preview.value = props.action.split('/')[1];
    // ossUrl = getOssUrlByUploadType(2);
  } else {
    // ossUrl = getOssUrlByUploadType(1);
  }

  const inputChange = (event) => {
    emit('change', { file: { response: { bean: { filename: event.target.value } } } });
  };

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status !== 'uploading') {
    }

    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        emit('change', info);

        message.success(`${info.file.name}${t('component.cropper.uploadSuccess')}`);
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

<style>
  .prograss-w .ant-form-item-control-input-content > div > div {
    height: 20px;
  }
</style>
