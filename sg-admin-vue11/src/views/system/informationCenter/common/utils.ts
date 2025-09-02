import { domToBlob } from 'modern-screenshot';

export function toImage(el, scale = 2) {
  return domToBlob(el, { scale }).then((blob) => {
    const file = new File([blob], 'image.webp', { type: 'image/webp' });
    return file;
  });
}
