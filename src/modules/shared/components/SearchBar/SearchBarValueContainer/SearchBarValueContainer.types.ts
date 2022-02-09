import { TagInfo } from '@meemoo/react-components';
import { ValueContainerProps } from 'react-select';

import { SearchBarValuePlaceholder } from '../SearchBar.types';

export interface SearchBarValueContainerProps extends ValueContainerProps<TagInfo> {
	placeholder?: SearchBarValuePlaceholder;
}
