import { TagsInputProps } from '@meemoo/react-components';
import { ReactNode } from 'react';

export type SearchBarProps = TagsInputProps & {
	clearLabel: string | ReactNode;
	onClear?: () => void;
	onSearchClick?: () => void;
};
