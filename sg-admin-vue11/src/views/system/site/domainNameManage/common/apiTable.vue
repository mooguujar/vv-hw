<template>
  <div class="baseTable">
    <BasicTable
      @register="registerTable"
      class="commonTable"
      :beforeEditSubmit="beforeEditSubmit"
      @edit-cancel="handleEditCancel"
      :scroll="{ y: scrollHeight }"
    >
      <template #action="{ record }">
        <slot name="action" :record="record">
          <Space>
            <span
              v-if="record.state === 1 || record.use_state === 2"
              class="cursor"
              style="color: red"
              @click="
                handleStoped(
                  record,
                  'stateUse',
                  record.state === 2
                    ? t('table.system.deactivate_domain_sure')
                    : t('table.system.activate_domain_sure'),
                )
              "
              >{{ t('table.system.deactivate') }}</span
            >
            <span
              v-if="showVerifica === record.id"
              @click="handleVerifica(record)"
              class="primary-color cursor"
              >{{ $t('common.verify') }}</span
            >
            <!-- <span v-if="record.state === 2" class="primary-color cursor" @click="handleUpdate(record)"
            >修改</span
          > -->
            <span
              v-if="record.state === 2 || record.use_state === 2"
              class="caret-red cursor"
              style="color: red"
              @click="
                handleStoped(record, 'statedelete', $t('table.system.system_remove_domain_tip'))
              "
              >{{ $t('common.delText') }}</span
            >
          </Space>
        </slot>
      </template>

      <template #customizeAction="{ record }">
        <slot name="customizeAction" :record="record">
          <Space>
            <span class="primary-color cursor" @click="handleCustom(record)">{{
              t('table.system.edit')
            }}</span>
            <span
              class="caret-red cursor"
              style="color: red"
              @click="
                handleStoped(record, 'statedelete', $t('table.system.system_remove_domain_tip'))
              "
              >{{ t('table.common.delete') }}</span
            >
          </Space>
        </slot>
      </template>
      <template #form-aplication
        ><Button type="primary" @click="handleCertificate">
          {{ t('table.system.apply_free_certificate') }}</Button
        >
      </template>
      <template #form-reloadTime>
        <Select
          style="min-width: 120px"
          v-model:value="reloadTime"
          :options="domainReloadOptions"
          @change="handleReloadTimeChange"
      /></template>
      <template #form-typeid>
        <DateButtonGroup
          :compareRangeTime="unixRang"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
        />
      </template>
      <template #form-upload
        ><Button type="primary" @click="handleUpload">{{
          t('table.system.upload_certificate')
        }}</Button></template
      >
      <template #form-domainManageSearch>
        <InputGroup compact style="display: flex" class="t-form-label-com">
          <Select
            v-model:value="currentDomainManageSearchType"
            class="domain-manage-search pay-select"
            :listHeight="500"
          >
            <SelectOption value="1">
              {{ $t('table.system.system_domain_main') }}
            </SelectOption>
            <SelectOption value="2">
              {{ $t('table.risk.report_operate_people') }}
            </SelectOption>
          </Select>
          <Input
            class="pay-input"
            style="width: 60%; margin-right: 10px"
            allowClear
            :placeholder="$t('table.member.member_inquiry_input')"
            v-model:value="currentDomainManageFromSearch"
          />
        </InputGroup>
      </template>
      <template #form-webLobbySearch>
        <InputGroup compact style="display: flex" class="t-form-label-com">
          <Select
            v-model:value="currentWebLobbySearchType"
            class="domain-manage-search pay-select"
            :listHeight="500"
          >
            <SelectOption value="3">
              {{ $t('table.system.system_valid_domain') }}
            </SelectOption>
            <SelectOption value="2">
              {{ $t('table.risk.report_operate_people') }}
            </SelectOption>
          </Select>
          <Input
            class="pay-input"
            style="width: 60%; margin-right: 10px"
            allowClear
            :placeholder="$t('table.member.member_inquiry_input')"
            v-model:value="currentWebLobbyFromSearch"
          />
        </InputGroup>
      </template>
      <template #form-customAnalysisSearch>
        <InputGroup compact style="display: flex" class="t-form-label-com">
          <Select
            v-model:value="currentCustomAnalysisSearchType"
            class="domain-manage-search pay-select"
            :listHeight="500"
            :dropdownMatchSelectWidth="false"
          >
            <SelectOption value="1">
              {{ $t('table.system.system_domain_main') }}
            </SelectOption>
            <SelectOption value="2">
              {{ $t('table.system.system_domain_record') }}
            </SelectOption>
            <SelectOption value="3">
              {{ $t('table.system.system_parse_record') }}
            </SelectOption>
            <SelectOption value="4">
              {{ $t('table.risk.report_operate_people') }}
            </SelectOption>
          </Select>
          <Input
            class="pay-input"
            style="width: 60%; margin-right: 10px"
            allowClear
            :placeholder="$t('table.member.member_inquiry_input')"
            v-model:value="currentCustomAnalysisFromSearch"
          />
        </InputGroup>
      </template>
      <template #domindChild1="{ record }">
        <domaindChildElement :records="record" />
      </template>
      <template #nameServer="{ record }">
        <span v-if="record?.cdn_type === 2" style="color: #1cd91c">{{
          t('common.customAdd')
        }}</span>
        <domainVerificate
          v-else
          :records="record"
          :showVerifica="showVerifica"
          :handleVerifica="handleVerifica"
        />
      </template>
      <template #domainNameSlots="{ record }">
        <div style="width: 190px; margin: auto">
          <div class="flex justify-between domainName">
            <div class="flex">
              <Tooltip
                v-if="
                  (record.child_name + '.' + record.domain_name).length > 19 ||
                  record.domain_name.length > 19
                "
                placement="topLeft"
                :title="
                  record.child_name !== '@' && isValid(record.child_name)
                    ? record.child_name + '.' + record.domain_name
                    : record.domain_name
                "
              >
                <span class="text-domain" style="width: '156px'; float: left">
                  {{
                    record.child_name !== '@' && isValid(record.child_name)
                      ? record.child_name + '.' + record.domain_name
                      : record.domain_name
                  }}
                </span>
              </Tooltip>
              <span v-else class="text-domain" style="float: left">
                {{
                  record.child_name !== '@' && isValid(record.child_name)
                    ? record.child_name + '.' + record.domain_name
                    : record.domain_name
                }}
              </span>

              <CopyOutlined
                class="primary-color cursor m-t-1 m-l-1"
                @click="
                  handleCopy(
                    record.child_name !== '@' && isValid(record.child_name)
                      ? record.child_name + '.' + record.domain_name
                      : record.domain_name,
                  )
                "
              />
            </div>
            <div>
              <RedoOutlined
                class="btnClass m-t-0.8 m-l-2 primary-color cursor-pointer"
                @click="handleReload"
              />
            </div>
          </div>
          <div
            :style="{ color: record.parse_state === 2 ? '#E91134' : '#1CD91C' }"
            class="text-left"
          >
            {{ record.parse_state === 2 ? t('common.Unresolved') : t('common.Parsed') }}
          </div>
        </div>
      </template>
      <template #form-resetBefore>
        <Button v-if="deleteData.length" type="error" @click="handleDeleteData">{{
          t('business.batch_delete')
        }}</Button></template
      >
    </BasicTable>
    <updateModal @register="registerUpdata" @active-success="submitReload" />
    <certificateModal @register="registerCertificateModal" />
    <uploadModal @register="registerUpload" />
    <customizationModal @register="registerAddModal" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, defineExpose, unref, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { Space, message, Select, SelectOption, InputGroup, Input, Tooltip } from 'ant-design-vue';
  import { openConfirm } from '/@/utils/confirm';
  import updateModal from '../common/modal/updateModal.vue';
  import { useModal } from '/@/components/Modal';
  import { Button } from '/@/components/Button';
  import eventBus from '/@/utils/eventBus';
  import certificateModal from './modal/certificateModal.vue';
  import uploadModal from './modal/uploadModal.vue';
  import customizationModal from './modal/customizationModal.vue';
  import domaindChildElement from '../components/domaindChildElement.vue';
  import domainVerificate from '../components/domainVerificate.vue';
  import { updateDomainVerify, domainUpdateRemark } from '/@/api/domain/index';
  import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { domainReloadOptions } from './const';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useInterval } from '/@/utils/helper/paramsHelper';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import dayjs from 'dayjs';
  import { isValid } from '/@/utils/is';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(430).value);
  const dateGroupButtonList = [
    { label: t('common.day'), value: 'days' }, //日
    { label: t('common.week'), value: 'week' }, //周
    { label: t('common.month'), value: 'month' }, //月
  ];
  const unixRang = ref<Array<number>>([]);
  const FORM_SIZE = useFormSetting().getFormSize;
  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {
        false;
      },
    },
  });
  const cdnType = ref('' as any);
  const deleteData = ref([] as any);
  const showVerifica = ref(false as any);
  const currentDomainManageSearchType = ref('1' as any);
  const currentDomainManageFromSearch = ref('' as any);
  const currentWebLobbySearchType = ref('3' as any);
  const currentWebLobbyFromSearch = ref('' as any);
  const currentCustomAnalysisSearchType = ref('1' as any);
  const currentCustomAnalysisFromSearch = ref('' as any);
  const [registerUpdata, { openModal }] = useModal();
  const reloadTime = ref<number>(domainReloadOptions[0].value);
  const cndKindNum = ref(null);
  const [registerTable, { reload, getForm, getSelectRowKeys, clearSelectedRowKeys }] = useTable({
    api: getDataList,
    columns: props.apiMap.columns,
    useSearchForm: props.apiMap.formHide,
    bordered: true,
    formConfig: {
      schemas: props.apiMap.schemas,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      // baseColProps: { xxl: 4, xl: 4, lg: 4, md: 6, sm: 7 },
      // baseColProps: { span: 3 },
      showResetButton: false,
    },
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: props.apiMap.hideMultipleDelete
      ? false
      : {
          getCheckboxProps(record) {
            if (record.cdn_type === 2) {
              return { disabled: false };
            } else if (record.cdn_type === 1) {
              return { disabled: record.state === 1, name: record.state };
            }
            {
              return { disabled: false };
            }
          },
          onChange: (v, d) => {
            if (props.apiMap.type === 1) {
              const deleteObj = d.map((item) => {
                return {
                  id: item.id,
                  domain_id: item.domain_id,
                };
              });
              return (deleteData.value = deleteObj);
            } else {
              return (deleteData.value = v);
            }
          },
        },
    beforeFetch: async (params) => {
      const values = await getForm().validate();
      if (!props.apiMap.useType) {
        if (values.search_type === 1) {
          params['name'] = values.search_value;
          delete params['search_value'];
        } else if (values.search_type === 2) {
          params['operate_name'] = values.search_value;
          delete params['search_value'];
        } else if (values.search_type === 3) {
          params['domain_name'] = values.search_value;
          delete params['search_value'];
        }
      }
      if (currentDomainManageFromSearch.value) {
        params['search_type'] = currentDomainManageSearchType.value;
        if (currentDomainManageSearchType.value == '1') {
          params['name'] = currentDomainManageFromSearch.value;
        }
        if (currentDomainManageSearchType.value == '2') {
          params['operate_name'] = currentDomainManageFromSearch.value;
        }
      }
      if (currentWebLobbyFromSearch.value) {
        if (currentWebLobbySearchType.value == '3') {
          params['domain_name'] = currentWebLobbyFromSearch.value;
        }
        if (currentWebLobbySearchType.value == '2') {
          params['operate_name'] = currentWebLobbyFromSearch.value;
        }
      }
      if (currentCustomAnalysisFromSearch.value) {
        params['search_type'] = Number(currentCustomAnalysisSearchType.value);
        params['search_value'] = currentCustomAnalysisFromSearch.value;
      }
      if (params?.created_at?.length > 0) {
        params.start_time = params.created_at[0] ? setStartformatDate(params.created_at[0]) : null;
        params.end_time = params.created_at[1] ? setEndformatDate(params.created_at[1]) : null;
      }
      delete params.created_at;
      return params;
    },
    // afterFetch:(data)=> {
    // 	for (let i in data) {
    //       data[i].id = parseInt(i) + 1; //  <== 关键——全选时不选择禁用数据
    //    }
    // }
  });
  const { startInterval, stopInterval } = useInterval(reload);
  const [registerCertificateModal, { openModal: openCertificateModal }] = useModal();
  const [registerUpload, { openModal: openUploadModal }] = useModal();
  const [registerAddModal, { openModal: openComstermModal }] = useModal();
  //新增刷新
  eventBus.on('emitLoad', () => {
    reload();
  });

  async function getDataList(tableParams: { rows: number; page: number }) {
    if (!props.apiMap.useType) {
      delete tableParams['search_type'];
    }
    return props.apiMap.list({
      ...tableParams,
      use_type: props.apiMap.type,
      cdn_name: cdnType.value,
      cdn_type: cndKindNum.value,
    });
  }
  async function handleUpdate(record) {
    openModal(true, record);
  }
  function handleDeleteData() {
    openConfirm(
      t('common.warning'),
      t('table.system.system_remove_domain_tip'),
      async () => {
        const { status, data } = await props.apiMap.batchDeleteDomain(deleteData.value);
        if (status) {
          reload();
          clearSelectedRowKeys();
          message.success(data);
        } else {
          message.error(data);
        }
      },
      '',
    );
  }
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ start_time: value[0] });
      await getForm().setFieldsValue({ end_time: value[1] });
    });
  }
  function handleCustom(record) {
    openComstermModal(true, record);
  }
  eventBus.on('mittChange', (rangTime: any) => {
    const startTime = rangTime[0] ? dayjs(rangTime[0]).toDate().getTime() : 0;
    const endTime = rangTime[1] ? dayjs(rangTime[1]).toDate().getTime() : 0;
    unixRang.value = [startTime, endTime];
  });
  async function beforeEditSubmit({ record, index, key, value }) {
    //const {record } = record;
    const { status, data } = await domainUpdateRemark({
      id: record.id,
      remark: value ? value : 'sg.ipx.tw.6666',
    });
    if (status) {
      message.success(data);
      reload();
    }
  }
  function handleEditCancel() {}
  async function submitReload() {
    await reload();
  }
  async function handleStoped(record, type, msg) {
    //警告提示
    openConfirm(
      t('common.warning'),
      msg,
      async () => {
        if (type === 'stateUse') {
          const state = record.state === 1 ? 2 : 1;
          const { status, data } = await props.apiMap.updataState({ state: state, id: record.id });
          if (status) {
            reload();
            message.success(data);
          } else {
            message.error(data);
          }
        } else if (type === 'statedelete') {
          const { status, data } = await props.apiMap.deleteList({ id: record.id });
          if (status) {
            reload();
            message.success(data);
          } else {
            message.error(data);
          }
        }
      },
      '',
    );
  }
  function handleCopy(value) {
    if (!value) {
      message.warning(t('business.common_copy_tip'));
      return;
    }
    clearClipboard();
    clipboardRef.value = value;
    if (unref(copiedRef)) {
      message.success(t('business.common_copy_suceess'));
    }
  }
  function handleCertificate() {
    openCertificateModal(true);
  }
  async function handleVerifica(record) {
    const { status, data } = await updateDomainVerify({ id: record.id });
    if (status) {
      showVerifica.value = false;
      message.success(data);
    } else {
      message.error(data);
    }
  }
  function handleUpload() {
    openUploadModal(true);
  }
  const setLoad = async (v) => {
    if (v == 2) {
      cndKindNum.value = 2;
      cdnType.value = '';
      reload();
    } else {
      cndKindNum.value = '';
      cdnType.value = v;
      reload();
    }
    clearSelectedRowKeys();
  };
  function handleReload() {
    eventBus.emit('handleLoad');
  }
  eventBus.on('handleVerificatEmit', (record: any) => {
    showVerifica.value = record?.id;
  });
  eventBus.on('handleLoad', () => {
    reload();
  });
  function handleReloadTimeChange(time: number): void {
    if (time !== -1) {
      startInterval(time);
    } else {
      stopInterval();
    }
  }
  defineExpose({ setLoad, reload, deleteData });
</script>
<style>
  .ant-table-wrapper .ant-table-header thead tr th:first-child {
    width: 52px;
  }
</style>
<style scoped lang="less">
  // .commonTable {
  //   ::v-deep(.ant-table-wrapper .ant-table-header thead tr th:first-child label) {
  //     display: none;
  //   }
  // }

  .baseTable {
    .domainName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .text-domain {
        width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .domain-manage-search {
    border: none !important;
  }

  ::v-deep(.ant-checkbox-disabled .ant-checkbox-inner::after) {
    display: none;
  }
</style>
