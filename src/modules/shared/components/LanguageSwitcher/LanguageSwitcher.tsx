import { LanguageCode } from '@meemoo/admin-core-ui';
import { Button } from '@meemoo/react-components';
import { useQueryClient } from '@tanstack/react-query';
import { reverse, sortBy } from 'lodash-es';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { NavigationDropdown } from '@navigation/components/Navigation/NavigationDropdown';
import { QUERY_KEYS, ROUTE_PARTS_BY_LOCALE, RouteKey, ROUTES_BY_LOCALE } from '@shared/const';
import { useGetAllLanguages } from '@shared/hooks/use-get-all-languages/use-get-all-languages';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import {
	setOpenNavigationDropdownId,
	setShowLanguageSelectionDropdown,
	setShowMaterialRequestCenter,
	setShowNotificationsCenter,
} from '@shared/store/ui';
import { Locale } from '@shared/utils';

import styles from './LanguageSwitcher.module.scss';

export default function LanguageSwitcher() {
	const router = useRouter();
	const locale = useLocale();
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();
	const { data: allLanguages } = useGetAllLanguages();

	const languageOptions = (allLanguages || []).map((languageInfo) => ({
		label: languageInfo.languageLabel,
		value: languageInfo.languageCode.toLowerCase(),
	}));

	const handleOpen = () => {
		dispatch(setShowMaterialRequestCenter(false));
		dispatch(setShowNotificationsCenter(false));
		dispatch(setOpenNavigationDropdownId(null));
		setTimeout(() => {
			setShowLanguageSelectionDropdown(true);
		}, 10);
	};

	const handleLocaleChanged = (oldLocale: Locale, newLocale: Locale) => {
		const oldFullPath = router.asPath;
		const routeEntries = Object.entries(ROUTES_BY_LOCALE[oldLocale]);
		// We'll go in reverse order, so we'll match on the longest paths first
		const routeEntryInOldLocale = reverse(sortBy(routeEntries, (entry) => entry[1])).find(
			(routeEntry) => oldFullPath.startsWith(routeEntry[1])
		);
		const routeKey = (routeEntryInOldLocale?.[0] || 'home') as RouteKey;
		const oldPath = ROUTES_BY_LOCALE[oldLocale][routeKey] || ROUTES_BY_LOCALE[oldLocale].home;
		const newPath = ROUTES_BY_LOCALE[newLocale][routeKey] || ROUTES_BY_LOCALE[newLocale].home;

		// Replace the static first path of the full path with the localized path
		// eg:
		// - /account/mijn-mappen/map123
		// should become
		// - /account/my-folders/map123
		let newFullPath = oldFullPath.replace(oldPath, newPath);

		// exceptions for specific paths
		if (routeKey === RouteKey.accountMyFolders) {
			// If route contains the default "favorites" folder, strip it off, since it will be different in the other locale
			const favoritesInAllLanguages = Object.values(ROUTE_PARTS_BY_LOCALE).map(
				(routeParts) => routeParts.favorites
			);
			const favoritesFolder = newFullPath.split('/').pop() as string;
			if (favoritesInAllLanguages.includes(favoritesFolder)) {
				newFullPath = newFullPath.substring(0, newFullPath.lastIndexOf('/'));
			}
		}

		// Redirect to new path
		router.push(newFullPath, newFullPath, { locale: newLocale });
		queryClient.invalidateQueries([QUERY_KEYS.getNavigationItems]);
	};

	return (
		<div className={styles['c-language-switcher']}>
			<NavigationDropdown
				id="c-language-switcher__dropdown"
				isOpen={isOpen}
				className={styles['c-language-switcher__select']}
				trigger={
					<Button
						label={(router.locale || LanguageCode.Nl)?.toUpperCase()}
						variants={['black']}
						onClick={() => setIsOpen(true)}
					/>
				}
				items={languageOptions.map((option) => ({
					id: option.value,
					path: '',
					node: (
						<Button
							variants={['text']}
							onClick={() => {
								const newLocale: Locale = option.value as unknown as Locale;
								handleLocaleChanged(locale, newLocale);
							}}
						>
							{option.label}
						</Button>
					),
				}))}
				onClose={() => setIsOpen(false)}
				onOpen={handleOpen}
			/>
		</div>
	);
}
