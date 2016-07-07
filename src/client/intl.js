import { addLocaleData } from 'react-intl';

export function configureLocale() {
	addLocaleData([
		...require('react-intl/locale-data/en'),
		...require('react-intl/locale-data/ko'),
	]);
}
