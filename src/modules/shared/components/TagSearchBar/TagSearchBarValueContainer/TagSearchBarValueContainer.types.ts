import { TagInfo } from '@meemoo/react-components';
import { ValueContainerProps } from 'react-select';

import { TagSearchBarValuePlaceholder } from '../TagSearchBar.types';

export interface TagSearchBarValueContainerProps extends ValueContainerProps<TagInfo> {
	placeholder?: TagSearchBarValuePlaceholder;
}
