import { TagInfo } from '@meemoo/react-components';
import { ReactNode } from 'react';
import { ValueContainerProps } from 'react-select';

import { TagSearchBarValuePlaceholder } from '../TagSearchBar.types';

export interface TagSearchBarValueContainerProps extends ValueContainerProps<TagInfo> {
	children: ReactNode;
	placeholder?: TagSearchBarValuePlaceholder;
}
