<template>
  <div class="table-checkbox">
    <div class="table-checkbox-body" v-if="processedTreeData?.length">
      <header class="color-[#1475e1]">
        <div
          v-for="th in processedTreeData"
          :key="th[replaceFields.key]"
          :style="{ width: th.width + 'px' }"
        >
          {{ th[replaceFields.label] }}
        </div>
      </header>
      <div class="checkbox-tree">
        <div class="checkbox-tree-content">
          <tree-node
            v-for="node in processedTreeData"
            :key="node[replaceFields.key]"
            :node="node"
            :level="0"
            :checked-keys="checkedKeys"
            :expanded-keys="expandedKeys"
            :check-strictly="checkStrictly"
            @toggle-expand="toggleExpand"
            @check-change="handleCheckChange"
            :replace-fields="replaceFields"
            class="tree-node-content-col"
            :style="{ width: node.width + 'px' }"
          />
        </div>
      </div>
    </div>
    <div class="ant-table-expanded-row-fixed" v-else>
      <div class="ant-empty ant-empty-normal">
        <div class="ant-empty-image">
          <svg class="ant-empty-img-simple" width="64" height="41" viewBox="0 0 64 41">
            <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
              <ellipse
                class="ant-empty-img-simple-ellipse"
                fill="#F5F5F5"
                cx="32"
                cy="33"
                rx="32"
                ry="7"
              />
              <g class="ant-empty-img-simple-g" fill-rule="nonzero" stroke="#D9D9D9">
                <path
                  d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
                />
                <path
                  d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                  fill="#FAFAFA"
                  class="ant-empty-img-simple-path"
                />
              </g>
            </g>
          </svg>
        </div>
        <p class="ant-empty-description">{{ $t('routes.basic.errorNoData') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, computed, watch } from 'vue';
  import TreeNode from './TreeNode.vue';
  import { cloneDeep } from 'lodash-es';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  export default {
    components: { TreeNode },
    props: {
      data: {
        type: Array,
        required: true,
        default: () => [],
      },
      defaultExpandAll: {
        type: Boolean,
        default: false,
      },
      defaultExpandedKeys: {
        type: Array,
        default: () => [],
      },
      defaultCheckedKeys: {
        type: Array,
        default: () => [],
      },
      current_platform_ids: {
        type: Array,
        default: () => [],
      },
      model_current_platform_ids: {
        type: Boolean,
        default: false,
      },
      checkStrictly: {
        type: Boolean,
        default: false,
      },
      replaceFields: {
        type: Object,
        default: () => ({
          children: 'children',
          title: 'title',
          key: 'key',
          label: 'label',
        }),
      },
    },
    emits: ['check-change', 'update:checkedKeys'],
    setup(props, { emit }) {
      // 选中的节点keys
      const checkedKeys = ref([...props.defaultCheckedKeys]);
      // 展开的节点keys
      const expandedKeys = ref(
        props.defaultExpandAll ? getAllKeys(props.data) : [...props.defaultExpandedKeys],
      );
      // 处理树形数据，添加状态标记
      const processedTreeData = computed(() => {
        const data = cloneDeep(props.data).map((p) => {
          let lableData = [
            {
              ...p,
              [props.replaceFields.title]: p[props.replaceFields.label],
            },
            ...p[props.replaceFields.children],
          ].map((p) => {
            return {
              ...p,
              label: p[props.replaceFields.title],
            };
          });
          return {
            ...p,
            show: !!p[props.replaceFields.children]?.length,
            width: useAutoLabelWidth(lableData, { moreWidth: 40 }),
          };
        });
        return processTreeDataBottomUp(data).filter((p) => p[props.replaceFields.children]?.length);
      });

      // // 处理原始数据，添加状态标记
      // function processTreeData(nodes, parentKey = null) {
      //   return nodes.map((node) => {
      //     const isExpanded = expandedKeys.value.includes(  node[props.replaceFields.key]);
      //     const isChecked = checkedKeys.value.includes(  node[props.replaceFields.key]);
      //     const isIndeterminate = isIndeterminateChecked(  node[props.replaceFields.key]);

      //     return {
      //       ...node,
      //       isExpanded: props.defaultExpandAll || isExpanded,
      //       isChecked,
      //       isIndeterminate,
      //       parentKey,
      //       children: node.children ? processTreeData(node.children,   node[props.replaceFields.key]) : [],
      //     };
      //   });
      // }

      function processTreeDataBottomUp(nodes, parentKey = null) {
        return nodes.map((node) => {
          // 先递归处理子节点

          const processedChildren = node[props.replaceFields.children]
            ? processTreeDataBottomUp(
                node[props.replaceFields.children],
                node[props.replaceFields.key],
              )
            : [];

          // 然后处理当前节点
          const isExpanded = expandedKeys.value.includes(node[props.replaceFields.key]);
          const isChecked = checkedKeys.value.includes(node[props.replaceFields.key]);
          const isIndeterminate = isIndeterminateChecked(node[props.replaceFields.key]);

          // 可以根据子节点状态调整父节点状态
          const childrenCheckedStatus =
            processedChildren.length > 0
              ? processedChildren.every((child) => child.isChecked)
              : false;

          const childrenIndeterminateStatus =
            processedChildren.length > 0
              ? processedChildren.some((child) => child.isChecked || child.isIndeterminate)
              : false;
          const getisIndeterminate =
            isChecked || childrenCheckedStatus
              ? false
              : isIndeterminate || childrenIndeterminateStatus;
          return {
            ...node,
            isExpanded: props.defaultExpandAll || isExpanded,
            isChecked: isChecked || childrenCheckedStatus,
            isIndeterminate: getisIndeterminate,
            parentKey,
            [props.replaceFields.children]: processedChildren,
          };
        });
      }

      // 获取所有节点的key
      function getAllKeys(nodes) {
        let keys = [];
        nodes.forEach((node) => {
          keys.push(node[props.replaceFields.key]);
          if (node[props.replaceFields.children]) {
            keys = [...keys, ...getAllKeys(node[props.replaceFields.children])];
          }
        });
        return keys;
      }

      // 检查是否是半选状态
      function isIndeterminateChecked(key) {
        if (props.checkStrictly) return false;

        const node = findNode(props.data, key);
        if (!node || !node[props.replaceFields.children]) return false;

        const childKeys = getAllChildKeys(node);
        const checkedChildCount = childKeys.filter((k) => checkedKeys.value.includes(k)).length;

        return checkedChildCount > 0 && checkedChildCount < childKeys.length;
      }

      // 查找节点
      function findNode(nodes, key) {
        for (const node of nodes) {
          if (node[props.replaceFields.key] === key) return node;
          if (node[props.replaceFields.children]) {
            const found = findNode(node[props.replaceFields.children], key);
            if (found) return found;
          }
        }
        return null;
      }

      // 获取所有子节点key
      function getAllChildKeys(node) {
        let keys = [];
        if (node[props.replaceFields.children]) {
          node[props.replaceFields.children].forEach((child) => {
            keys.push(child[props.replaceFields.key]);
            keys = [...keys, ...getAllChildKeys(child)];
          });
        }
        return keys;
      }

      // 切换节点展开状态
      function toggleExpand(node) {
        const index = expandedKeys.value.indexOf(node[props.replaceFields.key]);
        if (index > -1) {
          expandedKeys.value.splice(index, 1);
        } else {
          expandedKeys.value.push(node[props.replaceFields.key]);
        }
      }

      // 处理复选框变化
      function handleCheckChange(node) {
        let checked = !node.isChecked;
        if (props.checkStrictly) {
          // 严格模式，不联动父子节点
          updateCheckedKeys(node[props.replaceFields.key], checked);
        } else {
          // 非严格模式，联动父子节点
          updateCheckedWithRelation(node, checked);
        }

        emit('check-change', checkedKeys.value, node);
        emit('update:checkedKeys', checkedKeys.value);
        emit('update:tabValue', node.game_type || node.value);
        emit('handleCheckboxChange', checked, node, checkedKeys.value);
      }

      // 更新选中状态（严格模式）
      function updateCheckedKeys(key, checked) {
        // const node = findNode(props.data, key);
        // if (node[props.replaceFields.children]?.length) {
        //   return;
        // }
        const index = checkedKeys.value.indexOf(key);
        const index1 = checkedKeys.value.indexOf(key);
        if (checked && index === -1) {
          checkedKeys.value.push(key);
        } else if (!checked && index > -1) {
          checkedKeys.value.splice(index, 1);
        }
      }

      // 更新选中状态（联动父子节点）
      function updateCheckedWithRelation(node, checked) {
        // 更新当前节点
        updateCheckedKeys(node[props.replaceFields.key], checked);

        // 更新所有子节点
        if (node[props.replaceFields.children]) {
          const childKeys = getAllChildKeys(node);
          if (checked) {
            // 添加所有子节点
            childKeys.forEach((key) => {
              if (!checkedKeys.value.includes(key)) {
                checkedKeys.value.push(key);
              }
            });
          } else {
            // 移除所有子节点
            checkedKeys.value = checkedKeys.value.filter((key) => !childKeys.includes(key));
          }
        }
        // 更新所有父节点
        updateParentCheckedStatus(node);
      }

      // 更新父节点状态
      function updateParentCheckedStatus(node) {
        if (!node.parentKey) return;

        const parentNode = findNode(props.data, node.parentKey);
        if (!parentNode) return;

        const childKeys = getAllChildKeys(parentNode);
        const checkedChildCount = childKeys.filter((k) => checkedKeys.value.includes(k)).length;

        if (checkedChildCount === 0) {
          // 没有子节点选中，取消父节点选中
          updateCheckedKeys(parentNode.key, false);
        } else if (checkedChildCount === childKeys.length) {
          // 所有子节点都选中，选中父节点
          updateCheckedKeys(parentNode.key, true);
        } else {
          // 部分子节点选中，保持父节点半选状态
          const index = checkedKeys.value.indexOf(parentNode.key);
          if (index > -1) {
            checkedKeys.value.splice(index, 1);
          }
        }

        // 递归更新上级节点
        updateParentCheckedStatus(parentNode);
      }

      // 监听默认选中值变化
      watch(
        () => props.defaultCheckedKeys,
        (newVal) => {
          emit('update:checkedKeys', [...newVal]);
          checkedKeys.value = [...newVal];
        },
        { immediate: true, deep: true },
      );
      // 监听默认选中值变化
      watch(
        () => props.current_platform_ids,
        (newVal) => {
          if (props.model_current_platform_ids) {
            checkedKeys.value = [...newVal];
            return;
          }
        },
      );

      return {
        processedTreeData,
        checkedKeys,
        expandedKeys,
        toggleExpand,
        handleCheckChange,
      };
    },
  };
</script>

<style lang="less" scoped>
  .table-checkbox {
    max-width: 100%;
    overflow-y: auto;
    border: 1px solid #f0f0f0;

    .table-checkbox-body {
      header {
        display: flex;
        min-width: fit-content;
        padding-right: 8px;
        border-bottom: 1px solid #f0f0f0;
        user-select: none;

        > div {
          flex-grow: 1;
          padding: 10px 8px;
          text-align: center;

          &:not(:first-child) {
            border-left: 1px solid #f0f0f0;
          }
        }
      }

      .checkbox-tree {
        min-width: fit-content;
        max-height: 330px;
        // padding-right: 7px;
        overflow-y: auto;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
          Cantarell;
        user-select: none;

        .checkbox-tree-content {
          display: flex;

          > .checkbox-tree-node {
            flex-grow: 1;
            height: auto;
            padding: 5px 15px;

            &:not(:first-child) {
              border-left: 1px solid #f0f0f0;
            }
          }
        }
      }
    }

    .ant-table-expanded-row-fixed {
      width: 100%;
    }
  }

  :deep(.ant-checkbox) {
    & + span {
      white-space: nowrap;
    }
  }

  .ant-empty-normal {
    margin: 32px;
  }
</style>
