import { Alert, Button, FormControl, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { type FC, type ReactNode, useState } from 'react';

import { foldersService } from '@account/services/folders';
import { Blade } from '@shared/components/Blade/Blade';
import { CopyButton } from '@shared/components/CopyButton';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';

import { labelKeys, SHARE_FOLDER_FORM_SCHEMA } from './ShareFolderBlade.consts';
import styles from './ShareFolderBlade.module.scss';
import type { ShareFolderBladeProps } from './ShareFolderBlade.types';

const ShareFolderBlade: FC<ShareFolderBladeProps> = ({ isOpen, onClose, folderId }) => {
	const locale = useLocale();

	const [email, setEmail] = useState('');
	const [formErrors, setFormErrors] = useState<{ email?: string }>({});

	const link = `${window.location.origin}${ROUTES_BY_LOCALE[locale].accountShareFolder.replace(
		':id',
		folderId
	)}`;

	const handleClose = () => {
		setEmail('');
		onClose();
	};

	const handleSend = async () => {
		try {
			const errors = await validateForm({ email: email }, SHARE_FOLDER_FORM_SCHEMA());
			setFormErrors(errors || {});
			if (errors) {
				setFormErrors(errors);
				return;
			}

			await foldersService.shareFolder(folderId, email);
			toastService.notify({
				maxLines: 3,
				title: tText('pages/account/map-delen/folder-id/index___map-is-gedeeld'),
				description: `${tText(
					'pages/account/map-delen/folder-id/index___map-is-verstuurd-naar'
				)} ${email}`,
			});
			handleClose();
		} catch (err) {
			console.error(err);
			toastService.notify({
				maxLines: 3,
				title: tText('pages/account/map-delen/folder-id/index___error'),
				description: tText(
					'pages/account/map-delen/folder-id/index___error-er-is-iets-misgelopen'
				),
			});
		}
	};

	const renderFooter = () => {
		return (
			<div className={styles['c-share-folder-blade__close-button-container']}>
				<Button
					label={tText('pages/account/map-delen/folder-id/index___sluit')}
					variants={['block', 'text', 'dark']}
					onClick={onClose}
					className={styles['c-share-folder-blade__close-button']}
				/>
			</div>
		);
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
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h2 {...props}>{tText('pages/account/map-delen/folder-id/index___deel-map')}</h2>
			)}
			footer={isOpen && renderFooter()}
			onClose={handleClose}
			id="share-folder-blade"
		>
			<div className={styles['c-share-folder-blade__content']}>
				<>
					{renderEditAlert()}
					<label className={styles['c-share-folder-blade__content-label']} htmlFor="link">
						<h5>{tText('pages/account/map-delen/folder-id/index___via-deellink')}</h5>
					</label>
					<div
						className={clsx(
							styles['c-share-folder-blade__content-value'],
							styles['c-share-folder-blade__content-copy-container']
						)}
					>
						<TextInput
							id="link"
							value={link}
							className={styles['c-share-folder-blade__content-copy-input']}
						/>
						<CopyButton
							text={link}
							iconStart={<Icon name={IconNamesLight.Copy} aria-hidden />}
							label={tText(
								'modules/shared/components/copy-button/copy-button___kopieer'
							)}
							variants={['inputCopy']}
						/>
					</div>
					<label className={styles['c-share-folder-blade__content-label']} htmlFor={labelKeys.email}>
						<h5 className={styles['c-share-folder-blade__content-label--margin-top']}>
							{tText('pages/account/map-delen/folder-id/index___via-email')}
						</h5>
					</label>
					<label className={styles['c-share-folder-blade__content-label--email']} htmlFor={labelKeys.email}>
						{tText('pages/account/map-delen/folder-id/index___email')}
					</label>
					<div className={styles['c-share-folder-blade__content-value']}>
						<FormControl
							className="u-mb-8 u-mb-24-md"
							id={labelKeys.email}
							errors={[
								<RedFormWarning error={formErrors.email} key="form-error--email" />,
							]}
						>
							<TextInput
								name="email"
								id={labelKeys.email}
								autoComplete={'email'}
								value={email}
								onChange={(evt) => setEmail(evt.target.value)}
							/>
						</FormControl>
					</div>

					<Button
						label={tText('pages/account/map-delen/folder-id/index___verstuur')}
						variants={['block', 'text']}
						className={styles['c-share-folder-blade__send-button']}
						onClick={handleSend}
						disabled={!!formErrors.email}
					/>
				</>
			</div>
		</Blade>
	);
};

export default ShareFolderBlade;
