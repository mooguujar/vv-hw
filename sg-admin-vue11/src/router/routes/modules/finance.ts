import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

const finance: AppRouteModule = {
  path: '/finance',
  name: 'Finance',
  component: LAYOUT,
  redirect: '/finance/online_payment',
  meta: {
    id: 20000,
    orderNo: 2,
    icon: 'Finance:svg',
    tagName: 'total',
    tag: {
      dot: false,
      content: '',
      type: 'error',
    },
    title: t('routes.finance.moduleName'),
    slectPath: '/finance',
  },
  children: [
    {
      path: 'online_payment',
      name: 'OnlinePayment',
      component: () => import('/@/views/finance/onlinePayment/index.vue'),
      meta: {
        id: 20100,
        title: t('routes.finance.online_payment'),
        icon: 'OnlinePayment:svg',
        slectPath: '/finance',
      },
    },
    {
      path: 'company_deposit',
      name: 'CompanyDeposit',
      component: () => import('/@/views/finance/companyDeposit/index.vue'),
      meta: {
        id: 20200,
        title: t('routes.finance.company_deposit'),
        icon: 'CompanyDeposit:svg',
        tagName: 'deposit_offline_bank',
        tag: {
          dot: false,
          content: '',
          type: 'error',
        },
        slectPath: '/finance',
      },
    },
    {
      path: 'currency_deposit',
      name: 'CurrencyDeposit',
      component: () => import('/@/views/finance/currencyDeposit/index.vue'),
      meta: {
        id: 20300,
        title: t('routes.finance.currency_deposit'),
        icon: 'CurrencyDeposit:svg',
        tagName: 'coin_deposit',
        tag: {
          dot: false,
          content: '',
          type: 'error',
        },
        slectPath: '/finance',
      },
    },
    {
      path: 'online_withdrawal',
      name: 'OnlineWithdrawal',
      component: () => import('/@/views/finance/onlineWithdrawal/index.vue'),
      meta: {
        id: 20400,
        title: t('routes.finance.online_withdrawal'),
        icon: 'OnlineWithdrawal:svg',
        tagName: 'withdraw',
        tag: {
          dot: false,
          content: '',
          type: 'error',
        },
        slectPath: '/finance',
      },
    },
    {
      path: 'currency_withdrawal',
      name: 'CurrencyWithdrawal',
      component: () => import('/@/views/finance/currencyWithdrawal/index.vue'),
      meta: {
        id: 20500,
        title: t('routes.finance.currency_withdrawal'),
        icon: 'CurrencyWithdrawal:svg',
        tagName: 'coin_withdraw',
        tag: {
          dot: false,
          content: '',
          type: 'error',
        },
        slectPath: '/finance',
      },
    },
    {
      path: 'pre_payment_management',
      name: 'ReceiveManagement',
      component: () => import('/@/views/finance/receiveManagement/index.vue'),
      meta: {
        id: 20600,
        title: t('routes.finance.pre_payment_management_1'),
        icon: 'ReceiveManagement:svg',
        hideChildrenInMenu: true,
        slectPath: '/finance',
      },
    },
    {
      path: 'payment_management',
      name: 'PaymentManagement',
      component: () => import('/@/views/finance/paymentManagement/index.vue'),
      meta: {
        id: 20700,
        title: t('routes.finance.payment_management'),
        icon: 'PaymentManagement:svg',
        slectPath: '/finance',
      },
    },
    {
      path: 'withdrawal_config',
      name: 'WithdrawalConfig',
      component: () => import('/@/views/finance/withdrawalConfig/index.vue'),
      meta: {
        id: 20800,
        title: t('routes.finance.withdrawal_config'),
        icon: 'WithdrawalConfig:svg',
        hideChildrenInMenu: true,
        slectPath: '/finance',
      },
      children: [
        {
          path: '',
          name: 'First',
          redirect: 'First', // 默认重定向到 SiteAnnouncement
          meta: {
            title: t('routes.finance.withdrawal_config'),
            id: 20800,
          },
        },
        {
          path: 'first',
          name: 'First',
          meta: {
            id: 20800,
            title: t('routes.finance.withdrawal_config'),
          },
        },
        {
          path: 'add_Withdrawal_config/:modalType/:id',
          name: 'AddWithdrawalConfig',
          component: () => import('/@/views/finance/withdrawalConfig/AddWithdrawalConfig.vue'),
          meta: {
            id: 20800,
            title: t('routes.finance.add_Withdrawal_config'),
            icon: 'AddWithdrawalConfig:svg',
            hideTab: true,
            hideBreadcrumb: true,
            currentActiveMenu: '/finance/withdrawal_config',
            slectPath: '/finance',
          },
        },
      ],
    },
    {
      path: 'deposit_summary',
      name: 'DepositSummary',
      component: () => import('/@/views/finance/depositSummary/index.vue'),
      meta: {
        id: 20900,
        title: t('routes.finance.deposit_summary'),
        icon: 'DepositSummary:svg',
        slectPath: '/finance',
      },
    },
    {
      path: 'deposit_card_management',
      name: 'DepositCardManagement',
      component: () => import('/@/views/finance/depositCardManagement/index.vue'),
      meta: {
        id: 21000,
        title: t('routes.finance.deposit_card_management'),
        icon: 'DepositCardManagement:svg',
        hideChildrenInMenu: true,
        slectPath: '/finance',
      },
    },
  ],
};

export default finance;
