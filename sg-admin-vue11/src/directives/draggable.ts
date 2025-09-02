import type { App } from 'vue';

const mounted = (el, binding) => {
  let dragSrcIndex = null;

  el.draggable = true;

  el.addEventListener('dragstart', (event) => {
    dragSrcIndex = binding.value.index;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', dragSrcIndex);
    el.classList.add('dragging');
  });

  el.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
  });

  el.addEventListener('dragenter', () => {
    el.classList.add('over');
  });

  el.addEventListener('dragleave', () => {
    el.classList.remove('over');
  });

  el.addEventListener('drop', (event) => {
    event.stopPropagation();
    const dragDstIndex = binding.value.index;
    const dragSrcIndex = event.dataTransfer.getData('text/plain');

    if (dragSrcIndex !== dragDstIndex) {
      binding.value.swap(dragSrcIndex, dragDstIndex);
    }
    el.classList.remove('over');
    return false;
  });

  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
  });
};

export function setDraggable(app: App) {
  app.directive('draggable', { mounted });
}
