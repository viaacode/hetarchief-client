import { TagInfo } from '@meemoo/react-components';
import { DropdownIndicatorProps } from 'react-select';

export interface SearchBarButtonProps extends DropdownIndicatorProps<TagInfo> {
	onClick?: () => void;
}
