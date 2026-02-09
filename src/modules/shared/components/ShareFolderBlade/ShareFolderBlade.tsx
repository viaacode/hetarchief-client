import { FoldersService } from '@account/services/folders';
import { Alert, Button, FormControl, TextInput } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { CopyButton } from '@shared/components/CopyButton';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import React, { type FC, type ReactNode, useState } from 'react';

import { labelKeys, SHARE_FOLDER_FORM_SCHEMA } from './ShareFolderBlade.consts';
import styles from './ShareFolderBlade.module.scss';
import type { ShareFolderBladeProps } from './ShareFolderBlade.types';

const ShareFolderBlade: FC<ShareFolderBladeProps> = ({ isOpen, onClose, folderId }) => {
	const locale = useLocale();

	const [email, setEmail] = useState('');
	const [formErrors, setFormErrors] = useState<{ email?: string }>({});

	const link = `${window.location.origin}${ROUTES_BY_LOCALE[locale].accountShareFolder.replace(':id', folderId)}`;

	const handleClose = () => {
		setEmail('');
		setFormErrors({});
		onClose();
	};

	const handleSend = async () => {
		try {
			setFormErrors({});
			const errors = await validateForm({ email: email }, SHARE_FOLDER_FORM_SCHEMA());

			if (errors) {
				setFormErrors(errors);
				return;
			}

			await FoldersService.shareFolderCreate(folderId, email);
			toastService.notify({
				maxLines: 3,
				title: tText('pages/account/map-delen/folder-id/index___map-is-gedeeld'),
				description: `${tText('pages/account/map-delen/folder-id/index___map-is-verstuurd-naar')} ${email}`,
			});
			handleClose();
		} catch (err) {
			console.error(err);
			toastService.notify({
				maxLines: 3,
				title: tText('pages/account/map-delen/folder-id/index___error'),
				description: tText('pages/account/map-delen/folder-id/index___error-er-is-iets-misgelopen'),
			});
		}
	};

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText('pages/account/map-delen/folder-id/index___sluit'),
				mobileLabel: tText(
					'modules/shared/components/share-folder-blade/share-folder-blade___sluit-mobiel'
				),
				type: 'secondary',
				onClick: handleClose,
				enforceSecondary: true,
			},
		];
	};

	const renderEditAlert = (): ReactNode => (
		<Alert
			className={styles['c-share-folder-blade__alert']}
			title={tText('pages/account/map-delen/folder-id/index___zichtbaarheid-van-de-items')}
			content={tText('pages/account/map-delen/folder-id/index___zichtbaarheid-message')}
			icon={<Icon name={IconNamesLight.Exclamation} />}
		/>
	);

	return (
		<Blade
			isOpen={isOpen}
			title={tText('pages/account/map-delen/folder-id/index___deel-map')}
			footerButtons={getFooterButtons()}
			onClose={handleClose}
			id="share-folder-blade"
			stickyFooter={false}
		>
			<div className={styles['c-share-folder-blade__content']}>
				{renderEditAlert()}
				<FormControl
					label={tText('pages/account/map-delen/folder-id/index___via-email')}
					errors={[<RedFormWarning error={formErrors.email} key="form-error--email" />]}
				>
					<div className={clsx(styles['c-share-folder-blade__content-copy-container'])}>
						<TextInput
							name="email"
							id={labelKeys.email}
							autoComplete={'email'}
							value={email}
							onChange={(evt) => setEmail(evt.target.value)}
							className={styles['c-share-folder-blade__content-copy-input']}
						/>
						<Button
							label={tText('pages/account/map-delen/folder-id/index___verstuur')}
							iconStart={<Icon name={IconNamesLight.Search} aria-hidden />}
							variants={['inline-input']}
							className={styles['c-share-folder-blade__send-button']}
							onClick={handleSend}
						/>
					</div>
				</FormControl>

				<FormControl label={tText('pages/account/map-delen/folder-id/index___via-deellink')}>
					<div className={clsx(styles['c-share-folder-blade__content-copy-container'])}>
						<TextInput
							id="link"
							value={link}
							className={styles['c-share-folder-blade__content-copy-input']}
						/>
						<CopyButton
							text={link}
							iconStart={<Icon name={IconNamesLight.Copy} aria-hidden />}
							label={tText('modules/shared/components/copy-button/copy-button___kopieer')}
							variants={['inline-input']}
						/>
					</div>
				</FormControl>
			</div>
		</Blade>
	);
};

export default ShareFolderBlade;
