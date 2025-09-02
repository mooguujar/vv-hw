<template>
  <div class="tabMain">
    <BasicTable
      @register="registerTable"
      class="!p-0 with-more-input"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-speak>
        <div class="mr-2">
          <Button
            type="primary"
            v-if="checkboxActive.length > 0 && isHasAuth('70899')"
            danger
            class="mr-2"
            @click="showConfirm(null, 'delAmount')"
            >{{ $t('business.batch_delete') }}</Button
          >
          <Button type="primary" class="mr-2" v-if="isHasAuth('70897')" @click="showSpeakConfig">{{
            $t('table.system.system_manual_ban')
          }}</Button>
        </div>
      </template>
      <template #form-speaker>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentChoose" class="br-none">
            <SelectOption :value="'username'">{{
              $t('table.discountActivity.discountActivity_member')
            }}</SelectOption>
            <SelectOption :value="'update_name'">
              {{ $t('table.member.member_oprate_people') }}
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

      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label: $t('table.system.edit'),
              onClick: showLimitModal.bind(null, record, 'update'),
              ifShow: isHasAuth('70898'),
            },
            {
              label: $t('business.common_delete_b'),
              color: 'error',
              onClick: showConfirm.bind(null, record, 'del'),
              ifShow: isHasAuth('70899'),
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
  <limitSpeak @register="registerLimitModal" @active-success="successChange" />
  <handLimitSpeak @register="registerHandLimitModal" @active-success="successChange" />
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, defineExpose } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columnsLimit, searchSchemaLimit, langrageArr } from './chat.data';
  import { forbidList, forbidBatchDelete } from '/@/api/site';
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
  import limitSpeak from '/@/views/system/site/chatroom/modal/limitSpeak.vue';
  import handLimitSpeak from './modal/handLimitSpeak.vue';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
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
      handLimitSpeak,
    },
    props,
    setup(props) {
      const [registerModal, { openModal }] = useModal();
      const scrollHeight = Number(useScrollerHeight(400).value);
      const checkboxActive = ref<Array<string | number>>([]);
      const searchCon = ref('');
      const currentChoose = ref('username');
      const languageModal = ref('zh_CN' as string);

      const [registerTable, { reload, clearSelectedRowKeys, getForm, setProps }] = useTable({
        api: forbidList,
        columns: columnsLimit,
        useSearchForm: true,
        showTableSetting: false,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 160,
          title: t('business.common_operate'),
          dataIndex: 'action',
          slots: { customRender: 'action' },
          ifShow: auths(['70898', '70899']),
        },
        rowSelection: {
          onChange: (value, record) => {
            checkboxActive.value = record.map((item) => {
              return item.uid;
            });
          },
        },
        formConfig: {
          schemas: searchSchemaLimit,
          showAdvancedButton: false,
          actionColOptions: {
            class: 't-form-col t-form-label-com',
            span: 1,
          },
          showResetButton: false,
        },
        beforeFetch: (params) => {
          params[currentChoose.value] = searchCon.value;
          setDateParmaTime(params);
          setDateParmas(params);
          params['st'] = params.start_time;
          params['et'] = params.end_time;
          delete params.start_time;
          delete params.end_time;
          delete params.time;
          return params;
        },
        afterFetch: async () => {
          clearSelectedRowKeys();
          checkboxActive.value = [];
        },
      });

      const [registerLimitModal, { openModal: OpenLimitModal }] = useModal();
      const [registerHandLimitModal, { openModal: OpenHandLimitModal }] = useModal();

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
        OpenHandLimitModal();
      }

      async function showConfirm(record, type) {
        if (type === 'del') {
          openConfirm(
            t('table.google.report_columns_APP_confirm'),
            `${t('table.system.system_del_columns_conf', { len: record.username })}`,
            () => {
              handleDelete(record);
            },
            'confirmModal',
          );
        }
        if (type === 'delAmount') {
          openConfirm(
            t('table.google.report_columns_APP_confirm'),
            `${t('table.system.system_del_columns_list', { len: checkboxActive.value.length })}`,
            () => {
              handleDelete(record);
            },
            'confirmModal',
          );
        }
      }
      const handleDelete = async (record) => {
        const { status } = await forbidBatchDelete({
          uid: record?.uid ? [record.uid] : checkboxActive.value,
        });
        if (status) {
          message.success(t('table.google.report_columns_APP_delete_success'));
          reload();
        }
      };

      async function cutSubMit() {
        await getForm().submit();
      }
      function successChange() {
        reload();
        eventBus.emit('RefreshChatList');
      }
      onMounted(() => {
        if (!isHasAuth('70899')) {
          setProps({ rowSelection: false });
        }
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
        registerHandLimitModal,
        showLimitModal,
        showSpeakConfig,
        successChange,
        isHasAuth,
        scrollHeight,
      };
    },
  });
</script>
<style scoped lang="scss">
  .tabMain {
    ::v-deep(.vben-basic-table-form-container .ant-form) {
      padding: 0;
    }

    ::v-deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector) {
      padding: 0 15px !important;
    }

    ::v-deep(.ant-col-1) {
      flex: 0;
    }

    ::v-deep(.ant-table-wrapper) {
      padding-left: 0 !important;
    }

    ::v-deep(
        .t-form-label-com
          .ant-select:not(.select-right)
          > .ant-select-selector
          .ant-select-selection-item
      ) {
      text-align: center;
    }
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
</style>
