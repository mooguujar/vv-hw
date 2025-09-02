<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <DateButtonGroup
      class="absolute h-0"
      :isSelect="'days'"
      @change-button-day="changeButtonDay"
      :dateGroupButtonList="[]"
    />
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content', y: scrollHeight }">
      <template #action="{ column, record }">
        <!--详情，撤回-->
        <TableAction
          :actions="[
            {
              label: $t('business.common_detail'),
              onClick: handleInfo.bind(null, record),
              ifShow: isHasAuth('70534'),
            },
            {
              label: $t('table.system.system_withdraw'),
              onClick: handleWithdraw.bind(
                null,
                record,
                $t('table.system.system_message_return_tip'),
              ),
              ifShow: isHasAuth('70533'),
            },
          ]"
        />
      </template>
      <template #form-sendletter>
        <!--发站内信-->
        <Button type="primary" v-if="isHasAuth('70532')" @click="setSend()" class="!mr-2">{{
          $t('routes.system.website_letter')
        }}</Button>
      </template>
      <template #centent="{ record }">
        <!--信息内容-->
        <TableAction
          :actions="[
            {
              label: $t('table.system.system_message_content'),
              onClick: hondelContent.bind(null, record),
            },
          ]"
        />
      </template>
      <template #image-action="{ record }">
        <TableAction
          v-if="isHasAuth('70534')"
          :actions="[
            {
              label: record.read_count + '/' + (record.msg_num - record.read_count),
              onClick: handleInfo.bind(null, record),
            },
          ]"
        />
        <span v-else>{{ record.read_count + '/' + (record.msg_num - record.read_count) }}</span>
      </template>
    </BasicTable>
    <SendLetterModal @register="registerSendLetterModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { Button } from '/@/components/Button/index';
  import { useRouter } from 'vue-router';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { columns, searchFormSchema } from './index.data';
  import { openConfirm } from '/@/utils/confirm';
  import SendLetterModal from '../common/components/SendLetterModal.vue';
  import { delStationInfo, getStationInfolist } from '/@/api/sys';
  import { message } from 'ant-design-vue';
  import { createLocalStorage } from '/@/utils/cache';
  import { WEBSITELETTERINFO } from '/@/enums/cacheEnum';
  import { formatDateTime } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import eventBus from '/@/utils/eventBus';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import dayjs from 'dayjs';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  export default defineComponent({
    name: 'WebsiteLetterNocash',
    components: {
      BasicTable,
      TableAction,
      PageWrapper,
      Button,
      SendLetterModal,
      DateButtonGroup,
    },
    setup() {
      const scrollHeight = Number(useScrollerHeight(325).value);
      const $router = useRouter();
      const ls = createLocalStorage();

      const [registerSendLetterModal, { openModal: openSend }] = useModal();
      const [registerTable, { reload, getForm }] = useTable({
        api: getStationInfolist,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          submitButtonOptions: {
            class: 't-form-label-com-btn',
            text: t('business.common_inquire'), //查询
          },
          showResetButton: false,
          showAdvancedButton: false,
        },
        actionColumn: {
          width: 180,
          title: t('business.common_operate'), //操作
          dataIndex: 'action',
          slots: { customRender: 'action' },
          ifShow: auths(['70534', '70533']),
        },
        beforeFetch: async (param) => {
          if (param?.time?.length > 0) {
            param.start_time = param.time[0] ? formatDateTime(param.time[0]) : null;
            param.end_time = param.time[1]
              ? formatDateTime(dayjs(param.time[1]).endOf('days'))
              : null;
          }
          delete param.time;
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
      });

      // 详情跳转
      function handleInfo(record) {
        ls.set(WEBSITELETTERINFO, record);
        $router.push({
          name: 'WebsiteLetterInfo',
          query: {
            id: record.id,
            username: record.accountTypeName,
            currencyName: record.totalDeposit,
          },
        });
      }
      eventBus.on('RefreshWebsiteList', () => {
        reload();
      });
      function setSend() {
        const type = 'FrontPage';
        openSend(true, { type: type });
      }

      async function changeButtonDay(value) {
        setTimeout(async () => {
          await getForm().setFieldsValue({ time: value });
          reload();
        }, 11);
      }

      async function handleDelete(record: any): Promise<void> {
        try {
          const { status, data } = await delStationInfo({
            id: record.id,
          });
          if (status) {
            message.success(data);
            reload();
          } else {
            message.error(data);
          }
        } catch (e) {
          console.error(e);
        }
      }

      function handleSuccess() {
        reload();
      }

      function handleWithdraw(record, msg) {
        openConfirm(t('common.warning'), msg, () => {
          handleDelete(record);
        });
      }

      function hondelContent(record) {
        try {
          record.centent = JSON.parse(record.msg);
        } catch (e) {
          record.centent = '';
          console.error(e);
        }
        const type = 'content';
        openSend(true, { type: type, ...record });
      }
      return {
        reload,
        registerTable,
        registerSendLetterModal,
        handleInfo,
        Button,
        SendLetterModal,
        setSend,
        handleWithdraw,
        hondelContent,
        handleSuccess,
        isHasAuth,
        changeButtonDay,
        scrollHeight,
      };
    },
  });
</script>
<style lan="less" scoped>
  ::v-deep(.vben-basic-table-form-container) {
    padding: 20px !important;
    padding-top: 10px !important;
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding: 0 !important;
  }

  ::v-deep(.ant-form-item-control-input-content) {
    flex: none !important;
  }
</style>
