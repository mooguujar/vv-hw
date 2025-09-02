<template>
  <img
    :src="srcs[props.id ? getCurrencyName(props.id) ?? props.icon : props.icon]"
    class="currency-icon"
  />
</template>
<script setup lang="ts">
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
  import MAGIC from '/@/assets/svg/currency/MAGIC.svg';
  import MXN from '/@/assets/svg/currency/MXN.svg';
  import PEN from '/@/assets/svg/currency/PEN.svg';
  import SAND from '/@/assets/svg/currency/SAND.svg';
  import SHIB from '/@/assets/svg/currency/SHIB.svg';
  import THB from '/@/assets/svg/currency/THB.svg';
  import TRX from '/@/assets/svg/currency/TRX.svg';
  import UNI from '/@/assets/svg/currency/UNI.svg';
  import USDC from '/@/assets/svg/currency/USDC.svg';
  import USDT from '/@/assets/svg/currency/USDT.svg';
  import KVND from '/@/assets/svg/currency/KVND.svg';
  import VND from '/@/assets/svg/currency/VND.svg';
  import XRP from '/@/assets/svg/currency/XRP.svg';
  import KRW from '/@/assets/svg/currency/KRW.svg';
  import ALL from '/@/assets/svg/currency/ALL.svg';
  import IDR from '/@/assets/svg/currency/IDR.svg';
  import PHP from '/@/assets/svg/currency/PHP.svg';

  const props = defineProps<{
    icon: string;
    id?: string;
  }>();
  const srcs = {
    APE,
    ARS,
    BCH,
    BNB,
    BRL,
    BTC,
    BUSD,
    CAD,
    CLP,
    CNY,
    CRO,
    DAI,
    DOGE,
    EOS,
    ETH,
    EUR,
    INR,
    JPY,
    LINK,
    LTC,
    MATIC,
    MXN,
    PEN,
    SAND,
    SHIB,
    THB,
    TRX,
    UNI,
    USDC,
    USDT,
    KVND,
    VND,
    XRP,
    ALL,
    MAGIC,
    KRW,
    IDR,
    PHP,
  };
  const currencyArr = [
    { label: 'CNY', id: '701' },
    { label: 'BRL', id: '702' },
    { label: 'INR', id: '703' },
    { label: 'VND', id: '704' },
    { label: 'THB', id: '705' },
    { label: 'USDT', id: '706' },
    { label: 'BTC', id: '707' },
    { label: 'ETH', id: '708' },
    { label: 'BNB', id: '709' },
    { label: 'EUR', id: '710' },
    { label: 'JPY', id: '711' },
    { label: 'CAD', id: '712' },
    { label: 'ARS', id: '713' },
    { label: 'CLP', id: '714' },
    { label: 'PEN', id: '715' },
    { label: 'MXN', id: '716' },
    { label: 'LTC', id: '717' },
    { label: 'DOGE', id: '718' },
    { label: 'BCH', id: '719' },
    { label: 'XRP', id: '720' },
    { label: 'EOS', id: '721' },
    { label: 'TRX', id: '722' },
    { label: 'USDC', id: '723' },
    { label: 'APE', id: '724' },
    { label: 'BUSD', id: '725' },
    { label: 'CRO', id: '726' },
    { label: 'DAI', id: '727' },
    { label: 'LINK', id: '728' },
    { label: 'SAND', id: '729' },
    { label: 'SHIB', id: '730' },
    { label: 'UNI', id: '731' },
    { label: 'MATIC', id: '732' },
    { label: 'KRW', id: '733' },
    { label: 'IDR', id: '734' },
    { label: 'PHP', id: '735' },
  ];
  function getCurrencyName(id: string) {
    return currencyArr.find((item) => item.id === id)?.label;
  }
</script>
<style lang="less">
  .ant-select-dropdown {
    .currency-icon {
      zoom: 0.8;
    }
  }
</style>
