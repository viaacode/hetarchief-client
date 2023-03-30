import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash';
import React, { FC, useState } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { selectUser } from '@auth/store/user';
import { Blade, CopyButton } from '@shared/components';
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
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<ShareFolderBladeFormState>({
		resolver: yupResolver(SHARE_FOLDER_FORM_SCHEMA()),
	});

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
					title: tText('pages/account/map-delen/folder-id/index___gelukt'),
					description: tText(
						'pages/account/map-delen/folder-id/index___gelukt-beschrijving'
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
				<h3 className={styles['c-share-folder-blade__title']}>
					{tText('pages/account/map-delen/folder-id/index___deel-map')}
				</h3>
			)}
			footer={isOpen && renderFooter()}
			onClose={onClose}
		>
			<div className={styles['c-share-folder-blade__content']}>
				<>
					<dt className={styles['c-share-folder-blade__content-label']}>
						<h5>{tText('pages/account/map-delen/folder-id/index___via-deellink')}</h5>
					</dt>
					<dd
						className={clsx(
							styles['c-share-folder-blade__content-value'],
							styles['c-share-folder-blade__content-copy-container']
						)}
					>
						<TextInput
							value={link}
							className={styles['c-share-folder-blade__content-copy-input']}
						/>
						<CopyButton text={link} isInputCopy />
					</dd>
					<dt className={styles['c-share-folder-blade__content-label']}>
						<h5 className={styles['c-share-folder-blade__content-label--margin-top']}>
							{tText('pages/account/map-delen/folder-id/index___via-email')}
						</h5>
					</dt>
					<dt className={styles['c-share-folder-blade__content-label']}>
						{tText('pages/account/map-delen/folder-id/index___email')}
					</dt>
					<dd className={styles['c-share-folder-blade__content-value']}>
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
					</dd>

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
