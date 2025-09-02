<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="site-config">
    <Card :title="t('common.platformFee')" style="width: 100%">
      <div class="flex">
        <div class="mr-12px flex flex-col">
          <Button
            v-for="kind in gameist"
            :key="kind.name"
            @click="handleSwitchGame(kind.game_type)"
            :type="kind.game_type === activeGame ? 'primary' : ''"
            :size="'large'"
            class="mb-12px"
          >
            {{ gameDictionary[kind.game_type] }}
          </Button>
        </div>
        <div class="flex-1">
          <Button
            v-for="plat in platform"
            :type="plat.id === activePlatformId ? 'primary' : 'default'"
            :key="plat.id"
            @click="handleSwitchPlat(plat.id)"
            class="mr-12px mb-12px"
            :size="'large'"
            >{{ plat.name }}
          </Button>
          <Table
            class="plateForm !max-h-660px !overflow-x-scroll"
            :dataSource="deTailData"
            :pagination="{
              pageSize: 40,
              showSizeChanger: true,
            }"
            :columns="columns"
            bordered
          />
        </div>
      </div>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { Card, Button, Table } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { columns } from './PlatformRate.data';
  import { configList } from '@/api/sys';
  import { getPlatefromAll } from '/@/api/member/index';
  import { useGameDictionary } from '/@/views/common/commonSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const platform = ref([]);
  const activeGame = ref();
  const activePlatformId = ref(null);
  const getPlateForm = ref([] as any);
  const gameist = ref([] as any);
  const { gameDictionary } = useGameDictionary();
  const handleSwitchGame = (plant_type) => {
    const data = filterBygame_type(gameist.value, plant_type);

    platform.value = data;
    //请求接口显示数据
    activeGame.value = plant_type;
    handleSwitchPlat(data[0].id);
  };
  const pid = ref({ pid: 101 });
  const deTailData = ref([]);

  function filterBygame_type(gameArray, game_type) {
    return gameArray
      .filter((game) => game.game_type === game_type)
      .map((game) => game.data)
      .flat();
  }

  const GetGamePlat = async () => {
    const data = await getPlatefromAll();
    gameist.value = data;
    handleSwitchGame('1');
  };
  const handleSwitchPlat = (_pid) => {
    activePlatformId.value = _pid;
    deTailData.value = getPlateForm.value.filter((item) => {
      return item.pid === _pid;
    });
  };
  const init = async () => {
    const data = await configList();
    getPlateForm.value = JSON.parse(data.plat_fee);
    deTailData.value = getPlateForm.value.filter((item) => {
      return item.pid === gameist.value[0].data[0].id;
    });
  };
  onMounted(() => {
    activeGame.value = '1';
    GetGamePlat();
    init();
  });
</script>

<style scoped>
  ::v-deep(.plateForm .ant-pagination-item-active) {
    border: 1px solid #7542db !important;
  }
</style>
