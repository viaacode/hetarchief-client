import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import React, { type FC, useMemo, useRef } from 'react';

import styles from './MessageFileUpload.module.scss';

interface MessageFileUploadProps {
	onFileSelected: (file: File) => void;
	disabled?: boolean;
	selectedFiles: File[];
}

const MAX_FILE_SIZE_TOTAL = 25 * 1024 * 1024; // 25MB in bytes
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

const MessageFileUpload: FC<MessageFileUploadProps> = ({
	onFileSelected,
	selectedFiles,
	disabled = false,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const totalFileSize = useMemo(() => {
		let totalSize = 0;

		selectedFiles.forEach((file) => {
			totalSize += file.size;
		});

		return totalSize;
	}, [selectedFiles]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files?.length) {
			return;
		}

		const validFiles: File[] = [];
		let hasInvalidFiles = false;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];

			if (totalFileSize + file.size > MAX_FILE_SIZE_TOTAL) {
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
				title: tText(
					'modules/account/components/material-request-detail-blade/message-file-upload/message-file-upload___niet-alle-bestanden-zijn-correct'
				),
				description: tText(
					'modules/account/components/material-request-detail-blade/message-file-upload/message-file-upload___sommige-bestanden-voldoen-niet-aan-de-vereisten-max-30-mb-toegestane-types-pdf-doc-x-xls-x-jpg-png-csv'
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
