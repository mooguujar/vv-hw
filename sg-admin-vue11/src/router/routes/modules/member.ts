import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

const member: AppRouteModule = {
  path: '/member',
  name: 'Member',
  component: LAYOUT,
  redirect: '/member/inquiryMember',
  meta: {
    id: 10000,
    orderNo: 1,
    icon: 'Member:svg',
    title: t('routes.member.member'),
    slectPath: '/member',
  },
  children: [
    {
      path: 'inquiryMember',
      name: 'InquiryMember', // 会员列表不加缓存
      component: () => import('/@/views/member/InquiryMember/index.vue'),
      meta: {
        id: 10100,
        title: t('routes.member.memberList'),
        icon: 'InquiryMember:svg',
        slectPath: '/member',
      },
      children: [
        {
          path: 'detailsMember',
          name: 'DetailsMember',
          component: () => import('/@/views/member/detailsMember/index.vue'),
          meta: {
            id: 10100,
            title: t('routes.member.details'),
            icon: 'HeightLine:svg',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/member/inquiryMember',
            slectPath: '/member',
          },
        },
        {
          path: 'editMember',
          name: 'EditMember',
          component: () => import('/@/views/member/editMember/inquiryIndex.vue'),
          meta: {
            id: 10100,
            title: t('routes.member.editMember'),
            icon: 'HeightLine:svg',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/member/inquiryMember',
            slectPath: '/member',
          },
        },
      ],
    },
    {
      path: 'detailsOnlineMember',
      name: 'DetailsOnlineMember',
      component: () => import('/@/views/member/detailsMember/index.vue'),
      meta: {
        id: 10100,
        title: t('routes.member.details'),
        icon: 'OnlineMember:svg',
        hideMenu: true,
        hideTab: true,
        currentActiveMenu: '/member/activeMember',
        slectPath: '/member',
      },
    },
    {
      path: 'detailsMember',
      name: 'DetailsMember',
      component: () => import('/@/views/member/detailsMember/index.vue'),
      meta: {
        id: 10100,
        title: t('routes.member.details'),
        icon: 'HeightLine:svg',
        hideMenu: true,
        hideTab: true,
        currentActiveMenu: '/member/inquiryMember',
        slectPath: '/member',
      },
    },
    {
      path: 'editMember',
      name: 'EditMember',
      component: () => import('/@/views/member/editMember/inquiryIndex.vue'),
      meta: {
        id: 10100,
        title: t('routes.member.editMember'),
        icon: 'HeightLine:svg',
        hideMenu: true,
        hideTab: true,
        currentActiveMenu: '/member/inquiryMember',
        slectPath: '/member',
      },
    },
    {
      path: 'editOnlineMember',
      name: 'EditOnlineMember',
      component: () => import('/@/views/member/editMember/index.vue'),
      meta: {
        id: 10100,
        title: t('routes.member.details'),
        icon: 'HeightLine:svg',
        hideMenu: true,
        hideTab: true,
        currentActiveMenu: '/member/activeMember',
        slectPath: '/member',
      },
    },
    {
      path: 'activeMember',
      name: 'ActiveMember',
      component: () => import('/@/views/member/activeMember/index.vue'),
      meta: {
        id: 10100,
        title: t('routes.member.memberActive'),
        icon: 'OnlineMember:svg',
        slectPath: '/member',
      },
      children: [
        {
          path: 'detailsOnlineMember',
          name: 'DetailsOnlineMember',
          component: () => import('/@/views/member/detailsMember/index.vue'),
          meta: {
            id: 10100,
            title: t('routes.member.details'),
            icon: 'HeightLine:svg',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/member/activeMember',
            slectPath: '/member',
          },
        },
        {
          path: 'editOnlineMember',
          name: 'EditOnlineMember',
          component: () => import('/@/views/member/editMember/index.vue'),
          meta: {
            id: 10100,
            title: t('routes.member.details'),
            icon: 'HeightLine:svg',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/member/activeMember',
            slectPath: '/member',
          },
        },
      ],
    },
    {
      path: 'accountChanges',
      name: 'AccountChanges',
      component: () => import('/@/views/member/AccountChanges/AccountChanges.vue'),
      meta: {
        id: 10900,
        title: t('routes.member.accountChanges'),
        icon: 'AddMoney:svg',
        // hideMenu: true,
        // hideTab: true,
        // currentActiveMenu: '/member/inquiryMember',
        slectPath: '/member',
      },
    },
    {
      path: 'createMember',
      name: 'CreateMember',
      // component: () => import('/@/views/member/createMember/index.vue'),
      meta: {
        id: 10300,
        title: t('routes.member.analysis'),
        icon: 'AddMember:svg',
        // hideTab: true,
        slectPath: '/member',
      },
    },
    {
      path: 'addMoney',
      name: 'AddMoney',
      meta: {
        id: 10400,
        title: t('routes.member.addMoney'),
        // hideTab: true,
        icon: 'AddMoney:svg',
        slectPath: '/member',
      },
    },
    {
      path: 'vipGrade',
      name: 'VipGrade',
      component: () => import('/@/views/member/vipGrade/index.vue'),
      meta: {
        id: 10500,
        title: t('routes.member.vipGrade'),
        icon: 'VipGrade:svg',
        slectPath: '/member',
      },
    },
    {
      path: 'rakebackConfiguration',
      name: 'ReturnWaterConfiguration',
      component: () => import('/@/views/member/rakebackConfiguration/index.vue'),
      meta: {
        id: 10500,
        title: t('routes.vip_center'),
        icon: 'Rakeback:svg',
        slectPath: '/member',
      },
    },
    {
      path: 'memberGrade',
      name: 'MemberGrade',
      component: () => import('/@/views/member/memberGrade/index.vue'),
      meta: {
        id: 10600,
        title: t('routes.member.grade'),
        icon: 'MemberGrade:svg',
        slectPath: '/member',
      },
    },
    {
      path: 'memberLog',
      name: 'MemberLog',
      component: () => import('/@/views/member/memberLog/index.vue'),
      meta: {
        id: 10700,
        title: t('routes.member.memberLog'),
        icon: 'MemberLog:svg',
        slectPath: '/member',
      },
    },
    {
      path: 'debitCard',
      name: 'DebitCard',
      component: () => import('/@/views/member/debitCard/index.vue'),
      meta: {
        id: 10800,
        title: t('routes.member.cardLine'),
        icon: 'DebitCard:svg',
        slectPath: '/member',
      },
    },
  ],
};

export default member;
