import { TagInfo } from '@meemoo/react-components';
import { DropdownIndicatorProps } from 'react-select';

export interface TagSearchBarButtonProps extends DropdownIndicatorProps<TagInfo> {
	children?: React.ReactNode;
	onClick?: () => void;
}
