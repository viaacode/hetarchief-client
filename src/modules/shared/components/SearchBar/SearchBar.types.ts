import { TagInfo, TagsInputProps } from '@meemoo/react-components';
import { ReactNode } from 'react';
import { ActionMeta, InputActionMeta, OnChangeValue } from 'react-select';

import { DefaultComponentProps } from '@shared/types';

export type SearchBarProps<IsMulti extends boolean = false> = DefaultComponentProps &
	Omit<TagsInputProps<IsMulti>, 'rootClassName' | 'classNamePrefix' | 'variants'> & {
		clearLabel?: SearchBarClearLabel;
		large?: boolean;
		searchValue?: string;
		syncSearchValue?: boolean;
		valuePlaceholder?: SearchBarValuePlaceholder;
		onClear?: () => void;
		onCreate?: (newValue: string) => void;
		onRemoveValue?: (removedValue: SearchBarValue<IsMulti>) => void;
		onSearch?: IsMulti extends true ? OnSearchMulti : OnSearchSingle;
	};

export type SearchBarClearLabel = string | ReactNode;
export type SearchBarValuePlaceholder = string | ReactNode;

export type SearchBarValue<IsMulti extends boolean> = OnChangeValue<TagInfo, IsMulti>;
export type SearchBarMeta<Value = TagInfo> = ActionMeta<Value>;

export type OnSearchSingle = (newValue: string, meta?: InputActionMeta) => void;
export type OnSearchMulti = (newValue: SearchBarValue<true>, meta?: SearchBarMeta) => void;
