<template>
  <div class="gameListClassName">
    <PageWrapper
      :title="`${$t('table.system.system_game_list')} ${title}`"
      :contentStyle="{ margin: 0 }"
    >
      <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
        <template #action="{ column, record }">
          <TableAction
            :actions="[
              {
                label: `${
                  record.online == 1
                    ? $t('business.common_deactivate')
                    : $t('business.common_on_activate')
                }`,
                color: `${record.online == 2 ? 'success' : 'error'}`,
                onClick: showConfirm.bind(
                  null,
                  record,
                  `${$t('table.member.member_are_you')} ${
                    record.online == 1
                      ? $t('business.common_deactivate').toLowerCase()
                      : $t('business.common_on_activate').toLowerCase()
                  } ${record.name}`,
                ),
                ifShow: isHasAuth('70414'),
              },
              // {
              //   label: '编辑',
              //   icon: 'clarity:note-edit-line',
              //   onClick: handleEdit.bind(null, record),
              // },
            ]"
          />
        </template>
      </BasicTable>
      <!-- <EditGameModal @register="registerModal" @success="handleSuccess" /> -->
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, h, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { updateGameState, getSearchGameList } from '/@/api/sys/index';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';

  import EditGameModal from './EditGameModal.vue';
  import { columns, searchFormSchema } from './gameManage.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { openGameListConfirm } from '/@/utils/confirm';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';
  import QuestionIcon from '@/assets/images/question.webp';
  import { Textarea } from 'ant-design-vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const remarkVal = ref('');
  export default defineComponent({
    name: 'GameList',
    components: { BasicTable, TableAction, EditGameModal, PageWrapper },
    setup() {
      const scrollHeight = Number(useScrollerHeight(340).value);
      const title = history.state.name;
      const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<any>({});
      const [registerTable, { reload }] = useTable({
        api: getSearchGameList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          actionColOptions: {
            class: 't-form-label-com',
            span: 1,
          },
          showResetButton: false,
        },
        beforeFetch: (param) => {
          param.platform_id = history.state.platform_id;
          param['is_hot'] = 0;
          return param;
        },
        useSearchForm: true,
        showTableSetting: false,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 160,
          title: t('business.common_operate'),
          slots: { customRender: 'action' },
          ifShow: isHasAuth('70414'),
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record) {
        openModal(true, { record });
      }

      const { createMessage } = useMessage();

      // 游戏上线下线
      function handleUpdateGameState(record) {
        return updateGameState({
          id: record.id,
          // platform_id: record.platform_id,
          online: record.online == 2 ? '1' : '2',
          remark: record.online == 2 ? '' : remarkVal.value,
        }).then((response) => {
          if (response.status) {
            reload();
            remarkVal.value = '';
          } else {
            createMessage.error(response.data);
          }
        });
      }

      function handleSuccess() {
        reload();
      }

      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        reload();
      }

      function showConfirm(record, msg) {
        openGameListConfirm(
          t('table.member.member_oprate_tip'),
          () => showWhat(record, msg),
          async () => {
            await handleUpdateGameState(record);
          },
        );
      }

      function showWhat(row, msg) {
        if (row.online == 1) {
          return h('div', null, [
            h(
              'div',
              {
                class: 'flex mb-2',
              },
              [
                h('img', { src: QuestionIcon, class: 'w-20px h-20px mr-5px' }),
                h('div', { class: 'text-[#444444]' }, `${msg}？`),
              ],
            ),
            h(Textarea, {
              style: { width: '488px', marginLeft: '24px', marginTop: '6px' },
              modelValue: remarkVal.value,
              rows: 4,
              size: 'large',
              maxlength: 200,
              placeholder: t('table.member.member_stop_reason'),
              onChange: (e) => {
                remarkVal.value = e.target.value as string;
              },
            }),
          ]);
        }
        return h(
          'div',
          {
            class: 'flex',
          },
          [
            h('img', { src: QuestionIcon, class: 'w-20px h-20px mr-5px' }),
            h('div', { class: 'text-[#444444]' }, `${msg}？`),
          ],
        );
      }

      return {
        title,
        showConfirm,
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleSuccess,
        handleSelect,
        isHasAuth,
        scrollHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-page-header) {
    padding-top: 10px !important;
    background-color: transparent;
  }

  ::v-deep(.anticon-arrow-left::before) {
    content: '';
    display: inline-block;
    width: 9px;
    height: 14px;
    background-image: url('/@/assets/images/btn-left.webp');
    background-size: 100%;
  }

  ::v-deep(.ant-page-header-heading-title) {
    font-size: 18px !important;
  }

  ::v-deep(.anticon-arrow-left::before) {
    content: '';
    display: inline-block;
    width: 9px;
    height: 14px;
    background-image: url('/@/assets/images/btn-left.webp');
    background-size: 100%;
  }

  ::v-deep(.ant-table-wrapper) {
    padding-left: 10px !important;
  }

  ::v-deep(.anticon-arrow-left) {
    svg {
      display: none !important;
    }
  }

  ::v-deep(.vben-basic-table-form-container) {
    padding-top: 0 !important;
  }
</style>
