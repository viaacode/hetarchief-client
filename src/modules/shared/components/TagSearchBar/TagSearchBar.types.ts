import { TagsInputProps } from '@meemoo/react-components';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { ActionMeta, InputActionMeta, OnChangeValue } from 'react-select';

import { DefaultComponentProps } from '@shared/types';
import { TagIdentity } from '@visitor-space/types';

export type TagSearchBarProps<IsMulti extends boolean = false> = DefaultComponentProps &
	Omit<TagsInputProps<IsMulti>, 'rootClassName' | 'classNamePrefix' | 'variants'> & {
		clearLabel?: TagSearchBarClearLabel;
		inputState?: [string | undefined, Dispatch<SetStateAction<string | undefined>>];
		light?: boolean;
		hasDropdown?: boolean;
		infoContent?: string;
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
