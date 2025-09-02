// 后端返回的是一个平铺数组(route)  首先根据pid组成一个棵树形结构  pid 0表示最顶层路由(routerList)
// module 对应的 path
// name 对应的 路由名
// 还缺字段 type 用来区分是路由还是按钮 type 1路由 2按钮  路由标志符 routeName(字符串) 跳转用的

// 后台数据
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

const route = {
  id: '1',
  module: '',
  name: '会员管理',
  pid: '0',
  sortlevel: '001',
  state: 1,
};

// 树状机构
const routerList = [
  {
    routeName: 'member',
    type: 1,
    id: '1',
    module: '',
    name: '会员管理',
    pid: '0',
    sortlevel: '001',
    state: 1,
    children: [
      {
        routeName: 'InquiryMember',
        type: 1,
        id: '101',
        module: '/merchant/member/list',
        name: '会员列表',
        pid: '1',
        sortlevel: '001001',
        state: 1,
      },
      {
        routeName: 'delete',
        type: 2,
        id: '102',
        module: '',
        name: '会员列表-删除',
        pid: '1',
        sortlevel: '001001',
        state: 1,
      },
      {
        routeName: 'editor',
        type: 2,
        id: '103',
        module: '',
        name: '会员列表-编辑',
        pid: '1',
        sortlevel: '001001',
        state: 1,
      },
    ],
  },
  {
    routeName: 'Finance',
    type: 1,
    id: '2',
    module: '',
    name: '账务管理',
    pid: '0',
    sortlevel: '002',
    state: 1,
    children: [
      {
        routeName: 'Finance',
        type: 1,
        id: '201',
        module: '/merchant',
        name: '在线支付',
        pid: '2',
        sortlevel: '002001',
        state: 1,
      },
    ],
  },
];

// 最终的路由 登录成功 返回该角色 路由列表  需要把type=2的  放入 btnPermissions
const member = {
  path: '/member',
  name: 'Member',
  meta: {
    orderNo: 1,
    icon: 'HeightLine:svg',
    btnPermissions: ['delete'],
  },
  children: [
    {
      path: 'inquiryMember',
      name: 'InquiryMember', // 会员列表不加缓存
      meta: {
        icon: 'menuUser:svg',
        btnPermissions: ['editor', 'delete'],
      },
    },
  ],
};

// const list = [
//   {
//     flag: 1,
//     id: '10000',
//     module: 'member',
//     name: '会员管理',
//     pid: '0',
//     routeName: 'Member',
//     sortlevel: '001',
//     state: 1,
//   },
//   {
//     flag: 1,
//     id: '10100',
//     module: 'member/list',
//     name: '会员列表',
//     pid: '10000',
//     routeName: 'InquiryMember',
//     sortlevel: '001001',
//     state: 1,
//   },
//   {
//     flag: 1,
//     id: '10200',
//     module: 'member/list',
//     name: '会员列表',
//     pid: '10000',
//     routeName: 'InquiryMember',
//     sortlevel: '001001',
//     state: 1,
//   },
// ];

// const listTree = [
//   {
//     flag: 1,
//     id: '10000',
//     module: 'member',
//     name: '会员管理',
//     pid: '0',
//     routeName: 'Member',
//     sortlevel: '001',
//     state: 1,
//     selectIdList: ['10100'],
//     children: [
//       {
//         flag: 1,
//         id: '10100',
//         module: 'member/list',
//         name: '会员列表',
//         pid: '10000',
//         routeName: 'InquiryMember',
//         sortlevel: '001001',
//         selectIdList: ['10100'],
//         children: [],
//         state: 1,
//       },
//       {
//         flag: 1,
//         id: '10200',
//         module: 'member/list',
//         name: '会员列表2',
//         pid: '10000',
//         routeName: 'InquiryMember',
//         sortlevel: '001001',
//         selectIdList: ['10100'],
//         children: [],
//         state: 2,
//       },
//     ],
//   },
// ];
