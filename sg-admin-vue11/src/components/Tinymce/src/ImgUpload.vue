<template>
  <div :class="[prefixCls, { fullscreen }]">
    <Upload
      :name="'uploadfile'"
      multiple
      :customRequest="customUpload"
      :action="uploadUrl"
      :headers="{
        authorization: 'authorization-text',
        t: token,
        lang: lang,
      }"
      :showUploadList="false"
      accept=".jpg,.jpeg,.gif,.webp,.webp,.png"
    >
      <a-button type="primary" v-bind="{ ...getButtonProps }">
        {{ t('component.upload.imgUpload') }}
      </a-button>
    </Upload>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { message, Upload } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getDataTypePreviewUrl } from '@/utils/helper/paramsHelper';
  import { uploadPromoImage } from '/@/api/activity';
  import { useUserStore } from '/@/store/modules/user';
  import { useLocale } from '@/locales/useLocale';

  export default defineComponent({
    name: 'TinymceImageUpload',
    components: { Upload },
    props: {
      fullscreen: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },

    emits: ['uploading', 'done', 'error'],

    setup(props, { emit }) {
      const userStore = useUserStore();
      const token = userStore.getToken;
      const lang = useLocale().getLocale.value;
      let uploading = false;

      const { uploadUrl } = useGlobSetting();
      const { t } = useI18n();
      const { prefixCls } = useDesign('tinymce-img-upload');

      const getButtonProps = computed(() => {
        const { disabled } = props;
        return {
          disabled,
        };
      });

      function beforeUpload(file) {
        if (!file.type.startsWith('image/')) {
          return message.error(t('v.discount.activity.cannot_read_file'));
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
          reader.onload = (event) => {
            // 读取完成后，event.target.result 将包含 Data URL
            if (event.target?.result) {
              const img = new Image();
              img.src = event.target.result as string;
              return resolve(true);
            } else {
              message.error(t('v.discount.activity.cannot_read_file'));
              return resolve(false);
            }
          };
        });
      }
      async function customUpload(e) {
        const msg = await beforeUpload(e.file);
        if (!msg) {
          e.onError(new Error(t('common.translate.file_type_err')), null);
          emit('uploading', []);
          return false;
        }
        const params = {
          file: e.file,
          name: 'uploadfile',
        };

        try {
          const { data } = await uploadPromoImage(params);
          const imageUrl = data.data;
          // 转化为有效路径
          const validUrl = getDataTypePreviewUrl(imageUrl);
          e.onSuccess(imageUrl, e);
          emit('uploading', 'uploadfile');
          emit('done', 'uploadfile', validUrl);
          message.success(t('component.cropper.uploadSuccess'));
        } catch (error) {
          console.error(error);
          message.error(t('component.upload.uploadError'));
          throw new Error(error.response.data);
        }
      }

      // function handleChange(info: Record<string, any>) {
      //   const file = info.file;
      //   const status = file?.status;
      //   const url = file?.response?.url;
      //   const name = file?.name;

      //   if (status === 'uploading') {
      //     if (!uploading) {
      //       emit('uploading', name);
      //       uploading = true;
      //     }
      //   } else if (status === 'done') {
      //     emit('done', name, url);
      //     uploading = false;
      //   } else if (status === 'error') {
      //     emit('error');
      //     uploading = false;
      //   }
      // }

      return {
        prefixCls,
        uploadUrl,
        t,
        token,
        lang,
        getButtonProps,
        customUpload,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-tinymce-img-upload';

  .@{prefix-cls} {
    position: absolute;
    z-index: 20;
    top: 4px;
    right: 10px;

    &.fullscreen {
      position: fixed;
      z-index: 10000;
    }
  }
</style>
