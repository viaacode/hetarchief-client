import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, FormControl, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import React, { type FC, type ReactNode, useState } from 'react';
import { Controller, type ControllerRenderProps, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { foldersService } from '@account/services/folders';
import { selectUser } from '@auth/store/user';
import { Blade } from '@shared/components/Blade/Blade';
import { CopyButton } from '@shared/components/CopyButton';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';

import { labelKeys, SHARE_FOLDER_FORM_SCHEMA } from './ShareFolderBlade.consts';
import styles from './ShareFolderBlade.module.scss';
import {
	type ShareFolderBladeFormState,
	type ShareFolderBladeProps,
} from './ShareFolderBlade.types';

const ShareFolderBlade: FC<ShareFolderBladeProps> = ({ isOpen, onClose, folderId }) => {
	const locale = useLocale();

	const user = useSelector(selectUser);
	const [emailInputValue, setEmailInputValue] = useState('');

	const link = `${window.location.origin}${ROUTES_BY_LOCALE[locale].accountShareFolder.replace(
		':id',
		folderId
	)}`;

	const {
		handleSubmit,
		formState: { errors },
		control,
		resetField,
	} = useForm<ShareFolderBladeFormState>({
		resolver: yupResolver(SHARE_FOLDER_FORM_SCHEMA()),
	});

	const handleClose = () => {
		setEmailInputValue('');
		resetField('email');
		onClose();
	};

	const handleSend = async () => {
		try {
			if (user) {
				await foldersService.shareFolder(folderId, emailInputValue);
				toastService.notify({
					maxLines: 3,
					title: tText('pages/account/map-delen/folder-id/index___map-is-gedeeld'),
					description: `${tText(
						'pages/account/map-delen/folder-id/index___map-is-verstuurd-naar'
					)} ${emailInputValue}`,
				});
				handleClose();
			} else {
				toastService.notify({
					maxLines: 3,
					title: tText('pages/account/map-delen/folder-id/index___error'),
					description: tText(
						'pages/account/map-delen/folder-id/index___error-er-is-iets-misgelopen'
					),
				});
			}
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

	const renderTextInput = (field: ControllerRenderProps<ShareFolderBladeFormState, 'email'>) => {
		setEmailInputValue(field.value);
		return <TextInput {...field} id={labelKeys.email} />;
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
					<label className={styles['c-share-folder-blade__content-label']}>
						<h5>{tText('pages/account/map-delen/folder-id/index___via-deellink')}</h5>
					</label>
					<div
						className={clsx(
							styles['c-share-folder-blade__content-value'],
							styles['c-share-folder-blade__content-copy-container']
						)}
					>
						<TextInput
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
					<label className={styles['c-share-folder-blade__content-label']}>
						<h5 className={styles['c-share-folder-blade__content-label--margin-top']}>
							{tText('pages/account/map-delen/folder-id/index___via-email')}
						</h5>
					</label>
					<label className={styles['c-share-folder-blade__content-label--email']}>
						{tText('pages/account/map-delen/folder-id/index___email')}
					</label>
					<div className={styles['c-share-folder-blade__content-value']}>
						<FormControl
							className="u-mb-8 u-mb-24-md"
							id={labelKeys.email}
							errors={[
								<RedFormWarning
									error={errors.email?.message}
									key="form-error--email"
								/>,
							]}
						>
							<Controller
								name="email"
								control={control}
								render={({ field }) => renderTextInput(field)}
							/>
						</FormControl>
					</div>

					<Button
						label={tText('pages/account/map-delen/folder-id/index___verstuur')}
						variants={['block', 'text']}
						className={styles['c-share-folder-blade__send-button']}
						onClick={handleSubmit(handleSend)}
						disabled={!isNil(errors.email?.message)}
					/>
				</>
			</div>
		</Blade>
	);
};

export default ShareFolderBlade;
