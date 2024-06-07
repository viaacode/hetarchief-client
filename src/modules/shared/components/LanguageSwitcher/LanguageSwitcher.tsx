import { convertDbContentPageToContentPageInfo } from '@meemoo/admin-core-ui';
import { Button } from '@meemoo/react-components';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useChangeLanguagePreference } from '@account/hooks/change-language-preference';
import { useGetContentPageByLanguageAndPath } from '@content-page/hooks/get-content-page';
import { NavigationDropdown } from '@navigation/components/Navigation/NavigationDropdown';
import { changeLocalSlug } from '@shared/helpers/change-local-slug';
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
	const [selectedLanguage, setSelectedLanguage] = useState<Locale>(locale);
	const dispatch = useDispatch();
	const { data: allLanguages } = useGetAllLanguages();
	const { mutate: mutateLanguagePreference } = useChangeLanguagePreference(selectedLanguage);
	const { data: dbContentPage } = useGetContentPageByLanguageAndPath(
		locale,
		`/${router.query.slug}`,
		{ enabled: router.route === '/[slug]' }
	);

	const contentPageInfo = dbContentPage
		? convertDbContentPageToContentPageInfo(dbContentPage)
		: null;

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false; // it's no longer the first render
			return; // skip the effect on the first render
		}

		mutateLanguagePreference(selectedLanguage);
		changeLocalSlug(locale, selectedLanguage, queryClient, contentPageInfo);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLanguage, mutateLanguagePreference]);

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
								setSelectedLanguage(option.value as unknown as Locale);
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
