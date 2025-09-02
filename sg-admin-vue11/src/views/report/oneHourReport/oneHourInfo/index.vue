<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="rounded-lg">
    <div class="w-100% ml-2.5 mb-2.5">
      <!-- <Button type="primary" ghost @click="emit('back')"> {{ $t('common.back') }}</Button> -->
      <BasicButton type="primary" @click="emit('back')" :iconSize="20" preIcon="RectBack:svg">
        {{ $t('common.back') }}
      </BasicButton>
    </div>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <div class="w-full">
          <cdButtonCurrency
            :btn-list="currentList"
            @change-button-currency="changeClick"
            v-model="one_currency_id"
          />
        </div>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  import { ref, defineComponent, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns } from './index.data';
  import { CurrencyButtonGroup } from '/@/components/CurrencyButtonGroup/index';
  import { getHourReportList } from '/@/api/report/index';
  import { useRouter } from 'vue-router';
  import { Button } from '/@/components/Button';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import BasicButton from '/@/components/Button/src/BasicButton.vue';

  export default defineComponent({
    name: 'OneHourInfo',
    components: {
      BasicTable,
      CurrencyButtonGroup,
      BasicButton,
      Button,
      PageWrapper,
      cdButtonCurrency,
    },
    props: {
      currency_id: String,
      count_time: String,
    },
    emits: ['back'],
    setup(props, { emit }) {
      const { currencyTreeList } = useTreeListStore();
      const router = useRouter();
      const one_currency_id = ref(null as any);
      one_currency_id.value = toRefs(props).currency_id.value;
      const { t } = useI18n();
      const currentList = ref([
        { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
        ...currencyTreeList,
      ] as any);
      const [registerTable, { reload, getColumns }] = useTable({
        api: async (params) => {
          try {
            const response = await getHourReportList(params);
            return response.d;
          } catch (error) {
            return [];
          }
        },
        bordered: true,
        showIndexColumn: false,
        columns,
        pagination: false,
        maxHeight: 600,
        beforeFetch: (params) => {
          params['count_time'] = toRefs(props).count_time.value;
          params['currency_id'] = one_currency_id.value || history.state.currency_id;
          return params;
        },
      });
      function changeClick(v) {
        one_currency_id.value = v;
        reload();
      }
      return { registerTable, changeClick, router, one_currency_id, emit, currentList };
    },
  });
</script>
<style lang="less" scoped></style>
