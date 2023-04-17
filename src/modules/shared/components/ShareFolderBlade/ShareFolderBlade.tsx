import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash';
import React, { FC, useState } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { selectUser } from '@auth/store/user';
import { Blade, CopyButton, Icon, IconNamesLight } from '@shared/components';
import { ROUTES } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service/campaign-monitor.service';
import { toastService } from '@shared/services/toast-service';

import { labelKeys, SHARE_FOLDER_FORM_SCHEMA } from './ShareFolderBlade.consts';
import styles from './ShareFolderBlade.module.scss';
import { ShareFolderBladeFormState, ShareFolderBladeProps } from './ShareFolderBlade.types';

const ShareFolderBlade: FC<ShareFolderBladeProps> = ({ isOpen, onClose, folderId, folderName }) => {
	const { tText } = useTranslation();

	const user = useSelector(selectUser);
	const [emailInputValue, setEmailInputValue] = useState('');

	const link = `${window.location.origin}${ROUTES.shareFolder.replace(':id', folderId)}`;

	const {
		setValue,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<ShareFolderBladeFormState>({
		resolver: yupResolver(SHARE_FOLDER_FORM_SCHEMA()),
	});

	const handleClose = () => {
		setEmailInputValue('');
		setValue('email', '');
		onClose();
	};

	const handleSend = async () => {
		try {
			if (user) {
				await CampaignMonitorService.send({
					template: 'shareFolder',
					data: {
						to: emailInputValue,
						consentToTrack: 'unchanged',
						data: {
							sharer_email: user.email,
							sharer_name: user.fullName,
							folder_name: folderName,
							folder_sharelink: link,
						},
					},
				});
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

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={() => (
				<h4 className={styles['c-share-folder-blade__title']}>
					{tText('pages/account/map-delen/folder-id/index___deel-map')}
				</h4>
			)}
			footer={isOpen && renderFooter()}
			onClose={handleClose}
		>
			<div className={styles['c-share-folder-blade__content']}>
				<>
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
					<label className={styles['c-share-folder-blade__content-label']}>
						{tText('pages/account/map-delen/folder-id/index___email')}
					</label>
					<div className={styles['c-share-folder-blade__content-value']}>
						<FormControl
							className="u-mb-8 u-mb-24:md"
							id={labelKeys.email}
							errors={[errors.email?.message]}
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
