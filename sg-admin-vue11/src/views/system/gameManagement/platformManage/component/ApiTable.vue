<template>
  <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            label:
              record.state == 1
                ? $t('business.common_deactivate')
                : $t('business.common_on_activate'),

            color: record.state == 2 ? 'success' : 'error',
            onClick: showConfirm.bind(
              null,
              record,
              'state',
              record.state == 1
                ? `${$t('table.system.system_deactivate_game')}${
                    record[getLanguageField('name')]
                  }${$t('table.system.system_ma')}`
                : `${$t('table.system.system_enable_game')}${record[getLanguageField('name')]}${$t(
                    'table.system.system_ma',
                  )}`,
            ),
            ifShow: isHasAuth('70414'),
          },
          {
            label: $t('table.system.system_game_list'),

            onClick: handleToGameList.bind(null, record),
            ifShow: isHasAuth('70424'),
          },
        ]"
      />
    </template>
    <template #currency="{ record }">
      <CurrencyDisplay
        :currency_names="currencyArray(record.currency)"
        :currencyTreeList="currencyTreeList"
      />
    </template>
  </BasicTable>
</template>

<script lang="ts">
  import { defineComponent, h, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { openGameListConfirm } from '/@/utils/confirm';
  import { useLocale } from '@/locales/useLocale';
  import { message, Textarea, Tooltip } from 'ant-design-vue';
  import { updatePlatformMaintained, updatePlatformState } from '/@/api/sys/index';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import CurrencyDisplay from '/@/components-cd/Icon/CurrencyDisplay.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import QuestionIcon from '@/assets/images/question.webp';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const { getLanguageField } = useLocale();

  export default defineComponent({
    name: 'PlatformApiTable',
    components: {
      BasicTable,
      TableAction,
      cdIconCurrency,
      Tooltip,
      CurrencyDisplay,
      // EditPlatformModal,
      // MaintainModal,
    },
    props: {
      apiMap: {
        type: Object,
        default: () => {},
      },
    },
    setup(props) {
      const scrollHeight = Number(useScrollerHeight(360).value);
      const $router = useRouter();
      const [registerModal, { openModal }] = useModal();
      const [registerMaintainModal, { openModal: openMaintainModal }] = useModal();
      const { currencyTreeList } = useTreeListStore();
      const remarkVal = ref('');

      const [registerTable, { reload }] = useTable({
        api: getList,
        columns: props.apiMap.columns,
        bordered: true,
        showIndexColumn: false,
        showTableSetting: false,
        actionColumn: {
          minWidth: 220,
          title: t('business.common_operate'),
          dataIndex: 'action',
          fixed: false,
          slots: { customRender: 'action' },
          ifShow: auths(['70414', '70424']),
        },
      });

      function getList(tableParams: { rows: number; page: number }): Promise<any> {
        return props.apiMap.list({
          ...tableParams,
          state: 0,
          maintained: 0,
          game_type: props.apiMap.modalType,
        });
      }

      function handleMaintainModal(record): void {
        if (record.maintained == 2) {
          openConfirm(t('table.member.member_oprate_tip'), t('table.system.system_are_you'), () => {
            updatePlatformMaintained({ id: record.id, maintained: 1 });
          });
        }
        if (record.maintained == 1) {
          openMaintainModal(true, record);
        }
      }
      function showWhat(row, msg) {
        if (row.state == 1) {
          return h('div', null, [
            h(
              'div',
              {
                class: 'flex mb-2',
              },
              [
                h('img', { src: QuestionIcon, class: 'w-20px h-20px mr-5px' }),
                h('div', { class: 'text-[#444444]' }, `${msg}`),
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
            h('div', { class: 'text-[#444444]' }, `${msg}`),
          ],
        );
      }
      function handleToGameList(record) {
        $router.push({
          name: 'GameList',
          state: { name: record.name, platform_id: record.id },
        });
      }

      function handleSuccess() {
        reload();
      }

      async function platformMaintained(record) {
        const { status, data } = await updatePlatformMaintained({
          id: record.id,
          maintained: record.maintained == 1 ? 2 : 1,
        });
        if (status) {
          message.success(data);
          reload();
        } else {
          message.error(data);
        }
      }

      async function platformState(record) {
        const { status, data } = await updatePlatformState({
          id: record.id,
          state: record.state == 1 ? '2' : '1',
          remark: remarkVal.value,
        });
        if (status) {
          message.success(data);
          remarkVal.value = '';

          reload();
        } else {
          message.error(data);
        }
      }

      function showConfirm(record, use, msg) {
        openGameListConfirm(
          t('table.member.member_oprate_tip'),
          () => showWhat(record, msg),
          () => {
            if (use === 'state') {
              platformState(record);
            }
            if (use === 'maintained') {
              platformMaintained(record);
            }
          },
        );
      }

      function currencyArray(_array) {
        _array = JSON.parse(_array);
        return _array;
      }

      function currencyString(_array) {
        _array = JSON.parse(_array);
        let _str = '';
        _array.map((q) => {
          _str = _str + q + ',';
        });
        _str = _str.substring(0, _str.length - 1);
        return _str;
      }

      return {
        handleToGameList,
        registerModal,
        registerMaintainModal,
        registerTable,
        handleMaintainModal,
        handleSuccess,
        showConfirm,
        getLanguageField,
        currencyArray,
        cdIconCurrency,
        currencyString,
        currencyTreeList,
        isHasAuth,
        scrollHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  .currency-box {
    display: inline-block;
    width: 80px;
    cursor: pointer;
  }

  .currency-more {
    display: inline-block;
    width: 30px;
    float: right;
    cursor: pointer;
  }
</style>
