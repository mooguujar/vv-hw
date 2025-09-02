<template>
  <div class="leaderContainer">
    <div class="flex items-center leaderTop">
      <div class="ml-5">
        {{ t('modalForm.system.h5_boot_download_cfg') }}
        <Checkbox
          v-model:checked="fontWebHidden"
          :disabled="isControlValueSet()"
          style="margin-left: 15px"
          >{{ t('table.system.system_hid_l') }}</Checkbox
        >
      </div>
    </div>
    <div class="leaderBottom3">
      <div class="leaderLeft3">
        <BasicForm
          @register="leadDefault"
          :disabled="isControlValueSet()"
          @field-value-change="fieldChang"
        >
          <template #bgColorSlot="{ model, field }">
            <input-color
              :disabled="isControlValueSet()"
              v-model="bgColor"
              v-model:gradient="bgGradientColor"
              v-model:colorType="bgColorType"
              :use-type="'both'"
            />
          </template>
          <template #btnColorSlot="{ model, field }">
            <input-color
              :disabled="isControlValueSet()"
              v-model="btnColor"
              v-model:gradient="btnGradientColor"
              v-model:colorType="btnColorType"
              :use-type="'both'"
            />
          </template>
          <template #titleTextSlot="{ model, field }">
            <LangRadioGroup
              :disabled="isControlValueSet()"
              :contentList="contentList"
              @click:radio="handleClickContent"
            />
          </template>
          <template #amountDesSlot="{ model, field }">
            <div class="text-red">{{ t('common.insertAmountTips') }}</div>
          </template>
          <template #amountSlot="{ model, field }">
            <Input
              size="large"
              v-model:value="amount"
              :placeholder="t('business.banner_tip')"
              type="number"
              :disabled="isControlValueSet()"
            />
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
              <input-color
                :disabled="isControlValueSet()"
                v-model="mainTitleColor"
                class="w-80px"
              />
              <span class="ml-5px">{{ t('table.system.col') }}</span>
            </div>
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
              <input-color :disabled="isControlValueSet()" v-model="subTitleColor" class="w-80px" />
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
                <SvgIcon :name="item.ios" size="30" />
                <SvgIcon :name="item.android" size="30" />
              </div>
              <input-color :disabled="isControlValueSet()" v-model="svgColor" class="w-80px" />
            </dir>
          </template>
          <template #logoSetting="{ model, field }">
            <div class="-ml-4px">
              <LangRadioGroup :contentList="contentList" @click:radio="handleClickContent" />
            </div>
            <BaseUploadDragger
              name="uploadfile"
              :upload-text="t('modalForm.system.system_drag_doc_tip')"
              :maxNumber="1"
              :isDisplayButton="true"
              :showUploadList="true"
              :isShowPopover="true"
              :height="92"
              :width="730"
              :disabled="isControlValueSet()"
              :isShowButton="true"
              :apiMap="LeadApiMap"
              :CheckSize="true"
              :accept="'image/webp,image/png,image/jpeg'"
              :url="currentLang.image_url"
              :file-list="currentLang.fileList"
              :maxSize="500"
              :sizeUnit="'KB'"
              @change="handleChangeLeadUpload"
              @save="handleSave"
              @remove="handleRemoveLeadUpload"
            />
          </template>
        </BasicForm>
      </div>
      <div class="flex justify-center leaderRight3 mt-50px">
        <div
          v-if="barType == 1"
          class="relative flex w-460px h-46px px-14px py-4px"
          :style="setStyle(bgColorType, bgColor, bgGradientColor)"
        >
          <div class="overflow-hidden left w-320px text-ellipsis whitespace-nowrap">
            <div class="text-[13px] font-semibold" :style="{ color: mainTitleColor }">{{
              currentLang.transitionMainTitle
            }}</div>
            <div class="text-[12px] font-semibold" :style="{ color: subTitleColor }">{{
              currentLang.transitionSubTitle
            }}</div>
          </div>
          <div class="right">
            <div
              class="w-80px h-30px mt-5px rounded-[4px] overflow-hidden text-ellipsis whitespace-nowrap"
              :style="setStyle(btnColorType, btnColor, btnGradientColor)"
            >
              <div class="flex items-center justify-center h-30px">
                <SvgIcon name="svg_1_1" size="18" :style="{ color: svgColor }" />
                <span :style="{ color: btnTextColor }">{{ currentLang.transitionValueBtn }}</span>
              </div>
            </div>
          </div>
          <img :src="Close" :style="getDynamicStyle(btnPosition)" class="w-16px h-16px" />
        </div>
        <div class="w-375px h-46px bg" v-else>
          <Image
            v-if="currentLang.image_url"
            :src="getDataTypePreviewUrl(currentLang.image_url)"
            :preview="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref, onMounted, watch } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { BaseUploadDragger } from '/@/components/BaseUploadDragger';
  import { Image, message, Checkbox, Input } from 'ant-design-vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { updateSiteBrand, uploadSiteBrand } from '/@/api/sys/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import LangRadioGroup from '/@/views/system/informationCenter/common/components/LangRadioGroup.vue';
  import { useLocalList } from '/@/settings/localeSetting';
  import InputColor from '@/components-cd/colorpicker/colorpicker.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { leaderschemas } from './LeadDragger.data';
  import SvgIcon from '@/components/Icon/src/SvgIcon.vue';
  import Close from '/@/assets/images/close.webp';
  import translateContentList from '/@/views/common/language';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
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

  const bgColor = ref('#0F212E'); // Default color

  const bgGradientColor = ref(
    'linear-gradient(92deg, rgba(61, 61, 61, 1) 0%, rgba(0, 0, 0, 1) 100%)',
  );

  const bgColorType = ref('pure');

  const btnColor = ref('#1475E1'); // Default color

  const btnGradientColor = ref(
    'linear-gradient(92deg, rgba(61, 61, 61, 1) 0%, rgba(0, 0, 0, 1) 100%)',
  );

  const btnColorType = ref('pure');

  const mainTitleColor = ref('#B1BAD3'); // Default color

  const subTitleColor = ref('#B1BAD3'); // Default color

  const btnTextColor = ref('#B1BAD3'); // Default color

  const svgColor = ref('#B1BAD3'); // Default color

  const btnPosition = ref(1); // Default color

  const barType = ref(1); // Default color

  const amount = ref(''); // Default color

  const localeList = useLocalList();

  const currentSvg = ref(0);

  const svgList = ref([
    {
      dataIndex: 0,
      ios: 'svg_1_1',
      android: 'svg_1_2',
    },
    // {
    //   dataIndex: 1,
    //   ios: 'svg_1_1',
    //   android: 'svg_1_2',
    // },
    // {
    //   dataIndex: 2,
    //   ios: 'svg_1_1',
    //   android: 'svg_1_2',
    // },
    // {
    //   dataIndex: 3,
    //   ios: 'svg_1_1',
    //   android: 'svg_1_2',
    // },
  ]);

  /*   const extraList = ref([
    {
      label: '翻译原文',
      value: 'default',
      transitionSubTitle: '',
      transitionValueBtn: '下载',
      transitionMainTitle: '',
      image_url: '',
      language: 'original',
      fileList: [],
    },
  ]); */

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

  let fontWebHidden = ref<boolean>(false);

  const FORM_SIZE = useFormSetting().getFormSize;

  const [leadDefault, { setProps, setFieldsValue }] = useForm({
    schemas: leaderschemas,
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
    currentLang.value.image_url = data;
    currentLang.value.fileList = [{ uid: '1', name: data, status: 'done' }];
    contentList.value[currentLangIndex.value].fileList = [{ uid: '1', name: data, status: 'done' }];
  }

  // 删除
  function handleRemoveLeadUpload(data) {
    currentLang.value.image_url = '';
    currentLang.value.fileList = [];
    contentList.value[currentLangIndex.value].fileList = [];
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
      state: fontWebHidden.value ? 1 : 2, // 显示隐藏
      barType: barType.value, // 1 文字 2 图片
    };

    obg['config'] = {
      // 文字配置
      bgColor: bgColor.value, // 背景颜色
      bgColorType: bgColorType.value, //背景颜色类型
      bgGradientColor: bgGradientColor.value, // 背景渐变色
      btnColor: btnColor.value, // 按钮背景颜色
      btnColorType: btnColorType.value, //背景颜色类型
      btnGradientColor: btnGradientColor.value, // 背景渐变色
      btnIcon: {
        svg: svgList.value?.[currentSvg.value], // 图标
        color: svgColor.value, // 图标颜色
      },
      btnPosition: btnPosition.value, // 关闭按钮  1 按钮后 2 按钮前 3 右上角 4 左上角
      mainTitle: {
        content: reduceContentList('transitionMainTitle'), //第一行标题
        color: mainTitleColor.value,
      },
      subTitle: {
        content: reduceContentList('transitionSubTitle'), //第二行标题
        color: subTitleColor.value,
      },
      btnText: {
        content: reduceContentList('transitionValueBtn'), // 按钮文字
        color: btnTextColor.value,
      },
    };

    obg['img'] = reduceContentList('image_url'); // 图片配置

    const params = {
      name: 'pc',
      field: 'pc_lead',
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
    LeadApiMap.language = currentLang.value.value;
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

    if (!data || !data.config) {
      console.error('Invalid data or config');
      return;
    }

    // Update fontWebHidden based on state
    fontWebHidden.value = data.state !== 2;

    // Update barType
    barType.value = data?.barType;

    // Extract and update properties based on barType
    const {
      bgColor: newBgColor,
      btnColor: newBtnColor,
      btnColorType: newbtnColorType,
      btnGradientColor: newbtnGradientColor,
      btnPosition: newBtnPosition,
      bgColorType: newBgColorType,
      bgGradientColor: newBgGradientColor,
      btnIcon,
      mainTitle,
      subTitle,
      btnText,
    } = data.config;

    // Update color and position values
    bgColorType.value = newBgColorType;
    bgGradientColor.value = newBgGradientColor;
    bgColor.value = newBgColor;
    btnColor.value = newBtnColor;
    btnColorType.value = newbtnColorType; //背景颜色类型
    btnGradientColor.value = newbtnGradientColor; // 背景渐变色
    btnPosition.value = newBtnPosition;
    svgColor.value = btnIcon.color;
    currentSvg.value = btnIcon.svg.dataIndex;
    mainTitleColor.value = mainTitle.color;
    subTitleColor.value = subTitle.color;
    btnTextColor.value = btnText.color;

    // Update contentList with transition values
    contentList.value.forEach((el) => {
      el.transitionMainTitle = mainTitle.content[el.value] || '';
      el.transitionSubTitle = subTitle.content[el.value] || '';
      el.transitionValueBtn = btnText.content[el.value] || '';
      if (data?.img) {
        el.image_url = data.img[el.value] || '';
        el.fileList = [{ uid: '1', name: el.image_url, status: 'done' }];
      }
    });
    setFieldsValue({ barType: barType.value, btnPosition: newBtnPosition });
    setcontentList();
    setProps({ showSubmitButton: barType.value == 1 ? true : false });
  }

  function updateCurrentSvgByIndex(index) {
    const selectedSvg = svgList.value?.[index];
    if (selectedSvg) {
      currentSvg.value = selectedSvg.dataIndex;
    }
  }

  function fieldChang(k, v) {
    if (k == 'btnPosition') btnPosition.value = v;
    if (k == 'barType') {
      barType.value = v;
      setProps({ showSubmitButton: barType.value == 1 ? true : false });
      setcontentList();
    }
  }

  function getDynamicStyle(position) {
    switch (position) {
      case 1:
        return { position: 'absolute', top: '15px', right: '20px' };
      case 2:
        return { position: 'absolute', top: '15px', left: '0' };
      case 3:
        return { position: 'absolute', top: '0', right: '0' };
      case 4:
        return { position: 'absolute', top: '0', left: '0' };
      default:
        return {}; // No positioning
    }
  }

  function handleClickTranslation() {
    if (!contentList.value[0].transitionMainTitle && !contentList.value[0].transitionSubTitle) {
      message.error(t('v.bannner.origin_transitionValue'));
      return false;
    }
    translateContentList(
      contentList.value,
      contentList.value[0].transitionSubTitle,
      0,
      'transitionSubTitle',
    );

    translateContentList(
      contentList.value,
      contentList.value[0].transitionValueBtn,
      0,
      'transitionValueBtn',
    );

    translateContentList(
      contentList.value,
      contentList.value[0].transitionMainTitle,
      0,
      'transitionMainTitle',
    ).then((res) => {
      if (res.success) {
        message.success(t('v.bannner.transitionValue_success'));
      } else {
        message.error(t('v.bannner.transitionValue_error'));
      }
    });
  }

  function setcontentList() {
    if (barType.value == 1) contentList.value = [...langList];
    else contentList.value = [...langList];
    currentLang.value = contentList.value[0];
  }

  function replaceBracesWithNumber(text) {
    if (text.includes('{}')) {
      return text.replace('{}', amount.value);
    }
    return text;
  }

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
    height: 700px; /* 满屏高度 */
    background-color: #fff; /* 示例背景色 */
  }

  .leaderTop {
    flex: 0 0 60px; /* 固定高度 */
    border: 1px solid #e1e1e1; /* 示例背景色 */
    background-color: #f6f7fb !important;
  }

  .leaderBottom3 {
    display: flex; /* 设置为 Flexbox */
    flex: 1; /* 填满剩余空间 */
  }

  .leaderLeft3 {
    flex: 65%; /* 左侧占据剩余空间 */
    padding: 20px; /* 内边距 */
  }

  .leaderRight3 {
    flex: 35%; /* 右侧占据剩余空间 */
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
</style>
