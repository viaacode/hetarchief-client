import { convertDbContentPageToContentPageInfo } from '@meemoo/admin-core-ui/dist/client.mjs';
import { Button } from '@meemoo/react-components';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { type FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectCommonUser } from '@auth/store/user';
import { useGetContentPageByLanguageAndPath } from '@content-page/hooks/get-content-page';
import { NavigationDropdown } from '@navigation/components/Navigation/NavigationDropdown';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { GET_LANGUAGE_NAMES } from '@shared/const/language-names';
import { changeApplicationLocale } from '@shared/helpers/change-application-locale';
import { tText } from '@shared/helpers/translate';
import { useGetAllLanguages } from '@shared/hooks/use-get-all-languages/use-get-all-languages';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import {
	setOpenNavigationDropdownId,
	setShowLanguageSelectionDropdown,
	setShowMaterialRequestCenter,
	setShowNotificationsCenter,
} from '@shared/store/ui';
import { Locale } from '@shared/utils/i18n';

import { getSlugFromQueryParams } from '@shared/helpers/get-slug-from-query-params';
import { isRootSlugRoute } from '@shared/helpers/is-root-slug-route';
import styles from './LanguageSwitcher.module.scss';

export const LanguageSwitcher: FC<{ className?: string }> = ({ className }) => {
	const router = useRouter();
	const locale = useLocale();
	const queryClient = useQueryClient();
	const commonUser = useSelector(selectCommonUser);
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();
	const { data: allLanguages } = useGetAllLanguages();
	const slug = getSlugFromQueryParams(router.query);
	const { data: dbContentPage } = useGetContentPageByLanguageAndPath(locale, `/${slug}`, {
		enabled: isRootSlugRoute(router.route),
	});

	const contentPageInfo = dbContentPage
		? convertDbContentPageToContentPageInfo(dbContentPage)
		: null;

	const languageOptions = (allLanguages || []).map((languageInfo) => {
		const langCode = languageInfo.languageCode.toLowerCase() as Locale;
		return {
			label: GET_LANGUAGE_NAMES()[langCode],
			value: langCode,
		};
	});

	const handleOpen = () => {
		dispatch(setShowMaterialRequestCenter(false));
		dispatch(setShowNotificationsCenter(false));
		dispatch(setOpenNavigationDropdownId(null));
		setTimeout(() => {
			setShowLanguageSelectionDropdown(true);
		}, 10);
	};

	const renderLanguageOptionButtons = () => {
		return languageOptions.map((languageOption) => (
			<Button
				key={languageOption.value}
				label={languageOption.label}
				variants={['text']}
				onClick={async () => {
					const selectedLanguage = languageOption.value as Locale;
					await changeApplicationLocale(
						locale,
						selectedLanguage,
						router,
						queryClient,
						contentPageInfo,
						commonUser
					);
					setIsOpen(false);
				}}
			/>
		));
	};

	return (
		<div className={clsx(styles['c-language-switcher'], className)}>
			<NavigationDropdown
				id="c-language-switcher__dropdown"
				isOpen={isOpen}
				className={styles['c-language-switcher__select']}
				trigger={
					<Button
						label={(router.locale || Locale.nl)?.toUpperCase()}
						aria-label={tText(
							'modules/shared/components/language-switcher/language-switcher___pas-de-taal-van-de-website-aan'
						)}
						variants={['black']}
						onClick={() => setIsOpen(true)}
						iconEnd={<Icon name={IconNamesLight.AngleDown} />}
					/>
				}
				renderedItems={renderLanguageOptionButtons()}
				onClose={() => setIsOpen(false)}
				onOpen={handleOpen}
			/>
		</div>
	);
};
