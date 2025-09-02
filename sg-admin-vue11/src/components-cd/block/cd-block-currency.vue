<script>
  import { h } from 'vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { COLORS } from '/@/views/common/const';
  import Move from '/@/assets/images/move.webp';

  export default {
    props: {
      label: [String, undefined],
      id: [String, undefined],
      currencyName: String,
      active: {
        type: Boolean,
        default: false,
      },
      move: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      return () =>
        h('div', { class: 'inline-flex align-middle items-center justify-center' }, [
          h(cdIconCurrency, {
            icon: props.label || props.currencyName,
            id: props.id,
            class: 'w-[20px] mr-[5px]',
          }),
          h(
            'div',
            props.active
              ? { style: { color: COLORS.INFO, borderBottom: 'solid 2px' + COLORS.INFO } }
              : null,
            props.currencyName,
          ),
          props.move
            ? h('img', { src: Move, alt: 'Description of the image', class: 'w-[20px] ml-[5px]' })
            : null,
        ]);
    },
  };
</script>
