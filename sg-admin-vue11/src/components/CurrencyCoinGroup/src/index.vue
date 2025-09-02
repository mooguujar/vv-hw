<script lang="ts" setup>
  import { reactive } from 'vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import APE from '/@/assets/svg/currency/APE.svg';
  import ARS from '/@/assets/svg/currency/ARS.svg';
  import BCH from '/@/assets/svg/currency/BCH.svg';
  import BNB from '/@/assets/svg/currency/BNB.svg';
  import BRL from '/@/assets/svg/currency/BRL.svg';
  import BTC from '/@/assets/svg/currency/BTC.svg';
  import BUSD from '/@/assets/svg/currency/BUSD.svg';
  import CAD from '/@/assets/svg/currency/CAD.svg';
  import CLP from '/@/assets/svg/currency/CLP.svg';
  import CNY from '/@/assets/svg/currency/CNY.svg';
  import CRO from '/@/assets/svg/currency/CRO.svg';
  import DAI from '/@/assets/svg/currency/DAI.svg';
  import DOGE from '/@/assets/svg/currency/DOGE.svg';
  import EOS from '/@/assets/svg/currency/EOS.svg';
  import ETH from '/@/assets/svg/currency/ETH.svg';
  import EUR from '/@/assets/svg/currency/EUR.svg';
  import INR from '/@/assets/svg/currency/INR.svg';
  import JPY from '/@/assets/svg/currency/JPY.svg';
  import LINK from '/@/assets/svg/currency/LINK.svg';
  import LTC from '/@/assets/svg/currency/LTC.svg';
  import MATIC from '/@/assets/svg/currency/MATIC.svg';
  import MXN from '/@/assets/svg/currency/MXN.svg';
  import PEN from '/@/assets/svg/currency/PEN.svg';
  import SAND from '/@/assets/svg/currency/SAND.svg';
  import SHIB from '/@/assets/svg/currency/SHIB.svg';
  import THB from '/@/assets/svg/currency/THB.svg';
  import TRX from '/@/assets/svg/currency/TRX.svg';
  import UNI from '/@/assets/svg/currency/UNI.svg';
  import USDC from '/@/assets/svg/currency/USDC.svg';
  import USDT from '/@/assets/svg/currency/USDT.svg';
  import VND from '/@/assets/svg/currency/VND.svg';
  import XRP from '/@/assets/svg/currency/XRP.svg';
  import KRW from '/@/assets/svg/currency/KRW.svg';
  import IDR from '/@/assets/svg/currency/IDR.svg';
  import PHP from '/@/assets/svg/currency/PHP.svg';

  const CurrencyConfiguration = reactive({
    '701': {
      unit: '',
      label: 'CNY',
      name: CNY,
      img: '/@/assets/currency/CNY.svg',
      defaultContract: '',
    },
    '702': {
      unit: '',
      label: 'BRL',
      name: BRL,
      img: '/@/assets/currency/BRL.svg',
      defaultContract: '',
    },
    '703': {
      unit: '',
      label: 'INR',
      name: INR,
      img: '/@/assets/currency/INR.svg',
      defaultContract: '',
    },
    '704': {
      unit: '',
      label: 'VND',
      name: VND,
      img: '/@/assets/currency/VND.svg',
      defaultContract: '',
    },
    '705': {
      unit: '',
      label: 'THB',
      name: THB,
      img: '/@/assets/currency/THB.svg',
      defaultContract: '',
    },
    '706': {
      unit: '₮',
      label: 'USDT',
      name: USDT,
      img: '/@/assets/currency/USDT.svg',
      defaultContract: '1802',
    },
    '707': {
      unit: '₿',
      label: 'BTC',
      name: BTC,
      img: '/@/assets/currency/BTC.svg',
      defaultContract: '1805',
    },
    '708': {
      unit: 'Ξ',
      label: 'ETH',
      name: ETH,
      img: '/@/assets/currency/ETC.svg',
      defaultContract: '1807',
    },
    '709': {
      unit: '',
      label: 'BNB',
      name: BNB,
      img: '/@/assets/currency/BNB.svg',
      defaultContract: '1807',
    },
    '710': {
      unit: '',
      label: 'EUR',
      name: EUR,
      img: '/@/assets/currency/EUR.svg',
      defaultContract: '',
    },
    '711': {
      unit: '',
      label: 'JPY',
      name: JPY,
      img: '/@/assets/currency/JPY.svg',
      defaultContract: '',
    },
    '712': {
      unit: '',
      label: 'CAD',
      name: CAD,
      img: '/@/assets/currency/CAD.svg',
      defaultContract: '',
    },
    '713': {
      unit: '',
      label: 'ARS',
      name: ARS,
      img: '/@/assets/currency/ARS.svg',
      defaultContract: '',
    },
    '714': {
      unit: '',
      label: 'CLP',
      name: CLP,
      img: '/@/assets/currency/CLP.svg',
      defaultContract: '',
    },
    '715': {
      unit: '',
      label: 'PEN',
      name: PEN,
      img: '/@/assets/currency/PEN.svg',
      defaultContract: '',
    },
    '716': {
      unit: '',
      label: 'MXN',
      name: MXN,
      img: '/@/assets/currency/MXN.svg',
      defaultContract: '',
    },
    '717': {
      unit: '',
      label: 'LTC',
      name: LTC,
      img: '/@/assets/currency/LTC.svg',
      defaultContract: '',
    },
    '718': {
      unit: '',
      label: 'DOGE',
      name: DOGE,
      img: '/@/assets/currency/DOGE.svg',
      defaultContract: '',
    },
    '719': {
      unit: '',
      label: 'BCH',
      name: BCH,
      img: '/@/assets/currency/BCH.svg',
      defaultContract: '',
    },
    '720': {
      unit: '',
      label: 'XRP',
      name: XRP,
      img: '/@/assets/currency/XRP.svg',
      defaultContract: '',
    },
    '721': {
      unit: '',
      label: 'EOS',
      name: EOS,
      img: '/@/assets/currency/EOS.svg',
      defaultContract: '',
    },
    '722': {
      unit: '',
      label: 'TRX',
      name: TRX,
      img: '/@/assets/currency/TRX.svg',
      defaultContract: '',
    },
    '723': {
      unit: '',
      label: 'USDC',
      name: USDC,
      img: '/@/assets/currency/USDC.svg',
      defaultContract: '',
    },
    '724': {
      unit: '',
      label: 'APE',
      name: APE,
      img: '/@/assets/currency/APE.svg',
      defaultContract: '',
    },
    '725': {
      unit: '',
      label: 'BUSD',
      name: BUSD,
      img: '/@/assets/currency/BUSD.svg',
      defaultContract: '',
    },
    '726': {
      unit: '',
      label: 'CRO',
      name: CRO,
      img: '/@/assets/currency/CRO.svg',
      defaultContract: '',
    },
    '727': {
      unit: '',
      label: 'DAI',
      name: DAI,
      img: '/@/assets/currency/DAI.svg',
      defaultContract: '',
    },
    '728': {
      unit: '',
      label: 'LINK',
      name: LINK,
      img: '/@/assets/currency/LINK.svg',
      defaultContract: '',
    },
    '729': {
      unit: '',
      label: 'SAND',
      name: SAND,
      img: '/@/assets/currency/SAND.svg',
      defaultContract: '',
    },
    '730': {
      unit: '',
      label: 'SHIB',
      name: SHIB,
      img: '/@/assets/currency/SHIB.svg',
      defaultContract: '',
    },
    '731': {
      unit: '',
      label: 'UNI',
      name: UNI,
      img: '/@/assets/currency/UNI.svg',
      defaultContract: '',
    },
    '732': {
      unit: '',
      label: 'MATIC',
      name: MATIC,
      img: '/@/assets/currency/MATIC.svg',
      defaultContract: '',
    },
    '733': {
      unit: '',
      label: 'KRW',
      name: KRW,
      img: '/@/assets/currency/KRW.svg',
      defaultContract: '',
    },
    '734': {
      unit: '',
      label: 'IDR',
      name: IDR,
      img: '/@/assets/currency/IDR.svg',
      defaultContract: '',
    },
    '735': {
      unit: '',
      label: 'PHP',
      name: PHP,
      img: '/@/assets/currency/PHP.svg',
      defaultContract: '',
    },
  });

  interface ListItem {
    key: string;
    name: string;
    component: string;
    apiMap: {
      PAGE_TYPE: string;
      pageName: string;
      columns: any;
      modalType: string;
      list: any;
      attr: any;
    };
    [p: string]: any;
  }

  interface Props {
    modelValue?: any;
    list?: ListItem[];
  }

  const props = withDefaults(defineProps<Props>(), {
    list: () => [],
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const active = reactive(props.list.length ? props.list[0] : undefined);

  function rgChange(e) {
    if (e && e.target && e.target.value !== undefined) {
      const val = props.list.filter((i) => i.key === e.target.value)[0];
      if (val) {
        emit('update:modelValue', val.key);
        emit('change', val.key, val);
      }
    }
  }

  emit('update:modelValue', active?.key ?? '');

  defineExpose({
    active,
  });
</script>

<template>
  <RadioGroup
    :value="modelValue"
    button-style="solid"
    class="!mt-15px !mb-15px t-form-label-com"
    @change="rgChange"
  >
    <RadioButton v-for="item in list" :key="item.key" :value="item.key" class="!mb-5px">
      <img :src="CurrencyConfiguration[item.key].name" class="w22px mr5px" />
      {{ item.name }}
    </RadioButton>
  </RadioGroup>
</template>

<style lang="less" scoped></style>
