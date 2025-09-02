import { message } from 'ant-design-vue';
import { toRaw } from 'vue';

export interface DragSortParams {
  source: number;
  target: number;
  dataSource: Array<any>;
  setTableData: Fn;
}

export function useDragSort(record, index, params: DragSortParams) {
  return {
    props: {
      // draggable: 'true'
    },
    class: {
      columnSelectBar: true,
    },
    style: {},
    // 鼠标移入
    onMouseenter: (event) => {
      // 兼容IE
      const ev = event || window.event;
      ev.target.draggable = true; // 让你要拖动的行可以拖动，默认不可以
    },
    // 开始拖拽
    onDragstart: (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      // 得到源目标数据序号
      params.source = index;
    },
    // 拖动元素经过的元素
    onDragover: (event) => {
      // 兼容 IE
      const ev = event || window.event;
      // 阻止默认行为
      ev.preventDefault();
    },
    // 鼠标松开
    onDrop: async (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      // 得到目标数据序号
      params.target = index;
      [
        // 这里就是让数据位置互换，让视图更新 你们可以看record，index的输出，看是什么
        params.dataSource[params.source],
        params.dataSource[params.target],
      ] = [params.dataSource[params.target], params.dataSource[params.source]];
      params.setTableData(params.dataSource);
    },
  };
}
