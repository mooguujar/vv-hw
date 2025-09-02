<template>
  <PageWrapper>
    <Affix :offset-top="top">
      <div
        style="background-color: #1b2c37"
        class="fixed z-10 flex flex-col rounded-md top-60 right-10 w-450px h-415px p-10px announcement-display"
      >
        <div class="flex items-center w-full h-60px textF">
          <SvgIcon name="laba" size="20" class="mr-5px" :style="{ color: '#b1bad3' }" />
          {{
            currentLang.transitionValueTitle
              ? currentLang.transitionValueTitle
              : t('routes.system.site_announcement')
          }}
        </div>
        <div class="w-full overflow-hidden rounded-md h-355px" style="background-color: #0f212e">
          <div v-if="popContent == 1">
            <div
              id="html_text"
              class="leading-4 flex-1 whitespace-pre-wrap break-all text-xs p-[10px] leading-[1.5]"
              style="color: #b1bad3"
              v-html="currentLang.transitionValue"
            >
            </div>
          </div>
          <div v-else class="flex items-center">
            <div
              v-if="currentPopStyle == 1 || currentPopStyle == 2"
              :class="[{ 'flex-row-reverse': currentPopStyle !== 1 }]"
              class="flex justify-between w-full mt-40px"
            >
              <div
                id="html_text"
                class="leading-4 whitespace-pre-wrap break-all text-xs p-[10px] leading-[1.5] item1"
                style="color: #b1bad3"
                v-html="currentLang.transitionValue"
              >
              </div>
              <div class="item2" v-if="currentPopIcon">
                <img class="w-173px h-245px" :src="currentPopIcon" />
              </div>
            </div>
            <div v-if="currentPopStyle == 3 && currentLang.image_url">
              <img
                :src="getDataTypePreviewUrl(currentLang.image_url)"
                class="object-cover w-430px h-340px"
              />
            </div>
          </div>
        </div>
      </div>
    </Affix>
    <BasicForm class="announce-form-local" @register="createForm">
      <template #titleTextSlot>
        <FormItemRest>
          <div class="flex">
            <Input
              v-model:value="currentLang.transitionValueTitle"
              :placeholder="t('table.system.system_p_announce_title')"
              size="large"
              @blur="blurTitle"
            />
            <Button size="large" class="m-l-5" @click="moreLangurageModal" type="primary">{{
              t('v.discount.activity.more_language')
            }}</Button>
          </div>
        </FormItemRest>
      </template>
      <template #startDate="{ model, field }">
        <DatePicker
          style="width: 100%"
          :size="FORM_SIZE"
          v-model:value="model[field]"
          show-time
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #endDate="{ model, field }">
        <DatePicker
          style="width: 100%"
          :size="FORM_SIZE"
          v-model:value="model[field]"
          show-time
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #clientSlot="{ model, field }">
        <FormItemRest>
          <!--全选-->
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
      <template #popContent="{ model, field }">
        <RadioGroup
          v-model:value="model[field]"
          :options="contentOptions"
          @change="handleChangePopContent"
        />
      </template>
      <template #popStyle>
        <div class="flex">
          <div
            v-for="(item, index) in popStyleTab"
            :key="index"
            class="ml-2 flex justify-between flex-wrap w-25 h-12.5 py-1 px-2 border border-slate-100 rounded cursor"
            :class="[item.value === currentPopStyle ? 'border-active-color' : '', ...[item.class]]"
            @click="handleChangePopStyle(item.value)"
          >
            <!--自定义-->
            <div v-if="item.value === 3" class="text-slate-500">{{
              $t('business.banner_customer_defined')
            }}</div>
            <template v-else>
              <div class="h-10 w-9 bg-slate-200"></div>
              <div>
                <div class="w-10 h-2.5 bg-slate-200"></div>
                <div class="w-10 h-2.5 bg-slate-200 mt-1"></div>
              </div>
            </template>
          </div>
        </div>
      </template>
      <template #popColor>
        <div class="flex flex-wrap">
          <div
            v-for="(item, index) in popColorTabs"
            :key="index"
            class="w-20 h-10 px-1 py-1 mb-2 ml-2 border rounded border-slate-200 cursor"
            :class="[index === currentPopColorIndex ? 'border-active-color' : '']"
            @click="handleChangePopColor(index)"
          >
            <div class="w-full h-full" :style="{ background: item }"></div>
          </div>
        </div>
      </template>
      <template #popIcon>
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
      <template #content>
        <LangRadioGroup
          :contentList="contentList"
          @click:radio="handleClickContent"
          class="lan-radio-box"
          :showTranslation="popContent == 2 ? false : true"
          @click:translation="handleClickTranslation"
        />
      </template>
      <template #contentEdit="{ model }">
        <div class="block1" v-if="currentPopStyle === 3 && model.pop_up_type === 2">
          <!--将文件拖到此处，或点击上传-->
          <BaseUploadDragger
            name="uploadfile"
            :upload-text="$t('modalForm.system.system_drag_doc_tip')"
            :maxNumber="1"
            :maxSize="2"
            :showUploadList="true"
            :isShowPopover="true"
            :height="538"
            :width="650"
            :apiMap="apiMap"
            :action="'/site/notice/upload'"
            :url="currentLang.image_url"
            :CheckSize="true"
            accept="image/png,image/jpg,image/gif,image/jpeg,image/webp"
            :file-list="currentLang.fileList"
            @change="handleChangeUpload"
            @remove="handleRemoveUpload"
          />
        </div>
        <div v-else class="block">
          <Tinymce
            v-model="currentLang.transitionValue"
            :showImageUpload="false"
            @change="handleTinymceChange"
          />
        </div>
      </template>
    </BasicForm>
    <Loading :loading="loading" :absolute="false" />
    <buttonTextModal @register="textModal" @emits-values="getValues" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, watch, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useContentOptions } from '../../common/const';
  import { Tinymce } from '/@/components/Tinymce/index';
  import Loading from '/@/components/Loading/src/Loading.vue';
  import {
    Tabs,
    TabPane,
    Checkbox,
    CheckboxGroup,
    FormItemRest,
    DatePicker,
    Affix,
    Image,
    RadioGroup,
    message,
    Input,
    Button,
  } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';
  import { schemas } from './announcementFormData';
  import { useMemberStore } from '/@/store/modules/member';
  import { BaseUploadDragger } from '/@/components/BaseUploadDragger';
  import LangRadioGroup from '../../common/components/LangRadioGroup.vue';
  import translateContentList from '/@/views/common/language';
  import { getPopIconTabs, popColorTabs } from '../../common/setting';
  import { ClientMappings, Client, OPEN_TERMINAL_OPTIONS } from '/@/views/common/commonSetting';
  import { useModal } from '/@/components/Modal';
  import { useLocalList } from '/@/settings/localeSetting';
  import { insertSiteNoticet, updateSiteNoticet, uploadSiteNotice } from '/@/api/sys';
  import { formatToDateTime, timeChange, toUTCtime, toUTCValue } from '/@/utils/dateUtil';
  import { toImage } from '../../common/utils';
  import { transform } from 'lodash-es';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import buttonTextModal from '/@/components/buttonTextModal/buttonTextModal.vue';
  import SvgIcon from '@/components/Icon/src/SvgIcon.vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';

  const { contentOptions } = useContentOptions();
  const localeList = useLocalList();
  const { t } = useI18n();
  interface FormModel {
    beginTime: Date | null;
    endTime: Date | null;
    state: string | number;
  }
  const props = defineProps({
    isEdit: {
      type: Boolean,
      default: false,
    },
    editBulletinData: {
      type: Object,
      default: () => null,
    },
  });
  const popIconTabs = getPopIconTabs();
  const extraList = [
    {
      label: t('business.common_original'),
      value: 'default',
      transitionValue: '',
      transitionValueTitle: '',
      image_url: '',
      language: 'original',
    },
  ];

  const langList = localeList.map((item) => {
    return {
      label: t('common.common_' + item.event),
      value: item.event,
      transitionValue: '',
      transitionValueTitle: '',
      image_url: '',
      language: item.language || '',
      fileList: [],
    };
  });

  const contentList: any = ref([...extraList, ...langList]);
  const memberStore = useMemberStore();
  // 获取VIP等级下拉
  memberStore.getVipLevelList();
  // 获取层级下拉
  memberStore.getLevelList();
  const top = ref(10);
  const loading = ref(false);
  const tinymceIsChange = ref(false);
  const FORM_SIZE = useFormSetting().getFormSize;
  const openTerminalOptions = OPEN_TERMINAL_OPTIONS;
  const router = useRouter();
  const currentPopStyle = ref(1); // 弹窗样式
  const currentPopColorIndex = ref(0); // 弹窗颜色下标
  const currentPopColor = ref<any>(popColorTabs[0]); // 弹窗颜色
  const currentPopIconTab = ref('1'); // 弹窗图标tabs分组
  const currentPopIcon = ref(''); // 弹窗图标
  const currentLangIndex = ref(0); // 当前语言公告内容下标
  const currentLang = ref(contentList.value[0]); // 当前语言公告内容

  const popContent = ref(1);

  const apiMap = reactive({
    uploadApi: uploadSiteNotice,
    language: 'zh-CN',
  });

  const popStyleTab = [
    { value: 1, class: 'flex-row-reverse' },
    { value: 2 },
    { value: 3, class: 'items-center !justify-center' },
  ];

  const [createForm, { setFieldsValue, validate, setProps, resetFields, getFieldsValue }] = useForm(
    {
      labelWidth: 120,
      schemas,
      actionColOptions: {
        span: 16,
      },
      size: FORM_SIZE,
      submitFunc,
      submitButtonOptions: <any>{
        text: t('business.banner_add_comfirm'), //确认新增
        size: FORM_SIZE,
        style: {
          width: '40%',
          // marginTop: '20px',
        },
      },
      showResetButton: false,
    },
  );
  const [textModal, { openModal }] = useModal();
  const openTerminalState = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: openTerminalOptions || [],
  });
  // 切换弹窗内容
  function handleChangePopContent(e) {
    if (e.target.value === 1) {
      currentPopStyle.value = 1;
      currentPopIcon.value = '';
      contentList.value = [...extraList, ...langList];
    } else {
      setFieldsValue({ pop_up_style: 3 });
      currentPopStyle.value = 3;
      currentPopIcon.value = popIconTabs[0].list[0];
      if (currentPopStyle.value == 3) contentList.value = langList;
    }
    popContent.value = e.target.value;
    setTimeout(() => {
      handleClickContent(0);
    }, 100);
  }
  // 切换弹窗样式
  function handleChangePopStyle(value) {
    currentPopStyle.value = value;
    setFieldsValue({ pop_up_style: Number(value) });
    if (value == 3) {
      contentList.value = langList;
    } else {
      contentList.value = [...extraList, ...langList];
    }
    currentLang.value = contentList.value[0];
    currentLangIndex.value = 0;
  }
  // 切换弹窗颜色
  function handleChangePopColor(value) {
    currentPopColorIndex.value = value;
    currentPopColor.value = popColorTabs[currentPopColorIndex.value];
  }
  // 切换弹窗图标
  function handleChangePopIcon(value) {
    currentPopIcon.value = value;
  }
  // 切换语言
  function handleClickContent(index) {
    tinymceIsChange.value = false;
    currentLangIndex.value = index;
    currentLang.value = contentList.value[currentLangIndex.value];
    apiMap.language = currentLang.value.value;
  }
  // 富文本
  function handleTinymceChange(value) {
    tinymceIsChange.value = true;
    contentList.value[currentLangIndex.value].transitionValue = value;
  }

  async function moreLangurageModal() {
    setTimeout(() => {
      const title = transform(
        contentList.value,
        function (result, item, key) {
          result[item.value] = item.transitionValueTitle;
        },
        {},
      );
      openModal(true, { data: title });
    }, 1500);
  }
  const handleBtnTextBlur = async (type) => {
    await translateContentList(
      contentList.value,
      currentLang.value[type],
      currentLangIndex.value,
      type,
    );
  };
  // 上传成功返回
  function handleChangeUpload(data) {
    currentLang.value.image_url = data;
    currentLang.value.fileList = [{ uid: '1', name: data, status: 'done' }];
  }

  function handleRemoveUpload(data) {
    currentLang.value.image_url = '';
    currentLang.value.fileList = [];
  }

  // 全选开放终端
  function onCheckAllChange(e: any, model: any, field: any): void {
    Object.assign(openTerminalState, {
      checkedList: e.target.checked ? openTerminalOptions : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? openTerminalOptions : [];
  }

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
  let parseData = (record) => {
    try {
      typeof record.content === 'string' ? (record.content = JSON.parse(record.content)) : '';
      typeof record.image_url === 'string' ? (record.image_url = JSON.parse(record.image_url)) : '';
      typeof record.image_info === 'string'
        ? (record.image_info = JSON.parse(record.image_info))
        : '';
      typeof record.title === 'string' ? (record.title = JSON.parse(record.title)) : '';
      let crowd_content =
        typeof record.crowd_content === 'string'
          ? record.crowd_content.split(',')
          : record.crowd_content;
      record.client = typeof record.client === 'string' ? record.client.split(',') : record.client;
      record.usernames = crowd_content;
      record.user_levels = crowd_content;
      record.vip_levels = crowd_content;
      record.agents = crowd_content;
    } catch (e) {
      console.error(e);
    }

    return record;
  };
  watch(
    () => props.editBulletinData,
    (values) => {
      if (!values.id) {
        currentLang.value.transitionValueTitle = '';
        currentLang.value.transitionValue = '';
      }
      setProps({
        submitButtonOptions: {
          text: values.id
            ? t('business.banner_edit_comfirm')
            : t('business.banner_add_comfirm') + '11', //'确认编辑' : '确认新增'
        },
      });

      values = parseData(values);
      setFieldsValue({
        ...values,
        client: values.client.map((el) => Client[Number(el)]),
        start_time: values.start_time * 1000,
        end_time: values.end_time * 1000,
        user_levels: values.user_levels ? values.user_levels.map((level) => level.toString()) : [],
        vip_levels: values.vip_levels ? values.vip_levels.map((level) => level.toString()) : [],
        usernames: values.usernames ? values.usernames.join(',') : '',
        agents: values.agents ? values.agents.join(',') : '',
      });

      const { pop_up_style, color, icon_tab, icon } = values.image_info;
      handleChangePopStyle(pop_up_style);
      popContent.value = values.pop_up_type;

      currentPopIconTab.value = icon_tab;
      currentPopIcon.value = icon;
      currentPopColor.value = color;
      currentPopColorIndex.value = popColorTabs.findIndex((item) => item === color);
      // if (values.pop_up_type == 2 && pop_up_style !== 3) {
      // }

      const image_url = values.image_url;
      const content = values.content;
      const title = values.title;

      let copyContentList = contentList.value;

      if (currentPopStyle.value == 3) {
        copyContentList = [...extraList, ...langList];
      }

      copyContentList.forEach((item) => {
        item.image_url = image_url[item.value];
        item.transitionValue = content[item.value];
        item.transitionValueTitle = title[item.value];
        item.fileList = [{ uid: '1', name: image_url[item.value], status: 'done' }];
      });
      Object.assign(openTerminalState, {
        checkedList: values.client.map((el) => Client[Number(el)]),
      });
    },
  );

  async function bacthUploadImage() {
    async function uploadImage(imageResults) {
      const dom = document.querySelector(`#announcement`);
      const el: any = dom?.querySelector('#html_text');
      for (let i = 0; i < contentList.value.length; i++) {
        const item: any = contentList.value[i];
        try {
          if (item.transitionValue) {
            el.innerHTML = item.transitionValue;
            item.file = await toImage(dom, 4);
            const { data } = await uploadSiteNotice({
              file: item.file,
              name: 'uploadfile',
              lang: item.value,
            });
            if (data.status) {
              const imageUrl = data.data;
              item.image_url = imageUrl;
              imageResults.push(imageUrl);
            } else {
              throw new Error(data.data);
            }
          } else {
            item.image_url = '';
          }
          // 处理当前请求的数据
        } catch (error) {
          console.error(error);
        }
      }
    }
    try {
      const imageResults = [];
      await uploadImage(imageResults);
      return { success: true, imageUrls: imageResults };
    } catch (error) {
      console.error('上传图片失败', error);
      return { success: false, imageUrls: [] };
    }
  }

  function validateTransitionValues(extraList, type) {
    let nonDefaultItems = extraList.filter((item) => item.value !== 'default');
    let allTransitionValuesEmpty = nonDefaultItems.every((item) => item[type] === '');
    return allTransitionValuesEmpty;
  }

  function getValues(valueNumToStr, type) {
    console.log('valueNumToStr, type', valueNumToStr, type);
    contentList.value.forEach((item) => {
      item.transitionValueTitle = valueNumToStr[item.value] || '';
    });
  }

  async function submitFunc(): Promise<void> {
    try {
      const values = await validate();
      if (values.usernames) {
        values['usernames'] = values.usernames.includes(',')
          ? values.usernames.split(',')
          : [values.usernames];
      } else if (values.user_levels) {
        values['user_levels'] = values.user_levels
          ? values.user_levels.map((level) => Number(level))
          : [];
      } else if (values.vip_levels) {
        values['vip_levels'] = values.vip_levels
          ? values.vip_levels.map((level) => Number(level))
          : [];
      } else if (values.agents) {
        values['agents'] = values.agents.includes(',') ? values.agents.split(',') : [values.agents];
      }
      if (values.flags == 1) values['all'] = 1;
      if (values.flags == 5) values['agent'] = 1;

      if (!currentLang.value.transitionValueTitle) {
        message.error(t('table.system.system_p_announce_title'));
        return;
      }
      if (formatToDateTime(values.end_time) < formatToDateTime(values.start_time)) {
        message.error(t('table.discountActivity.discount_time_err'));
        return;
      }
      if (currentPopStyle.value !== 3) {
        let istransitionValue = validateTransitionValues(contentList.value, 'transitionValue');
        if (istransitionValue) {
          message.error(t('table.discountActivity.system_p_announce_content'));
          return;
        }
      }

      formatToDateTime(values.end_time);

      loading.value = true;
      // if (currentPopStyle.value !== 3) {
      //   await bacthUploadImage();
      // }

      let copyContentList = contentList.value;

      if (currentPopStyle.value == 3) {
        copyContentList = [...extraList, ...langList];
      }

      const image_url = transform(
        contentList.value,
        function (result, item, key) {
          result[item.value] = item.image_url;
        },
        {},
      );

      const content = transform(
        copyContentList,
        function (result, item, key) {
          result[item.value] = item.transitionValue;
        },
        {},
      );

      const title = transform(
        copyContentList,
        function (result, item, key) {
          result[item.value] = item.transitionValueTitle;
        },
        {},
      );

      title['default'] = title['zh_CN'];
      let image_info: any = {
        pop_up_style: currentPopStyle.value,
        icon_tab: currentPopIconTab.value,
        icon: currentPopIcon.value,
        color: currentPopColor.value,
        id: props.editBulletinData ? props.editBulletinData.image_info.id : '',
      };
      image_info = JSON.stringify(image_info);
      let crowd_content =
        values.flags == 2
          ? values.usernames.join(',')
          : values.flags == 3
          ? values.user_levels.join(',')
          : values.flags == 4
          ? values.vip_levels.join(',')
          : values.flags == 5
          ? values.agents.join(',')
          : '';

      const params = {
        ...values,
        image_info: image_info,
        crowd_content: crowd_content,
        notice_type: 1,
        start_time: toUTCValue(values.start_time),
        end_time: toUTCValue(values.end_time),
        client: values.client.map((el) => ClientMappings[el]).join(','),
        image_url: JSON.stringify(image_url),
        content: JSON.stringify(content),
        title: JSON.stringify(title),
      };
      const { data, status } = values.id
        ? await updateSiteNoticet(params)
        : await insertSiteNoticet(params);

      if (status) {
        message.success(data);
        router.go(-1);
        loading.value = false;
        resetFields();
        currentLang.value.transitionValueTitle = '';
        currentLang.value.transitionValue = '';
      } else {
        message.error(data);
        loading.value = false;
      }
    } catch (e) {
      loading.value = false;
      console.error(e);
    }
  }

  const model = ref<FormModel>({
    beginTime: dayjs().startOf('day').toDate(),
    endTime: dayjs().endOf('day').toDate(),
    state: '',
  });

  const disabledStartDate = (date) => {
    if (!model.value.endTime || !date) return false;
    return date.valueOf() > model.value.endTime.valueOf();
  };

  const disabledEndDate = (date) => {
    if (!model.value.beginTime || !date) return false;
    return date.valueOf() < model.value.beginTime.valueOf();
  };

  const onStartDateChange = (value) => {
    model.value.beginTime = value;
  };

  const onEndDateChange = (value) => {
    model.value.endTime = value;
  };

  function handleClickTranslation() {
    if (currentPopStyle.value != 3) {
      if (!contentList.value[0].transitionValue) {
        message.error(t('v.bannner.origin_transitionValue'));
        return false;
      }

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
  }
  function blurTitle() {
    handleBtnTextBlur('transitionValueTitle');
  }
  onMounted(() => {
    if (!props.isEdit) {
      setFieldsValue({ client: openTerminalOptions });
    }
  });
</script>

<style lang="less">
  .announce-form-local {
    label[for='form_item_is_limit'],
    label[for='form_item_flags'] {
      > span {
        display: flex;
      }
    }
  }
</style>

<style lang="less">
  .border-active-color {
    border-color: @primary-color;
  }

  html,
  body {
    width: auto;
    height: 100%;
  }
</style>
<style lang="less" scoped>
  .lan-radio-box {
    position: relative;
  }

  .bg-slate-announcement {
    background: url('@/assets/images/modal_bg.webp') no-repeat;
    background-size: 100% 100%;

    .pop-bg {
      margin: 0 15px;
      background: url('@/assets/images/modal.webp') no-repeat;
      background-size: 100% 100%;
    }
  }

  ::v-deep(.ant-col) {
    &.ant-col-16:last-child > div {
      font-size: 14px !important;
      font-weight: 600 !important;
      text-align: center !important;
    }
  }

  .textF {
    color: #fff;
    font-family: 'PingFang SC';
    font-size: 16px;
    font-weight: 600;
  }

  .item1 {
    flex-basis: 70%;
  }

  .item2 {
    flex-basis: 30%;
  }

  .block {
    width: 100%;
    height: 380px;
  }

  .block1 {
    width: 100%;
    height: 250px;
  }
</style>
