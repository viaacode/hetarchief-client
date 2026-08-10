import { tHtml } from '@shared/helpers/translate';
import clsx from 'clsx';
import { forwardRef } from 'react';

import styles from './FileInput.module.scss';
import type { FileInputProps } from './FileInput.types';

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
	({ className, onChange, hasFile, children, ...inputProps }, ref) => {
		return (
			<label className={clsx(className, 'c-button c-button--outline', styles['c-file-input'])}>
				{/* Remaining props (id, accept, disabled, ...) belong on the input, not the label:
				    FileInputProps extends InputHTMLAttributes, so callers rightly expect them to apply */}
				<input
					{...inputProps}
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
