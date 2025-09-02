<template>
  <PageWrapper
    :contentStyle="{ margin: '0px', paddingLeft: '10px', paddingRight: '10px' }"
    class="LayoutTable"
  >
    <Space :size="10" class="t-form-label-com ml-2.5 mt-2.5">
      <template v-for="(item, index) in buttonList">
        <Button
          v-if="item?.ifshow"
          type="primary"
          class="my-2"
          :key="index"
          @click="openTargetModal(item.type)"
          :preIcon="item.icon"
        >
          {{ item.text }}
        </Button>
      </template>
    </Space>
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #action="{ column, record }">
        <template v-if="column.key === 'id'">
          <MenuOutlined />
        </template>
        <TableAction :actions="createActions(record)" />
      </template>
      <template #memberCount="{ record }">
        <router-link
          v-if="record.member_count > 0 && isHasAuth('10100')"
          :to="{
            path: '/member/inquiryMember',
            query: { level: record.level_id },
          }"
          >{{ record.member_count }}
        </router-link>
        <div v-else>{{ record.member_count }}</div>
      </template>
      <template #memberValid="{ record }"
        ><router-link
          v-if="record.member_valid_count > 0 && isHasAuth('10100')"
          :to="{
            path: '/member/inquiryMember',
            query: { level: record.level_id, is_available: '1' },
          }"
          >{{ record.member_valid_count }}</router-link
        >
        <div v-else>{{ record.member_valid_count }}</div>
      </template>
    </BasicTable>
    <addMemberLevel @diamondsuccess="sucModel" @register="registeraddDemond" />
    <editGrade @register="registerEditGradeModal" />
    <!-- <payEditModal @register="registerPayEditModal" /> -->
  </PageWrapper>
</template>
<script setup lang="ts">
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { Space } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { Button } from '/@/components/Button';
  import { MenuOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import { columns } from './grade.data';
  import { getLevelList, deleteLevel } from '/@/api/member/index';
  import { openConfirm } from '/@/utils/confirm';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  //增加会员等级
  import addMemberLevel from './component/addMemberLevel.vue';
  //修改会员层级
  import editGrade from './component/editGrade.vue';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight340 } from '../../common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight340).value);

  const { createMessage } = useMessage();
  //新增会员层级初始化
  const [registeraddDemond, { openModal: memberEdit }] = useModal();
  //修改等级初始化
  const [registerEditGradeModal, { openModal: openEditGrade }] = useModal();

  // const [registerPayEditModal, { openModal: payEdit }] = useModal();

  const buttonList = [
    {
      text: t('modalForm.member.member_add_level'),
      icon: '',
      type: 'addVip',
      ifshow: isHasAuth('10604'),
    },
    {
      text: t('modalForm.member.member_updata_level'),
      icon: '',
      type: 'editVip',
      ifshow: isHasAuth('10606'),
    },
  ];
  const [registerTable, { reload, getColumns, setColumns }] = useTable({
    columns,
    showIndexColumn: false,
    api: getLevelList,
    bordered: true,
    actionColumn: {
      title: t('business.common_operate'),
      dataIndex: 'action',
      minWidth: 100,
      slots: { customRender: 'action' },
      ifShow: auths(['10603', '10605']),
    },
  });
  function openTargetModal(type) {
    switch (type) {
      case 'addVip':
        memberEdit(true, {});
        break;
      case 'editVip':
        openEditGrade(true, {});
        break;
      case 'detail':
        openPayDetail(true, {});
        break;
    }
  }
  function createActions(record) {
    const actions: ActionItem[] = [
      {
        label: t('business.common_edit'),
        onClick: editFun.bind(null, record),
        ifShow: isHasAuth('10603'),
      },
      {
        label: t('business.common_delete'),
        color: 'error',
        ifShow: isHasAuth('10605'),
        onClick: showConfirm.bind(null, record, 'del', t('table.member.member_level_tip2')),
        // ifShow: record?.is_default !== 1 && record?.id !== '0',
        disabled:
          record?.id === '0' ||
          record?.is_default === 1 ||
          record?.member_count > 0 ||
          record?.member_valid_count > 0,
      },
    ];
    return actions;
  }
  function sucModel() {
    reload();
  }
  function editFun(_key) {
    memberEdit(true, _key);
  }
  function showConfirm(record, type, msg) {
    openConfirm(t('modalForm.finance.finance_operation_confirmation'), msg, async () => {
      if (type === 'del') {
        const { data, status } = await deleteLevel({ id: record.id });
        if (status) {
          createMessage.success(data);
        } else {
          createMessage.error(data);
        }
        sucModel();
      }
    });
  }
</script>

<style lang="less" scoped>
  .layoutTop {
    margin-bottom: 5px;
  }

  .vipLevel {
    margin-left: 5px;
  }

  .dividerClass {
    margin: 0 20px 20px 10px;
  }

  .pay-bottom {
    padding: 10px;
    border-radius: 3px;
    background-color: @component-background;
  }
</style>
<style>
  .ant-modal-confirm-content {
    line-height: 1.5 !important;
  }
</style>
