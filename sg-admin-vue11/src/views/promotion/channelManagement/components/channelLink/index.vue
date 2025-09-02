<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="LayoutTable channel-link">
    <header class="pl-[10px] border-b-1px border-[#e1e1e1] mb-10px">
      <div class="flex justify-between align-items-center mb-[10px]">
        <h3 class="mb-[0px]">{{ t('common.promoter_list') }}</h3>
        <span
          ><Switch v-model:checked="showAll" @change="handleModalSuccess" /><span
            class="ml-[10px]"
            >{{ t('common.show_all') }}</span
          ></span
        >
      </div>
      <div class="flex flex-wrap overflow-auto align-items-center max-h-305px">
        <Button
          @click="openProvidersModalClick(false)"
          type="primary"
          class="mr-2.5 mb-[10px]"
          size="large"
          >+</Button
        >
        <Tooltip
          placement="bottom"
          v-for="(item, index) in channelProvidersListAll"
          :key="item.value"
          color="#fff"
          overlayClassName="channel-link-tooltip"
        >
          <template #title>
            <div class="flex flex-col p-[5px]">
              <Button type="primary" @click="getHiddenChannelProviders(item)">{{
                t('common.view_channels')
              }}</Button>
              <template v-if="item.type === 'item'">
                <Button
                  type="primary"
                  class="mb-[10px] mt-[10px]"
                  @click="openProvidersModalClick(item)"
                  >{{ t('common.change_name') }}</Button
                >
                <Button type="danger" @click="setHiddenChannelProviders(item)">{{
                  item.state === 1 ? t('common.set_hidden') : t('common.set_show')
                }}</Button>
              </template>
            </div>
          </template>
          <BaseTag
            style="text-align: center !important"
            class="cursor mr-10px mb-10px"
            :class="[
              {
                activeTag: group_ids === item.value,
                primary: item.state === 1,
              },
            ]"
            :value="item.label"
          />
        </Tooltip>
      </div>
    </header>
    <BasicTable
      @register="registerTable"
      :scroll="{ y: scrollHeight }"
      class="!p-0 with-more-input"
    >
      <template #groupName="{ record }">
        <Button type="link" @click="getHiddenChannelProviders({ value: record.group_id })">{{
          record.group_name
        }}</Button>
      </template>
      <template #form-created>
        <div class="mr-2.5">
          <Button
            v-show="checkboxActive.length > 0"
            @click="showConfirm({ ids: checkboxActive })"
            type="primary"
            danger
            class="mr-2.5"
            >{{ t('business.batch_delete') }}</Button
          >
          <Button
            @click="openAddIpModalFun()"
            type="primary"
            class="mr-2.5"
            v-if="isHasAuth('70837')"
            >{{ t('business.add_new') }}</Button
          >
          <Button
            @click="openOficialUpdate()"
            type="primary"
            v-if="!areAllFieldsNullOrEmpty(appLink)"
            >{{ t('business.official_app') }}</Button
          >
          <!-- <Button
            @click="showConfirmApk({})"
            type="primary"
            class="ml-2.5"
            v-if="isHasAuth('70847')"
            >{{ t('business.add_new_apk') }}</Button
          > -->
        </div>
      </template>
      <template #form-currentType>
        <FormItemRest>
          <InputGroup compact style="display: flex; width: 380px" class="t-form-label-com">
            <Select :dropdownMatchSelectWidth="false" v-model:value="currentType" class="br-none">
              <SelectOption :value="1"
                >{{ $t('table.promotion.promotion_agency_account') }}
              </SelectOption>
              <SelectOption :value="2"
                >{{ $t('table.promotion.promotion_tunnel_name') }}
              </SelectOption>
              <SelectOption :value="3"
                >{{ $t('table.promotion.promotion_tunnel_ID') }}
              </SelectOption>
              <SelectOption :value="4">{{ $t('table.risk.report_operate_people') }}</SelectOption>
              <SelectOption :value="6">{{ $t('table.promotion.link_type_1') }}</SelectOption>
            </Select>
            <Input
              class="mr-5"
              allowClear
              :placeholder="t('common.inputText')"
              v-model:value="fromSearch"
            />
          </InputGroup>
        </FormItemRest>
      </template>
      <!-- <template #form-startDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template> -->
      <template #chanelId="{ record }">
        <Button type="link" @click="toChannlStatistics('channel_id', record.id)"
          >{{ record.id }}
        </Button>
      </template>
      <template #agent="{ record }">
        <Button type="link" @click="toChannlStatistics('username', record.agent_account)">{{
          record.agent_account
        }}</Button>
        <!-- <span class="ml-1 primary-color cursor" @click="handleCopyVal(record.agent_account)">{{
          t('modalForm.finance.common_income.copy')
        }}</span> -->
      </template>
      <template #chanelLink="{ record }">
        <span>{{ getNavLocationLabel(record) }}:</span>
        <span class="ml-1" v-if="record.state == 4"
          >{{ t('table.promotion.promotion_deleted')
          }}{{ record.link_type == 2 ? `?c=${record.channel_code}` : '' }}</span
        >
        <span class="ml-1" v-else>{{ `https://${record.channel_domain}` }}</span>
        <span class="ml-1 primary-color cursor" @click="handleCopy(record)">{{
          t('modalForm.finance.common_income.copy')
        }}</span>
        <!-- <span class="ml-1 primary-color cursor" v-if='record.channel_type==2'>下载</span> -->
      </template>
      <template #chanelapk="{ record }">
        <span class="ml-1" v-if="record.fix == 2"> - </span>
        <span class="ml-1" v-else-if="record.app_open == 4"> {{ t('common.follow_system') }}</span>

        <span class="ml-1 text-green" v-if="record.state == 2">
          {{ t('table.promotion.promotion_automatically_packaging') }}
        </span>

        <template
          v-if="
            record.apk == t('table.promotion.promotion_packaging_failed') &&
            record.state != 2 &&
            record.fix != 2
          "
        >
          <span class="ml-1 text-red">{{ record.apk }}</span>
          <span class="ml-1 primary-color cursor" @click="openApk(record, 'update')">
            {{ t('modalForm.member.member_authorized_update') }}
          </span>
        </template>

        <span class="ml-1" v-if="record.apk == '-' && record.state != 2 && record.fix != 2">
          {{ record.apk }}
        </span>

        <template
          v-if="
            record.apk != t('table.promotion.promotion_packaging_failed') &&
            record.state != 2 &&
            record.apk != '-' &&
            record.apk != '' &&
            record.fix != 2
          "
        >
          <span class="ml-1">{{ record.apk }}</span>
          <span class="ml-1 primary-color cursor" @click="openApk(record)">
            {{ t('modalForm.member.member_authorized_update') }}
          </span>
          <span class="ml-1 primary-color cursor" @click="handleCopyApk(record, 'apk')">{{
            t('modalForm.finance.common_income.copy')
          }}</span>
          <span class="ml-1 primary-color cursor" @click="downloadApk(record.apk, record.apk_name)">
            {{ t('component.upload.download') }}
          </span>
        </template>
      </template>
      <template #chanelios="{ record }">
        <span class="ml-1" v-if="record.fix == 2"> - </span>
        <span class="ml-1" v-else-if="record.app_open == 4"> {{ t('common.follow_system') }}</span>
        <span class="ml-1 text-green" v-if="record.state == 2">
          {{ t('table.promotion.promotion_automatically_packaging') }}
        </span>

        <template
          v-if="
            record.ios == t('table.promotion.promotion_packaging_failed') &&
            record.state != 2 &&
            record.fix != 2
          "
        >
          <span class="ml-1 text-red">{{ record.ios }}</span>
          <span class="ml-1 primary-color cursor" @click="openIOS(record)">
            {{ t('modalForm.member.member_authorized_update') }}
          </span>
        </template>

        <span class="ml-1" v-if="record.ios == '-' && record.state != 2 && record.fix != 2">
          {{ record.ios }}
        </span>

        <template
          v-if="
            record.ios != t('table.promotion.promotion_packaging_failed') &&
            record.state != 2 &&
            record.ios != '-' &&
            record.ios != '' &&
            record.fix != 2
          "
        >
          <span class="ml-1">{{ record.ios }}</span>
          <span class="ml-1 primary-color cursor" @click="openIOS(record)">
            {{ t('modalForm.member.member_authorized_update') }}
          </span>
          <span class="ml-1 primary-color cursor" @click="handleCopyApk(record, 'ios')">{{
            t('modalForm.finance.common_income.copy')
          }}</span>
          <span class="ml-1 primary-color cursor" @click="downloadApk(record.ios, record.ios_name)">
            {{ t('component.upload.download') }}
          </span>
        </template>
      </template>
      <template #action="{ record }">
        <span
          v-if="isHasAuth('70838')"
          class="px-3 primary-color cursor"
          @click="EditFun(record)"
          >{{ t('business.common_edit') }}</span
        >
        <span
          v-if="isHasAuth('70840')"
          class="px-3 text-red cursor"
          @click="showConfirm({ id: record.id, state: 5 })"
          >{{ t('common.delText') }}
        </span>
      </template>
    </BasicTable>
    <addChannelLinkModal @register="addIpModal" :userData="appLink" @success="handleModalSuccess" />
    <updateModal @register="registerUpdateModal" @success="handleModalSuccess" />
    <updateIOSModal @register="registerUpdateIOSModal" @success="handleModalSuccess" />
    <oficialModal @register="registerOficialModal" :userData="appLink" />
    <addlProvidersModal @register="addlProvidersIModal" @success="handleModalSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onBeforeMount, onMounted, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '@/components/Table';
  import { columns, schemas } from './index.data';
  import { Button } from '@/components/Button';
  import { BaseTag } from '/@/components/DragSelectGroup';
  import {
    InputGroup,
    Select,
    SelectOption,
    Input,
    DatePicker,
    FormItemRest,
    message,
    Switch,
    Tooltip,
  } from 'ant-design-vue';
  import {
    deleteChannelLink,
    getBatchUpdateOpen,
    getChannelAppList,
    getChannelList,
    channelProviders,
    channelProvidersInsert,
    channelProvidersUpdate,
  } from '@/api/promotion';
  import addChannelLinkModal from '../../common/components/addChannelLinkModal.vue';
  import addlProvidersModal from '../../common/components/addlProvidersModal.vue';
  import { useModal } from '@/components/Modal';
  import dayjs from 'dayjs';
  import { openConfirm } from '@/utils/confirm';
  import { setDateParmas } from '@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useI18n } from '@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';
  import updateModal from '../../common/components/updateModal.vue';
  import updateIOSModal from '../../common/components/updateIOSModal.vue';
  import { navLocation } from '../../../common/const';
  import eventBus from '/@/utils/eventBus';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import oficialModal from '../../common/components/oficialModal.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const emit = defineEmits(['update-event']);

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(460).value);

  const navLocationMap = {
    1: t('table.promotion.promotion_home'),
    2: t('table.promotion.promotion_regis'),
    3: t('table.promotion.promotion_login'),
    4: t('table.promotion.promotion_tiyu'),
    // 2: '娱乐城',
    // 3: '体育',
    // 4: '联盟中心',
  };

  const deviceLocationMap = {
    1: 'Android',
    2: 'IOS',
    3: 'Google Play',
  };
  const channelProvidersList = ref([]);
  const channelProvidersListAll = ref([]);
  const group_ids = ref('');
  const showAll = ref(false);

  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();

  const { createMessage } = useMessage();
  const fromSearch = ref('' as string);
  const checkboxActive = ref([] as any);
  const currentType = ref(1);

  const appLink = ref({});

  // const disabledStartDate = (date) => {
  //   let end_time: any = null;
  //   if (dayjs(model.value.end_time).valueOf()) {
  //     end_time = model.value.end_time.valueOf();
  //   } else {
  //     end_time = dayjs().endOf('days').valueOf();
  //   }
  //   return date.valueOf() > end_time;
  // };

  // const disabledEndDate = (date) => {
  //   return (
  //     date.valueOf() > dayjs().endOf('days').valueOf() ||
  //     date.valueOf() <= dayjs(model.value.start_time).valueOf()
  //   );
  // };
  // const onStartDateChange = (value) => {
  //   model.value.start_time = value;
  // };

  // const onEndDateChange = (value) => {
  //   model.value.end_time = dayjs(value).endOf('days');
  // };

  const [addIpModal, { openModal }] = useModal();
  const [registerUpdateModal, { openModal: openModalUpdate }] = useModal();
  const [registerUpdateIOSModal, { openModal: openModalUpdateIOS }] = useModal();
  const [registerOficialModal, { openModal: openOficialModal }] = useModal();
  const [addlProvidersIModal, { openModal: openProvidersModal }] = useModal();
  const [registerTable, { reload, clearSelectedRowKeys, setPagination }] = useTable({
    api: getChannelList,
    columns: columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    beforeFetch: async (params) => {
      await getChannelProviders();
      if (showAll.value) {
        params.group_ids = group_ids.value ? [group_ids.value] : [];
      } else {
        params.group_ids = group_ids.value
          ? [group_ids.value]
          : channelProvidersList.value.map((p) => p.id);
      }

      if (params.time?.length) {
        params.end_time = '';
        params.start_time = '';

        params.start_time = params.time[0];
        params.end_time = dayjs(params.time[1]).endOf('days');
      } else {
        params.end_time = '';
        params.start_time = '';
      }
      delete params['time'];
      setDateParmas(params);
      if (fromSearch.value) {
        params.search_type = currentType.value;
        params.search_value = fromSearch.value;
      }
      return params;
    },
    afterFetch: () => {
      clearSelectedRowKeys();
    },
  });

  function handleCopy(record) {
    clearClipboard();
    if (record.state == 4)
      clipboardRef.value =
        record.link_type == 2
          ? `${t('table.promotion.promotion_deleted')}?c=${record.channel_code}`
          : `${t('table.promotion.promotion_deleted')}`;
    else clipboardRef.value = `https://${record.channel_domain}`;

    if (unref(copiedRef)) {
      createMessage.success(t('business.common_copy_suceess'));
    }
  }

  function downloadApk(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'app.apk'; // 默认文件名为 app.apk
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleCopyApk(record, type) {
    clearClipboard();
    clipboardRef.value = record[type];

    if (unref(copiedRef)) {
      createMessage.success(t('business.common_copy_suceess'));
    }
  }

  function handleCopyVal(value) {
    if (!value) {
      createMessage.warning(t('table.promotion.promotion_please_copy_content'));
      return;
    }
    clearClipboard();

    clipboardRef.value = value;

    if (unref(copiedRef)) {
      createMessage.success(t('business.common_copy_suceess'));
    }
  }

  function EditFun(record) {
    openModal(true, {
      category: 1,
      title: t('table.promotion.promotion_edit_tunnel'),
      ...record,
      group_ids: record.group_id,
    }); //编辑渠道
  }

  function openAddIpModalFun() {
    openModal(true, {
      category: 2,
      title: t('table.promotion.promotion_add_tunnel'),
      group_ids: group_ids.value,
    }); //新增渠道
  }

  function openOficialUpdate() {
    openOficialModal(true, appLink.value); //新增渠道
  }

  function openProvidersModalClick(item) {
    if (item) {
      openProvidersModal(true, { title: t('common.change_name'), item });
    } else {
      openProvidersModal(true, { title: t('common.add_promoters') });
    }
  }

  async function getOficialLink() {
    const res = await getChannelAppList({});
    appLink.value = JSON.parse(res.data);
    // openOficialModal(true, data); //新增渠道
  }

  async function getChannelProviders() {
    const { data } = await channelProviders({ state: showAll.value ? 0 : 1 });

    channelProvidersList.value = data.map((p) => {
      return {
        ...p,
        label: p.group_name,
        value: p.id,
        type: 'item',
      };
    });
    channelProvidersListAll.value = [
      {
        label: '全部',
        value: '',
        type: 'all',
      },
    ].concat(channelProvidersList.value);
  }

  function areAllFieldsNullOrEmpty(data) {
    return Object.values(data).every((value) => value === '' || value === null);
  }

  function showConfirm(params) {
    // '操作确认'，'您确定删除该IP地址吗？'
    // '您确定删除该渠道吗？'
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.promotion.promotion_remove_tunnel_tip'),
      async () => {
        try {
          const { status, data } = await deleteChannelLink(params);
          if (status) {
            message.success(data);
            setPagination({ current: 1 });
            reload();
          } else message.error(data);
        } catch (e) {
          console.error(e);
        }
      },
    );
  }

  function getHiddenChannelProviders(item) {
    group_ids.value = item.value;
    reload();
  }

  function setHiddenChannelProviders(params) {
    openConfirm(
      t('common.friendly_reminder'),
      t('common.set_hidden_title', {
        s: params.state === 2 ? t('business.common_show') : t('business.common_hidden'),
        n: params.group_name,
      }),
      async () => {
        try {
          const { status, data } = await channelProvidersUpdate({
            id: params.id,
            state: params.state === 2 ? 1 : 2,
            only_state: 1,
          });
          if (status) {
            message.success(data);
            reload();
          } else message.error(data);
        } catch (e) {
          console.error(e);
        }
      },
    );
  }
  async function showConfirmApk(params) {
    const res = await getChannelList({
      page: 1, //分页页码，数字类型
      page_size: 1000, //分页条数
      search_type: 5,
      search_value: 'apk',
    });
    openConfirm(
      t('table.member.member_oprate_tip'),
      `${t('table.promotion.showConfirmApk_1')}${res.t}${t('table.promotion.showConfirmApk_2')}`,
      async () => {
        try {
          const { status, data } = await getBatchUpdateOpen({
            app_type: 1,
          });
          if (status) {
            message.success(data);
            reload();
          } else message.error(data);
        } catch (e) {
          console.error(e);
        }
      },
    );
  }

  function toChannlStatistics(type, data) {
    switch (type) {
      case 'username':
        emit('update-event', { username: data });
        return;
      case 'channel_id':
        emit('update-event', { channel_id: data });
        return;
    }
  }

  function isHttpUrl(url) {
    const httpRegex = /^https?:\/\//; // 正则表达式，用于匹配以 http:// 或 https:// 开头的 URL
    return httpRegex.test(url);
  }

  function openApk(record: any, type?: any) {
    // if (type) {
    //   record.apk = '';
    //   record.apk_name = '';
    // }
    openModalUpdate(true, record); //新增渠道
  }

  function openIOS(record: any, type?: any) {
    openModalUpdateIOS(true, record); //新增渠道
  }

  function handleModalSuccess() {
    group_ids.value = '';
    reload();
  }

  function getNavLocationLabel(record) {
    if (record.nav_location == 5) return t('table.promotion.promotion_imitation_google');
    const matchedLocation = navLocation.find((el) => el.value === record.nav_location);
    return matchedLocation?.label ?? '-';
  }

  onMounted(() => {
    const treeListStore = useTreeListStore();
    treeListStore.initPostChannelTemplateList();
    getOficialLink();
    getChannelProviders();
    eventBus.on('Refreshfix', (res: any) => {
      reload();
    });
  });

  onBeforeMount(() => {
    eventBus.off('Refreshfix');
  });
</script>
<style scoped lang="less">
  .channel-link {
    .primary.base-tag {
      border: 1px solid #1475e1;
      background-color: #fff;
      color: #1475e1;
    }

    .activeTag.base-tag {
      border: 1px solid #1475e1;
      background-color: #1475e1;
      color: #fff;
    }
  }
</style>

<style lang="less">
  .channel-link-tooltip {
    // margin-top: -16px;
    padding-top: 4px;

    .ant-tooltip-arrow {
      top: -9px;
    }
  }
</style>
