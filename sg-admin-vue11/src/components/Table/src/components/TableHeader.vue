<template>
  <div style="width: 100%">
    <div v-if="$slots.headerTop" style="margin: 5px" class="header-top">
      <slot name="headerTop"></slot>
    </div>
    <div :class="`flex items-center ${prefixCls}__table-title-box`">
      <div :class="`${prefixCls}__tableTitle`">
        <slot name="tableTitle" v-if="$slots.tableTitle"></slot>
        <!--修改标题插槽位置-->
        <TableTitle
          :helpMessage="titleHelpMessage"
          :placement="titleHelpPlacement"
          :title="title"
          v-if="!$slots.tableTitle && title"
        />
      </div>

      <div :class="`${prefixCls}__toolbar`" v-if="$slots.toolbar">
        <slot name="toolbar"></slot>
        <Divider type="vertical" v-if="$slots.toolbar && showTableSetting" />
        <TableSetting
          :class="`${prefixCls}__toolbar-desktop`"
          style="white-space: nowrap"
          :setting="tableSetting"
          v-if="showTableSetting"
          @columns-change="handleColumnChange"
        />
        <Popover
          :overlayClassName="`${prefixCls}__toolbar-mobile`"
          trigger="click"
          placement="left"
          :getPopupContainer="(n) => n.parentElement"
        >
          <template #content>
            <TableSetting
              mode="mobile"
              :setting="tableSetting"
              v-if="showTableSetting"
              @columns-change="handleColumnChange"
            />
          </template>
          <a-button
            :class="`${prefixCls}__toolbar-mobile`"
            v-if="showTableSetting"
            type="text"
            preIcon="ant-design:menu"
            shape="circle"
          />
        </Popover>
      </div>
    </div>
    <!--添加tableTop插槽-->
    <div style="margin: -4px 0 -2px; padding-top: 5px; display: none">
      <slot name="tableTop">
        <Alert type="info" show-icon class="alert" v-if="openRowSelection != null && showAlert">
          <template #message>
            <template v-if="selectRowKeys.length > 0">
              <span>
                <span>{{ t('common.translate.selRecords', { size: selectRowKeys.length }) }}</span>
                <span v-if="isAcrossPage">{{ t('common.translate.canPages') }}</span>
              </span>
              <Divider type="vertical" />
              <a @click="setSelectedRowKeys([])">{{ t('common.translate.clear') }}</a>
              <slot name="alertAfter"></slot>
            </template>
            <template v-else>
              <span>{{ t('common.translate.noData') }}</span>
            </template>
          </template>
        </Alert>
      </slot>
    </div>
    <!--添加tableTop插槽-->
  </div>
</template>
<script lang="ts">
  import type { TableSetting, ColumnChangeParam } from '../types/table';
  import type { PropType } from 'vue';
  import { defineComponent, computed } from 'vue';
  import { Divider, Popover, Alert } from 'ant-design-vue';
  import TableSettingComponent from './settings/index.vue';
  import TableTitle from './TableTitle.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useTableContext } from '../hooks/useTableContext';
  import { useI18n } from '@/hooks/web/useI18n';

  export default defineComponent({
    name: 'BasicTableHeader',
    components: {
      Divider,
      TableTitle,
      TableSetting: TableSettingComponent,
      Popover,
      Alert,
    },
    props: {
      title: {
        type: [Function, String] as PropType<string | ((data: Recordable) => string)>,
      },
      tableSetting: {
        type: Object as PropType<TableSetting>,
      },
      showTableSetting: {
        type: Boolean,
      },
      titleHelpMessage: {
        type: [String, Array] as PropType<string | string[]>,
        default: '',
      },
      titleHelpPlacement: { type: String },
      showAlert: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['columns-change'],
    setup(_, { emit }) {
      const { prefixCls } = useDesign('basic-table-header');
      const { t } = useI18n();
      function handleColumnChange(data: ColumnChangeParam[]) {
        emit('columns-change', data);
      }

      const { getSelectRowKeys, setSelectedRowKeys, getRowSelection } = useTableContext();
      const selectRowKeys = computed(() => getSelectRowKeys());
      const openRowSelection = computed(() => getRowSelection());
      // 是否允许跨页选择
      const isAcrossPage = computed(() => openRowSelection.value?.preserveSelectedRowKeys === true);

      return {
        t,
        prefixCls,
        handleColumnChange,
        selectRowKeys,
        setSelectedRowKeys,
        openRowSelection,
        isAcrossPage,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-header';

  .@{prefix-cls} {
    &__toolbar {
      //flex: 1;
      width: 140px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      > * {
        margin-right: 8px;
      }

      &-desktop {
        display: block;
      }

      &-mobile {
        display: none;
      }
    }
    &__tableTitle {
      width: 100%;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;

      > * {
        margin-right: 4px;
        margin-bottom: 4px;
      }
    }

    @media (max-width: @screen-lg) {
      &__table-title-box {
        align-items: flex-end;
      }

      &__toolbar {
        width: 30px;
        text-align: center;

        > * {
          margin-right: 0;
        }

        .table-settings > * {
          margin-right: 0;
          margin-bottom: 6px;
        }
        &-desktop {
          display: none;
        }

        &-mobile {
          display: block;
          .table-settings > * {
            margin-right: 6px;
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
