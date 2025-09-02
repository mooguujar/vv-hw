<template>
  <div class="roleModalClass venuesClassZoom" ref="main">
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      :title="title"
      @ok="handleSubmit"
      width="1200px"
      :okText="t('business.banner_confrim')"
      :showCancelBtn="false"
      :getContainer="() => $refs.main"
    >
      <!-- 顶级标签 -->
      <div class="pt-4 pb-1">
        <CheckboxGroup v-model:value="firstChildCheckboxes" class="!flex">
          <div
            class="border rootManageButton border-gray-200 !pl-2 !pr-2 !py-2 !mb-2 w-40 ml-2 first:ml-0 cursor-pointer"
            :class="{
              active: item.id === firstSelectId,
            }"
            v-for="(item, index) in firsttreeList"
            :value="item.id"
            :key="item.id"
            @click="clickSelectId('first', item)"
          >
            <Checkbox
              :value="item.id"
              @change="handleCheckboxChange(item, 'first')"
              @click.stop="() => {}"
              :disabled="item.flag == 3 ? true : false"
            />
            {{ item?.name }}
          </div>
        </CheckboxGroup>
      </div>
      <!-- 一层元素 -->
      <div class="flex boder-t">
        <div class="w-48 pr-3 boder-r">
          <div class="p-2 !pl-0 !pr-0">
            <CheckboxGroup v-model:value="secondchildList.selectIdList">
              <template v-for="(item, index) in secondchildList.children" :key="item.id">
                <div
                  class="border rootManageButton hengrow border-gray-200 !pl-2 !pr-2 !py-2 !mb-3 first:mt-1 w-38 ml-0 cursor-pointer"
                  :class="{
                    active: item.id === secondSelectId,
                    oneself_role: item.flag == 6,
                  }"
                  v-if="item.flag != 3"
                  :value="item.id"
                  @click="item.flag != 6 && clickSelectId('second', item)"
                >
                  <Checkbox
                    :value="item.id"
                    @change="handleCheckboxChange(item, 'second')"
                    @click.stop="() => {}"
                    :disabled="item.flag == 3 ? true : false"
                  />
                  {{ item?.name }}

                  <tooltip placement="right">
                    <template #title>
                      <div
                        >{{ t('table.system.system_include') }}
                        <span style="color: #ff9800">{{
                          t('table.report.report_online_member')
                        }}</span>
                        {{ t('table.system.authority') }}</div
                      ></template
                    >
                    <InfoCircleFilled class="pl-2" v-if="item?.name == '会员列表'" />
                  </tooltip>
                </div>
              </template>
            </CheckboxGroup>
          </div>
        </div>

        <!-- 二层元素 -->
        <div
          class="w-50 boder-r"
          v-if="threechildList.children && threechildList.children.length > 0"
        >
          <div class="p-2 pl-0 pr-3">
            <CheckboxGroup v-model:value="threechildList.selectIdList">
              <template v-for="(item, index) in threechildList.children" :key="item.id">
                <div
                  class="border rootManageButton hengrow border-gray-200 !pl-2 !pr-2 !py-2 !mb-2 w-38 ml-2 cursor-pointer"
                  :class="{
                    active: item.id === threeSelectId,
                    oneself_role: item.flag == 6,
                  }"
                  :value="item.id"
                  @click="item.flag != 6 && clickSelectId('three', item)"
                >
                  <Checkbox
                    :value="item.id"
                    @change="handleCheckboxChange(item, 'three')"
                    @click.stop="() => {}"
                    :disabled="item.flag == 3 ? true : false"
                  />
                  {{ item?.name }}
                </div>
              </template>
            </CheckboxGroup>
          </div>
        </div>

        <!-- 三层元素 -->
        <div class="thirdChildBox">
          <div v-if="fourchildList.children && fourchildList.children.length > 0">
            <CheckboxGroup v-model:value="fourchildList.selectIdList" class="w-100%">
              <!-- 横列的标签 -->
              <div
                class="clearfix pt-3 pb-3 pl-2 borderBottom_"
                v-if="fourchildList.children.filter((item) => item?.flag == 5).length"
              >
                <template v-for="(item, index) in fourchildList.children">
                  <div
                    v-if="item?.flag == 5 && !item.children?.length"
                    class="relative float-left top_label child mb-10px"
                    style="float: left"
                  >
                    <Checkbox
                      class="border rootManageButton border-gray-200 !pl-2 !py-2 w-50"
                      :value="item.id"
                      :key="item.id"
                      @change="
                        handleCheckboxChange(item, 'four'),
                          handleCheckboxChange_active($event.target.checked, item, fourchildList)
                      "
                      @click.stop="() => {}"
                      :class="{
                        '!ml-2': index === 0,
                        active: item.id == '40201',
                        oneself_role: item.id != '40201',
                      }"
                    />
                    <div class="absolute left-0 top-9px !text-center w-100%">
                      {{ item?.name }}
                      <tooltip placement="right">
                        <template #title>
                          <div
                            >{{ t('table.system.system_include') }}
                            <span style="color: #ff9800">{{
                              t('111table.discountActivity.discount_close_activity')
                            }}</span>
                            {{ t('table.system.authority') }}</div
                          ></template
                        >
                        <InfoCircleFilled class="pl-2" v-if="item?.id == '40201'" />
                      </tooltip>
                    </div>
                  </div>
                  <!--  有子按钮的横行标签 -->
                  <div
                    v-if="item.children.length > 0 && item?.flag == 5"
                    class="relative float-left top_label child"
                    @click="tapRowLabel(null, index)"
                    style="float: left"
                  >
                    <Checkbox
                      class="border rootManageButton border-gray-200 !pl-2 !py-2 w-50"
                      :value="item.id"
                      :key="item.id"
                      @change="
                        handleCheckboxChange(item, 'four'),
                          tapRowLabel(
                            $event.target.checked,
                            index,
                            fourchildList.children[rowLabelIndax],
                          )
                      "
                      @click.stop="() => {}"
                      :class="{
                        '!ml-2': index === 0,
                        active: index == rowLabelIndax,
                        oneself_role: false,
                      }"
                    />
                    <div class="absolute left-0 top-9px !text-center w-100%">
                      {{ item?.name }}
                    </div>
                  </div>
                </template>
              </div>
              <!-- 横向标签里的子按钮 -->
              <CheckboxGroup v-model:value="fourchildList.children[rowLabelIndax].selectIdList">
                <template
                  v-for="(item, index) in fourchildList.children[rowLabelIndax].children"
                  :key="index"
                >
                  <div
                    v-if="
                      fourchildList.children[rowLabelIndax].children &&
                      fourchildList.children[rowLabelIndax].children.length > 0 &&
                      item?.flag != 5
                    "
                    v-show="item.flag != 2 && item.flag != 3"
                    style="float: left"
                    class="pt-2 pl-2 child"
                  >
                    <Checkbox
                      class="border rootManageButton border-gray-200 !pl-2 !py-2 !mb-2 w-50"
                      :value="item.id"
                      :key="item.id"
                      :disabled="item.flag == 3 ? true : false"
                      @change="
                        handleCheckboxChange(item, 'four'),
                          handleCheckboxChange_active($event.target.checked, item, fourchildList)
                      "
                      @click.stop="() => {}"
                      :class="{
                        '!ml-2': index === 0,
                      }"
                    >
                      <div class="truncate w-36">
                        {{ item?.name }}
                        <tooltip placement="right">
                          <template #title>
                            <div
                              >{{ t('table.system.system_include') }}
                              <span style="color: #ff9800">{{
                                t('table.report.report_betting_sport')
                              }}</span>
                              {{ t('table.system.authority') }}</div
                            ></template
                          >
                          <InfoCircleFilled class="pl-2" v-if="item?.id == '50201'" />
                        </tooltip>
                      </div>
                    </Checkbox>
                  </div>
                </template>
              </CheckboxGroup>
              <!-- 其他子按钮 -->
              <template v-for="(item, index) in fourchildList.children">
                <div
                  v-if="
                    fourchildList.children && fourchildList.children.length > 0 && item?.flag != 5
                  "
                  v-show="
                    item.id != '41101' &&
                    item.id != '41105' &&
                    item.id != '41103' &&
                    item.flag != 2 &&
                    item.flag != 3 &&
                    controlIfshow(item, fourchildList.selectIdList)
                  "
                  style="float: left"
                  class="pl-2 mt-3 child"
                >
                  <!-- 文字超出的按钮 -->
                  <template v-if="item?.name.length > 10">
                    <Tooltip placement="topLeft" :title="item?.name">
                      <Checkbox
                        class="border rootManageButton border-gray-200 !pl-2 !py-2 !mb-2 w-50"
                        :value="item.id"
                        :key="item.id"
                        :disabled="item.flag == 3 ? true : false"
                        @change="
                          handleCheckboxChange(item, 'four'),
                            handleCheckboxChange_active($event.target.checked, item, fourchildList)
                        "
                        @click.stop="() => {}"
                        :class="{
                          '!ml-2': index === 0,
                        }"
                      >
                        <div class="truncate w-36">{{ item?.name }}</div>
                      </Checkbox>
                    </Tooltip>
                  </template>

                  <!-- 正常的按钮 -->
                  <!-- 普通三级 -->
                  <template v-else>
                    <Checkbox
                      class="border rootManageButton border-gray-200 !pl-2 !py-2 w-50"
                      :value="item.id"
                      :key="item.id"
                      :disabled="item.flag == 3 ? true : false"
                      @change="
                        handleCheckboxChange(item, 'four'),
                          handleCheckboxChange_active($event.target.checked, item, fourchildList)
                      "
                      @click.stop="() => {}"
                      :class="{
                        '!ml-2': index === 0,
                      }"
                    >
                      <div class="truncate w-36">
                        {{ editNameIdList.includes(item.id) ? matchName(item.id) : item?.name }}
                        <tooltip placement="right">
                          <template #title>
                            <div
                              >{{ t('table.system.system_include') }}
                              <span style="color: #ff9800">{{
                                t('table.report.report_betting_sport')
                              }}</span>
                              {{ t('table.system.authority') }}</div
                            ></template
                          >
                          <InfoCircleFilled class="pl-2" v-if="item?.id == '50201'" />
                        </tooltip>
                      </div>
                    </Checkbox>
                  </template>
                </div>
              </template>
            </CheckboxGroup>
          </div>
          <div v-else class="flex items-center justify-center h-full">
            <Empty />
          </div>
        </div>
      </div>
    </BasicModal>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { InfoCircleFilled } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Checkbox, CheckboxGroup, Empty, Tooltip } from 'ant-design-vue';
  import { updateGroup } from '/@/api/sys/rootManage';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';

  const { t } = useI18n();
  const permissionStoreWithOut = usePermissionStoreWithOut();
  const { changePrivGroup } = permissionStoreWithOut;
  const emit = defineEmits(['register', 'success']);

  const title = ref('');
  const recordData: any = ref({});
  const firsttreeList = ref([]);
  const secondchildList = ref({});
  const threechildList = ref({});
  const fourchildList = ref({});

  const firstChildCheckboxes = ref([]);

  const firstSelectId = ref();
  const secondSelectId = ref();
  const threeSelectId = ref();
  const defaultIdList = ref([]);

  const editNameIdList = ref(['41102', '41104', '41107']);
  const matchName = (id) => {
    let name = '';
    switch (id) {
      case '41102':
        name = t('common.add_code');
        break;
      case '41104':
        name = `${t('business.common_off')}/${t('common.delText')}`;
        break;
      case '41107':
        name = t('common.export');
        break;
    }
    return name;
  };

  const rowLabelIndax = ref(0);
  // 当当前按钮被选中时，子集全部被选中
  const controlIfshow = (item, selectIdList) => {
    if (['10105', '10106', '10107'].includes(item.id)) {
      if (!selectIdList.includes('10109')) {
        return false;
      }
    }
    if (['10113'].includes(item.id)) {
      if (!selectIdList.includes('10133')) {
        return false;
      }
    }
    if (
      [
        '10406',
        '10407',
        '10408',
        '10409',
        '10410',
        '10411',
        '10412',
        '10413',
        '10414',
        '10415',
        '10416',
        '10417',
      ].includes(item.id)
    ) {
      if (!selectIdList.includes('10404')) {
        return false;
      }
    }
    return true;
  };

  // 当当前按钮被选中时，子集全部被选中
  const tapRowLabel = (e, index, item?) => {
    setTimeout(() => {
      rowLabelIndax.value = index;
      if (item) {
        if (e) {
          return;
        } else {
          fourchildList.value.children[rowLabelIndax.value].selectIdList = [];
        }
      }
    }, 111);
  };
  function buildTree(data, rootPid) {
    const tree: any = [];
    const map: any = {};

    data.forEach((item) => {
      if (item.name.includes('-A')) {
        item.name = item.name.split('-A')[0];
      }
      map[item.id] = { ...item, children: [], selectIdList: [] };
    });
    data.forEach((item: any) => {
      if (item.pid === rootPid) {
        tree.push(map[item.id]);
      } else {
        if (item.id == '10200' || item.pid == '10200') {
          map['10100'].children.push(map[item.id]);
          if (item.state === 2) {
            map['10100'].selectIdList.push(item.id);
          }
        } else if (map[item.pid]) {
          map[item.pid].children.push(map[item.id]);
          if (item.state === 2) {
            map[item.pid].selectIdList.push(item.id);
          }
        }
      }
    });
    return tree;
  }

  // 获取children数据
  function filterState(data) {
    const result = [];
    data.forEach((item) => {
      if (item.state == 2) result.push(item.id);
    });

    return result;
  }

  // 按钮的 flag 1 显示 2 隐藏 3 置灰 4 老接口废弃的隐藏 5 标签按钮 6 不可点击按钮
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    const { record, source, selectId } = data;
    defaultIdList.value = selectId;
    const permission = JSON.parse(record.permission);

    // flag = 4 前端不显示
    const filteredSource = source.filter((el) => el.flag !== 4);
    // 处理数据
    if (permission.length > 0) {
      const permissionSet = new Set(permission);
      filteredSource.forEach((el) => {
        if (permissionSet.has(el.id)) {
          el.state = 2;
        }
      });
    } else {
    }
    // flag = 3 默认选中
    filteredSource.forEach((el) => {
      if (el.flag == 3) el.state = 2;
    });
    // 设置标题
    title.value = `${t('table.system.system_edit_permissions')}( ${record.name} )`;
    recordData.value = record;
    // 处理数据源
    firsttreeList.value = buildTree(filteredSource, '0');
    firstSelectId.value =
      firsttreeList.value[0].flag == 6 ? firsttreeList.value[1].id : firsttreeList.value[0].id;
    firstChildCheckboxes.value = filterState(firsttreeList.value);

    watchTabPositionChange(firstSelectId.value);
  });

  function watchTabPositionChange(firstSelectId) {
    secondchildList.value = firsttreeList.value.find((obj: any) => obj.id === firstSelectId);
    secondSelectId.value =
      secondchildList.value.children[0].flag == 6
        ? secondchildList.value.children[1].id
        : secondchildList.value.children[0].id;
    handleSecondSelectChange(secondSelectId.value);
  }

  function handleSecondSelectChange(secondSelectId) {
    const queryDate = secondchildList.value.children.find((obj) => obj.id === secondSelectId);
    if (queryDate.children.length > 0 && queryDate.children[0].children.length > 0) {
      threechildList.value = queryDate;
      threeSelectId.value = threechildList.value.children[0].id;
      fourchildList.value = threechildList.value.children.find(
        (obj) => obj.id === threeSelectId.value,
      );
    } else {
      threechildList.value = {};
      fourchildList.value = queryDate;
    }
  }

  function clickSelectId(type, data) {
    if (type == 'first') {
      firstSelectId.value = data.id;
      watchTabPositionChange(firstSelectId.value);
    }
    if (type == 'second') {
      secondSelectId.value = data.id;
      handleSecondSelectChange(data.id);
    }
    if (type == 'three') {
      threeSelectId.value = data.id;
      fourchildList.value = threechildList.value.children.find((obj: any) => obj.id === data.id);
    }
  }

  function processChildItems(item, selectIdList) {
    item.selectIdList = selectIdList;

    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        if (child.flag == 2) {
          item.selectIdList.push(child.id);
        }
        processChildItems(child, child.selectIdList);
      });
    }
  }

  function processFlaggedItems(item, selectIdList) {
    item.selectIdList = selectIdList;

    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        if (child.flag === 3) {
          item.selectIdList.push(child.id);
        }
        if (child.flag === 2) {
          item.selectIdList.push(child.id);
        }
        processFlaggedItems(child, []);
      });
    }
  }
  //处理新加的横向标签勾选父级 和 子级联动的问题
  const handleCheckboxChange_active = (e, { id, pid, flag }, list) => {
    setTimeout(() => {
      if (id == '10109') {
        fourchildList.value.selectIdList = fourchildList.value.selectIdList.filter(
          (item) => !['10105', '10106', '10107'].includes(item),
        );
      } else if (id == '10133') {
        fourchildList.value.selectIdList = fourchildList.value.selectIdList.filter(
          (item) => !['10113'].includes(item),
        );
      } else if (id == '10404') {
        if (!list.selectIdList.includes('10404')) {
          list.selectIdList = list.selectIdList.filter(
            (item) =>
              ![
                '10406',
                '10407',
                '10408',
                '10409',
                '10410',
                '10411',
                '10412',
                '10413',
                '10414',
                '10415',
                '10416',
                '10417',
              ].includes(item),
          );
        }
      } else if (!e && id == '40201') {
        list.children
          .filter((item) => item.flag != 5 && item.flag != 3)
          .forEach((element) => {
            // element.state = 2;
            list.selectIdList = list.selectIdList.filter((item_s) => item_s != element.id);
          });
      } else if (pid == '40200') {
        if (e && flag != 5) {
          if (!list.selectIdList.includes('40201')) {
            list.selectIdList.push('40201');
          }
        }
      } else if (pid == '10400') {
        if (e && flag != 5) {
          if (!list.selectIdList.includes('10401')) {
            list.selectIdList.push('10401');
          }
          if (!list.selectIdList.includes('10403')) {
            list.selectIdList.push('10403');
          }
        }
      } else {
        if (e && flag != 5) {
          if (!list.selectIdList.includes(pid)) {
            list.selectIdList.push(pid);
            handleCheckboxChange(list.children.filter((item) => item.id == pid)[0], 'four');
          }
        }
      }
    }, 66);
  };

  async function handleCheckboxChange(item: any, type: any) {
    setTimeout(() => {
      const processFunction = (flagged: boolean) => {
        if (flagged) {
          processChildItems(item, []);
        } else {
          processFlaggedItems(item, []);
        }
      };

      switch (type) {
        case 'first':
          if (firstChildCheckboxes.value.includes(item.id)) {
            processChildItems(item, []);
          } else {
            processFlaggedItems(item, []);
          }
          break;

        case 'second':
          const secondList = secondchildList.value.selectIdList;
          if (secondList.includes(item.id)) {
            if (!firstChildCheckboxes.value.includes(item.pid)) {
              firstChildCheckboxes.value.push(item.pid);
            }
            processChildItems(item, []);
            if (item.id == '40200') {
              if (!item.selectIdList.includes('40201')) {
                item.selectIdList.push('40201');
              }
            }
          } else {
            processFunction(false);
          }
          break;

        case 'three':
          const thirdList = threechildList.value.selectIdList;
          if (thirdList.includes(item.id)) {
            if (!secondchildList.value.selectIdList.includes(item.pid)) {
              secondchildList.value.selectIdList.push(item.pid);
            }
            if (!firstChildCheckboxes.value.includes(secondchildList.value.id)) {
              firstChildCheckboxes.value.push(secondchildList.value.id);
            }
            processChildItems(item, []);
          } else {
            processFunction(false);
          }
          break;

        case 'four':
          let fourthList = fourchildList.value.selectIdList;
          if (fourthList.includes(item?.id)) {
            fourchildList.value.children.forEach((child) => {
              if (child.flag == 2) {
                fourthList.push(child.id);
              }
            });
            if (item.id == '10109') {
              if (!fourthList.includes('10203')) {
                fourchildList.value.selectIdList.push('10203');
              }
            }
            if (threechildList.value.hasOwnProperty('children')) {
              if (!threechildList.value.selectIdList.includes(item.pid)) {
                threechildList.value.selectIdList.push(item.pid);
              }
              if (!firstChildCheckboxes.value.includes(secondchildList.value.id)) {
                firstChildCheckboxes.value.push(secondchildList.value.id);
              }
              if (!secondchildList.value.selectIdList.includes(threechildList.value.id)) {
                secondchildList.value.selectIdList.push(threechildList.value.id);
              }
            } else {
              if (!secondchildList.value.selectIdList.includes(item.pid)) {
                secondchildList.value.selectIdList.push(item.pid);
              }
              if (!firstChildCheckboxes.value.includes(secondchildList.value.id)) {
                firstChildCheckboxes.value.push(secondchildList.value.id);
              }
            }
          } else {
            if (item?.id == '10109') {
              if (fourthList.includes('10203')) {
                fourchildList.value.selectIdList = fourchildList.value.selectIdList.filter(
                  (item_s) => item_s != '10203',
                );
              }
            }
          }
          break;

        default:
      }
    });
  }
  function mergeSelectIdList(tree) {
    let mergedList = [];
    function traverse(tree) {
      for (let item of tree) {
        mergedList.push(...item.selectIdList);
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      }
    }

    traverse(tree);

    return mergedList;
  }

  async function handleSubmit() {
    try {
      setModalProps({ confirmLoading: true });
      const mergedPermission = [
        ...mergeSelectIdList(firsttreeList.value),
        ...firstChildCheckboxes.value,
        ...defaultIdList.value,
      ];
      const uniquePermissions = [...new Set(mergedPermission)];

      const { name, noted, gid } = recordData.value;
      await updateGroup({
        gid: gid, //gid
        permission: JSON.stringify(uniquePermissions), //权限id
      });
      const userStore = useUserStore();
      closeModal();
      emit('success');
      if (userStore.getCurrentSite['group_id'] == gid) {
        location.reload();
      }
    } finally {
      changePrivGroup();
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<style lang="scss" scoped>
  .active {
    position: relative;
    border: none;
    background-color: #e1effe;
  }

  .active::before {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px 5px 0;
    border-style: solid;
    border-color: #e1effe transparent transparent !important;
  }

  .active.hengrow::before {
    content: '';
    position: absolute;
    top: 50%;
    right: -5px;
    bottom: unset;
    left: unset;
    transform: translateX(0);
    transform: translateY(-50%);
    border-width: 5px 0 5px 5px;
    border-style: solid;
    border-color: transparent transparent transparent #e1effe !important;
  }

  .boder {
    border: 1px solid #e1effe;
    border-radius: 4px;
  }

  .boder-r {
    border-right: 1px solid #e1effe;
    border-bottom: 1px solid #e1effe;
  }

  .thirdChildBox {
    width: 100%;
    border-bottom: 1px solid #e1effe;

    //border: 1px solid red;
    .ant-checkbox-group {
      .child {
        width: 186px;
        margin-right: 12px;

        label {
          width: 186px;
          margin-left: 0 !important;
        }
      }
    }
  }

  ::v-deep(.ant-ribbon-wrapper) {
    position: absolute !important;
    margin-left: 190px !important;
  }

  .oneself_role {
    border: none;
    background: #eee !important;
  }

  .rootManageButton {
    border-radius: 4.5px;
    text-align: center;

    .ant-checkbox-wrapper {
      float: left;
    }
  }

  .roleModalClass {
    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      padding-top: 0 !important;
    }
  }
</style>
