<template>
  <div class="googleNewAddClass venuesClassZoom" ref="main">
    <BasicModal
      @register="registerNewAddModal"
      :title="titleName"
      v-bind="$attrs"
      :width="700"
      :okText="t('table.promotion.promotion_confirm_add')"
      cancelText=""
      :destroyOnClose="isDestroy"
      :getContainer="() => $refs.main"
      @ok="handleSubmit"
      @cancel="handleCloseModal"
    >
      <BasicForm @register="registerNewAdd">
        <template #appIconSlot="{ model, field }">
          <div class="appIconClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="iconDescribe"
              :limitNum="iconLimitNum"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitSizeObj="iconLimitSizeObj"
              :modalTitle="t('table.google.report_columns_APP_icon')"
              :showUpload="1"
              :modalSize="[400, 400]"
              @remove="() => handleIconRemoveClick(model, field)"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @success="() => clearValidate()"
            />
            <UploadImg
              v-else
              v-model:fileList="model[field]"
              :describe="iconDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="iconLimitNum"
              :limitSizeObj="iconLimitSizeObj"
              :modalTitle="t('table.google.report_columns_APP_icon')"
              :showUpload="1"
              :modalSize="[400, 400]"
              @remove="() => handleIconRemoveClick(model, field)"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @success="() => clearValidate()"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in appNoticeList.length"
          :key="index"
          #[`appNoticeSlot${index+1}`]="{ model, field }"
        >
          <div class="appNoticeClass">
            <UploadImg
              v-if="model[field] && model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
            <UploadImg
              v-else
              :key="model[field][0]?.url"
              v-model:fileList="model[field]"
              :describe="noticeDescribe"
              :accept="'image/jpg,image/webp,image/jpeg,image/png,image/gif'"
              :limitNum="noticeLimitNum"
              :limitSizeObj="noticeLimitSizeObj"
              :modalTitle="`${t('table.google.report_columns_APP_notice_img')}${index + 1}`"
              :modalSize="[400, 700]"
              :showUpload="1"
              :name="'uploadfile'"
              :api="uploadUnderGroundManager"
              @remove="() => handleNoticeRemoveClick(model, field)"
              @success="handleSuccess"
            />
          </div>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref, defineEmits } from 'vue';
  import UploadImg from '/@/components-cd/upload/UploadImg.vue';

  import {
    uploadUnderGroundManager,
    postChannelTemplateInsert,
    postChannelTemplateUpdate,
  } from '/@/api/promotion';
  import { message } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';

  const { t } = useI18n();

  const emits = defineEmits(['activeSuccess']);

  const titleName = ref(t('table.promotion.promotion_add_new_template'));
  // app图标
  const iconDescribe = ref('');
  const iconLimitNum = ref('512 x 512');
  const iconLimitSizeObj = {
    width: 512,
    height: 512,
  };
  // app宣传图
  const noticeDescribe = ref('');
  // const noticeDescribe = ref(t('table.promotion.promotion_format_WEBP'));
  const noticeLimitNum = ref('252 x 448');
  const noticeLimitSizeObj = {
    width: 252,
    height: 448,
  };
  const shownFieldsState = ref<any>([]);
  const isDestroy = ref(false);
  const editId = ref('');
  // 1新增 2编辑
  const modalType = ref(1);
  const appNoticeList: FormSchema[] = Array.from({ length: 56 }, (_, index) => {
    const num = index + 1; // 生成 1 到 8 的数字
    return {
      field: `appNotice${num}`,
      component: 'Input',
      // label: t(`table.google.report_columns_APP_notice_img`) + t(`${num}`) + ':',
      label: ' ',
      defaultValue: [],
      slot: `appNoticeSlot${num}`,
      colProps: {
        span: 6,
        style: {
          height: '225px',
          overflow: 'hidden',
        },
      },
      ifShow: ({ model }) => {
        if (num < 5) {
          if (!shownFieldsState.value.includes(num)) {
            shownFieldsState.value.push(num);
          }
          return true;
        }

        const prevField = `appNotice${num - 1}`;
        const prevFieldHasValue = model[prevField] && model[prevField].length > 0;

        if (prevFieldHasValue || shownFieldsState.value.includes(num)) {
          if (!shownFieldsState.value.includes(num)) {
            shownFieldsState.value.push(num);
          }
          return true;
        }

        return false;
      },
    };
  });
  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: t('table.google.report_columns_model_name') + ':',
      defaultValue: '',
      rules: [{ required: true, message: t('table.google.report_columns_p_enter_model_name') }],
      componentProps: {
        size: 'large',
        placeholder: t('table.google.report_columns_p_enter_model_name'),
        maxlength: 30,
        allowClear: false,
        labelAlign: 'left',
      },
    },
    {
      field: 'app_name',
      component: 'Input',
      label: t('table.google.report_columns_APP_name') + ':',
      labelWidth: 'auto',
      defaultValue: '',
      rules: [{ required: true, message: t('table.promotion.app_name_p') }],

      componentProps: {
        allowClear: false,
        placeholder: t('table.promotion.app_name_p'),
        maxlength: 30,

        size: 'large',
      },
    },
    {
      field: 'author',
      component: 'Input',
      label: t('table.google.report_columns_APP_auth') + ':',
      defaultValue: '',
      rules: [{ required: true, message: t('table.google.report_columns_p_enter_APP_auth') }],

      componentProps: {
        allowClear: false,
        placeholder: t('table.google.report_columns_p_enter_APP_auth'),
        maxlength: 30,
        size: 'large',
      },
    },
    {
      field: 'icon',
      component: 'Input',
      label: t('table.google.report_columns_APP_icon') + ':',
      labelWidth: 'auto',
      defaultValue: [],
      slot: 'appIconSlot',
      subLabel: t('common.google1'),
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (value.length < 1) {
              return Promise.reject(t('table.google.report_columns_p_upload_APP_icon'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
    },
    {
      field: 'present',
      component: 'InputTextArea',
      label: t('table.google.report_columns_APP_introduction') + ':',
      rules: [
        { required: true, message: t('table.google.report_columns_p_enter_APP_introduction') },
      ],

      componentProps: {
        rows: 6,
        autoSize: { minRows: 4 },
        placeholder: t(''),
        allowClear: false,
        maxlength: 111111,
      },
    },
    {
      field: 'presentText',
      component: 'InputTextArea',
      label: t(`table.google.report_columns_APP_notice_img`),
      subLabel: t('common.google2'),
      slot: 'appTextSlot',
      colProps: {
        style: {
          height: '35px',
        },
      },
    },
    ...appNoticeList,
  ];
  const [registerNewAddModal, { closeModal }] = useModalInner(async (data) => {
    if (data && data?.id != '111') {
      resetForm();
      titleName.value = t('table.promotion.promotion_edit_template');
      isDestroy.value = true;
      modalType.value = 2;
      editId.value = data.id;
      const formData = omit(data, ['updated_at', 'updated_name', 'updated_uid', 'id', 'key']);
      formData.icon = [{ backUrl: formData.icon, url: getDataTypePreviewUrl(formData.icon) }];
      const parseUrlList = JSON.parse(formData.promo_icon);
      const urlList = await parseUrlList.reduce((acc, urlItem, index) => {
        if (!shownFieldsState.value.includes(index + 1)) {
          shownFieldsState.value.push(index + 1);
        }
        if (urlItem != 1) {
          acc[`appNotice${index + 1}`] = [
            {
              backUrl: urlItem,
              url: getDataTypePreviewUrl(urlItem),
            },
          ];
        } else {
          acc[`appNotice${index + 1}`] = [];
        }
        return acc;
      }, {});
      delete formData.promo_icon;
      const lastFormList = { ...formData, ...urlList };
      await setFieldsValue({ ...lastFormList });
    } else {
      titleName.value = t('table.promotion.promotion_add_new_template');
      isDestroy.value = false;
      modalType.value = 1;
      shownFieldsState.value = [];
    }
  });

  const [registerNewAdd, { validate, resetFields, setFieldsValue, getFieldsValue, clearValidate }] =
    useForm({
      schemas,
      showActionButtonGroup: false,
      labelWidth: 'auto',
      baseColProps: { span: 24 },
      layout: 'vertical',
      labelAlign: 'left',
    });
  function handleIconRemoveClick(model, field) {
    model[field] = [];
  }
  function handleNoticeRemoveClick(model, field) {
    model[field] = [];
  }

  async function handleCloseModal() {
    if (isDestroy.value) {
      await resetForm();
      isDestroy.value = false;
    }
  }
  function resetForm() {
    resetFields();
    shownFieldsState.value = [];
    modalType.value = 1;
    editId.value = '';
  }

  async function handleSubmit() {
    const values = await validate();
    const urlObj = {};
    let urlState = false;
    for (let i = 0; i <= appNoticeList.length; i++) {
      const num = i + 1;
      const currentFiled = values[`appNotice${num}`];
      if (currentFiled) {
        urlObj[`appNotice${num}`] = 1;
        if (currentFiled.length > 0) {
          urlState = true;
          urlObj[`appNotice${num}`] = currentFiled[0].backUrl;
        }
        delete values[`appNotice${num}`];
      }
    }
    const urlList = JSON.stringify(Object.values(urlObj));
    values['promo_icon'] = urlList;
    values.icon = values.icon[0].backUrl;
    if (modalType.value == 2) {
      values['id'] = editId.value;
    }
    if (!urlState) {
      message.error(t('table.google.report_columns_p_upload_APP_notice_img'));
      return;
    }
    const { data, status } =
      modalType.value == 1
        ? await postChannelTemplateInsert(values)
        : await postChannelTemplateUpdate(values);
    if (status) {
      message.success(data);
      isDestroy.value = true;
      emits('activeSuccess');
      closeModal();
    } else {
      message.error(data);
    }
  }
  function smoothScrollToBottom(element) {
    const target = element.scrollHeight; // 目标滚动位置
    const duration = 400; // 动画持续时间（毫秒）
    const start = element.scrollTop; // 当前滚动位置
    const distance = target - start; // 滑动距离
    let startTime;

    function animateScroll(timestamp: any) {
      if (!startTime) startTime = timestamp; //初始化赋值先
      const spacing = timestamp - startTime; // 开始帧与运动帧的时间间隔，趋进于400时，运动结束
      const progress = Math.min(spacing / duration, 1); // 时间间隔占动画持续时间的多少倍
      // 然后用开始距离 + 滑动距离 * 每次帧率差值需要运动的距离比例
      element.scrollTop = start + distance * progress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll); // 确保动画继续
      }
    }

    requestAnimationFrame(animateScroll); // 启动动画
  }

  // 使用示例
  async function handleSuccess() {
    const scrollDom = document.querySelectorAll('.scrollbar__wrap');
    if (scrollDom.length > 0) {
      smoothScrollToBottom(scrollDom[1]); // 调用简化的平滑滚动函数
    } else {
      console.error('未找到该元素');
    }
  }
</script>
<style lang="scss" scoped>
  .googleNewAddClass {
    ::v-deep(.ant-form) {
      border-bottom: 1px solid #dce3f1;
    }

    ::v-deep(.ant-form-vertical .ant-form-item-label) {
      padding: 0;
    }

    ::v-deep(.ant-form-item-label > label) {
      display: flex;
    }

    ::v-deep(.ant-form-item-no-colon) {
      height: auto !important;
      margin-right: 5px;
      line-height: 40px !important;
    }

    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      padding: 0 20px;
    }

    ::v-deep(.ant-modal-footer) {
      padding: 20px 16px;
    }

    ::v-deep(.ant-checkbox-group-item) {
      width: 72px;
      margin-right: 12px;
      margin-bottom: 5px;
      white-space: nowrap;
    }

    ::v-deep(.ant-checkbox-group) {
      width: 290px;
    }

    .ant-upload-select-picture-card i {
      color: #999;
      font-size: 32px;
    }

    .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }

    .appIconClass {
      width: 120px;
      height: 120px;
      overflow: hidden;

      ::v-deep(.ant-upload.ant-upload-select-picture-card) {
        width: 120px !important;
        height: 120px !important;
      }

      ::v-deep(.ant-upload-list-picture-card-container) {
        width: 120px !important;
        height: 120px !important;
      }
    }

    .appNoticeClass {
      ::v-deep(.ant-upload.ant-upload-select-picture-card) {
        width: 126px !important;
        height: 200px !important;
      }

      ::v-deep(.ant-upload-list-picture-card-container) {
        width: 126px !important;
        height: 200px !important;
      }

      ::v-deep(.uploadMain .ant-upload-list-item-thumbnail img) {
        width: 126px !important;
        object-fit: cover;
      }
    }
  }

  ::v-deep(.text-secondary) {
    color: #e91134 !important;
  }

  ::v-deep(.anticon-delete) {
    width: 24px !important;
    font-size: 24px !important;
  }

  ::v-deep(.anticon-eye) {
    width: 24px !important;
    font-size: 24px !important;
  }
</style>
