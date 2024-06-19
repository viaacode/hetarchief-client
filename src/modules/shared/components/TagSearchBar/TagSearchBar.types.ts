import { type TagsInputProps } from '@meemoo/react-components';
import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { type ActionMeta, type InputActionMeta, type OnChangeValue } from 'react-select';

import { type DefaultComponentProps } from '@shared/types';
import { type TagIdentity } from '@visitor-space/types';

export type TagSearchBarProps<IsMulti extends boolean = false> = DefaultComponentProps &
	Omit<TagsInputProps<IsMulti>, 'rootClassName' | 'classNamePrefix' | 'variants'> & {
		clearLabel?: TagSearchBarClearLabel;
		inputState?: [string | undefined, Dispatch<SetStateAction<string | undefined>>];
		light?: boolean;
		hasDropdown?: boolean;
		infoContent?: string | ReactNode;
		onClear?: () => void;
		onCreate?: (newValue: string) => void;
		onRemoveValue?: (removedValue: TagSearchBarValue<IsMulti>) => void;
		onSearch?: (newValue: string) => void;
		searchValue?: string;
		size?: 'lg' | 'md';
		syncSearchValue?: boolean;
		valuePlaceholder?: TagSearchBarValuePlaceholder;
	};

export type TagSearchBarClearLabel = string | ReactNode;
export type TagSearchBarValuePlaceholder = string | ReactNode;

export type TagSearchBarValue<IsMulti extends boolean> = OnChangeValue<TagIdentity, IsMulti>;
export type TagSearchBarMeta<Value = TagIdentity> = ActionMeta<Value>;

export type OnSearchSingle = (newValue: string, meta?: InputActionMeta) => void;
export type OnSearchMulti = (newValue: TagSearchBarValue<true>, meta?: TagSearchBarMeta) => void;
