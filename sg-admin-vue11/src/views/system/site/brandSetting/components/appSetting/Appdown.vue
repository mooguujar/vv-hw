<template>
  <div class="leaderContainer">
    <div class="flex items-center leaderTop">
      <div class="ml-5">
        {{ t('modalForm.system.app_boot_download_cfg') }}
        <Checkbox
          v-model:checked="currentData.popup"
          :disabled="isControlValueSet()"
          style="margin-left: 15px"
          >{{ t('table.system.system_hid') }}</Checkbox
        >
      </div>
    </div>
    <div class="leaderBottom1">
      <div class="leaderLeft1">
        <BasicForm
          @register="leadDefault"
          :disabled="isControlValueSet()"
          @field-value-change="fieldChang"
        >
          <template #bgColorSlot="{ model, field }">
            <input-color
              :disabled="isControlValueSet()"
              v-model="currentData.bgColor"
              :use-type="'both'"
              v-model:gradient="currentData.bgGradientColor"
              v-model:colorType="currentData.bgColorType"
            />
          </template>
          <template #buttonBorderSlot="{ model, field }">
            <input-color
              :disabled="isControlValueSet()"
              v-model="currentData.buttonBorder"
              :use-type="'both'"
              v-model:gradient="currentData.buttonGradientColor"
              v-model:colorType="currentData.buttonColorType"
            />
          </template>
          <template #titleTextSlot="{ model, field }">
            <LangRadioGroup :contentList="contentListArray" @click:radio="handleClickContent" />
          </template>
          <template #subTitleSlot="{ model, field }">
            <div class="flex items-center space-x-2">
              <Input
                v-model:value="currentLang.transitionSubTitle"
                size="large"
                :disabled="isControlValueSet()"
                class="flex-1"
                :placeholder="t('business.banner_tip')"
              />
              <input-color
                :disabled="isControlValueSet()"
                v-model="currentData.titleColor"
                class="w-80px"
              />
              <span class="ml-5px">{{ t('table.system.col') }}</span>
            </div>
          </template>
          <template #mainTitleSlot="{ model, field }">
            <div class="flex items-center space-x-2">
              <Input
                v-model:value="currentLang.transitionMainTitle"
                size="large"
                :disabled="isControlValueSet()"
                class="flex-1"
                :placeholder="t('business.banner_tip')"
              />
              <input-color
                :disabled="isControlValueSet()"
                v-model="currentData.contentColor"
                class="w-80px"
              />
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
              <input-color
                :disabled="isControlValueSet()"
                v-model="currentData.buttonTextColor"
                class="w-80px"
              />
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
                :url="currentAppImg.appTopImg"
                :file-list="currentAppImg.appTopfileList"
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
      <div class="relative flex justify-center leaderRight1 mt-50px" v-if="showModal">
        <div
          class="relative flex flex-col rounded-md shadow w-460px h-142px px-50px py-20px"
          :style="
            setStyle(currentData.bgColorType, currentData.bgColor, currentData.bgGradientColor)
          "
        >
          <div class="flex items-center w-full h-56px">
            <div class="border-green-500 w-56px h-56px">
              <Image :src="getDataTypePreviewUrl(currentAppImg.appTopImg)" :preview="false" />
            </div>
            <div class="font-medium ml-10px textF">
              <div :style="{ color: currentData.titleColor }">{{
                currentLang.transitionSubTitle
              }}</div>
              <div :style="{ color: currentData.contentColor }">{{
                currentLang.transitionMainTitle
              }}</div>
            </div>
          </div>

          <div
            class="flex items-center justify-center w-full border rounded-md h-36px mt-10px"
            :style="{
              borderColor: currentData.buttonBorder,
              color: currentData.buttonTextColor,
              ...setStyle(
                currentData.buttonColorType,
                currentData.buttonBorder,
                currentData.buttonGradientColor,
              ),
            }"
          >
            <img :src="getDataTypePreviewUrl(currentImg?.ios)" class="w-30px h-30px mr-10px" />
            <span>{{ currentLang.transitionValueBtn }}</span>
          </div>
        </div>
        <img
          :src="Close"
          class="absolute cursor-pointer w-16px h-16px top-30px right-50px"
          @click="showModal = !showModal"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue';
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
  import { appschemas } from './LeadDragger.data';
  import Close from '/@/assets/images/close.webp';
  import { getSettingStyle } from '/@/views/common/common';
  import { useUserStore } from '/@/store/modules/user';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const userStore = useUserStore();
  const emit = defineEmits(['downloadPicChange']);
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

  const showModal = ref(true);

  const maminKey = ref('official');

  const mainData = ref({
    official: {
      popup: false,
      bgColor: '#0F212E', // 背景颜色
      bgColorType: 'pure', //背景颜色类型
      bgGradientColor: 'linear-gradient(92deg, rgba(61, 61, 61, 1) 0%, rgba(0, 0, 0, 1) 100%)', // 背景渐变
      buttonBorder: '#1475E1', // 按钮线颜色
      buttonColorType: 'pure', //背景颜色类型
      buttonGradientColor: 'linear-gradient(92deg, rgba(61, 61, 61, 1) 0%, rgba(0, 0, 0, 1) 100%)', // 背景渐变
      titleColor: '#B1BAD3', // 标题颜色
      contentColor: '#B1BAD3', // 内容颜色
      buttonTextColor: '#B1BAD3', // 按钮文字颜色
      iconColor: '#B1BAD3',
      lang: {
        content: {},
        buttonText: {},
        title: {},
      },
      icon: '',
      imgIcon: {},
    },
    customize: {
      popup: false,
      bgColor: '#0F212E', // 背景颜色
      bgColorType: 'pure', //背景颜色类型
      bgGradientColor: 'linear-gradient(92deg, rgba(61, 61, 61, 1) 0%, rgba(0, 0, 0, 1) 100%)', // 背景渐变
      buttonBorder: '#1475E1', // 按钮线颜色
      buttonColorType: 'pure', //背景颜色类型
      buttonGradientColor: 'linear-gradient(92deg, rgba(61, 61, 61, 1) 0%, rgba(0, 0, 0, 1) 100%)', // 背景渐变
      titleColor: '#B1BAD3', // 标题颜色
      contentColor: '#B1BAD3', // 内容颜色
      buttonTextColor: '#B1BAD3', // 按钮文字颜色
      iconColor: '#B1BAD3',
      lang: {
        content: {},
        buttonText: {},
        title: {},
      },
      icon: '',
      imgIcon: {},
      ios: '',
      android: '',
    },
  });

  const currentData = computed(() => mainData.value[maminKey.value]);

  const localeList = useLocalList();

  const officialSvg = ref(0);

  const customizeSvg = ref(0);

  const currentSvg = computed(() =>
    maminKey.value == 'official' ? officialSvg.value : customizeSvg.value,
  );

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
      official: {
        label: item.text,
        value: item.event,
        transitionSubTitle: '',
        transitionValueBtn: '',
        transitionMainTitle: '',
        image_url: '',
        language: item.language || '',
        fileList: [],
      },
      customize: {
        label: item.text,
        value: item.event,
        transitionSubTitle: '',
        transitionValueBtn: '',
        transitionMainTitle: '',
        image_url: '',
        language: item.language || '',
        fileList: [],
      },
    };
  });

  const contentListArray = localeList.map((item) => {
    return {
      label: item.text,
      value: item.event,
    };
  });

  const contentList = ref([...langList]);

  const currentLangIndex = ref(0);

  const currentLang = computed(() => contentList.value[currentLangIndex.value][maminKey.value]);

  const FORM_SIZE = useFormSetting().getFormSize;

  const appImg = ref({
    official: {
      appTopImg: '',
      appTopfileList: [],
    },
    customize: {
      appTopImg: '',
      appTopfileList: [],
    },
  });

  const currentAppImg = computed(() => appImg.value[maminKey.value]);

  const [leadDefault, { validate, setProps, setFieldsValue }] = useForm({
    schemas: appschemas,
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
    currentAppImg.value.appTopImg = data;
    currentAppImg.value.appTopfileList = [{ uid: '1', name: data, status: 'done' }];
  }

  // 删除
  function handleRemoveLeadUpload(data) {
    currentAppImg.value.appTopImg = '';
    currentAppImg.value.appTopfileList = [];
  }

  function handleSave(save) {
    if (save) {
      handleSubmit();
    }
  }

  async function handleSubmit() {
    const values = await validate();
    const { flag, android, ios } = values;

    const reduceContentList = (key, type) => {
      return contentList.value.reduce((acc, item) => {
        if (item[type]) {
          // 确保 item[type] 存在
          acc[item[type].value] = item[type][key]; // 使用 item[type][key] 来访问值
        }
        return acc;
      }, {});
    };

    mainData.value['official'].lang.content = reduceContentList('transitionMainTitle', 'official');

    mainData.value['official'].lang.buttonText = reduceContentList(
      'transitionValueBtn',
      'official',
    );

    mainData.value['official'].lang.title = reduceContentList('transitionSubTitle', 'official');

    mainData.value['customize'].lang.content = reduceContentList(
      'transitionMainTitle',
      'customize',
    );

    mainData.value['customize'].lang.buttonText = reduceContentList(
      'transitionValueBtn',
      'customize',
    );

    mainData.value['customize'].lang.title = reduceContentList('transitionSubTitle', 'customize');

    mainData.value['customize'].icon = appImg.value['customize'].appTopImg;
    mainData.value['official'].icon = appImg.value['official'].appTopImg;

    mainData.value['customize'].imgIcon = svgList.value?.[customizeSvg.value];
    mainData.value['official'].imgIcon = svgList.value?.[officialSvg.value];

    const obg = mainData.value;

    obg['flag'] = flag;

    obg['customize'].ios = ios;

    obg['customize'].android = android;

    const params = {
      name: 'pc',
      field: 'home_app_download',
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

    const { customize, official, flag } = data;

    if (customize) mainData.value['customize'] = customize;
    if (official) mainData.value['official'] = official;

    setFieldsValue({ flag: flag ? flag : 1, ...customize });

    const updateAppImg = (key, icon) => {
      appImg.value[key] = {
        appTopImg: icon || '', // 使用可选链
        appTopfileList: [{ uid: '1', name: icon || '', status: 'done' }],
      };
    };

    updateAppImg('customize', customize?.icon);
    updateAppImg('official', official?.icon);

    contentList.value.forEach((el) => {
      el['official'].transitionMainTitle = official?.lang?.content[el['official'].value];
      el['official'].transitionValueBtn = official?.lang?.buttonText[el['official'].value];
      el['official'].transitionSubTitle = official?.lang?.title[el['official'].value];

      el['customize'].transitionMainTitle = customize?.lang?.content[el['customize'].value];
      el['customize'].transitionValueBtn = customize?.lang?.buttonText[el['customize'].value];
      el['customize'].transitionSubTitle = customize?.lang?.title[el['customize'].value];
    });

    if (flag == 1) {
      maminKey.value = 'official';
      if (official?.imgIcon) currentImg.value = official?.imgIcon;
    } else {
      maminKey.value = 'customize';
      if (customize?.imgIcon) currentImg.value = customize?.imgIcon;
    }

    officialSvg.value = official?.imgIcon['dataIndex'] || 0;
    customizeSvg.value = customize?.imgIcon['dataIndex'] || 0;
  }

  function updateCurrentSvgByIndex(index) {
    const selectedSvg = svgList.value?.[index];
    if (selectedSvg) {
      if (maminKey.value == 'official') officialSvg.value = selectedSvg.dataIndex;
      else customizeSvg.value = selectedSvg.dataIndex;
      currentImg.value = svgList.value?.[index];
    }
  }

  async function fieldChang(k, v) {
    if (k == 'flag') {
      if (v == 1) {
        maminKey.value = 'official';
        currentImg.value = svgList.value?.[officialSvg.value];
      } else {
        maminKey.value = 'customize';
        currentImg.value = svgList.value?.[customizeSvg.value];
      }
    }
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
    height: 1050px; /* 满屏高度 */
    background-color: #fff; /* 示例背景色 */
  }

  .leaderTop {
    flex: 0 0 60px; /* 固定高度 */
    border: 1px solid #e1e1e1; /* 示例背景色 */
    background-color: #f6f7fb !important;
  }

  .leaderBottom1 {
    display: flex; /* 设置为 Flexbox */
    flex: 1; /* 填满剩余空间 */
  }

  .leaderLeft1 {
    width: 922px;
    padding: 20px; /* 内边距 */
  }

  .leaderRight1 {
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
