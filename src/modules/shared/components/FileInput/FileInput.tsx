import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useRef, useState } from 'react';

import { Icon } from '../Icon';

import styles from './FileInput.module.scss';
import { FileInputProps } from './FileInput.types';

const FileInput: FC<FileInputProps> = ({ className, onChange }) => {
	const { t } = useTranslation();

	const inputRef = useRef<HTMLInputElement>(null);

	const [imageUploaded, setImageUploaded] = useState(false);

	return (
		<>
			<label
				className={clsx(className, 'c-button c-button--outline', styles['c-file-input'])}
			>
				<input
					ref={inputRef}
					type="file"
					onChange={(e) => {
						setImageUploaded(!!e.currentTarget.files?.length);
						onChange?.(e);
					}}
				/>
				{imageUploaded ? t('Upload nieuwe afbeelding') : t('Upload afbeelding')}
			</label>
			{imageUploaded && (
				<Button
					label={t('Verwijderen')}
					iconStart={<Icon name="trash" />}
					variants="text"
					onClick={() => {
						if (inputRef.current) {
							inputRef.current.value = '';
							setImageUploaded(!!inputRef.current?.value);
						}
					}}
				/>
			)}
		</>
	);
};

export default FileInput;
