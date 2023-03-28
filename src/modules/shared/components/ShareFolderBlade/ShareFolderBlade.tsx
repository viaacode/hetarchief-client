import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash';
import React, { FC, useState } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { Blade, CopyButton } from '@shared/components';
import { ROUTES } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { labelKeys, SHARE_FOLDER_FORM_SCHEMA } from './ShareFolderBlade.consts';
import styles from './ShareFolderBlade.module.scss';
import { ShareFolderBladeFormState, ShareFolderBladeProps } from './ShareFolderBlade.types';

const ShareFolderBlade: FC<ShareFolderBladeProps> = ({ isOpen, onClose, folderId }) => {
	const { tText } = useTranslation();

	const [emailInputValue, setEmailInputValue] = useState<string>('');
	const [isSendMailDisabled, setIsSendMailDisabled] = useState(false);
	const link = `${window.location.origin}${ROUTES.shareFolder.replace(':id', folderId)}`;

	const {
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<ShareFolderBladeFormState>({
		resolver: yupResolver(SHARE_FOLDER_FORM_SCHEMA()),
	});

	const onEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmailInputValue(e.target.value);
		// const mail = await emailschema.isValid(e.target.value);
		// if (mail) {
		// 	setIsSendMailDisabled(false);
		// } else {
		// 	setIsSendMailDisabled(true);
		// }
	};

	const handleSend = () => {
		console.log('test');
	};

	// const onFormSubmit = (): Promise<void> => {
	// 	return new Promise<void>((resolve, reject) => {
	// 		handleSubmit<EditFolderFormState>(async (values) => {
	// 			const response = await foldersService.update(folder.id, values);
	// 			await afterSubmit(response);

	// 			toastService.notify({
	// 				title: tHtml(
	// 					'modules/account/components/edit-folder-title/edit-folder-title___name-is-aangepast',
	// 					values
	// 				),
	// 				description: tHtml(
	// 					'modules/account/components/edit-folder-title/edit-folder-title___deze-map-is-successvol-aangepast'
	// 				),
	// 			});
	// 			resolve();
	// 		}, reject)();
	// 	});
	// };

	const renderTextInput = (field: ControllerRenderProps<ShareFolderBladeFormState, 'email'>) => {
		console.log(field);
		return <TextInput {...field} id={labelKeys.email} />;
	};

	const renderFooter = () => {
		return (
			<div className={styles['c-share-folder-blade__close-button-container']}>
				<Button
					label="Sluit"
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
			renderTitle={() => <h3 className={styles['c-share-folder-blade__title']}>Deel map</h3>}
			footer={isOpen && renderFooter()}
			onClose={onClose}
		>
			<div className={styles['c-share-folder-blade__content']}>
				<>
					<dt className={styles['c-share-folder-blade__content-label']}>
						<h5>Via een deellink</h5>
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
					{/* <dt className={styles['c-share-folder-blade__content-label']}>
						<h5 className={styles['c-share-folder-blade__content-label--margin-top']}>
							Via een email
						</h5>
					</dt>
					<dt className={styles['c-share-folder-blade__content-label']}>Email</dt>
					<dd className={styles['c-share-folder-blade__content-value']}>
						<TextInput value={emailInputValue} onChange={onEmailChange} />
					</dd> */}

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

					<Button
						label="Verstuur"
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
