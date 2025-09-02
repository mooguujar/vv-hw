<template>
  <main>
    <BasicModal
      v-bind="$attrs"
      :width="800"
      :centered="true"
      :title="t('search.finance.finance_commission_choose')"
      :canFullscreen="false"
      @register="registerModal"
    >
      <template v-for="item in currentBusinessTypeList" :key="item.style">
        <div class="nav-bg w-full px-4 py-4">{{ item.name }}</div>
        <BusinessTypeCheckbox
          v-for="subItem in item.styleList"
          :key="subItem.style"
          :businessName="subItem.name"
          :businessTypeOptions="subItem.styleList"
          :resetFlag="resetFlag"
          @change-business-types-picked="changeBusinessTypesPicked(subItem, $event)"
        />
      </template>

      <template #footer>
        <a-button @click="resetPicked">{{ t('common.resetText') }}</a-button>
        <a-button type="primary" @click="confirmPickedTypes">{{ t('common.okText') }}</a-button>
      </template>
    </BasicModal>
  </main>
</template>
<script lang="ts">
  import { defineComponent, ref, Ref, onMounted, toRaw, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import BusinessTypeCheckbox from './BusinessTypeCheckBox.vue';
  import { getTransactionTypeList } from '/@/api/member';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'BusinessTypeModal',
    components: { BasicModal, BusinessTypeCheckbox },
    emits: ['register', 'comfirmBusinessTypesPicked'],
    setup(_, context) {
      const resetFlag: Ref<boolean> = ref(false);
      const businessTypesList = ref<any>([]);
      const currentBusinessTypeList = ref<any>([]);
      const type = ref('');
      const { t } = useI18n();

      // watch(type, () => {
      //   resetPicked();
      //   if (type.value) {
      //     currentBusinessTypeList.value = businessTypesList.value.filter(
      //       (item: any) => item.style === type.value,
      //     );
      //   } else {
      //     currentBusinessTypeList.value = businessTypesList.value;
      //   }
      // });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        type.value = data.type;
        setModalProps({ confirmLoading: false });
      });

      const fetchBusinessTypeList = async () => {
        let list = [
          {
            name: t('table.report.report_deposit'),
            style: '008001',
            level: '801',
            styleList: [
              {
                name: t('business.common_all'),
                style: '008001',
                level: '801',
                styleList: [],
              },
            ],
          },
          {
            name: t('search.finance.finance_withdraw'),
            style: '008002',
            level: '808',
            styleList: [
              {
                name: t('business.common_all'),
                style: '008002',
                level: '808',
                styleList: [],
              },
            ],
          },
          {
            name: t('search.finance.finance_discount'),
            style: '008003',
            level: '813',
            styleList: [
              {
                name: t('business.common_all'),
                style: '008003',
                level: '813',
                styleList: [],
              },
            ],
          },
          {
            name: t('search.finance.finance_commission'),
            style: '008004',
            level: '823',
            styleList: [
              {
                name: t('business.common_all'),
                style: '008004',
                level: '823',
                styleList: [],
              },
            ],
          },
        ];

        const updateElement = (element, data) => {
          element.style = element.id;
          element.styleList = data;
        };
        const res = await getTransactionTypeList();

        list = list.filter(({ style, styleList }) => {
          const responseData = res[style];
          if (responseData) {
            responseData.forEach((el) => updateElement(el, null));
            styleList[0].styleList = responseData;
            return true;
          }
          return false;
        });
        const translate = (list) => {
          const newList = list.map((item) => {
            item.label = item.name;
            item.value = item.style;
            item.checkedList = [];
            item.level = item.level;
            if (item.styleList) {
              item.styleList = translate(item.styleList);
            }
            return toRaw(item);
          });
          return newList;
        };
        businessTypesList.value = translate(list);
        currentBusinessTypeList.value = businessTypesList.value;
      };

      const changeBusinessTypesPicked = (data, list: string[]) => {
        data.checkedList = list;
      };

      const confirmPickedTypes = () => {
        setModalProps({ confirmLoading: true });
        toRaw(currentBusinessTypeList.value);
        const pickedList = {};
        // const getPickedList = (list) => {
        //   list.forEach((item: any) => {
        //     if (item.checkedList.length) {
        //       pickedList.push(...item.checkedList);
        //     }
        //     if (item.styleList) {
        //       getPickedList(item.styleList);
        //     }
        //   });
        // };
        const getPickedList = (list) => {
          list.forEach((item) => {
            if (item.checkedList.length) {
              if (!pickedList[item.level]) {
                pickedList[item.level] = [];
              }
              pickedList[item.level].push(...item.checkedList);
            }
            if (item.styleList) {
              getPickedList(item.styleList);
            }
          });
        };
        getPickedList(currentBusinessTypeList.value);
        context.emit('comfirmBusinessTypesPicked', pickedList);
        setModalProps({ confirmLoading: false });
        closeModal();
      };

      const resetPicked = () => {
        resetFlag.value = !resetFlag.value;
        const getPickedList = (list) => {
          list.forEach((item: any) => {
            item.checkedList = [];
            if (item.styleList) {
              getPickedList(item.styleList);
            }
          });
        };
        getPickedList(currentBusinessTypeList.value);
        context.emit('comfirmBusinessTypesPicked', {});
      };

      onMounted(() => {
        fetchBusinessTypeList();
      });

      return {
        registerModal,
        resetPicked,
        confirmPickedTypes,
        changeBusinessTypesPicked,
        resetFlag,
        businessTypesList,
        currentBusinessTypeList,
        t,
      };
    },
  });
</script>

<style lang="less" scoped>
  .nav-bg {
    // color: #fff;
    background-color: @header-bg-100;
  }
</style>
