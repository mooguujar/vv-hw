<template>
  <div ref="content">
    <PageWrapper contentClass="editLayout" :title="HEAD_TITLE" contentBackground>
      <template v-if="currentPopStyle !== 3">
        <div
          class="fixed z-10 flex items-center justify-center transition-all right-8 w-390px h-224px"
          :class="[scrollTopClass]"
        >
          <AnnouncementPopupImgBnaner
            id="announcement"
            :bgColor="currentPopColor"
            :bgImage="currentPopImage"
            :imageUrl="currentPopIcon"
            :popStyle="currentPopStyle"
            :htmlText="currentLang.transitionValue"
            :btnText="currentLang.transitionValueBtn"
            :SuperscriptText="currentLang.transitionValueSuperscript"
            :titleText="currentLang.transitionValueTitle"
            :btnShow="currentLang.btnJumpData['button_state'] == 1"
            :isTextShow="false"
            :outBoxStyle="{ width: '390px', 'min-height': '224px' }"
            :bgImageStyle="{ 'min-width': '136px', 'min-height': '128px' }"
          />
        </div>
      </template>
      <div class="px-4 py-4 ml-2 bg-white">
        <BasicForm @register="registerForm" @field-value-change="fieldChang">
          <template #basicInfo1>
            <div class="display-flex">
              <div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div>
              <h1>{{ $t('v.bannner.setting_1') }}</h1>
            </div>
          </template>
          <template #basicInfo2>
            <div class="display-flex">
              <div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div>
              <h1>{{ $t('v.bannner.setting_3') }}</h1>
            </div>
          </template>
          <template #basicInfo3>
            <div class="display-flex">
              <div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div>
              <h1>{{ $t('v.bannner.setting_2') }}</h1>
            </div>
          </template>
          <template #basicInfo4>
            <div class="display-flex">
              <div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div>
              <h1>{{ $t('v.bannner.setting_4') }}</h1>
            </div>
          </template>
          <template #basicInfo5>
            <div class="display-flex">
              <div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div>
              <h1>{{ $t('v.bannner.setting_5') }}</h1>
            </div>
          </template>
          <template #basicInfo6>
            <div class="display-flex">
              <div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div>
              <h1>{{ $t('v.bannner.setting_6') }}</h1>
            </div>
          </template>
          <template #basicInfo7>
            <div class="display-flex">
              <div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div>
              <h1>{{ $t('v.bannner.setting_7') }}</h1>
            </div>
          </template>
          <!-- banner样式 -->
          <template #bannertypeSlot>
            <div class="flex">
              <div
                v-for="(item, index) in popStyleTab"
                :key="index"
                class="flex flex-wrap justify-between px-2 py-2 ml-2 border rounded w-33 h-18 border-slate-100 cursor"
                :class="[
                  item.value === currentPopStyle ? 'border-active-color' : '',
                  ...[item.class],
                ]"
                @click="handleChangePopStyle(item.value)"
              >
                <div v-if="item.value === 3" class="text-slate-500">{{
                  $t('business.banner_customer_defined')
                }}</div>
                <template v-else>
                  <div class="w-13 h-13 bg-DCE3F1"></div>
                  <div>
                    <div class="w-14 h-2.5 bg-DCE3F1 rounded-4px"></div>
                    <div class="w-14 h-2.5 bg-DCE3F1 mt-1 rounded-4px"></div>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <!-- 轮播跳转配置 -->
          <template #jumpConfig>
            <Form
              ref="formRef"
              :model="currentLang.jumpData"
              :label-col="{ style: { width: '120px' } }"
            >
              <Row>
                <Col :span="8">
                  <FormItem :label="$t('v.bannner.jump_state')" name="jump_state" :colon="false">
                    <RadioGroup
                      v-model:value="currentLang.jumpData['jump_state']"
                      @change="mapJumpData"
                    >
                      <Radio :value="1">{{ $t('business.common_on') }}</Radio>
                      <Radio :value="2">{{ $t('business.common_off') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>

                <Col :span="8" v-if="currentLang.jumpData['jump_state'] == 1">
                  <FormItem :label="$t('v.bannner.jump_type')" name="jump_type" :colon="false">
                    <Select
                      v-model:value="currentLang.jumpData['jump_type']"
                      :size="FORM_SIZE"
                      @change="mapJumpData"
                    >
                      <template v-for="option in bannerjumpTo" :key="option.value">
                        <SelectOption :value="option.value">
                          {{ option.label }}
                        </SelectOption>
                      </template>
                    </Select>
                  </FormItem>
                </Col>

                <Col
                  :span="8"
                  v-if="
                    currentLang.jumpData['jump_state'] == 1 &&
                    (currentLang.jumpData['jump_type'] == 1 ||
                      currentLang.jumpData['jump_type'] == 14)
                  "
                >
                  <FormItem :label="$t('v.bannner.jump_url')" name="jump_url" :colon="false">
                    <Input
                      :size="FORM_SIZE"
                      :placeholder="$t('table.promotion.promotion_please_enter')"
                      v-model:value="currentLang.jumpData['jump_url']"
                      style="height: 40px"
                      @blur="mapJumpUrl"
                    />
                  </FormItem>
                </Col>
                <!-- 轮播跳转：活动详情页面 -->
                <Col
                  :span="6"
                  v-if="
                    currentLang.jumpData['jump_state'] == 1 &&
                    currentLang.jumpData['jump_type'] == 15
                  "
                >
                  <FormItem
                    :label="$t('table.discountActivity.discount_activity_list')"
                    name="select_jump_url"
                    :colon="false"
                  >
                    <Select
                      v-model:value="currentLang.jumpData['aid']"
                      :size="FORM_SIZE"
                      @change="(value) => handleChangePromo(value, 'banner')"
                    >
                      <template v-for="option in promoList" :key="option.value">
                        <SelectOption :value="option.value">
                          {{ option.label }}
                        </SelectOption>
                      </template>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </template>
          <!-- 轮播图跳转：Banner自定义/全部通用/活动列表页面 -->
          <template #selectJumpUrlSlot="{ model, field }">
            <FormItemRest>
              <Select
                v-model:value="model[field]"
                :size="FORM_SIZE"
                @change="(value) => handleChangePromoAll(value, 'banner')"
              >
                <template v-for="option in promoList" :key="option.value">
                  <SelectOption :value="option.value">
                    {{ option.label }}
                  </SelectOption>
                </template>
              </Select>
            </FormItemRest>
          </template>
          <!-- 颜色配置 -->
          <template #bannercolorSlot>
            <div class="flex flex-wrap">
              <div
                v-for="(item, index) in popColorTabs"
                :key="index"
                class="px-1 py-1 mb-2 ml-2 border rounded w-23 h-13 border-slate-200 cursor"
                :class="[index === currentPopColorIndex ? 'border-active-color' : '']"
                @click="handleChangePopColor(index)"
              >
                <div class="w-full h-full">
                  <Image :preview="false" :src="item" style="width: 82px; height: 42px" />
                </div>
              </div>
            </div>
          </template>
          <!-- 图标配置 -->
          <template #bannericonsSlot>
            <Tabs type="card" v-model:activeKey="currentPopIconTab">
              <template v-for="item in popIconTabs" :key="item.value">
                <TabPane :tab="item.label">
                  <div class="flex flex-wrap content-start overflow-y-auto max-h-65">
                    <div
                      v-for="(sItem, sIndex) in item.list"
                      :key="sIndex"
                      class="flex items-center justify-center w-20 mb-2 ml-2 border rounded h-26 border-slate-200 cursor"
                      :class="[sItem === currentPopIcon ? 'border-active-color' : '']"
                      @click="handleChangePopIcon(sItem)"
                    >
                      <Image
                        :preview="false"
                        :src="sItem"
                        :style="{ width: '68px', height: '96px', 'background-size': '100%' }"
                      />
                    </div>
                  </div>
                </TabPane>
              </template>
            </Tabs>
          </template>
          <!-- banner内容：多语言配置 -->
          <template #bannerlanguageSlot>
            <FormItemRest>
              <LangRadioGroup
                :contentList="contentList"
                @click:radio="handleClickContent"
                :showTranslation="true"
                @click:translation="handleClickTranslation"
              />
            </FormItemRest>
          </template>
          <template #imgTypeContent="{ model, field }">
            <RadioGroup v-model:value="model[field]" @change="handleChangePopContent">
              <Radio :value="1">{{ $t('v.bannner.img_type_1') }}</Radio>
              <Radio :value="2">{{ $t('v.bannner.img_type_2') }}</Radio>
            </RadioGroup>
          </template>
          <template #bannerTextareaSlot>
            <FormItemRest>
              <!-- <Textarea v-model:value="currentLang.transitionValue" :rows="8" @change="handleTinymceChange"
              @blur="handleTinymceBlur" /> -->
              <Tinymce
                v-model="currentLang.transitionValue"
                :showImageUpload="false"
                @change="handleTinymceChange"
                :TinBg="tinBg"
                v-if="tinShow"
              />
            </FormItemRest>
          </template>
          <template #titleTextSlot>
            <FormItemRest>
              <Input
                v-model:value="currentLang.transitionValueTitle"
                @blur="handleBtnTextBlur('transitionValueTitle')"
                :placeholder="$t('v.bannner.titile')"
                size="large"
              />
            </FormItemRest>
          </template>
          <template #superscriptTextSlot>
            <FormItemRest>
              <Input v-model:value="currentLang.transitionValueSuperscript" size="large" />
            </FormItemRest>
          </template>
          <template #btnTextSlot>
            <FormItemRest>
              <Input v-model:value="currentLang.transitionValueBtn" size="large" />
            </FormItemRest>
          </template>
          <!-- 按钮跳转配置:自定义链接跳转 -->
          <template #btnjumpUrlSlot>
            <FormItemRest>
              <Input
                :size="FORM_SIZE"
                :placeholder="$t('table.promotion.promotion_please_enter')"
                v-model:value="currentLang.btnJumpData['button_jump_url']"
                style="height: 40px"
                @blur="changbtnJump"
              />
            </FormItemRest>
          </template>
          <!-- 按钮跳转配置:活动列表跳转 -->
          <template #selectButtonIdMapSlot>
            <FormItemRest>
              <Select
                v-model:value="currentLang.btnJumpData['button_aid']"
                :size="FORM_SIZE"
                @change="(value) => handleChangePromo(value, 'button')"
              >
                <template v-for="option in promoList" :key="option.value">
                  <SelectOption :value="option.value">
                    {{ option.label }}
                  </SelectOption>
                </template>
              </Select>
            </FormItemRest>
          </template>
          <!-- 按钮跳转配置:点击跳转 -->
          <template #btnjumpTypeSlot>
            <FormItemRest>
              <Select
                v-model:value="currentLang.btnJumpData['button_jump_type']"
                :size="FORM_SIZE"
                @change="changbtnJumpType"
              >
                <template v-for="option in btnjumpList" :key="option.value">
                  <SelectOption :value="option.value">
                    {{ option.label }}
                  </SelectOption>
                </template>
              </Select>
            </FormItemRest>
          </template>
          <template #btnTextState>
            <FormItemRest>
              <RadioGroup
                v-model:value="currentLang.btnJumpData['button_state']"
                @change="changbtnJump"
              >
                <Radio :value="1">{{ $t('business.common_on') }}</Radio>
                <Radio :value="2">{{ $t('business.common_off') }}</Radio>
              </RadioGroup>
            </FormItemRest>
          </template>
          <template #templateSlot>
            <div class="flex flex-wrap">
              <div
                v-for="(item, index) in templateStyleTab"
                :key="index"
                class="px-1 py-1 mb-2 ml-2 border rounded w-33 h-18 border-slate-200 cursor"
                :class="[item.value === currentPopTemplte ? 'border-active-color' : '']"
                @click="handleChangetemplate(item.value)"
              >
                <div class="w-full h-full" v-if="item.img">
                  <Image :preview="false" :src="item.img" style="width: 122px; height: 62px" />
                </div>
                <div class="flex items-center justify-center text-slate-500 mt-22px" v-else>
                  {{ t('table.discountActivity.discount_custom') }}
                </div>
              </div>
            </div>
          </template>
          <!-- 上传图片 -->
          <template #bannerUpdatePicSlot>
            <FormItemRest>
              <LangRadioGroup
                v-if="btnlangShow"
                :contentList="contentList"
                @click:radio="handleClickContent"
              />
              <div class="w-520px h-291px ml-4px">
                <BaseUploadDragger
                  name="uploadfile"
                  :upload-text="$t('modalForm.system.system_drag_doc_tip')"
                  :maxNumber="3"
                  :maxSize="500"
                  :sizeUnit="'KB'"
                  :showUploadList="false"
                  :isShowPopover="false"
                  :height="getBannerWidth(currentTpl, 'h')"
                  :width="getBannerWidth(currentTpl, 'w')"
                  :CheckSize="showLimitSize"
                  :showLimitSize="showLimitSize"
                  :action="'/site/notice/upload'"
                  :url="btnlangShow ? currentLang.image_url : alllangImg"
                  :apiMap="apiMap"
                  :file-list="btnlangShow ? currentLang.fileList : alllangImgLis"
                  :accept="'image/webp,image/png,image/jpeg'"
                  @change="handleChangeUpload"
                  @remove="handleRemoveUpload"
                />
              </div>
            </FormItemRest>
          </template>
          <template #terminalSlot="{ model, field }">
            <FormItemRest>
              <Checkbox
                v-model:checked="openTerminalState.checkAll"
                :indeterminate="openTerminalState.indeterminate"
                @change="onCheckAllChange($event, model, field)"
              >
                {{ $t('business.common_select_all') }}
              </Checkbox>
            </FormItemRest>
            <CheckboxGroup
              v-model:value="openTerminalState.checkedList"
              :options="openTerminalOptions"
              @change="onChangeOpenTerminal($event, model, field)"
            />
          </template>
        </BasicForm>
      </div>
      <Loading :loading="loading" :absolute="false" />
    </PageWrapper>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, reactive, ref, unref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import AnnouncementPopupImgBnaner from '/@/views/system/informationCenter/common/components/AnnouncementPopupImgBnaner.vue';
  import LangRadioGroup from '/@/views/system/informationCenter/common/components/LangRadioGroup.vue';
  import translateContentList from '/@/views/common/language';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useFormSetting } from '@/hooks/setting/useFormSetting';
  import { schemas } from './addBanner.data';
  import { useLocalList, domainObj, LangURL } from '/@/settings/localeSetting';
  import { LangItem, getPopIconTabs } from '/@/views/system/informationCenter/common/setting';
  import { BaseUploadDragger } from '/@/components/BaseUploadDragger';
  import {
    UploadBannerPic,
    insertBannerV2,
    updateBannerV2,
    getBannerV2PromoList,
  } from '/@/api/sys/banner';
  import { router } from '/@/router';
  import Loading from '/@/components/Loading/src/Loading.vue';
  import imagesMap from '/@/assets/images/images';
  import { useRoute } from 'vue-router';
  import { useLocale } from '/@/locales/useLocale';
  import { OPEN_TERMINAL_OPTIONS, useRegisterbannerjumpTo } from '/@/views/common/commonSetting';
  import { Tinymce } from '/@/components/Tinymce/index';
  import { Client } from '/@/views/member/common/const';
  import {
    RadioGroup,
    Input,
    FormItem,
    Row,
    Col,
    FormItemRest,
    message,
    CheckboxGroup,
    Checkbox,
    Radio,
    Form,
    Select,
    SelectOption,
    Tabs,
    TabPane,
    Image,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import template1 from '/@/assets/images/template1.webp';
  import { useUserStore } from '/@/store/modules/user';
  import { LimitSize } from '/@/settings/commonSetting';
  import { getBannerWidth } from '/@/views/common/common';
  import { activeJumpUrl } from '/@/views/discountActivity/activity/common/setting';

  const userStore = useUserStore();

  // 当前模板
  const currentTpl = computed(() => {
    return userStore.getCurrentSite['tpl'] || 1;
  });

  const templateStyleTab = [
    { value: 1, class: 'flex-row-reverse', img: '' },
    { value: 2, class: 'flex-row-reverse', img: template1 },
  ];

  const content = ref();

  const tinShow = ref(true);
  const tinBg = ref('#fff');

  const scrollTopClass = ref('top-48');

  const { bannerjumpTo } = useRegisterbannerjumpTo();
  const { t } = useI18n();
  // 按钮跳转配置
  const btnjumpList = bannerjumpTo;
  // 转换选项为键值对
  function convertOptionsToKeys(options, mapping) {
    const convertedArray = options.map((option) => {
      const key = Object.keys(mapping).find((key) => mapping[key] === option);
      return { label: key, value: key };
    });

    return convertedArray.map((item) => item.value);
  }
  // 开放终端配置
  const openTerminalOptions = OPEN_TERMINAL_OPTIONS;
  // 开放终端状态
  const openTerminalState = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: openTerminalOptions || [],
  });
  // 活动下拉列表
  const promoList = ref<{ value: number; label: string }[]>([]);
  // 活动数据列表
  const promoDataList = ref<any[]>([]);
  // 获取活动下拉列表
  const getPromoList = async () => {
    const res = await getBannerV2PromoList({ lang: curSelLang.value });
    promoDataList.value = res;
    promoList.value = res.map((item: { id: any; name: any }) => ({
      value: item.id,
      label: item.name,
    }));
  };
  // 当前按钮跳转：选择的活动
  const currentButtonPromo = ref('');
  // 当前轮播图跳转：选择的活动aid
  const currentBannerPromo = ref('');
  // 当前域名
  const currentDomain = ref('');

  const btnlangShow = ref(true);
  const alllangImg = ref('');
  const alllangImgLis: any = ref([]);

  const localeList = useLocalList();
  const route = useRoute();
  const currentPopColorIndex = ref(0); // 弹窗颜色下标

  const currentPopTemplte = ref(1); //模版主题

  const editting = ref(false);
  const loading = ref(false);
  const { createMessage } = useMessage();
  const FORM_SIZE = useFormSetting().getFormSize as any;
  const currentPopIconTab = ref('1');
  const popIconTabs = getPopIconTabs();

  let HEAD_TITLE = ref(t('business.banner_add'));
  let SUBMIT_BTN = ref(t('business.banner_add_comfirm'));

  const apiMap = reactive({
    uploadApi: UploadBannerPic,
    language: 'zh-CN',
  });

  const popStyleTab =
    currentTpl.value == 7
      ? [{ value: 3, class: 'items-center !justify-center' }]
      : [
          { value: 1, class: 'flex-row-reverse' },
          { value: 2 },
          { value: 3, class: 'items-center !justify-center' },
        ];
  // 导入轮播底图
  const popColorTabs = Array.from({ length: 1 }, (_, i) => imagesMap[`bg_${i + 1}`]);

  const currentPopColor = ref('rgba(99, 161, 3, 1)'); // 弹窗颜色
  // 背景图
  const currentPopImage = ref(popColorTabs[0]); // 弹窗颜色
  // 图标
  const currentPopIcon = ref(popIconTabs[0].list[0]);

  const { getLocale } = useLocale();
  const sourceLang = [unref(getLocale)][0] || 'zh-CN'; // 源语言

  const currentPopStyle = ref(1);
  // if (currentTpl.value == 7) {
  //   currentPopStyle.value = 3;
  //   handleChangePopStyle(3);
  // } // 模板7默认样式为3
  // 当前语言索引
  const currentLangIndex = ref(0);
  const tinymceIsChange = ref(false);

  const currentSite = computed(() => {
    return userStore.getCurrentSite['id'] || 1;
  });

  const showLimitSize = computed(() => {
    return LimitSize.includes(currentSite.value);
  });

  const props = defineProps({
    editBulletinData: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  });

  // 切换弹窗颜色
  function handleChangePopColor(value) {
    currentPopColorIndex.value = value;
    currentPopImage.value = popColorTabs[currentPopColorIndex.value];
    changBg(value);
  }

  const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));
  // 轮播图跳转配置
  const jump = {
    jump_state: 1,
    jump_type: 2,
    jump_url: '',
    aid: '',
  };
  // 按钮跳转配置
  const btnJump = {
    button_state: 1,
    button_jump_type: 2,
    button_jump_url: '',
    button_aid: '',
  };

  const styleTemplte = ref('tm_theme1_');

  const styleColor = ref('white');
  // 轮播图默认文本
  const template_text1 = computed(() => {
    return `<div class='${styleTemplte.value}${styleColor.value}'>
      <p><span>${t('table.system.discount_money_like_rain')}</span></p>
      <p><span>${t('table.system.discount_free_participate')}</span></p>
      <p><span>${t('table.system.discount_daily_delivery6')}</span></p></div>`;
  });

  function replaceClass(str, oldClass, newClass) {
    return str.replace(oldClass, newClass);
  }
  // 轮播图默认数据
  const extraList = ref([
    {
      label: t('business.common_original'),
      value: 'default',
      transitionValue: '',
      transitionValueBtn: t('business.banner_lean_more'),
      transitionValueTitle: '',
      transitionValueSuperscript: t('table.system.discount_promotions'),
      btnShow: true,
      image_url: '',
      language: 'original',
      default_lang: '',
      jumpData: cloneDeep(jump),
      btnJumpData: cloneDeep(btnJump),
    },
  ]);
  // 多语言配置列表
  const langList = localeList.map((item) => {
    return {
      label: item.text,
      value: item.event,
      transitionValue: '',
      transitionValueBtn: '',
      transitionValueTitle: '',
      transitionValueSuperscript: '',
      btnShow: true,
      image_url: '',
      language: item.language || '',
      fileList: [],
      default_lang: '',
      jumpData: cloneDeep(jump),
      btnJumpData: cloneDeep(btnJump),
    };
  });

  const theme_1 = ref({});
  const customize = ref({});
  // 多语言文本配置列表
  const contentList = ref<Array<LangItem>>([...extraList.value, ...langList]);
  // 当前语言配置
  const currentLang = ref(contentList.value[0]);
  // 当前选择的语言
  const curSelLang = ref('zh_CN');
  // currentLang.value = contentList.value[0];
  // 多语言文本配置：切换语言
  const handleClickContent = (idx) => {
    currentLangIndex.value = idx;
    tinymceIsChange.value = false;
    currentLang.value = contentList.value[idx];
    apiMap.language = currentLang.value.value as string;
    curSelLang.value =
      currentLang.value.value === 'default' ? 'zh_CN' : (currentLang.value.value as string);
    changbtnJump();
  };

  const handleTinymceChange = (value) => {
    tinymceIsChange.value = true;
    contentList.value[currentLangIndex.value].transitionValue = value;
  };

  // 切换banner样式事件
  function handleChangePopStyle(value) {
    console.log('handleChangePopStyle', value);
    currentPopStyle.value = value;
    setTimeout(() => {
      setFieldsValue({ banner_style: Number(value) });
    }, 0);
    if (value == 3) {
      contentList.value = langList;
    } else {
      contentList.value = [...extraList.value, ...langList];
    }
    currentLang.value = contentList.value[0];
    currentLangIndex.value = 0;
  }

  // 切换弹窗图标
  function handleChangePopIcon(value) {
    currentPopIcon.value = value;
  }
  // banner标题：翻译原文
  const handleBtnTextBlur = (type) => {
    if (type == 'transitionValueSuperscript' && !contentList.value[0][type]) {
      contentList.value.forEach((el) => {
        el.transitionValueSuperscript = '';
      });
      return false;
    }
    if (!contentList.value[0][type]) return false;
    translateContentList(contentList.value, contentList.value[0][type], 0, type);
  };
  // banner图片：上传图片
  const handleChangeUpload = (data) => {
    if (btnlangShow.value) {
      currentLang.value.image_url = data;
      currentLang.value.fileList = [{ uid: '1', name: data, status: 'done' }];
      contentList.value[currentLangIndex.value].fileList = [
        { uid: '1', name: data, status: 'done' },
      ];
      valiveImg();
    } else {
      alllangImg.value = data;
      currentLang.value.image_url = data;
      alllangImgLis.value = [{ uid: '1', name: data, status: 'done' }];
      // contentList.value[currentLangIndex.value].fileList = [{ uid: '1', name: data, status: 'done' }];
      setFieldsValue({ banner_update_pic: data });
    }
  };
  // banner图片：删除图片
  function handleRemoveUpload() {
    if (btnlangShow.value) {
      currentLang.value.image_url = '';
      currentLang.value.fileList = [];
      contentList.value[currentLangIndex.value].fileList = [];
      valiveImg();
    } else {
      alllangImg.value = '';
      alllangImgLis.value = [];
      setFieldsValue({ banner_update_pic: '' });
    }
  }
  // 按钮/轮播图跳转配置：切换活动列表事件
  const handleChangePromo = (value, type = 'banner') => {
    const currentPromo = promoDataList.value.find((item) => item.id === value);
    if (type === 'banner') {
      currentBannerPromo.value = value;
      currentLang.value.jumpData['aid'] = value;
      currentLang.value.jumpData['jump_url'] = getPromoUrl(currentPromo);
    } else if (type === 'button') {
      currentButtonPromo.value = value;
      currentLang.value.btnJumpData['button_aid'] = value;
      currentLang.value.btnJumpData['button_jump_url'] = getPromoUrl(currentPromo);
    }
  };
  // 按钮/轮播图跳转配置：切换活动列表事件（全部通用）
  const handleChangePromoAll = (value, type = 'banner') => {
    const currentPromo = promoDataList.value.find((item) => item.id === value);
    if (type === 'banner') {
      currentBannerPromo.value = value;
      setFieldsValue({ all_jump_url: getPromoUrl(currentPromo) });
      setFieldsValue({ aid: value });
    } else if (type === 'button') {
      currentButtonPromo.value = value;
      currentLang.value.btnJumpData['button_aid'] = value;
      currentLang.value.btnJumpData['button_jump_url'] = getPromoUrl(currentPromo);
    }
  };
  // 转换拼接活动详情页面链接
  function getPromoUrl(data) {
    const currentNet = window.location.hostname;
    const currentLangUrl = LangURL[currentLang.value.value];
    const currentJumpUrl = activeJumpUrl[data.ty];
    Object.keys(domainObj).forEach((item) => {
      if (currentNet.includes(item)) {
        currentDomain.value = domainObj[item];
      }
    });
    if (data?.display_mode && data?.display_mode == 2) {
      return '/promotion';
    } else {
      const baseUrl = `/promotions/promotion/${currentJumpUrl}`;
      let queryParam = '';

      if (data.ty === 8) {
        queryParam = `?pid=${data.id}&cond=${data.cond}&preview=1`;
      } else if (data.ty === 3) {
        queryParam = `?promoid=${data.id}&preview=1`;
      } else {
        queryParam = `?pid=${data.id}&preview=1`;
      }

      return baseUrl + queryParam;
    }
  }

  watch(
    () => props.editBulletinData,
    (values) => {
      if (values.id) {
        editting.value = true;
        HEAD_TITLE.value = t('business.banner_edit');
        SUBMIT_BTN.value = t('business.banner_confrim');
        handelLoadingEditData(values);
      }
    },
  );

  // 滚动条滚动事件
  const doScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    if (scrollTop > 600) {
      scrollTopClass.value = 'bottom-20';
    } else {
      scrollTopClass.value = 'top-48';
    }
  };

  onMounted(() => {
    if (!props.isEdit) {
      let set_banner_sites = Number(route.query.bannerType);
      setFieldsValue({ banner_type: [set_banner_sites], client: openTerminalOptions });
      handleChangePopColor(0);
    }
    getPromoList();
    window.addEventListener('scroll', doScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', doScroll);
  });

  const [registerForm, { validate, setFieldsValue }] = useForm({
    labelWidth: 100,
    schemas,
    actionColOptions: {
      span: 24,
    },
    size: FORM_SIZE,
    compact: true,
    submitFunc,
    submitButtonOptions: {
      text: props.isEdit ? t('business.banner_confrim') : t('business.banner_add_comfirm'),
      size: FORM_SIZE as any,
      style: {
        width: '40%',
        marginTop: '20px',
        float: 'left',
        marginLeft: '120px',
      },
    },
    showResetButton: false,
    showActionButtonGroup: true,
  });
  // 修改文件名
  function modifyFilename(filename) {
    const regex = /-([a-zA-Z0-9]+)\.webp$/;
    return filename.replace(regex, '.webp');
  }
  // 验证过渡值
  function validateTransitionValues(extraList, type) {
    let nonDefaultItems = extraList.filter((item) => item.value !== 'default');
    let allTransitionValuesEmpty = nonDefaultItems.every((item) => item[type] === '');
    return allTransitionValuesEmpty;
  }

  // 提交事件
  async function submitFunc(): Promise<void> {
    try {
      const values = await validate();
      if (values.banner_style !== 3) {
        let istransitionValue = validateTransitionValues(contentList.value, 'transitionValue');
        if (istransitionValue) {
          createMessage.error(t('table.system.discount_p_enter_carousel'));
          return;
        }
      }
      loading.value = true;
      // 多语言配置数据：初始化
      let content = { default_lang: sourceLang },
        button_content = { default_lang: sourceLang },
        title = { default_lang: sourceLang },
        superscript = { default_lang: sourceLang },
        banner_url = {},
        config = {},
        button_state_map = {},
        jump_url_map = {},
        jump_type_map = {},
        button_aid_map = {};
      contentList.value.forEach((item) => {
        // 图片相关
        banner_url[item.value] = item.image_url;
        content[item.value] = item.transitionValue;
        button_content[item.value] = item.transitionValueBtn;
        title[item.value] = item.transitionValueTitle || '';
        superscript[item.value] = item.transitionValueSuperscript || '';
        if (item.value != 'default')
          config[item.value] = {
            ...item.jumpData,
            url: '',
          };
        button_state_map[item.value] = item['btnJumpData']['button_state'];
        jump_url_map[item.value] = item['btnJumpData']['button_jump_url'];
        jump_type_map[item.value] = item['btnJumpData']['button_jump_type'];
        button_aid_map[item.value] = item['btnJumpData']['button_aid'];
      });
      const {
        client,
        jump_type,
        jump_url,
        banner_style,
        button_jump_type,
        button_jump_url,
        button_state,
        jump_state,
        banner_type,
      } = values;
      let data: any = {
        banner_type,
        client: convertOptionsToKeys(client, Client),
        jump_type: jump_type || 1,
        jump_url: jump_url, //要改
        banner_style,
        jump_state,
        button_state_map,
        jump_url_map,
        jump_type_map,
        button_aid_map,
        template_style: currentPopTemplte.value,
      };

      if (data.jump_type == 1 && !jump_url) {
        data.jump_url = '111';
      }
      if (banner_style != 3) {
        data.banner_info = {
          background: modifyFilename(currentPopImage.value.split('/').pop()), //banner背景图
          icon: modifyFilename(currentPopIcon.value.split('/').pop()), //banner图标
          button_state,
          button_jump_type,
          button_jump_url,
          button_content,
          content,
          title,
          superscript,
          pic_mode_setting: {
            mode: 1,
            config,
          },
        };
      } else {
        data.banner_url = banner_url;
        if (values.img_type == 1) {
          data.banner_info = {
            pic_mode_setting: {
              mode: 1,
              config,
            },
          };
        } else {
          const { jump_state, jump_type, jump_url, all_jump_url, aid } = values;
          data.banner_info = {
            pic_mode_setting: {
              mode: 2,
              config: {
                all: {
                  jump_state,
                  jump_type,
                  jump_url: jump_url || all_jump_url,
                  aid,
                  url: alllangImg.value,
                },
              },
            },
          };
        }
      }
      const { data: text, status } = values.id
        ? await updateBannerV2({ ...data, id: values.id })
        : await insertBannerV2(data);

      if (status) {
        createMessage.success(text);
        // router.go(-1);
        router.push({ name: 'CarouselList', query: { bannerType: route.query.bannerType } });
        loading.value = false;
      } else {
        createMessage.error(text);
        loading.value = false;
      }
    } catch (e) {
      loading.value = false;
    }
  }

  // 处理回显数据
  const handelLoadingEditData = (data) => {
    const {
      background,
      button_content,
      button_jump_type,
      button_jump_url,
      button_state,
      content,
      icon,
      title,
      superscript,
      pic_mode_setting,
    } = data['banner_info'];

    const { button_state_map, jump_url_map, jump_type_map, button_aid_map } = data;
    if (data.jump_url == '111') data.jump_url = null;

    let _data = { ...data, button_jump_type, button_jump_url, button_state, button_aid_map };

    // 客户端
    data.client = data.client.map((key) => Client[key]);
    openTerminalState.checkedList = data.client;

    // if (button_state == 1) isbtnShow.value = true;
    // else isbtnShow.value = false;
    if (button_jump_type == 0) _data.button_jump_type = 1;
    // banner样式：自定义; 图片模式：全部通用
    if (data.banner_style == 3 && pic_mode_setting.mode == 2) {
      const { jump_state, jump_type, jump_url, url, aid } = pic_mode_setting.config.all;
      _data = {
        ..._data,
        jump_state,
        jump_type,
        jump_url,
        all_jump_url: jump_url,
        img_type: 2,
        aid,
        banner_update_pic: url,
      };
      if (_data.jump_type == 0) _data.jump_type = 2;
    }
    setFieldsValue(_data);

    //Banner样式切换事件
    handleChangePopStyle(data.banner_style);

    // 客户端
    // const convertedArray = data.client.map(key => Client[key]);

    //Banner颜色
    let indexImg = imagesMap[background.replace('.webp', '')];

    function findElementIndex(arr, element) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === element) {
          return i;
        }
      }
      return -1; // 如果元素未找到，返回 -1 表示未找到
    }

    let indexOfNine = findElementIndex(popColorTabs, indexImg);
    if (indexOfNine !== -1) handleChangePopColor(indexOfNine);
    else handleChangePopColor(0);

    //图标
    if (icon) handleChangePopIcon(imagesMap[icon.replace('.webp', '')]);

    if (data.banner_style == 3 && pic_mode_setting.mode == 2) {
      alllangImg.value = pic_mode_setting.config.all.url;
      btnlangShow.value = false;
    }

    contentList.value.forEach((item) => {
      if (content && content[item.value]) item.transitionValue = content[item.value];
      if (data['banner_url'] && data['banner_url'][item.value])
        item.image_url = data['banner_url'][item.value];
      if (button_content && button_content[item.value])
        item.transitionValueBtn = button_content[item.value];
      if (title && title[item.value]) item.transitionValueTitle = title[item.value];

      if (superscript && superscript[item.value])
        item.transitionValueSuperscript = superscript[item.value];

      if (data['banner_url'] && data['banner_url'][item.value])
        item.fileList = [{ uid: '1', name: data['banner_url'][item.value], status: 'done' }];

      if (pic_mode_setting.mode == 1) {
        if (item.value == 'default') item.jumpData = pic_mode_setting.config['zh_CN'];
        else item.jumpData = pic_mode_setting.config[item.value];
      }
      item.btnJumpData = {
        button_state: button_state_map?.[item.value] ?? 1,
        button_jump_url: jump_url_map?.[item.value] ?? '',
        button_jump_type: jump_type_map?.[item.value] ?? 2,
        button_aid: button_aid_map?.[item.value] ?? '',
      };
    });
    //模版
    currentPopTemplte.value = data.template_style;
    // 模版切换
    // handleChangetemplate(data.template_style);
    valiveImg();
  };

  // 验证图片
  function valiveImg() {
    const itemsWithImageUrl = contentList.value.filter((item) => {
      return item.image_url;
    });
    if (itemsWithImageUrl.length > 0) {
      setFieldsValue({ banner_update_pic: itemsWithImageUrl[0].image_url });
    } else {
      if (btnlangShow.value) {
        setFieldsValue({ banner_update_pic: null });
      } else {
        setFieldsValue({ banner_update_pic: alllangImg.value });
      }
    }
  }

  // 背景颜色切换
  function changBg(v) {
    if (v == 1) styleColor.value = 'white';
    if (v == 0) styleColor.value = 'blueGreen';
    tinShow.value = false;
    if (v == 1) tinBg.value = '#fff';
    if (v == 0) tinBg.value = '#2F4553';
    setTimeout(() => {
      tinShow.value = true;
      if (extraList.value[0].transitionValue)
        extraList.value[0].transitionValue = replaceClass(
          extraList.value[0].transitionValue,
          `${styleTemplte.value}${styleColor.value == 'white' ? 'blueGreen' : 'white'}`,
          `${styleTemplte.value}${styleColor.value}`,
        );
    });
  }

  // 全选开放终端
  function onCheckAllChange(e: any, model: any, field: any): void {
    Object.assign(openTerminalState, {
      checkedList: e.target.checked ? openTerminalOptions : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? openTerminalOptions : [];
  }
  // 全选开放终端：选中终端
  function onChangeOpenTerminal(value: string[], model: any, field: any): void {
    model[field] = value;
  }

  watch(
    () => openTerminalState.checkedList,
    (val) => {
      openTerminalState.indeterminate = !!val.length && val.length < openTerminalOptions.length;
      openTerminalState.checkAll = val.length === openTerminalOptions.length;
      setFieldsValue({ client: openTerminalState.checkedList });
    },
  );

  // 跳转开关：是否开启按钮跳转
  function handleChangePopContent(e) {
    if (e.target.value == 2) btnlangShow.value = false;
    else btnlangShow.value = true;
  }
  // 轮播图跳转配置：跳转开关/轮播跳转
  function mapJumpData() {
    if (!props.isEdit && currentLangIndex.value == 0) {
      const { jumpData } = contentList.value[0];
      contentList.value.forEach(
        (item) => item.value !== 'default' && (item.jumpData = cloneDeep(jumpData)),
      );
    } else if (props.isEdit) {
      if (currentLang.value.jumpData['jump_type'] !== 15) {
        currentLang.value.jumpData['jump_url'] = '';
        currentLang.value.jumpData['aid'] = '';
      }
    }
  }
  // 轮播图跳转配置：切换活动列表事件
  function mapJumpUrl() {
    if (!props.isEdit && currentLangIndex.value == 0) {
      const { jumpData } = contentList.value[0];
      contentList.value.forEach(
        (item) => item.value !== 'default' && (item.jumpData = cloneDeep(jumpData)),
      );
    }
  }
  // 多语言文本配置：翻译原文
  function handleClickTranslation() {
    if (!contentList.value[0].transitionValue) {
      message.error(t('v.bannner.origin_transitionValue'));
      return false;
    }

    handleBtnTextBlur('transitionValueSuperscript');

    handleBtnTextBlur('transitionValueBtn');

    translateContentList(
      contentList.value,
      contentList.value[0].transitionValue,
      0,
      'transitionValue',
    ).then((res) => {
      if (res.success) {
        message.success(t('v.bannner.transitionValue_success'));
      } else {
        message.error(t('v.bannner.transitionValue_error'));
      }
    });
  }
  // 模版主题切换
  function handleChangetemplate(value) {
    currentPopTemplte.value = value;
    if (value == 2) {
      contentList.value.forEach((el) => {
        customize.value[el.value] = el.transitionValue;
      });
      contentList.value.forEach((el) => {
        el.transitionValue = theme_1.value[el.value]
          ? theme_1.value[el.value]
          : template_text1.value;
      });
    } else {
      contentList.value.forEach((el) => {
        theme_1.value[el.value] = el.transitionValue;
      });
      contentList.value.forEach((el) => {
        el.transitionValue = customize.value[el.value] ? customize.value[el.value] : '';
      });
    }
  }
  // 按钮跳转配置事件
  function changbtnJump() {
    const { btnJumpData } = currentLang.value;
    setFieldsValue({ ...btnJumpData });
  }
  // 单独按钮跳转配置事件
  function changbtnJumpType() {
    const { btnJumpData } = currentLang.value;
    if (btnJumpData['button_jump_type'] !== 15) {
      btnJumpData['button_jump_url'] = '';
      btnJumpData['button_aid'] = '';
    }
    setFieldsValue({ ...btnJumpData });
  }
  // // 当前模板
  // const currentTpl = computed(() => {
  //   return userStore.getCurrentSite['tpl'] || 1;
  // });
  if (currentTpl.value == 7) {
    console.log('当前模板为7');
    currentPopStyle.value = 3;
    handleChangePopStyle(3);
  }
</script>
<style lang="less">
  html,
  body {
    width: auto;
    height: 100%;
  }
</style>

<style lang="less" scoped>
  ::v-deep(.ant-modal-header) {
    border: 1px solid red !important;
  }

  .border-active-color {
    border-color: @primary-color;
  }

  .site-card-form {
    .ant-page-header-back {
      display: none;
    }
  }

  .pageHeader {
    margin-bottom: 20px;
    background-color: rgb(242 242 242 / 100%);
  }

  .setBannerSites {
    color: rgb(2 167 240 / 100%);
  }

  .bannerStylebox {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-top: -2px;
    margin-right: 8px;
    background: no-repeat;
    background-image: url('/@/assets/images/active-add.webp');
    background-position: center;
    background-size: 100%;
    vertical-align: middle;
  }

  .bannerColorbox {
    display: inline-block;
    width: 80px;
    height: 40px;
    margin-right: 15px;
    border: 1px solid rgb(242 242 242 / 100%);
    border-radius: 5px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
  }

  .bannerColorDiv {
    display: block;
    width: 70px;
    height: 30px;
    margin: auto;
    margin-top: calc(50% - 35px);
  }

  .boxChecked {
    border: 1px solid rgb(2 167 240 / 100%);
  }

  .bannerIconsTab {
    height: 20px;
    //padding-top: 6px;
    //padding-bottom: 6px;
    padding: 6px;
    font-family: PingFangSC-Semibold, 'PingFang SC Semibold', 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
  }

  .bannerIconTabChecked {
    position: relative;
    z-index: 333;
    border: 1px solid rgb(2 167 240 / 100%);
    border-bottom: 1px solid #fff;
    background-color: #fff;
    color: rgb(2 167 240 / 100%);
  }

  .bannerIconsTabBottom {
    position: absolute;
    z-index: 12;
    width: 100%;
    height: 1px;
    margin-top: 5px;
    background-color: rgb(242 242 242 / 100%);
  }

  .bannerIconsBox {
    width: 100%;
    height: 282px;
    margin-top: 15px;
    overflow-y: scroll;

    img {
      display: block;
      width: 80px;
      height: 80px;
      margin: 0 15px 15px 0;
      float: left;
      border: 1px solid rgb(242 242 242 / 100%);
      border-radius: 5px;
      cursor: pointer;
    }
  }

  .iconSelect {
    border: 1px solid rgb(2 167 240 / 100%) !important;
  }

  .bannerLanguage {
    display: inline-block;
    width: 70px;
    height: 40px;
    margin-right: 15px;
    border: 1px solid rgb(2 167 240 / 100%);
    color: rgb(2 167 240 / 100%);
    line-height: 40px;
    text-align: center;
    cursor: pointer;
  }

  .bannerLanguageChecked {
    background: linear-gradient(90deg, rgb(27 194 216 / 100%) 0%, rgb(64 158 255 / 100%) 100%);
    color: #fff;
  }

  .dragBox {
    position: relative;
    width: 100%;
    height: 330px;
    margin-top: 15px;
  }

  .slotInput,
  .slotselect {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    border: 1px solid #f2f2f2;
  }

  .slotInput:focus,
  .slotselect:focus {
    border: 2px solid rgb(2 167 240 / 100%);
  }

  .modi-position {
    display: block;
    position: absolute;
    top: 0;
    left: 228px;
  }

  .modi-shape-box {
    display: flex;
    align-items: center;
    justify-content: center;

    .modi-shape-content {
      width: 40%;
      height: 36px;
      margin-top: 6px;

      div {
        width: 100%;
        height: 10px;
        background-color: rgb(242 242 242 / 100%);
      }

      div:first-child {
        margin-bottom: 3px;
      }
    }

    .modi-shape-content:first-child {
      margin-right: 5px;
    }

    .modi-shape-block {
      width: 40%;
      height: 36px;
      margin-top: 6px;
      background-color: rgb(242 242 242 / 100%);
    }

    .modi-shape-block-left {
      margin-right: 5px;
    }
  }

  .border-active-color {
    border-color: @primary-color;
  }

  ::v-deep(.vben-basic-form--compact .ant-form-item) {
    margin-bottom: 16px !important;
  }

  /deep/ p {
    margin-bottom: 0;
  }
</style>
<style lang="less" scoped>
  ::v-deep(.ant-page-header) {
    background-color: transparent;
  }

  ::v-deep(.vben-page-wrapper-content-bg) {
    background-color: transparent !important;
  }

  ::v-deep(.ant-page-header-heading-left) {
    margin-top: 0;
    margin-bottom: 0;

    .ant-page-header-heading-title {
      color: #444;
      font-size: 18px;
      font-size: 500;
      line-height: 18px;
    }

    .ant-page-header-back {
      margin-right: 15px;

      div svg {
        display: none;
      }

      div::after {
        content: ' ';
        display: inline-block;
        width: 9.1px;
        height: 14px;
        background: no-repeat;
        background-image: url('/@/assets/images/btn-left.webp');
        background-size: 100%;
        vertical-align: middle;
      }
    }
  }

  .bg-DCE3F1 {
    background-color: #dce3f1;
  }
</style>
