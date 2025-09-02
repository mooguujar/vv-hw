import { withInstall } from '/@/utils';

import appLogo from './src/AppLogo.vue';
import appProvider from './src/AppProvider.vue';
import appSearch from './src/search/AppSearch.vue';
import appLocalePicker from './src/AppLocalePicker.vue';
import appTimeZoneSelect from './src/AppTimeZoneSelect.vue';
// import appDarkModeToggle from './src/AppDarkModeToggle.vue';
import appBalance from './src/AppBalance.vue';
import appExchangeRate from './src/AppExchangeRate.vue';
import appCurrency from './src/AppCurrency.vue';

export { useAppProviderContext } from './src/useAppContext';

export const AppLogo = withInstall(appLogo);
export const AppProvider = withInstall(appProvider);
export const AppSearch = withInstall(appSearch);
export const AppLocalePicker = withInstall(appLocalePicker);
export const AppTimeZoneSelect = withInstall(appTimeZoneSelect);
export const AppBalance = withInstall(appBalance);
// export const AppDarkModeToggle = withInstall(appDarkModeToggle);
export const AppExchangeRate = withInstall(appExchangeRate);
export const AppCurrency = withInstall(appCurrency);
