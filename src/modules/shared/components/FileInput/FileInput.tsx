import { tHtml } from '@shared/helpers/translate';
import clsx from 'clsx';
import { forwardRef } from 'react';

import styles from './FileInput.module.scss';
import type { FileInputProps } from './FileInput.types';

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
	({ className, onChange, hasFile }, ref) => {
		return (
			<label className={clsx(className, 'c-button c-button--outline', styles['c-file-input'])}>
				<input
					ref={ref}
					type="file"
					onChange={(e) => {
						onChange?.(e);
					}}
				/>
				{hasFile
					? tHtml('modules/shared/components/file-input/file-input___upload-nieuwe-afbeelding')
					: tHtml('modules/shared/components/file-input/file-input___upload-afbeelding')}
			</label>
		);
	}
);

FileInput.displayName = 'FileInput';
export default FileInput;
