import { Button } from '@meemoo/react-components';
import { useQueryClient } from '@tanstack/react-query';
import { reverse, sortBy } from 'lodash-es';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useGetContentPageByLanguageAndPath } from '@content-page/hooks/get-content-page';
import { NavigationDropdown } from '@navigation/components/Navigation/NavigationDropdown';
import { handleRouteExceptions } from '@shared/components/LanguageSwitcher/LanguageSwitcher.exceptions';
import { QUERY_KEYS, RouteKey, ROUTES_BY_LOCALE } from '@shared/const';
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
	const { data: contentPageInfo } = useGetContentPageByLanguageAndPath(
		(locale?.toUpperCase() || Locale.nl) as Locale,
		`/${router.query.slug}`,
		{ enabled: router.route === '/[slug]' }
	);

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
		newFullPath = handleRouteExceptions(routeKey, newFullPath);

		// exception for content pages
		if (router.route === '/[slug]') {
			const translatedContentPageInfo = (contentPageInfo?.translatedPages || []).find(
				(translatedPage) =>
					translatedPage.language === newLocale.toUpperCase() && translatedPage.isPublic
			);
			newFullPath = translatedContentPageInfo?.path || ROUTES_BY_LOCALE[newLocale].home;
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
						label={(router.locale || Locale.nl)?.toUpperCase()}
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
