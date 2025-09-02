// 注册配置表单
export function registerSchema() {
  return [
    {
      field: 'basic-setting',
      component: 'Input',
      label: '',
      colProps: {
        span: 24,
      },
      slot: 'basicInfo',
    },
  ];
}
