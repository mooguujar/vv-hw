<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-formFooter>
        <Button class="ml-2" type="primary" @click="goToCreateButton">{{
          $t('table.system.system_add_announcement')
        }}</Button>
      </template>
      <template #content="{ record }">
        <!--文字' : '图片'-->
        <div class="primary-color cursor" @click="handleOpenModal(record)">{{
          record.pop_up_type == 1 ? $t('common.text') : $t('common.pic')
        }}</div>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: $t('business.common_detail'), //详情
              icon: 'clarity:note-edit-line',
              onClick: handleOpenModal.bind(null, record),
              ifShow: isControlValueSet() ? true : isHasAuth('70915'),
            },
            {
              label: $t('common.editorText'), //编辑
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              ifShow: isControlValueSet() ? false : isHasAuth('70513'),
            },
            {
              label: $t('common.delText'), //删除
              icon: 'ant-design:delete-outlined',
              color: 'error',
              onClick: showConfirm.bind(null, record.id),
              ifShow: isControlValueSet() ? false : isHasAuth('70513'),
            },
          ]"
        />
      </template>
    </BasicTable>
    <AnnounceDetailModal @register="registerModal" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Button } from '/@/components/Button';
  import { columns, searchFormSchema } from './announcementTableData';
  import { getSiteNoticetList, deleteSiteNoticet, siteNoticetSort } from '/@/api/sys';
  import AnnounceDetailModal from './AnnounceDetailModal.vue';
  import { message } from 'ant-design-vue';
  import { ADDraggableRow } from '/@/utils';
  import eventBus from '/@/utils/eventBus';
  import { openConfirm } from '/@/utils/confirm';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  type Recordable<T = any> = Record<string, T>;

  export default defineComponent({
    name: 'AnnouncementTable',
    components: {
      BasicTable,
      TableAction,
      PageWrapper,
      Button,
      AnnounceDetailModal,
    },
    setup() {
      const scrollHeight = Number(useScrollerHeight(400).value);
      const router = useRouter();
      let tableSearchParam = ref<any>({});
      let dataSource = ref<any>([]);
      /**
       * 移动后回调函数
       * @param dataSource 数据源
       * @param target 移动后下标
       * @param source 移动前下标
       * style 1-动漫 2-漫画 3-图片 4-小说 5-有声小说 6-视频
       */
      async function sortTable(targetWork, tempSource) {
        if (!targetWork && !tempSource) {
          return;
        }
        //TODO 分类id  专题上一个id 下一个id
        let param = {
          index_id: targetWork.id,
          notice_type: 1, // 类型(1-公告,2-跑马灯)
          id: tempSource.id, // 广告Id
          sort_before: tempSource.seq,
          sort_after: targetWork.seq,
        };
        try {
          const { status, data } = await siteNoticetSort(param);
          if (status) {
            message.success(data);
          } else {
            message.error(data);
          }
          reload();
        } catch (e) {
          console.error(e);
        }
      }

      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload, setTableData }] = useTable({
        customRow: (record, index) => {
          return isHasAuth('70518')
            ? ADDraggableRow(dataSource.value, index, setTableData, sortTable)
            : (onclick = () => {});
        },
        api: getData,
        columns,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          minWidth: 200,
          title: t('business.common_operate'), //操作
          dataIndex: 'action',
          fixed: false,
          slots: { customRender: 'action' },
          ifShow: isControlValueSet() ? true : auths(['70915', '70513']),
        },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          showAdvancedButton: false,
          showResetButton: false,
          actionColOptions: {
            class: 't-form-col',
            xxl: 11,
            xl: 11,
            lg: 11,
          },
          submitButtonOptions: {
            text: t('common.queryText'),
          },
        },
        useSearchForm: false,
        beforeFetch: (tableParams: Recordable) => {
          return Object.assign(tableParams, tableSearchParam.value);
        },
        afterFetch: (data) => {
          // data = parseData(data);
          data = data.map((item) => parseData(item));
          dataSource.value = data;
        },
      });

      onBeforeMount(() => {
        eventBus.off('searchSubmit');
      });

      onMounted(() => {
        eventBus.on('searchSubmit', (value) => {
          tableSearchParam.value = value;
          handleSuccess();
        });
      });

      function getData(tableParams: { rows: number; page: number }): Promise<any> {
        return getSiteNoticetList({ ...tableParams, notice_type: 1 });
      }

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
          record.client =
            typeof record.client === 'string' ? record.client.split(',') : record.client;
          record.usernames = crowd_content;
          record.user_levels = crowd_content;
          record.vip_levels = crowd_content;
          record.agents = crowd_content;
        } catch (e) {
          console.error(e);
        }

        return record;
      };

      function handleOpenModal(record) {
        record = parseData(record);
        openModal(true, record);
      }

      function handleEdit(record: Recordable): void {
        record = parseData(record);

        router.push({ name: 'EditAnnouncement', params: { id: record.id } });
      }

      async function handleDelete(id: number): Promise<void> {
        try {
          const { status, data } = await deleteSiteNoticet({ id, notice_type: 1 });
          if (status) {
            message.success(data);
            reload();
          }
        } catch (e) {
          console.error(e);
        }
      }

      function handleSuccess() {
        reload();
      }

      function goToCreateButton() {
        router.push({ name: 'AddAnnouncement' });
      }

      function showConfirm(id) {
        //操作确认, 是否进行删除操作？删除后无法恢复
        openConfirm(
          t('table.member.member_oprate_tip'),
          t('table.system.system_option_delete_tip'),
          () => {
            handleDelete(id);
          },
        );
      }
      return {
        registerModal,
        registerTable,
        handleOpenModal,
        handleEdit,
        reload,
        goToCreateButton,
        showConfirm,
        isHasAuth,
        isControlValueSet,
        scrollHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.app-iconify) {
    svg {
      display: none;
    }
  }

  ::v-deep(.app-iconify)::after {
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    background-image: url('/@/assets/svg/drag.svg');
  }

  ::v-deep(.vben-basic-table-action) {
    .app-iconify {
      display: none !important;
    }
  }

  ::v-deep(.ant-switch-inner) {
    color: transparent !important;
  }
</style>
