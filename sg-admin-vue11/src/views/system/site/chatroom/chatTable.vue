<template>
  <DateButtonGroup
    class="absolute h-0"
    :isSelect="'days'"
    @change-button-day="changeButtonDay"
    :dateGroupButtonList="[]"
  />
  <BasicTable
    @register="registerTable"
    class="!p-0 with-more-input"
    :class="{
      positionClass: languageArr.length < 1,
    }"
    :scroll="{ x: 'max-content', y: scrollHeight }"
  >
    <template #form-speak>
      <div class="mr-2">
        <Button
          type="primary"
          v-if="checkboxActive.length > 0 && isHasAuth('70228')"
          danger
          class="mr-2"
          @click="showConfirm(null, 'delAmount')"
          >{{ $t('business.batch_delete') }}</Button
        >
        <Button type="primary" v-if="isHasAuth('70229')" class="mr-2" @click="showSpeakConfig">{{
          $t('table.system.system_speech_conf')
        }}</Button>
      </div>
    </template>
    <template #form-speaker>
      <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
        <Select style="width: 50%" v-model:value="currentChoose" class="br-none">
          <SelectOption :value="'username'">{{ $t('table.system.system_fsr') }}</SelectOption>
          <SelectOption :value="'content'">
            {{ $t('table.system.system_fsnr') }}
          </SelectOption>
        </Select>
        <Input
          style="width: 50%; margin-right: 10px"
          allowClear
          :placeholder="$t('common.inputText')"
          v-model:value="searchCon"
        />
      </a-input-group>
    </template>
    <template #form-subButton>
      <Button type="primary" class="mr-2" @click="cutSubMit">{{ $t('common.queryText') }}</Button>
    </template>
    <template #form-language>
      <RadioGroup
        v-if="languageArr.length > 0"
        class="primaryGroup"
        button-style="solid"
        v-model:value="languageModal"
        size="large"
        @change="changeLanguage"
      >
        <RadioButton v-for="(item, index) in languageArr" :value="item.value" :key="index">
          {{ item.label }}
        </RadioButton>
      </RadioGroup>
    </template>
    <template #action="{ column, record }">
      <TableAction
        :actions="[
          {
            label: $t('table.system.system_ban'),

            onClick: showLimitModal.bind(null, record, 'limit'),
            ifShow: isHasAuth('70896'),
          },
          {
            label: $t('common.delText'),

            color: 'error',
            onClick: showConfirm.bind(null, record, 'del'),
            ifShow: isHasAuth('70228'),
          },
        ]"
      />
    </template>
  </BasicTable>
  <limitSpeak @register="registerLimitModal" @active-success="successChange" />
  <speakConfig @register="registerSpeakConfigModal" @active-success="successChange" />
</template>
<script lang="ts">
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { defineComponent, onBeforeMount, onMounted, ref, defineExpose } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchSchema, langrageArr } from './chat.data';
  import { deleteChatList, chatList, chatLangList } from '/@/api/site';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    message,
    Button,
    FormItemRest,
    InputGroup,
    Select,
    SelectOption,
    Input,
    RadioGroup,
    RadioButton,
  } from 'ant-design-vue';
  import { openConfirm } from '/@/utils/confirm';
  import speakConfig from './modal/speakConfig.vue';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import limitSpeak from './modal/limitSpeak.vue';
  import { cloneDeep } from 'lodash-es';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import eventBus from '/@/utils/eventBus';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();

  const props = {
    /**
     * class style prefix
     */
    lang: { type: String, default: 'zh_CN' },
  };

  export default defineComponent({
    name: 'ChatDing',
    components: {
      BasicTable,
      TableAction,
      Button,
      FormItemRest,
      InputGroup,
      Select,
      SelectOption,
      Input,
      RadioGroup,
      RadioButton,
      limitSpeak,
      speakConfig,
      DateButtonGroup,
    },
    props,
    setup(props) {
      const scrollHeight = Number(useScrollerHeight(450).value);
      const [registerModal, { openModal }] = useModal();

      const checkboxActive = ref<Array<string | number>>([]);
      const searchCon = ref('');
      const currentChoose = ref('username');
      const languageModal = ref('' as string);
      const languageArr = ref([] as any);
      const langs = {
        en_US: t('common.langEn'),
        pt_BR: t('common.LangPt'),
        th_TH: t('common.common_th_TH'),
        vi_VN: t('common.LangVetnam'),
        zh_CN: t('common.common_zh_CN'),
        hi_IN: t('common.LangIndia'),
      };
      const minimumMoney = ref();

      const [registerTable, { reload, clearSelectedRowKeys, getForm, setProps }] = useTable({
        api: async (data) => {
          const cloneData = cloneDeep(data);
          const validList = [];
          const _data = await chatLangList(cloneData); //请求语言接口，即使没有语言也要请求语言列表，因为需要获取发言配置金额

          if (!languageModal.value) {
            languageModal.value = _data[0] || '';
          }
          data.lang = languageModal.value;

          if (_data && _data.length > 0) {
            _data.forEach((item) => validList.push({ label: langs[item], value: item }));
            //语言列表大于0，再去遍历
            languageArr.value = validList;
          } else {
            languageArr.value = [];
          }

          const res = await chatList(data);
          minimumMoney.value = res.r;
          return res || [];
        },
        columns: columns,
        bordered: true,
        useSearchForm: true,
        showIndexColumn: false,
        actionColumn: {
          width: 180,
          title: t('business.common_operate'),
          dataIndex: 'action',
          slots: { customRender: 'action' },
          ifShow: auths(['70228', '70896']),
        },
        formConfig: {
          schemas: searchSchema,
          showAdvancedButton: false,
          actionColOptions: {
            class: 't-form-col t-form-label-com',
            span: 1,
          },
          showActionButtonGroup: false,
        },
        rowSelection: isHasAuth('70228')
          ? {
              onChange: (value, record) => {
                checkboxActive.value = record.map((item) => {
                  return item.i;
                });
              },
            }
          : undefined,
        beforeFetch: (params) => {
          params[currentChoose.value] = searchCon.value;

          setDateParmaTime(params);
          setDateParmas(params);
          params['st'] = params.start_time;
          params['et'] = params.end_time;
          delete params.start_time;
          delete params.end_time;
          delete params.language;
          delete params.speak;

          return params;
        },
        afterFetch: (res) => {
          clearSelectedRowKeys();
          checkboxActive.value = [];
        },
      });

      const [registerLimitModal, { openModal: OpenLimitModal }] = useModal();
      const [registerSpeakConfigModal, { openModal: OpenSpeakConfigModal }] = useModal();

      function handleCreate() {
        openModal(true);
      }
      function handleSuccess() {
        reload();
      }

      async function showLimitModal(record, type) {
        OpenLimitModal(true, { record, type });
      }
      async function showSpeakConfig() {
        OpenSpeakConfigModal(true, minimumMoney.value);
      }

      async function showConfirm(record, type) {
        if (type === 'del') {
          openConfirm(
            t('table.google.report_columns_APP_confirm'),
            t('table.google.report_columns_APP_delete_msg'),
            () => {
              handleDelete(record);
            },
            'confirmModal',
          );
        }
        if (type === 'delAmount') {
          openConfirm(
            t('table.google.report_columns_APP_confirm'),
            `${t('table.system.system_del_tips_conf', { len: checkboxActive.value.length })}`,
            () => {
              handleDelete(record);
            },
            'confirmModal',
          );
        }
      }
      const handleDelete = async (record) => {
        const { status } = await deleteChatList({
          lang: languageModal.value,
          id: record ? [record.i] : checkboxActive.value,
        });
        if (status) {
          message.success(t('table.google.report_columns_APP_delete_success'));
          reload();
        }
      };

      async function cutSubMit() {
        await getForm().submit();
      }
      function changeLanguage() {
        reload();
      }
      function successChange() {
        reload();
      }
      onMounted(() => {
        if (!isHasAuth('70288')) {
          setProps({ rowSelection: false });
        }
        eventBus.on('RefreshChatList', (res: any) => {
          reload();
        });
      });

      async function changeButtonDay(value) {
        setTimeout(async () => {
          await getForm().setFieldsValue({ time: value });
          reload();
        }, 11);
      }

      onBeforeMount(() => {
        eventBus.off('RefreshChatList');
      });
      defineExpose({
        handleSuccess,
      });
      return {
        registerTable,
        registerModal,
        handleCreate,
        handleSuccess,
        showConfirm,
        searchCon,
        currentChoose,
        languageModal,
        langrageArr,
        cutSubMit,
        checkboxActive,
        registerLimitModal,
        registerSpeakConfigModal,
        showLimitModal,
        showSpeakConfig,
        changeLanguage,
        successChange,
        languageArr,
        isHasAuth,
        changeButtonDay,
        scrollHeight,
      };
    },
  });
</script>
<style scoped lang="less">
  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding: 0 !important;
  }

  ::v-deep(
      .t-form-label-com
        .ant-select:not(.select-right)
        > .ant-select-selector
        .ant-select-selection-item
    ) {
    text-align: center;
  }

  .primaryGroup {
    ::v-deep(.ant-radio-button-wrapper) {
      width: 88px !important;

      span:not(.ant-radio-button) {
        display: inline-block;
        width: 56px !important;
        font-size: 14px !important;
        text-align: center !important;
      }
    }
  }

  .positionClass {
    ::v-deep(.ant-table-wrapper) {
      position: absolute;
      top: 122px;
      width: 100%;
    }
  }
</style>
