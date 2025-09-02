<template>
  <PageWrapper
    :title="$t('table.system.system_message_send_detail')"
    :contentStyle="{ margin: 0 }"
    :back="back"
    class="web-site-letter-info-page"
  >
    <BasicTable
      @register="registerTable"
      class="web-site-letter-info"
      :scroll="{ y: scrollHeight }"
    >
      <template #action="{ record, column }">
        <TableAction
          :actions="[
            {
              label: $t('business.common_detail'), //详情
              icon: 'ant-design:eye-outlined',
              onClick: setSend.bind(null, record),
            },
            {
              label: $t('common.delText'), //删除
              icon: 'ant-design:edit-outlined',
              color: 'error',
              onClick: showConfirm.bind(null, record, $t('table.system.system_message_delete_tip')), //删除后无法恢复，您确定要删除吗
              ifShow: isHasAuth('70535'),
            },
          ]"
        />
      </template>
      <template #letterInfo="{ record }">
        <a @click="setSend(record)">{{ $t('table.system.system_message_content') }}</a>
      </template>
    </BasicTable>
    <SendLetterModal @register="registerSendLetterModal" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { columns, searchFormSchema } from './index.data';
  import { openConfirm } from '/@/utils/confirm';
  import SendLetterModal from '../../common/components/SendLetterModal.vue';
  import { delStationDetailInfo, getStationDetaillist } from '/@/api/sys';
  import { createLocalStorage } from '/@/utils/cache';
  import { WEBSITELETTERINFO } from '/@/enums/cacheEnum';
  import { useRoute } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';
  import { router } from '/@/router';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  export default defineComponent({
    name: 'WebsiteLetterInfo',
    components: {
      BasicTable,
      TableAction,
      PageWrapper,
      SendLetterModal,
    },
    setup() {
      const scrollHeight = Number(useScrollerHeight(340).value);
      const route = useRoute();
      const ls = createLocalStorage();
      const [registerSendLetterModal, { openModal: openSend }] = useModal();
      const back = () => {
        const { resetFields } = getForm();
        resetFields();
        router.go(-1);
      };
      const [registerTable, { getForm, reload }] = useTable({
        api: getData,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          submitButtonOptions: {
            text: t('business.common_inquire'), //查询
          },
          showResetButton: false,
          actionColOptions: {
            class: 't-form-col',
            span: 1,
          },
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        beforeFetch: async (param) => {
          return param;
        },
      });

      async function getData(tableParams: { rows: number; page: number }): Promise<any> {
        const { content, title, msg, created_name, from_user, created_at } =
          ls.get(WEBSITELETTERINFO);
        let obg = {
          content,
          msg,
          title,
          from_user,
          created_name,
          sentTime: created_at,
        };
        const data = await getStationDetaillist({
          ...tableParams,
          station_id: route.query.id,
        });
        data.d.forEach((el) => Object.assign(el, obg));

        return data;
      }

      async function handleDelete(record: any): Promise<void> {
        try {
          const { id, to_user, to_uid, station_id } = record;

          const { status, data } = await delStationDetailInfo({
            id: id,
            to_user: to_user,
            uid: to_uid,
            station_id: station_id,
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

      function showConfirm(record, msg) {
        // 警告提示
        openConfirm(t('common.warning'), msg, () => {
          handleDelete(record);
        });
      }

      function setSend(record) {
        const type = 'content';
        openSend(true, { type: type, ...record });
      }

      return {
        reload,
        back,
        registerTable,
        setSend,
        registerSendLetterModal,
        showConfirm,
        isHasAuth,
        scrollHeight,
      };
    },
  });
</script>
<style lang="less" setup>
  .iconify {
    font-size: 22px;
  }

  .web-site-letter-info {
    padding: 0;
    padding-right: 20px !important;
    padding-left: 20px !important;

    form {
      padding: 0;
      padding-right: 0 !important;
      padding-left: 0 !important;

      button {
        height: 40px !important;
      }
    }
  }

  .web-site-letter-info-page {
    .ant-page-header {
      background-color: transparent !important;

      .anticon-arrow-left {
        svg {
          display: none;
        }
      }

      .ant-page-header-back {
        //margin-right: 0;
        font-size: 16px;
        line-height: 1;
      }

      .anticon-arrow-left::after {
        content: '';
        display: inline-block;
        width: 9px;
        height: 16px;
        background-image: url('/@/assets/images/btn-left.webp');
        background-repeat: no-repeat;
        background-size: contain;
      }

      .ant-page-header-heading-title {
        font-size: 18px !important;
        font-weight: 500 !important;
        line-height: 18px !important;
      }
    }

    .vben-basic-table-action.center {
      svg {
        display: none;
      }
    }
  }
</style>
