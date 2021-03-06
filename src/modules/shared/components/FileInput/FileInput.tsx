import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { forwardRef } from 'react';

import styles from './FileInput.module.scss';
import { FileInputProps } from './FileInput.types';

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
	({ className, onChange, hasFile }, ref) => {
		const { t } = useTranslation();

		return (
			<>
				<label
					className={clsx(
						className,
						'c-button c-button--outline',
						styles['c-file-input']
					)}
				>
					<input
						ref={ref}
						type="file"
						onChange={(e) => {
							onChange?.(e);
						}}
					/>
					{hasFile
						? t(
								'modules/shared/components/file-input/file-input___upload-nieuwe-afbeelding'
						  )
						: t('modules/shared/components/file-input/file-input___upload-afbeelding')}
				</label>
			</>
		);
	}
);

FileInput.displayName = 'FileInput';
export default FileInput;
