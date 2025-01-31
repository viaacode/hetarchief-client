import type { TagInfo } from '@meemoo/react-components';
import type { ReactNode } from 'react';
import type { ValueContainerProps } from 'react-select';

import type { TagSearchBarValuePlaceholder } from '../TagSearchBar.types';

export interface TagSearchBarValueContainerProps extends ValueContainerProps<TagInfo> {
	children: ReactNode;
	placeholder?: TagSearchBarValuePlaceholder;
}
