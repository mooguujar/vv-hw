import type { FormProps, FormActionType, UseFormReturnType, FormSchema } from '../types/form';
import type { NamePath } from 'ant-design-vue/lib/form/interface';
import type { DynamicProps } from '/#/utils';
import { ref, onUnmounted, unref, nextTick, watch } from 'vue';
import { isProdMode } from '/@/utils/env';
import { error } from '/@/utils/log';
import { getDynamicProps } from '/@/utils';
import { isString, isNullOrUnDef } from '/@/utils/is';
import { BasicColumn } from '/@/components/Table';
export declare type ValidateFields = (nameList?: NamePath[]) => Promise<Recordable>;
import { useLocale } from '@/locales/useLocale';
const { getLocale } = useLocale();

type Props = Partial<DynamicProps<FormProps>>;
const pxWidth = function (str: string): number {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  // 14px是默认antv form的label字体大小
  context.font = '14px "PingFang SC", sans-serif, AlimamaFangYuanTiVF-Thin';
  const metrics = context?.measureText(str);
  return metrics.width;
};
export function useForm(props?: Props): UseFormReturnType {
  const formRef = ref<Nullable<FormActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  async function getForm() {
    const form = unref(formRef);
    if (!form) {
      error(
        'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!',
      );
    }
    await nextTick();
    return form as FormActionType;
  }

  function register(instance: FormActionType) {
    isProdMode() &&
      onUnmounted(() => {
        formRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) return;

    formRef.value = instance;
    loadedRef.value = true;

    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props));
      },
      {
        immediate: true,
        deep: true,
      },
    );
  }

  const methods: FormActionType = {
    scrollToField: async (name: NamePath, options?: ScrollOptions | undefined) => {
      const form = await getForm();
      form.scrollToField(name, options);
    },
    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm();
      form.setProps(formProps);
    },

    updateSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[], noUseUniqBy = true) => {
      const form = await getForm();
      form.updateSchema(data, noUseUniqBy);
    },

    resetSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form.resetSchema(data);
    },

    clearValidate: async (name?: string | string[]) => {
      const form = await getForm();
      form.clearValidate(name);
    },

    resetFields: async () => {
      getForm().then(async (form) => {
        await form.resetFields();
      });
    },

    removeSchemaByField: async (field: string | string[]) => {
      unref(formRef)?.removeSchemaByField(field);
    },

    // TODO promisify
    getFieldsValue: <T>() => {
      return unref(formRef)?.getFieldsValue() as T;
    },

    setFieldsValue: async <T>(values: T, noUseUniqBy) => {
      const form = await getForm();
      form.setFieldsValue<T>(values, noUseUniqBy);
    },

    appendSchemaByField: async (
      schema: FormSchema | FormSchema[],
      prefixField: string | undefined,
      first: boolean,
    ) => {
      const form = await getForm();
      form.appendSchemaByField(schema, prefixField, first);
    },

    submit: async (): Promise<any> => {
      const form = await getForm();
      return form.submit();
    },

    validate: async (nameList?: NamePath[]): Promise<Recordable> => {
      const form = await getForm();
      return form.validate(nameList);
    },

    validateFields: async (nameList?: NamePath[]): Promise<Recordable> => {
      const form = await getForm();
      return form.validateFields(nameList);
    },
  };

  return [register, methods];
}

/**
 * 使用canvas计算每个label的宽度，并将最宽的设为labelWidth
 * @param schemas Form的配置
 * @param other 当有两个From，另一form的配置，label是必须的
 * @param moreWidth 当FormSchema中设置helpComponentProps等，增加宽度的情况，设置此值
 * @returns labelWidth
 */
export function useAutoLabelWidth(
  schemas: FormSchema[],
  config?: { other?: Partial<FormSchema>[]; moreWidth?: number },
) {
  const other = config?.other ?? null;
  const moreWidth = config?.moreWidth ?? 0;
  let labelWidth = 0;
  for (const iterator of schemas) {
    if (
      isString(iterator?.label) &&
      isNullOrUnDef(iterator.labelWidth) &&
      iterator.ifShow !== false &&
      iterator.show !== false
    ) {
      let width = pxWidth(iterator.label);
      if (iterator.required) width += 15;
      if (iterator.helpComponentProps) width += 15;
      labelWidth < width && (labelWidth = Math.ceil(width));
    }
  }
  if (other) {
    for (const iterator of other) {
      if (isString(iterator?.label) && isNullOrUnDef(iterator.labelWidth)) {
        const width = pxWidth(iterator.label);
        labelWidth < width && (labelWidth = Math.ceil(width));
      }
    }
  }
  if (labelWidth !== 0) {
    labelWidth += 20;
    labelWidth += moreWidth;
    for (const iterator of schemas) {
      // 60是左右边距
      // isNullOrUnDef(iterator.labelWidth) && (iterator.labelWidth = labelWidth);
      iterator.labelWidth = Math.ceil(labelWidth);
    }
  }
  return Math.ceil(labelWidth);
}

/**
 *
 * @param column 表头选项
 * @returns
 */
export function useAutoTableLabelWidth(column: BasicColumn[], config?: {}) {
  let currentLocale = unref(getLocale);
  if (!Array.isArray(column)) return column;
  for (const iterator of column) {
    if (iterator.width) {
    } else {
      let labelWidth = 40;
      //中文去掉 左右间距
      // if (currentLocale === 'zh_CN') labelWidth = 0;
      //如果有排序功能
      if (iterator.sorter) labelWidth += 30;
      //如果表头有编辑图标
      if (iterator.edit) labelWidth += 30;
      if (iterator.helpMessage) labelWidth += 16;
      if (iterator.moreWidth) labelWidth += iterator.moreWidth;
      if (isString(iterator?.title)) {
        const width: number = Math.ceil(pxWidth(iterator.title));
        // 控制表头column item左右间距
        labelWidth += width;
      }
      //如果没有设置宽度，则按照column item内容宽度自适应
      //或者 如果要设置固定宽度，则最少保持表头内容自适应宽度，如果设置的宽度小于自适应宽度，则优先取自适应宽度
      //parseInt  防止设置的字符串异常
      if (isNullOrUnDef(iterator.width) || parseInt(iterator.width) < labelWidth) {
        if (isNullOrUnDef(iterator.minWidth)) {
          iterator.minWidth = Math.ceil(labelWidth);
        } else {
          if (parseInt(iterator.minWidth) < labelWidth) {
            iterator.minWidth = Math.ceil(labelWidth);
          }
        }
      }
      if (iterator.lockWidth) {
        delete iterator.minWidth;
        iterator.width = Math.ceil(labelWidth);
      }
    }
    if (iterator?.slots?.title) {
      delete iterator.title;
    }
    if (iterator.children?.length) {
      useAutoTableLabelWidth(iterator.children);
    }
  }
  return column;
}
/**
 * 使用canvas计算每个label的宽度，并将最宽的设为labelWidth
 * @param schemas Form的配置
 * @returns labelWidth
 */
export function useAutoFieldLabelWidth(schemas: FormSchema[], fieldNames = 'label', moreWidth = 0) {
  let labelWidth = 0;
  for (const iterator of schemas) {
    if (isString(iterator[fieldNames]) && iterator.ifShow !== false && iterator.show !== false) {
      const width = pxWidth(iterator[fieldNames]);
      labelWidth < width && (labelWidth = width);
    }
  }
  if (labelWidth !== 0) {
    labelWidth += 20;
    labelWidth += moreWidth;
    for (const iterator of schemas) {
      // 60是左右边距
      // isNullOrUnDef(iterator.labelWidth) && (iterator.labelWidth = labelWidth);
      iterator.labelWidth = labelWidth;
    }
  }
  labelWidth = Math.ceil(labelWidth);
  return labelWidth;
}

export function setClassWidthNew(width: { [key: string]: any; default: any }) {
  // 获取当前语言

  const currentLocale = unref(getLocale);

  // 根据语言返回相应的类
  const selectedWidth = width[currentLocale] || width.default;

  return selectedWidth;
}
