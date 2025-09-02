import { compact } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

const enum OPERATE_EVENT {
  CLOSE = 'close',
  MOVE = 'move',
  ADD = 'add',
  EDIT = 'edit',
}

export class MoveEvent {
  // 监听移动改变事件
  handleChangeMoveBox = (sourceList, targetList) => {
    this.setState(OPERATE_EVENT.MOVE, sourceList, targetList);
  };

  // 监听删除事件
  handleDelete = (index, sourceList, targetList) => {
    targetList.splice(index, 1);
    this.setState(OPERATE_EVENT.CLOSE, sourceList, targetList);
  };

  findArrayDifferences = (sourceList, targetList) => {
    const addedItems = compact(
      targetList.map((item2) => sourceList.find((item1) => item1.id === item2.id)),
    );
    const removedItems = sourceList.filter((item1) =>
      targetList.some((item2) => item2.id === item1.id),
    );

    // const commonElements = array1.filter(
    //   (value) => array2.includes(value) && array3.includes(value),
    // );

    return {
      addedItems,
      removedItems,
    };
  };

  setState = (event, sourceList, targetList) => {
    const { addedItems, removedItems } = this.findArrayDifferences(sourceList, targetList);

    switch (event) {
      case OPERATE_EVENT.CLOSE:
        // 删除动作时，更改游戏主类的列表状态
        sourceList.forEach((item) => {
          item.state = false;
        });
        addedItems.forEach((item: any) => {
          item.state = true;
        });
        break;
      case OPERATE_EVENT.MOVE:
        // 移动动作时，更改游戏主类的列表状态
        removedItems.forEach((item) => {
          item.state = true;
        });
        break;
      default:
        break;
    }
  };
}

export const langrageArr = [
  {
    language: 'zh_',
    value: 'zh_CN',
    label: t('common.common_zh_CN'),
    disabled: false,
  },
  {
    language: 'en_',
    value: 'en_US',
    label: t('common.common_en_US'),
    disabled: false,
  },
  {
    language: 'vn_',
    value: 'vi_VN',
    label: t('common.common_vi_VN'),
    disabled: false,
  },
  {
    language: 'th_',
    value: 'th_TH',
    label: t('common.common_th_TH'),
    disabled: false,
  },
  {
    language: 'pt_',
    value: 'pt_BR',
    label: t('common.common_pt_BR'),
    disabled: false,
  },
  {
    language: 'hi_',
    value: 'hi_IN',
    label: t('common.common_hi_IN'),
    disabled: false,
  },
  {
    language: 'in_',
    value: 'in_ID',
    label: t('common.common_id_ID'),
    disabled: false,
  },
  {
    language: 'ko_',
    value: 'ko_KR',
    label: t('common.common_ko_KR'),
    disabled: false,
  },
  {
    language: 'ja_',
    value: 'ja_JP',
    label: t('common.common_ja_JP'),
    disabled: false,
  },
  {
    language: 'ph_',
    value: 'tl_PH',
    label: t('common.common_tl_PH'),
    disabled: false,
  },
];
//商户后台游戏排序的那新增的3个多语言
export const newArr = [
  { id: '1', name: t('common.lobby') },
  { id: '2', name: t('common.slot') },
  { id: '3', name: t('common.liveEntertainment') },
  { id: '4', name: t('common.gameShow') },
];
export const newArrt = [
  { id: '3', name: '777' },
  { id: '4', name: '55' },
];

//newArr和newArrt合并掉，但是id相同的会被newArrt替换

export const arr = [
  {
    ty: 1,
    cid: '3',
    platform_id: '0',
    icon: '',
    name: t('common.liveCasino'),
  },
  {
    ty: 1,
    cid: '4',
    platform_id: '0',
    icon: '',
    name: t('common.gameShow'),
  },
  {
    ty: 1,
    cid: '5',
    platform_id: '0',
    icon: '',
    name: t('common.brandProvider'),
  },
  {
    ty: 2,
    cid: '0',
    platform_id: '303',
    icon: '',
    name: t('common.PPElectronic'),
  },
];

export const firstNavs = [
  {
    value: t('common.Lobby_navigation'),
    id: 0,
  },
  {
    value: t('common.Lobby_list'),
    id: 1,
  },
  {
    value: t('common.Lobby_side'),
    id: 2,
  },
];
