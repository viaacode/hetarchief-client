import { type TagInfo } from '@meemoo/react-components';
import { type ReactNode } from 'react';
import { type DropdownIndicatorProps } from 'react-select';

export interface TagSearchBarButtonProps extends DropdownIndicatorProps<TagInfo> {
	children?: ReactNode;
	onClick?: () => void;
}
