<template>
  <BasicModal
    @register="registerModel"
    :title="`VIP${getLevel}${$t('table.member.member_rate_config')}`"
    :width="560"
    :okText="$t('common.confirmSave')"
    :cancelText="$t('common.cancelText')"
    @ok="submitFun"
  >
    <Tabs v-model:activeKey="activeKey" @change="changeTab" class="capsule_tap capsule_tap_center">
      <TabPane v-for="item in getTitle" :key="item.game_type" :tab="gameDictionary[item.game_type]">
        <Row>
          <Col span="24" class="pt-14px input_number_item_box">
            <FormItem
              v-for="(itemChild, index) in item.data"
              :key="index"
              :label="itemChild[getLocale.split('_')[0] + '_name']"
              :labelCol="{ style: { width: labelMaxWidth + 'px' } }"
            >
              <div class="!flex">
                <div class="!w-40 !ml-2 input_number_width_full">
                  <InputNumber
                    :controls="false"
                    size="large"
                    :stringMode="true"
                    v-model:value="itemChild.rate"
                    addon-after="%"
                    :precision="2"
                    :min="0"
                    :max="100"
                    :step="0.01"
                    :placeholder="$t('table.member.member_rate_back')"
                  />
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { Tabs, TabPane, FormItem, InputNumber, Row, Col, message } from 'ant-design-vue';
  import { getPlatefromAll, updateRebateLevel } from '/@/api/member/index';
  import { useGameDictionary } from '/@/views/common/commonSetting';
  import { cloneDeep, flatten } from 'lodash-es';
  import { useLocale } from '/@/locales/useLocale';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { EditRecordRow, ActionItem } from '/@/components/Table';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { useCurrencyStore } from '/@/store/modules/currency';

  const { t } = useI18n();
  const { gameDictionary } = useGameDictionary();
  const { getLocale } = useLocale();
  const emit = defineEmits(['emitLoad', 'register']);
  const getData = ref([] as any);
  const activeKey = ref('' as string);
  const getLevel = ref('' as string);
  const childgame = ref([] as any);
  const getTitle = ref([] as any);
  //const submitData = ref([] as any);
  const currencyValue = ref(0 as any);
  const childItem = ref(null as any);
  const selectOptions = ref(0 as any);
  const selectChildOptions = ref(0 as any);
  const currencyOptions = ref([] as any);
  const getItem = ref({} as any);
  const { currencyTreeList } = useTreeListStore();
  const getgame_type = ref('' as any);
  const selectRow = ref([] as any);
  const { getCurrencyList } = useCurrencyStore();
  const currentEditKeyRef = ref('' as any);
  const totleRate = ref('' as any);
  const datagame_type = ref('' as any);
  const getGameId = ref('' as any);

  const [registerModel, { closeModal }] = useModalInner(async (data) => {
    getLevel.value = data.level;
    const getDataAll = await getPlatefromAll();
    getTitle.value = getDataAll;
    changeTab(getTitle.value[0], 0);
    getData.value = data.rebate_configs;
    activeKey.value = getTitle.value[0].game_type;
    if (data.rebate_configs && data.rebate_configs.length) {
      currencyOptions.value = currencyTreeList;
      const arr = [];
      currencyTreeList.map((item: any) => {
        return arr.push(item.id as never);
      });
      //currencyModal.value = arr.join();
      getTitle.value.forEach((g) => {
        compData(data.rebate_configs, g.game_type);
      });
    } else {
      currencyOptions.value = currencyTreeList;
    }
    const filterData = getData.value.filter((item) => {
      return item.game_type === activeKey.value;
    });
    childgame.value = cloneDeep(filterData);
  });
  const [registerModal, { openModal }] = useModal();
  const dataSource = ref([
    {
      //currency_id: '',
      rate: '0',
      oprate: 'admin',
      updata: '2023-08-08',
    },
  ] as any);
  const labelMaxWidth = ref(100);

  function changeTab(values, index) {
    getgame_type.value = values.game_type;
    childItem.value = values.data;
    selectOptions.value = index;
    const filteredArr = getData.value.filter(
      ({ game_type }) => game_type === values.game_type?.toString(),
    );
    childgame.value = cloneDeep(filteredArr);
  }
  async function handleChild(item, index) {
    //reload();
    ininDate(getTitle.value);
    if (!item) return false;
    //获取场馆ID
    getGameId.value = item.id;
    datagame_type.value = item.game_type;
    if (currencyValue.value === 1) {
      const findData = getData.value
        .filter((t) => {
          return t.game_type === item.game_type;
        })[0]
        .data.filter((d) => {
          return d.id === item.id;
        });
      dataSource.value = findData.filter((t) => t.id === item.id);
    }
    selectChildOptions.value = index;
    getItem.value = item;
  }

  function handleEdit(record: EditRecordRow) {
    currentEditKeyRef.value = record.key;
    record.onEdit?.(true);
  }
  async function handleSave(record: EditRecordRow, index): ActionItem[] {
    if (
      Number(cloneDeep(record?.editValueRefs?.rate)) > 100 ||
      Number(cloneDeep(record?.editValueRefs?.rate)) < 0
    ) {
      return message.error(t('common.gt0lt100'));
    }
    if (!record.game_type) {
      totleRate.value = cloneDeep(record?.editValueRefs?.rate);
    }
    const getData = ininDate(getTitle.value);
    const data = getData.filter((item) => item.game_type === record.game_type);
    record.onEdit?.(false, true);
  }
  function handleCancel(record: EditRecordRow, index) {
    record.onEdit?.(false);
  }
  async function submitFun(element) {
    const r = flatten(getTitle.value.map((g) => g.data));
    const config = convertToSubmitFormat(r);
    const { status, data } = await updateRebateLevel({
      rebate: JSON.stringify(config), // JSON.stringify(convertToSubmitFormat(getData.value)),
      level: getLevel.value,
    });
    if (status) {
      message.success(data);
      closeModal();
      emit('emitLoad');
    }
  }
  // //把这个二维数组转换成一维数组
  function convertToChageRealiy(realities) {
    const chageRealiy: any = [];
    cloneDeep(realities).forEach((item) => {
      cloneDeep(item.data).forEach((dataItem) => {
        const { id, game_type, rate, en_name, pt_name, th_name, vn_name, zh_name, currency_id } =
          dataItem;
        const name = dataItem.name; // 如果需要其他语言的名称，请根据实际情况调整
        //const currency_id = currencyModal.value;
        chageRealiy.push({
          id,
          game_type,
          name,
          currency_id,
          rate: cloneDeep(rate),
          en_name,
          pt_name,
          th_name,
          vn_name,
          zh_name,
        });
      });
    });

    return chageRealiy;
  }

  // function handleBatchEdit(value) {
  //   openModal(true, value);
  // }

  function convertToSubmitFormat(dataSet) {
    const result: any = [];

    // 使用 reduce 函数处理 dataSet 数组
    result.push(
      ...dataSet.reduce((acc: any, item: any) => {
        const existingType: any = acc.find((entry: any) => entry.game_type === item.game_type);
        //var myString = item?.currency_id;
        //currencyValue.value
        // 如果已经有相同 game_type 的 entry，则将当前数据项添加到该 entry 的 data 数组中
        if (existingType) {
          existingType.data.push({
            id: item.id,
            rate: cloneDeep(item.rate),
          });
        } else {
          // 否则，创建新的 entry
          acc.push({
            game_type: item.game_type,
            data: [
              {
                id: item.id,
                rate: cloneDeep(item.rate),
              },
            ],
          });
        }
        return acc;
      }, []),
    );
    return result;
  }
  function compData(rebate_config, tab) {
    rebate_config
      .filter((r) => r.game_type === tab)
      .forEach((r) => {
        const temp = getTitle.value.filter((g) => g.game_type === tab)[0];
        if (temp && temp.data && temp.data.length) {
          temp.data.forEach((t) => {
            t.rate = t.rate ? t.rate : '0';
            if (r.data && r.data.length) {
              r.data.forEach((rateItem) => {
                rateItem.rate = rateItem.rate ? rateItem.rate : '0';
                if (t.id === rateItem.id) {
                  if (rateItem.currency_id) {
                    t['currency_id'] = rateItem.currency_id
                      ? rateItem.currency_id.split(',')
                      : null;
                  }
                  t.rate = rateItem.rate;
                }
              });
            }
          });
        }
      });
  }
  function ininDate(list) {
    const config = list.map((item) => {
      return {
        game_type: item.game_type,
        data: item.data.flatMap((gameItem) => {
          return getCurrencyList.map((currencyItem) => {
            return {
              ...gameItem,
              currency_id: currencyItem.id, // 使用 currencyItem.curryid
              currency_name: currencyItem.label,
              rate: String(totleRate.value) || '0', // 如果原始数据中有 rate 值，则使用，否则为空字符串
            };
          });
        }),
      };
    });

    return config;
  }
  // 使用 reduce 方法进行过滤
  function uniqueFun(list) {
    const uniqueArray = list.reduce((acc, current) => {
      // 检查是否已经存在相同 id 的对象
      const existingItem = acc.find((item) => item.id === current.id);

      // 如果不存在，则添加到结果数组中
      if (!existingItem) {
        acc.push(current);
      }

      return acc;
    }, []);
    return uniqueArray;
  }
  onMounted(() => {
    if (currencyValue.value === 0) {
      handleChild(null, 0);
    }
  });
</script>

<style scoped lang="less">
  .widthScoll {
    //width: 800px;
    //height: 50px;
    .itemScoll {
      height: 60px;
    }
  }

  .input_number_width_full {
    width: 100% !important;

    ::v-deep(.ant-input-number-input) {
      height: 40px !important;
    }
  }

  .input_number_item_box {
    ::v-deep(.ant-form-item) {
      margin-bottom: 17px !important;
    }

    ::v-deep(.ant-form-item-label) {
      label {
        margin-top: 5px;
        line-height: 40px;
      }
    }
  }
</style>
