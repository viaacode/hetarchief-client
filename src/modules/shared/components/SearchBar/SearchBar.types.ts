import { TagsInputProps } from '@meemoo/react-components';
import { ReactNode } from 'react';
import { ActionMeta, InputActionMeta, OnChangeValue } from 'react-select';

import { TagIdentity } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export type SearchBarProps<IsMulti extends boolean = false> = DefaultComponentProps &
	Omit<TagsInputProps<IsMulti>, 'rootClassName' | 'classNamePrefix' | 'variants'> & {
		clearLabel?: SearchBarClearLabel;
		light?: boolean;
		searchValue?: string;
		size?: 'lg' | 'md';
		syncSearchValue?: boolean;
		valuePlaceholder?: SearchBarValuePlaceholder;
		onClear?: () => void;
		onCreate?: (newValue: string) => void;
		onRemoveValue?: (removedValue: SearchBarValue<IsMulti>) => void;
		onSearch?: (newValue: string) => void;
	};

export type SearchBarClearLabel = string | ReactNode;
export type SearchBarValuePlaceholder = string | ReactNode;

export type SearchBarValue<IsMulti extends boolean> = OnChangeValue<TagIdentity, IsMulti>;
export type SearchBarMeta<Value = TagIdentity> = ActionMeta<Value>;

export type OnSearchSingle = (newValue: string, meta?: InputActionMeta) => void;
export type OnSearchMulti = (newValue: SearchBarValue<true>, meta?: SearchBarMeta) => void;
