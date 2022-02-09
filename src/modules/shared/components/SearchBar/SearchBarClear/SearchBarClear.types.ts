import { TagInfo } from '@meemoo/react-components';
import { ReactNode } from 'react';
import { ClearIndicatorProps } from 'react-select';

export interface SearchBarClearProps extends ClearIndicatorProps<TagInfo> {
	label?: string | ReactNode;
}
