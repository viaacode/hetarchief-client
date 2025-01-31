import type { InputHTMLAttributes, ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

export interface FileInputProps
	extends DefaultComponentProps,
		InputHTMLAttributes<HTMLInputElement> {
	children?: ReactNode;
	hasFile?: boolean;
}
