import type { TagInfo } from '@meemoo/react-components';
import type { ReactNode } from 'react';
import type { ClearIndicatorProps } from 'react-select';

export interface TagSearchBarClearProps extends ClearIndicatorProps<TagInfo> {
	children?: ReactNode;
	label?: string | ReactNode;
}
