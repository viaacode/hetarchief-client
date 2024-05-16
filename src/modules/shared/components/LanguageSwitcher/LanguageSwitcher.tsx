import { LanguageCode } from '@meemoo/admin-core-ui';
import { Button } from '@meemoo/react-components';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { NavigationDropdown } from '@navigation/components/Navigation/NavigationDropdown';
import { useGetAllLanguages } from '@shared/hooks/use-get-all-languages/use-get-all-languages';
import {
	setOpenNavigationDropdownId,
	setShowLanguageSelectionDropdown,
	setShowMaterialRequestCenter,
	setShowNotificationsCenter,
} from '@shared/store/ui';

import styles from './LanguageSwitcher.module.scss';

export default function LanguageSwitcher() {
	const router = useRouter();
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
								router.push(
									{
										pathname: router.pathname,
										query: router.query,
									},
									undefined,
									{ locale: option.value }
								);
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
