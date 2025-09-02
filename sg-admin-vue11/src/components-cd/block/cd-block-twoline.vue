<script>
  import { h } from 'vue';
  import { isValid } from '/@/utils/is';
  import { Divider } from 'ant-design-vue';

  export default {
    props: {
      line1: [String, Number, undefined, null],
      line2: [String, Number, undefined, null],
    },
    render() {
      return h('div', { style: 'margin-top: -8px; margin-bottom: -8px' }, [
        h(
          'div',
          { class: 'text-ellipsis overflow-hidden whitespace-nowrap' },
          isValid(this.line1) ? this.line1 : '-',
        ),
        h(Divider,{ class: 'Divider_DIY' }),
        h(
          'div',
          { class: 'text-ellipsis overflow-hidden whitespace-nowrap' },
          isValid(this.line2) ? this.line2 : '-',
        ),
      ]);
    },
  };
</script>
