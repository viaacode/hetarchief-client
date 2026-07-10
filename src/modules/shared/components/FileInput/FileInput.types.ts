import type { DefaultComponentProps } from '@shared/types';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface FileInputProps
	extends DefaultComponentProps,
		InputHTMLAttributes<HTMLInputElement> {
	children?: ReactNode;
	hasFile?: boolean;
}
