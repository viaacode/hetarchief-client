import { TagsInputProps } from '@meemoo/react-components';
import { ReactNode } from 'react';
import { ActionMeta, InputActionMeta, OnChangeValue } from 'react-select';

import { TagIdentity } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export type TagSearchBarProps<IsMulti extends boolean = false> = DefaultComponentProps &
	Omit<TagsInputProps<IsMulti>, 'rootClassName' | 'classNamePrefix' | 'variants'> & {
		clearLabel?: TagSearchBarClearLabel;
		light?: boolean;
		searchValue?: string;
		size?: 'lg' | 'md';
		syncSearchValue?: boolean;
		valuePlaceholder?: TagSearchBarValuePlaceholder;
		onClear?: () => void;
		onCreate?: (newValue: string) => void;
		onRemoveValue?: (removedValue: TagSearchBarValue<IsMulti>) => void;
		onSearch?: (newValue: string) => void;
	};

export type TagSearchBarClearLabel = string | ReactNode;
export type TagSearchBarValuePlaceholder = string | ReactNode;

export type TagSearchBarValue<IsMulti extends boolean> = OnChangeValue<TagIdentity, IsMulti>;
export type TagSearchBarMeta<Value = TagIdentity> = ActionMeta<Value>;

export type OnSearchSingle = (newValue: string, meta?: InputActionMeta) => void;
export type OnSearchMulti = (newValue: TagSearchBarValue<true>, meta?: TagSearchBarMeta) => void;
