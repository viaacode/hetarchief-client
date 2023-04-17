import { TextInputProps } from '@meemoo/react-components';

import { DefaultComponentProps } from '@shared/types';

export type SearchBarProps = Omit<TextInputProps, 'value' | 'onChange'> &
	DefaultComponentProps & {
		value: string;
		onChange: (newValue: string) => void;
		onSearch: (value: string) => void;
		shouldReset?: boolean;
		onResetFinished?: () => void;
		instantSearch?: boolean;
	};
