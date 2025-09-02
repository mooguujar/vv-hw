<template>
  <div class="checkbox-tree-node" :class="{ 'has-children': hasChildren }">
    <div class="tree-node-content" v-if="showFirstCheck">
      <Checkbox
        :key="node[replaceFields.key]"
        v-model:checked="node.isChecked"
        :indeterminate="node.isIndeterminate"
        @click.stop="handleCheck(node)"
        v-show="!(node.show === false)"
      >
        {{ node[replaceFields.title] }}
      </Checkbox>
    </div>
    <div v-if="hasChildren && node.isExpanded" class="tree-children">
      <tree-node
        v-for="child in node[replaceFields.children]"
        :key="child[replaceFields.key]"
        :node="child"
        :level="level + 1"
        :checked-keys="checkedKeys"
        :expanded-keys="expandedKeys"
        :check-strictly="checkStrictly"
        :replace-fields="replaceFields"
        @toggle-expand="$emit('toggle-expand', $event)"
        @check-change="$emit('check-change', $event)"
      />
    </div>
  </div>
</template>

<script>
  import { computed } from 'vue';
  import { Checkbox } from 'ant-design-vue';

  export default {
    name: 'TreeNode',
    components: { Checkbox },
    props: {
      node: {
        type: Object,
        required: true,
      },
      level: {
        type: Number,
        default: 0,
      },
      checkedKeys: {
        type: Array,
        default: () => [],
      },
      expandedKeys: {
        type: Array,
        default: () => [],
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
    emits: ['toggle-expand', 'check-change'],
    setup(props, { emit }) {
      const hasChildren = computed(() => {
        return (
          props.node[props.replaceFields.children] &&
          props.node[props.replaceFields.children].length > 0
        );
      });
      const showFirstCheck = computed(
        () =>
          (props.level === 0 && props.node[props.replaceFields.children]?.length > 1) ||
          props.level > 0,
      );
      function handleToggle() {
        emit('toggle-expand', props.node);
      }

      function handleCheck() {
        emit('check-change', props.node);
      }

      function handleTitleClick() {
        emit('toggle-expand', props.node);
      }

      return {
        hasChildren,
        handleToggle,
        handleCheck,
        handleTitleClick,
        showFirstCheck,
      };
    },
  };
</script>

<style scoped>
  .checkbox-tree-node {
    position: relative;
  }

  .tree-node-content {
    display: flex;
    align-items: center;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 4px;
  }

  /* .tree-node-content:hover {
    background-color: #f5f5f5;
  } */

  .tree-switcher,
  .tree-switcher-placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 4px;
    font-size: 12px;
    color: #666;
  }

  .tree-switcher {
    cursor: pointer;
  }

  .tree-switcher:hover {
    color: #1890ff;
  }

  .tree-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 4px;
  }

  .checkbox-input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .tree-title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* .tree-children {
    margin-left: 8px;
  } */
</style>
