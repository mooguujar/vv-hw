<template>
  <div class="leaderContainer">
    <div class="flex items-center leaderTop">
      <div class="ml-5">
        {{ t('modalForm.system.app_boot_download_cfg_footer') }}
        <Checkbox
          v-model:checked="popup"
          :disabled="isControlValueSet()"
          style="margin-left: 15px"
          >{{ t('table.system.system_hid') }}</Checkbox
        >
      </div>
    </div>
    <div class="leaderBottom2">
      <div class="leaderLeft2">
        <BasicForm @register="leadDefault" :disabled="isControlValueSet()">
          <template #bgColorSlot="{ model, field }">
            <input-color
              :disabled="isControlValueSet()"
              v-model="bgColor"
              v-model:gradient="bgGradientColor"
              v-model:colorType="bgColorType"
              :use-type="'both'"
            />
          </template>
          <template #buttonBorderSlot="{ model, field }">
            <input-color
              :disabled="isControlValueSet()"
              v-model="buttonBorder"
              v-model:gradient="buttonGradientColor"
              v-model:colorType="buttonColorType"
              :use-type="'both'"
            />
          </template>
          <template #titleTextSlot="{ model, field }">
            <LangRadioGroup :contentList="contentList" @click:radio="handleClickContent" />
          </template>
          <template #subTitleSlot="{ model, field }">
            <div class="flex items-center space-x-2">
              <Input
                v-model:value="currentLang.transitionSubTitle"
                size="large"
                class="flex-1"
                :disabled="isControlValueSet()"
                :placeholder="t('business.banner_tip')"
              />
              <input-color v-model="subTitleColor" class="w-80px" />
              <span class="ml-5px">{{ t('table.system.col') }}</span>
            </div>
          </template>
          <template #mainTitleSlot="{ model, field }">
            <div class="flex items-center space-x-2">
              <Input
                v-model:value="currentLang.transitionMainTitle"
                size="large"
                class="flex-1"
                :disabled="isControlValueSet()"
                :placeholder="t('business.banner_tip')"
              />
              <input-color v-model="mainTitleColor" class="w-80px" />
              <span class="ml-5px">{{ t('table.system.col') }}</span>
            </div>
          </template>
          <template #btnTextSlot="{ model, field }">
            <div class="flex items-center space-x-2">
              <Input
                v-model:value="currentLang.transitionValueBtn"
                size="large"
                class="flex-1"
                :disabled="isControlValueSet()"
                :placeholder="t('business.banner_tip')"
              />
              <input-color :disabled="isControlValueSet()" v-model="btnTextColor" class="w-80px" />
              <span class="ml-5px">{{ t('table.system.col') }}</span>
            </div>
          </template>
          <template #btnIconSlot="{ model, field }">
            <dir class="flex flex-wrap">
              <div
                v-for="(item, index) in svgList"
                :key="index"
                :style="{ color: item.dataIndex === currentSvg ? '' : '' }"
                class="px-1 py-1 mr-2 border rounded w-74px border-slate-200 cursor"
                :class="[item.dataIndex === currentSvg ? 'border-active-color' : '']"
                @click="updateCurrentSvgByIndex(index)"
              >
                <img :src="getDataTypePreviewUrl(item.ios)" class="w-30px h-30px" />
                <img :src="getDataTypePreviewUrl(item.android)" class="w-30px h-30px ml-3px" />
              </div>
              <!-- <input-color v-model="svgColor" class="w-80px" /> -->
            </dir>
          </template>
          <template #logoSetting="{ model, field }">
            <div style="width: 100%; height: 255px">
              <BaseUploadDragger
                name="uploadfile"
                :upload-text="t('modalForm.system.system_drag_doc_tip')"
                :maxNumber="1"
                :isDisplayButton="false"
                :showUploadList="false"
                :isShowPopover="false"
                :height="1024"
                :width="1024"
                :disabled="isControlValueSet()"
                :isShowButton="false"
                :apiMap="LeadApiMap"
                :CheckSize="true"
                :accept="'image/webp,image/png,image/jpeg'"
                :url="appTopImg"
                :file-list="appTopfileList"
                :maxSize="500"
                :sizeUnit="'KB'"
                :previewType="'appDownIcon'"
                @change="handleChangeLeadUpload"
                @save="handleSave"
                @remove="handleRemoveLeadUpload"
                :bgColor="{
                  backgroundColor: getSettingStyle(currentTpl, 'pc_logo_white', 'backgroundColor'),
                }"
                :previewClss="getSettingStyle(currentTpl, 'pc_logo_white', 'previewClss')"
              />
            </div>
          </template>
        </BasicForm>
      </div>
      <div class="relative flex justify-center leaderRight2 mt-50px" v-if="showModal">
        <div
          class="relative flex flex-col rounded-md shadow w-460px h-142px px-50px py-20px"
          :style="setStyle(bgColorType, bgColor, bgGradientColor)"
        >
          <div class="flex items-center w-full h-56px">
            <div class="border-green-500 w-56px h-56px">
              <Image :src="getDataTypePreviewUrl(appTopImg)" :preview="false" />
            </div>
            <div class="font-medium ml-10px textF">
              <div :style="{ color: subTitleColor }">{{ currentLang.transitionSubTitle }}</div>
              <div :style="{ color: mainTitleColor }">{{ currentLang.transitionMainTitle }}</div>
            </div>
          </div>

          <div class="flex">
            <div
              @click="showModal = !showModal"
              class="flex items-center justify-center w-full border rounded-md h-36px mt-10px"
              :style="{
                borderColor: buttonBorder,
                color: btnTextColor,
              }"
            >
              <span
                class="cursor-pointer"
                :style="{
                  color: buttonBorder,
                }"
              >
                {{ t('common.cancelText') }}</span
              >
            </div>

            <div
              class="flex items-center justify-center w-full border rounded-md h-36px mt-10px ml-10px"
              :style="{
                borderColor: buttonBorder,
                color: btnTextColor,
                ...setStyle(buttonColorType, buttonBorder, buttonGradientColor),
              }"
            >
              <img :src="getDataTypePreviewUrl(currentImg.ios)" class="w-30px h-30px mr-10px" />
              <span>{{ currentLang.transitionValueBtn }}</span>
            </div>
          </div>

          <img
            :src="Close"
            class="absolute cursor-pointer w-16px h-16px top-10px right-15px"
            @click="showModal = !showModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref, watch, computed } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BaseUploadDragger } from '/@/components/BaseUploadDragger';
  import { Image, message, Checkbox, Input } from 'ant-design-vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { updateSiteBrand, uploadSiteBrand } from '/@/api/sys/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import LangRadioGroup from '/@/views/system/informationCenter/common/components/LangRadioGroup.vue';
  import { useLocalList } from '/@/settings/localeSetting';
  import InputColor from '@/components-cd/colorpicker/colorpicker.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { footerAppschemas } from './LeadDragger.data';
  import Close from '/@/assets/images/close.webp';
  import { getSettingStyle } from '/@/views/common/common';
  import { useUserStore } from '/@/store/modules/user';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const emit = defineEmits(['downloadPicChange']);
  const userStore = useUserStore();
  const props = defineProps({
    leadData: {
      type: [Object, String],
    },
    id: {
      type: String,
      default: '1',
    },
    logoPic: {
      type: String,
      default: '',
    },
    topLogoPic: {
      type: String,
      default: '',
    },
  });

  const bgColor = ref('#0F212E'); // Default color

  const bgGradientColor = ref(
    'linear-gradient(92deg, rgba(61, 61, 61, 1) 0%, rgba(0, 0, 0, 1) 100%)',
  );

  const bgColorType = ref('pure');

  const buttonBorder = ref('#1475E1'); // Default color

  const buttonGradientColor = ref(
    'linear-gradient(92deg, rgba(61, 61, 61, 1) 0%, rgba(0, 0, 0, 1) 100%)',
  );

  const buttonColorType = ref('pure');

  const mainTitleColor = ref('#B1BAD3'); // Default color

  const subTitleColor = ref('#B1BAD3'); // Default color

  const btnTextColor = ref('#B1BAD3'); // Default color

  const svgColor = ref('#B1BAD3'); // Default color

  const barType = ref(1); // Default color

  const localeList = useLocalList();

  const currentSvg = ref(0);
  const showModal = ref(true);

  const currentImg = ref({
    dataIndex: 0,
    ios: 'brand/1734938208740.webp',
    android: 'brand/1734938310059.webp',
  });

  const svgList = ref([
    {
      dataIndex: 0,
      ios: 'brand/1734938208740.webp',
      android: 'brand/1734938310059.webp',
    },
    {
      dataIndex: 1,
      ios: 'brand/1734938717616.webp',
      android: 'brand/1734938737537.webp',
    },
  ]);

  const langList = localeList.map((item) => {
    return {
      label: item.text,
      value: item.event,
      transitionSubTitle: '',
      transitionValueBtn: '',
      transitionMainTitle: '',
      image_url: '',
      language: item.language || '',
      fileList: [],
    };
  });

  const contentList = ref([...langList]);

  const currentLangIndex = ref(0);

  const currentLang = ref(contentList.value[0]);

  let popup = ref<boolean>(false);

  const FORM_SIZE = useFormSetting().getFormSize;

  const appTopImg = ref('');
  const appTopfileList = ref([]);

  const [leadDefault, { setProps, setFieldsValue }] = useForm({
    schemas: footerAppschemas,
    baseColProps: { span: 24 },
    actionColOptions: { span: 16 },
    size: FORM_SIZE,
    showSubmitButton: true,
    showResetButton: false,
    submitFunc: handleSubmit,
    submitButtonOptions: {
      text: t('common.saveText'),
      size: FORM_SIZE,
      disabled: isControlValueSet(),
      style: {
        width: '50%',
        marginTop: '20px',
      },
    },
  });

  const LeadApiMap = reactive({
    uploadApi: uploadSiteBrand,
    language: 'zh-CN',
  });

  // 上传成功返回
  function handleChangeLeadUpload(data) {
    appTopImg.value = data;
    appTopfileList.value = [{ uid: '1', name: data, status: 'done' }];
  }

  // 删除
  function handleRemoveLeadUpload(data) {
    appTopImg.value = '';
    appTopfileList.value = [];
  }

  function handleSave(save) {
    if (save) {
      handleSubmit();
    }
  }

  async function handleSubmit() {
    const reduceContentList = (key) => {
      return contentList.value.reduce((acc, item) => {
        acc[item.value] = item[key];
        return acc;
      }, {});
    };

    const obg = {
      popup: popup.value, // 显示隐藏
      // 文字配置
      bgColor: bgColor.value, // 背景颜色
      bgColorType: bgColorType.value, //背景颜色类型
      bgGradientColor: bgGradientColor.value, // 背景渐变色
      buttonBorder: buttonBorder.value, // 按钮线颜色
      buttonColorType: buttonColorType.value, //背景颜色类型
      buttonGradientColor: buttonGradientColor.value, // 背景渐变色
      titleColor: subTitleColor.value, // 标题颜色
      contentColor: mainTitleColor.value, // 内容颜色
      buttonTextColor: btnTextColor.value, // 按钮文字颜色
      iconColor: svgColor.value,
      lang: {
        content: reduceContentList('transitionMainTitle'),
        buttonText: reduceContentList('transitionValueBtn'),
        title: reduceContentList('transitionSubTitle'),
      },
      icon: appTopImg.value,
      imgIcon: svgList.value?.[currentSvg.value],
    };

    const params = {
      name: 'pc',
      field: 'bottom_app_download',
      content: JSON.stringify(obg),
    };

    const { status, data } = await updateSiteBrand(params);

    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  }

  const handleClickContent = (idx) => {
    currentLangIndex.value = idx;
    currentLang.value = contentList.value[idx];
  };

  watch(
    () => props.leadData,
    (val) => {
      if (val) {
        handleEditData(val);
      }
    },
    { deep: true },
  );

  function handleEditData(val) {
    const data = JSON.parse(val);
    if (!data) {
      console.error('Invalid data or config');
      return;
    }

    // Update popup based on state

    // Extract and update properties based on barType
    const {
      bgColor: newBgColor,
      bgColorType: newBgColorType,
      bgGradientColor: newBgGradientColor,
      buttonBorder: newbuttonBorder,
      buttonColorType: newbuttonColorType,
      buttonGradientColor: newbuttonGradientColor,
      iconColor: newiconColor,
      icon: newIcon,
      lang: newLang,
      titleColor: newTitleColor,
      contentColor: newContentColor,
      buttonTextColor: newButtonTextColor,
      imgIcon: NewimgIcon,
    } = data;

    // Update color and position values
    popup.value = data.popup;
    bgColorType.value = newBgColorType;
    bgGradientColor.value = newBgGradientColor;
    bgColor.value = newBgColor;
    buttonBorder.value = newbuttonBorder;
    buttonColorType.value = newbuttonColorType;
    buttonGradientColor.value = newbuttonGradientColor;
    svgColor.value = newiconColor;
    appTopImg.value = newIcon;
    subTitleColor.value = newTitleColor;
    mainTitleColor.value = newContentColor;
    btnTextColor.value = newButtonTextColor;

    if (NewimgIcon) {
      currentImg.value = NewimgIcon;
      currentSvg.value = NewimgIcon['dataIndex'];
    }

    // Update contentList with transition values
    contentList.value.forEach((el) => {
      el.transitionMainTitle = newLang.content ? newLang.content[el.value] : '';
      el.transitionValueBtn = newLang.buttonText ? newLang.buttonText[el.value] : '';
      el.transitionSubTitle = newLang.title ? newLang.title[el.value] : '';
    });
    setcontentList();
  }

  function updateCurrentSvgByIndex(index) {
    const selectedSvg = svgList.value?.[index];
    if (selectedSvg) {
      currentSvg.value = selectedSvg.dataIndex;
      currentImg.value = svgList.value?.[index];
    }
  }

  function setcontentList() {
    if (barType.value == 1) contentList.value = [...langList];
    else contentList.value = [...langList];
    currentLang.value = contentList.value[0];
  }
  const currentTpl = computed(() => {
    return userStore.getCurrentSite['tpl'] || 1;
  });
  function setStyle(type, bgColor, bgGradientColor) {
    if (type == 'pure') {
      return { backgroundColor: bgColor };
    } else {
      return { background: bgGradientColor };
    }
  }
</script>

<style lang="less" scoped>
  .leaderContainer {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    height: 860px; /* 满屏高度 */
    background-color: #fff; /* 示例背景色 */
  }

  .leaderTop {
    flex: 0 0 60px; /* 固定高度 */
    border: 1px solid #e1e1e1; /* 示例背景色 */
    background-color: #f6f7fb !important;
  }

  .leaderBottom2 {
    display: flex; /* 设置为 Flexbox */
    flex: 1; /* 填满剩余空间 */
  }

  .leaderLeft2 {
    width: 922px; /* 左侧占据剩余空间 */
    padding: 20px; /* 内边距 */
  }

  .leaderRight2 {
    flex: 1; /* 右侧占据剩余空间 */
    padding: 20px; /* 内边距 */
  }

  .svg-image {
    filter: invert(30%) sepia(100%) saturate(10000%) hue-rotate(90deg) brightness(1) contrast(1);
  }

  .border-active-color {
    border-color: @primary-color;
  }

  .bg {
    background-color: #1b2d38;
  }

  .textF {
    font-family: 'PingFang SC';
    font-size: 16px;
  }

  .shadow {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 20%), 0 2px 4px -1px rgb(0 0 0 / 12.2%);
  }
</style>
