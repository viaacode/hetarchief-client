import { TextInputProps } from '@meemoo/react-components';

import { DefaultComponentProps } from '@shared/types';

export type SearchBarProps = TextInputProps &
	DefaultComponentProps & {
		default: string | undefined;
		onSearch: (value: string | undefined) => void;
		shouldReset?: boolean;
		onResetFinished?: () => void;
		instantUpdate?: boolean;
	};
