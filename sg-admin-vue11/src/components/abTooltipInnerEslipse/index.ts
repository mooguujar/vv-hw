import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';

const setTooltip = (text) => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          class: 'whitespace-nowrap text-ellipsis overflow-hidden',
        },
        text,
      ),
  );
};
export default setTooltip;
