import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import React, { type FC, useRef } from 'react';

import styles from './MessageFileUpload.module.scss';

interface MessageFileUploadProps {
	onFileSelected: (file: File) => void;
	disabled?: boolean;
}

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB in bytes
const ALLOWED_FILE_TYPES = [
	'.pdf',
	'.doc',
	'.docx',
	'.xls',
	'.xlsx',
	'.jpg',
	'.jpeg',
	'.png',
	'.csv',
];

const MessageFileUpload: FC<MessageFileUploadProps> = ({ onFileSelected, disabled = false }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files?.length) {
			return;
		}

		const validFiles: File[] = [];
		let hasInvalidFiles = false;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];

			if (file.size > MAX_FILE_SIZE) {
				hasInvalidFiles = true;
				continue;
			}

			const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
			if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
				hasInvalidFiles = true;
				continue;
			}

			validFiles.push(file);
		}

		if (hasInvalidFiles) {
			toastService.notify({
				maxLines: 3,
				title: tText('Niet alle bestanden zijn correct'),
				description: tText(
					'Sommige bestanden voldoen niet aan de vereisten (max. 30MB, toegestane types: PDF, DOC(X), XLS(X), JPG, PNG, CSV).'
				),
			});
		}

		validFiles.forEach((file) => {
			onFileSelected(file);
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<>
			<input
				ref={fileInputRef}
				multiple
				type="file"
				accept={ALLOWED_FILE_TYPES.join(',')}
				onChange={handleFileChange}
				disabled={disabled}
				className={clsx(styles['c-message-file-upload__input'])}
			/>
			<Button
				variants={['sm', 'text']}
				onClick={handleButtonClick}
				icon={
					<Icon
						name={IconNamesLight.File}
						className={clsx(styles['c-message-file-upload__icon'])}
					/>
				}
				disabled={disabled}
				className={clsx(styles['c-message-file-upload__button'])}
			/>
		</>
	);
};

export default MessageFileUpload;
