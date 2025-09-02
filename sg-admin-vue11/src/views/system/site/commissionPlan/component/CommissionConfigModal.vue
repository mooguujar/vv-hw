<template>
  <BasicModal
    v-bind="$attrs"
    :width="600"
    :minHeight="300"
    :centered="true"
    :canFullscreen="false"
    :title="`{${title}}${$t('modalForm.member.member_config')}`"
    :cancelText="`${$t('common.cancelText')}`"
    :okText="`${$t('common.saveText')}`"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <Tabs v-model:activeKey="activeKey" @change="handleChange">
      <TabPane v-for="item in tabsFormSchema" :key="item.key" :tab="item.tab">
        <EditTable
          :buttonText="$t('modalForm.system.system_add_receive')"
          :isModal="true"
          :Table="item.Table"
          :tableColumns="columns"
        />
      </TabPane>
    </Tabs>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { columns } from './commissionConfig.data';
  import { useTable } from '/@/components/Table';

  import { Tabs, TabPane } from 'ant-design-vue';

  import EditTable from './EditTable.vue';

  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'CommissionConfigModal',
    components: { BasicModal, EditTable, Tabs, TabPane },
    emits: ['register', 'submit'],
    setup(_, { emit }) {
      const baseTableConfig = {
        showIndexColumn: false,
        pagination: false,
        actionColumn: {
          width: 120,
          title: t('business.common_operate'), //操作
          dataIndex: 'action',
        },
      };

      let companyDepositList = [];
      let currencyDepositList = [];
      let onlineSupportList = [];

      let title = ref('');

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        title.value = data.name;
        companyDepositList = data.record.filter((item: any) => item.wayType === 1);
        currencyDepositList = data.record.filter((item: any) => item.wayType === 2);
        onlineSupportList = data.record.filter((item: any) => item.wayType === 3);
        handleChange();
        setModalProps({ confirmLoading: false });
      });

      const activeKey = ref(1);

      const handleChange = () => {
        nextTick(() => {
          const tabsFormSchema1 = tabsFormSchema[0].Table[1];
          const tabsFormSchema2 = tabsFormSchema[1].Table[1];
          const tabsFormSchema3 = tabsFormSchema[2].Table[1];

          if (tabsFormSchema1.getTableRef().value && tabsFormSchema1.getDataSource().length === 0) {
            tabsFormSchema1.setTableData(companyDepositList);
          }
          if (tabsFormSchema2.getTableRef().value && tabsFormSchema2.getDataSource().length === 0) {
            tabsFormSchema2.setTableData(currencyDepositList);
          }
          if (tabsFormSchema3.getTableRef().value && tabsFormSchema3.getDataSource().length === 0) {
            tabsFormSchema3.setTableData(onlineSupportList);
          }
        });
      };
      // wayType: 1 BRL
      const tabsFormSchema = [
        {
          key: 1,
          tab: 'BRL',
          Table: useTable(
            Object.assign(
              { columns: columns },
              { dataSource: companyDepositList, ...baseTableConfig },
            ),
          ),
        },
        // {
        //   key: 2,
        //   tab: '货币入款',
        //   Table: useTable(
        //     Object.assign(
        //       { columns: columns },
        //       { dataSource: currencyDepositList, ...baseTableConfig },
        //     ),
        //   ),
        // },
        // {
        //   key: 3,
        //   tab: '在线支持',
        //   Table: useTable(
        //     Object.assign(
        //       { columns: columns },
        //       { dataSource: onlineSupportList, ...baseTableConfig },
        //     ),
        //   ),
        // },
      ];

      async function handleSubmit(): Promise<void> {
        try {
          setModalProps({ confirmLoading: true });

          let getSiteCashOffersConfigList: Array<any> = [];

          for (let i = 0; i < tabsFormSchema.length; i++) {
            const { getDataSource, getTableRef } = tabsFormSchema[i].Table[1];
            const tableRef = getTableRef();
            if (!tableRef.value) continue;
            const list = getDataSource();
            if (list.length === 0) continue;
            const dataList = list.map((item: any) => {
              const data = cloneDeep(item.editValueRefs);
              return { ...data, wayType: tabsFormSchema[i].key, id: item.id };
            });

            getSiteCashOffersConfigList = getSiteCashOffersConfigList.concat(dataList);
          }

          emit('submit', getSiteCashOffersConfigList);

          closeModal();
        } catch (e) {
          console.error(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        columns,
        activeKey,
        tabsFormSchema,
        handleChange,
        registerModal,
        handleSubmit,
        title,
      };
    },
  });
</script>
