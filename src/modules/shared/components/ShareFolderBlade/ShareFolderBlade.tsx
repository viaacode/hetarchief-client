import { Button, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { object, string } from 'yup';

import { Blade, CopyButton } from '@shared/components';
import { ROUTES } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import styles from './ShareFolderBlade.module.scss';
import { ShareFolderBladeProps } from './ShareFolderBlade.types';

// const emailschema = object({
// 	email: string().email(),
// });

const ShareFolderBlade: FC<ShareFolderBladeProps> = ({ isOpen, onClose, folderId }) => {
	const { tText } = useTranslation();

	const [emailInputValue, setEmailInputValue] = useState<string>('');
	const [isSendMailDisabled, setIsSendMailDisabled] = useState(true);
	const link = `${window.location.origin}${ROUTES.shareFolder.replace(':id', folderId)}`;

	const onEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmailInputValue(e.target.value);
		// const mail = await emailschema.isValid(e.target.value);
		// if (mail) {
		// 	setIsSendMailDisabled(false);
		// } else {
		// 	setIsSendMailDisabled(true);
		// }
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
					<dt className={styles['c-share-folder-blade__content-label']}>
						<h5 className={styles['c-share-folder-blade__content-label--margin-top']}>
							Via een email
						</h5>
					</dt>
					<dt className={styles['c-share-folder-blade__content-label']}>Email</dt>
					<dd className={styles['c-share-folder-blade__content-value']}>
						<TextInput value={emailInputValue} onChange={onEmailChange} />
					</dd>

					<Button
						label="Verstuur"
						variants={['block', 'text']}
						className={styles['c-share-folder-blade__send-button']}
						onClick={() => console.log('Send! To: ', emailInputValue)}
						disabled={isSendMailDisabled}
					/>
				</>
			</div>
		</Blade>
	);
};

export default ShareFolderBlade;
