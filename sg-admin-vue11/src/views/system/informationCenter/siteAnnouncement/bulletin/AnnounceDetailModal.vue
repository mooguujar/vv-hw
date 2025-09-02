<template>
  <!--公告详情-->
  <BasicModal
    @register="registerMarquee"
    :width="771"
    :title="$t('table.system.system_announce_detail')"
    :showOkBtn="false"
    :showCancelBtn="false"
    :destroyOnClose="true"
    centered
  >
    <BasicForm @register="createForm">
      <template #content>
        <LangRadioGroup :contentList="contentList" @click:radio="handlelanguageLevel" />
      </template>

      <template #contentEdit="{ model, field }">
        <!-- <div
          class="w-full h-40 rounded border p-2 overflow-auto"
          v-html="model[field]"
        ></div> -->
        <div class="w-430px h-355px rounded-md overflow-hidden" style="background-color: #0f212e">
          <div v-if="popContent == 1">
            <div
              id="html_text"
              class="leading-4 flex-1 whitespace-pre-wrap break-all text-xs p-[10px] leading-[1.5]"
              style="color: #b1bad3"
              v-html="model['contentEdit']"
            >
            </div>
          </div>
          <div v-else class="flex items-center">
            <div
              v-if="currentPopStyle == 1 || currentPopStyle == 2"
              :class="[{ 'flex-row-reverse': currentPopStyle !== 1 }]"
              class="w-full flex justify-between mt-40px"
            >
              <div
                id="html_text"
                class="leading-4 whitespace-pre-wrap break-all text-xs p-[10px] leading-[1.5] item1"
                style="color: #b1bad3"
                v-html="model['contentEdit']"
              >
              </div>
              <div class="item2" v-if="currentPopIcon">
                <img class="w-173px h-245px" :src="currentPopIcon" />
              </div>
            </div>
            <div v-if="currentPopStyle == 3 && imgUrl">
              <img :src="getDataTypePreviewUrl(imgUrl)" class="w-430px h-355px object-cover" />
            </div>
          </div>
        </div>
      </template>

      <template #imageUrl="{ model, field }">
        <div class="w-full !text-center" style="position: relative; min-height: 203px">
          <Image class="!w-65" v-if="model[field]" :src="getDataTypePreviewUrl(model[field])" />
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import LangRadioGroup from '../../common/components/LangRadioGroup.vue';
  import { useLocalList } from '/@/settings/localeSetting';
  import { announceDetailFrom } from './announceDetailModal.data';
  import { LangItem } from '../../common/setting';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { Image } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const localeList = useLocalList();
  const { t } = useI18n();
  export default defineComponent({
    name: 'AnnounceModalDetail',
    components: {
      BasicModal,
      BasicForm,
      LangRadioGroup,
      Image,
    },
    props: {},
    setup() {
      const FORM_SIZE = useFormSetting().getFormSize;
      const currentlanguageIndex = ref(0); // 当前

      const popContent = ref(1);

      const currentPopStyle = ref(1);

      const currentPopIcon = ref('');

      const imgUrl = ref('');

      const langList = localeList.map((item) => {
        return {
          label: item.text,
          value: item.event,
          transitionValue: '',
          image_url: '',
          language: item.language || '',
        };
      });

      const contentList = ref<Array<LangItem>>(langList);

      const [createForm, { setFieldsValue }] = useForm({
        schemas: announceDetailFrom,
        actionColOptions: {
          span: 18,
        },
        size: FORM_SIZE,
        showResetButton: false,
        showSubmitButton: false,
        showActionButtonGroup: false,
      });

      const handlelanguageLevel = (value, el) => {
        currentlanguageIndex.value = value;
        setFieldsValue({
          contentEdit: el.transitionValue || null,
          imageUrl: el.image_url || '',
        });
        imgUrl.value = el.image_url || '';
      };

      let parseData = (record) => {
        try {
          typeof record.content === 'string' ? (record.content = JSON.parse(record.content)) : '';
          typeof record.image_url === 'string'
            ? (record.image_url = JSON.parse(record.image_url))
            : '';
          typeof record.image_info === 'string'
            ? (record.image_info = JSON.parse(record.image_info))
            : '';
          // record.title ? (record.title = JSON.parse(record.title)) : '';
          let crowd_content =
            typeof record.crowd_content === 'string'
              ? record.crowd_content.split(',')
              : record.crowd_content;
          record.usernames = crowd_content;
          record.user_levels = crowd_content;
          record.vip_levels = crowd_content;
          record.agents = crowd_content;
        } catch (e) {
          console.error(e);
        }
        return record;
      };

      const [registerMarquee] = useModalInner(async (data) => {
        if (data.id) {
          let copyValue = JSON.parse(JSON.stringify(parseData(data)));
          const content = copyValue.content;
          const image_url = copyValue.image_url;
          popContent.value = copyValue.pop_up_type;
          currentPopStyle.value = copyValue.image_info.pop_up_style;

          if (currentPopStyle.value == 1 || currentPopStyle.value == 2) {
            currentPopIcon.value = copyValue.image_info.icon;
          }
          contentList.value.forEach((el) => {
            el.transitionValue = content[el.value];
            el.image_url = image_url[el.value];
            el.label = t('common.common_' + el.value); //语言列 i18n
          });
          copyValue.contentEdit = contentList.value[currentlanguageIndex.value].transitionValue;
          copyValue.imageUrl = contentList.value[currentlanguageIndex.value].image_url;
          imgUrl.value = copyValue.imageUrl;
          await setFieldsValue({ ...copyValue });
        }
      });

      return {
        FORM_SIZE,
        createForm,
        registerMarquee,
        handlelanguageLevel,
        currentlanguageIndex,
        getDataTypePreviewUrl,
        contentList,
        popContent,
        currentPopStyle,
        currentPopIcon,
        imgUrl,
      };
    },
  });
</script>
<style lang="less" scoped>
  .activeTag {
    border-color: #1475e1 !important;
    //background: linear-gradient(90deg, rgb(76, 155, 239) 0%, lighten(@primary-color, 10%) 100%);
    background-color: #1475e1 !important;
    color: #fff !important;
  }

  .base-tag {
    &.activeTag {
      border-color: #1475e1 !important;
    }
  }

  .marquee-bg {
    background-color: @header-bg-100;
  }

  ::v-deep(.ant-form-item-control-input) {
    .border {
      padding: 5px !important;
      border: 1px solid #e1e1e1 !important;

      &.dark-div {
        background-color: #f1f1f1 !important;
      }
    }
  }

  ::v-deep(.ant-form-item-control) {
    .base-tag:first-child {
      margin-left: 0;
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
</style>
