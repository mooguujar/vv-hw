import { unref } from 'vue';
import type { Ref } from 'vue';

export const useCanvas = () => {
  let canvasInstance: any = null;
  let ctx: any = null;
  let image: any = null;

  function initCanvas(elRef: Ref<HTMLCanvasElement | null>) {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }
    canvasInstance = el;
    ctx = canvasInstance?.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    image = new Image();
  }

  function changeLinearGradient(startColor, endColor) {
    if (!canvasInstance) return;
    const grad = ctx.createLinearGradient(0, 0, canvasInstance?.width, 0); //创建一个渐变色线性对象
    if (!startColor && !endColor) return;
    grad.addColorStop(0, startColor); //定义渐变色颜色
    grad.addColorStop(1, endColor);
    ctx.fillStyle = grad; //设置fillStyle为当前的渐变对象
    ctx.fillRect(0, 0, canvasInstance?.width, canvasInstance?.height);
  }

  function changeBackgroundColor(color) {
    if (!canvasInstance) return;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasInstance?.width, canvasInstance?.height);
  }

  function changeBackImage(src, arg: any[]) {
    if (!canvasInstance) return;
    image.src = src;
    image.onload = () => {
      ctx.drawImage(image, ...arg);
    };
  }

  function changeText(text, { x = 0, y = 0, maxWidth = 200, lineHeight = 20 }) {
    if (!canvasInstance) return;
    ctx.font = '14px PingFang SC, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.beginPath(); // 开始绘制
    _drawWrappedText(ctx, text, x, y, maxWidth, lineHeight);
  }

  // 绘制换行文字
  function _drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
    // 字符分隔为数组
    const arrText = text.split('');
    let line = '';

    for (let n = 0; n < arrText.length; n++) {
      const testLine = line + arrText[n];
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = arrText[n];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y); // 绘制最后一行的文字
  }

  // function convertCanvasToImage(canvas) {
  //   if (!canvasInstance && !canvas) return;
  //   canvasInstance = canvas;
  //   const image = new Image();
  //   image.src = canvasInstance.toDataURL('image/png');
  //   return image;
  // }

  // async function convertCanvasToFile() {
  //   if (!canvasInstance) return;
  //   let file: any = null;
  //   await canvasInstance.toBlob(function (blob) {
  //     file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  //   });
  //   return file;
  // }

  function clearRect() {
    ctx.clearRect(0, 0, canvasInstance.width, canvasInstance.height);
  }

  return {
    initCanvas,
    changeLinearGradient,
    changeBackgroundColor,
    changeBackImage,
    changeText,
    // convertCanvasToImage,
    // convertCanvasToFile,
    clearRect,
  };
};
