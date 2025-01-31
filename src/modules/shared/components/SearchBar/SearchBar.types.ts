import type { TextInputProps } from '@meemoo/react-components';

import type { DefaultComponentProps } from '@shared/types';

export type SearchBarProps = Omit<TextInputProps, 'value' | 'onChange'> &
	DefaultComponentProps & {
		value: string;
		onChange: (newValue: string) => void;
		onSearch: (value: string) => void;
	};
