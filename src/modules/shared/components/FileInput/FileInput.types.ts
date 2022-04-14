import { InputHTMLAttributes } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface FileInputProps
	extends DefaultComponentProps,
		InputHTMLAttributes<HTMLInputElement> {
	hasFile?: boolean;
}
