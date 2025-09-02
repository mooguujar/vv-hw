<template>
  <BasicModal
    :title="$t('table.member.member_rebate_detail')"
    :width="1200"
    :height="652"
    :showCancelBtn="false"
    :showOkBtn="false"
    @register="registerDatails"
  >
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getPlatefromAll, getVipLevelList } from '/@/api/member/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';

  const { t } = useI18n();

  defineEmits(['register']);
  const [registerTable, { setColumns, reload }] = useTable({
    api: getData,
    showIndexColumn: false,
    bordered: true,
    pagination: false,
  });
  // 提取数字部分
  function extractNumber(vipName) {
    const match = vipName.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
  const [registerDatails] = useModalInner(() => {
    // reload();
    getData();
  });

  async function getData() {
    const getHeader = await getPlatefromAll();
    const ossUrlarrNew = getHeader.flatMap((item) =>
      item.data.map((game) => ({ ...game, game_type: item.game_type })),
    );
    //这里要加i18n的判断,显示的是接口返回的数据
    const localeStore = useLocaleStoreWithOut();
    let i18nType = localeStore.getLocale.split('_')[0] + '_name';
    if (localeStore.getLocale.split('_')[0] === 'vi') {
      i18nType = 'vn_name';
    }
    const flattenedArray = getHeader.reduce((result, item) => {
      const gameData = item.data.map((game) => game[i18nType]);
      return result.concat(gameData);
    }, []);
    const headerObject = flattenedArray.reduce(
      (acc, game, index) => {
        acc[`game${index + 1}`] = game;
        return acc;
      },
      { vipName: t('business.commin_vip_level') }, //VIP等级
    );
    //这个可以作为表头
    const filteredData = await getVipLevelList({});
    const dataContent = filteredData.filter((el) => el.is_delete == 2);
    //遍历Object.values(dataContent)，如果rebate_config为空数组，ossUrlarrNew赋值给rebate_config
    const updatedContent = dataContent.map((item: any) => {
      if (item.rebate_configs && item.rebate_configs.length === 0) {
        // 如果 rebate_config 为空数组，则赋值 ossUrlarrNew
        item.rebate_configs = ossUrlarrNew.map(({ id, game_type, vn_name, name, rate }) => ({
          id,
          game_type,
          vn_name,
          name,
          rate,
        }));
      } else {
        const rebate_configsArr = Array.isArray(item.rebate_configs)
          ? item.rebate_configs
          : JSON.parse(item.rebate_configs);
        item.rebate_configs = rebate_configsArr.flatMap((item) =>
          item.data.map((game) => ({ ...game, game_type: item.game_type })),
        );
      }
      return item;
    });
    //level变成vipName，level的值赋值给vipName，其次game1对应rebate_config里面第一个rate值，game2对应rebate_config里面第二个rate值，game3对应rebate_config里面第三个rate值，game4对应rebate_config里面第四个rate值，game5对应rebate_config里面第五个rate值，game6对应rebate_config里面第六个rate值，game7对应rebate_config里面第七个rate值
    const testData1 = updatedContent.map((detail) => {
      const vipName = 'VIP' + detail.level;
      function filterById(element) {
        return detail.rebate_configs.every((el) => el.id !== element.id);
      }
      const differentElements = ossUrlarrNew.filter(filterById);
      const newDetailList = [];
      detail.rebate_configs.push(...differentElements);
      detail.rebate_configs.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
      });
      const rates = detail.rebate_configs.map((config) => config.rate);
      const resultObject = {};
      for (let i = 1; i <= detail.rebate_configs.length; i++) {
        const key = `game${i}`;
        resultObject[key] = rates[i - 1] ? rates[i - 1] + '%' : '0%';
      }
      return {
        vipName,
        ...resultObject,
      };
    });
    // 检查数组是否按照VIP1到VIP10的顺序排列
    testData1.sort((a, b) => {
      const numA = extractNumber(a.vipName);
      const numB = extractNumber(b.vipName);
      return numA - numB;
    });
    testData1.unshift(headerObject);
    let newColumns: any = [];
    for (const key in testData1[0]) {
      newColumns.push({
        title: testData1[0][key],
        dataIndex: key,
        width: 200,
        // customRender: ({ record }) => {
        //   return record[key] ? record[key] + '%' : '-';
        // },
      });
    }
    setColumns(newColumns);
    const newArr = testData1.slice(1);
    return newArr;
  }
</script>
